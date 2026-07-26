"""
AI Service (FastAPI)
---------------------
Handles the "AI" part of the platform:
  1. PDF text extraction
  2. Skill extraction (free, keyword/phrase based -- no API key needed)
  3. ATS-style scoring
  4. Job-description comparison + missing-skill detection
  5. Learning-roadmap recommendations
  6. OPTIONAL: nicer natural-language suggestions via OpenAI, if OPENAI_API_KEY
     is set in the environment. Falls back to templated suggestions if not.

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8001
"""

import os
import re
import io
from typing import List, Optional

import pdfplumber
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from skills_data import SKILL_TAXONOMY, ROLE_REQUIREMENTS

app = FastAPI(title="Resume Analyzer AI Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten this in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Optional OpenAI integration (used only if a key is present)
# ---------------------------------------------------------------------------
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
USE_OPENAI = bool(OPENAI_API_KEY)

if USE_OPENAI:
    from openai import OpenAI
    client = OpenAI(api_key=OPENAI_API_KEY)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def extract_text_from_pdf(file_bytes: bytes) -> str:
    text_chunks = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            text_chunks.append(page_text)
    return "\n".join(text_chunks)


def extract_skills(text: str) -> List[str]:
    """Keyword/phrase matching against SKILL_TAXONOMY. Free, deterministic, no API key."""
    lowered = f" {text.lower()} "
    found = []
    for canonical, patterns in SKILL_TAXONOMY.items():
        for pattern in patterns:
            if pattern in lowered:
                found.append(canonical)
                break
    return sorted(set(found))


def compute_ats_score(text: str, skills_found: List[str]) -> int:
    """
    Simple, explainable heuristic ATS score (0-100). Not a black box --
    each factor is transparent so you can tune weights later.
    """
    score = 0

    # 1. Skill density (up to 40 pts)
    score += min(len(skills_found) * 3, 40)

    # 2. Length / completeness (up to 20 pts) -- too short or absurdly long hurts
    word_count = len(text.split())
    if 250 <= word_count <= 900:
        score += 20
    elif 120 <= word_count < 250 or 900 < word_count <= 1300:
        score += 12
    else:
        score += 5

    # 3. Section presence (up to 25 pts)
    section_keywords = {
        "experience": ["experience", "work history", "employment"],
        "education": ["education", "academic"],
        "projects": ["project"],
        "skills": ["skills"],
        "contact": ["email", "@", "phone", "linkedin"],
    }
    sections_present = 0
    lowered = text.lower()
    for keys in section_keywords.values():
        if any(k in lowered for k in keys):
            sections_present += 1
    score += round((sections_present / len(section_keywords)) * 25)

    # 4. Quantified achievements bonus (up to 15 pts) -- numbers/% signal impact
    numeric_hits = len(re.findall(r"\b\d+%|\b\d+\+|\$\d+", text))
    score += min(numeric_hits * 3, 15)

    return min(score, 100)


def missing_skills_for_role(skills_found: List[str], target_skills: List[str]) -> List[str]:
    found_set = set(skills_found)
    return [s for s in target_skills if s not in found_set]


def suggest_roles(skills_found: List[str], top_n: int = 3):
    """Rank predefined roles by how many required skills the resume already covers."""
    found_set = set(skills_found)
    ranked = []
    for role, required in ROLE_REQUIREMENTS.items():
        overlap = len(found_set.intersection(required))
        ranked.append((role, overlap, len(required)))
    ranked.sort(key=lambda r: (r[1] / r[2]), reverse=True)
    return ranked[:top_n]


def template_improvements(score: int, missing: List[str]) -> List[str]:
    tips = []
    if score < 60:
        tips.append("Add measurable achievements (e.g. 'reduced load time by 30%') instead of plain duty descriptions.")
    if missing:
        tips.append(f"Consider learning/adding: {', '.join(missing[:5])}.")
    tips.append("Make sure Experience, Education, Projects, and Skills sections are clearly labeled for ATS parsers.")
    tips.append("Use standard section headers and avoid tables/graphics that some ATS systems can't parse.")
    return tips


def ai_improvements(resume_text: str, missing: List[str]) -> Optional[List[str]]:
    """Optional nicer suggestions via OpenAI, only called if USE_OPENAI is True."""
    if not USE_OPENAI:
        return None
    try:
        prompt = (
            "You are a career coach. Given this resume text, give 4 short, "
            "specific, actionable bullet-point suggestions to improve it. "
            f"Known missing skills for their target roles: {', '.join(missing) if missing else 'none'}.\n\n"
            f"Resume:\n{resume_text[:4000]}"
        )
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
        )
        content = resp.choices[0].message.content
        # split into bullet lines
        lines = [l.strip("-• ").strip() for l in content.split("\n") if l.strip()]
        return lines[:6]
    except Exception:
        return None  # gracefully fall back to templated tips


# ---------------------------------------------------------------------------
# API models
# ---------------------------------------------------------------------------
class CompareRequest(BaseModel):
    resume_text: str
    job_description: str


class CompareResponse(BaseModel):
    skills_found: List[str]
    job_skills: List[str]
    missing_skills: List[str]
    match_percent: int


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "openai_enabled": USE_OPENAI}


@app.post("/extract")
async def extract(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    file_bytes = await file.read()
    text = extract_text_from_pdf(file_bytes)
    if not text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from this PDF (it may be a scanned image).")

    skills_found = extract_skills(text)
    score = compute_ats_score(text, skills_found)
    top_roles = suggest_roles(skills_found)

    # Missing skills relative to the best-matching role
    best_role, _, _ = top_roles[0] if top_roles else (None, 0, 0)
    missing = missing_skills_for_role(skills_found, ROLE_REQUIREMENTS.get(best_role, [])) if best_role else []

    suggestions = ai_improvements(text, missing) or template_improvements(score, missing)

    return {
        "resume_text": text,
        "ats_score": score,
        "skills_found": skills_found,
        "recommended_roles": [
            {"role": r, "match": round((overlap / total) * 100)} for r, overlap, total in top_roles
        ],
        "missing_skills": missing,
        "improvement_suggestions": suggestions,
    }


@app.post("/compare", response_model=CompareResponse)
async def compare(req: CompareRequest):
    resume_skills = extract_skills(req.resume_text)
    job_skills = extract_skills(req.job_description)

    if not job_skills:
        raise HTTPException(status_code=422, detail="Could not detect any known skills in the job description.")

    missing = missing_skills_for_role(resume_skills, job_skills)
    match_percent = round(((len(job_skills) - len(missing)) / len(job_skills)) * 100)

    return CompareResponse(
        skills_found=resume_skills,
        job_skills=job_skills,
        missing_skills=missing,
        match_percent=match_percent,
    )
