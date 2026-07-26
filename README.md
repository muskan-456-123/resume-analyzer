# Scanline — AI Resume Analyzer & Career Guidance Platform

Three services:

```
frontend/    React + Vite + Tailwind        (port 5173)
backend/     Node.js + Express + MongoDB    (port 5000)
ai-service/  Python + FastAPI               (port 8001)
```

Flow: **frontend → backend (stores results, MongoDB) → ai-service (does the actual PDF parsing / skill extraction / scoring) → back to backend → frontend.**

## 1. AI service (start this first)

```bash
cd ai-service
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

Runs entirely free with no API key — skill extraction and scoring are keyword/heuristic-based.
To get nicer, AI-written improvement suggestions, optionally add a key:

```bash
export OPENAI_API_KEY=sk-...     # optional
```

If unset, the service automatically falls back to templated suggestions — nothing breaks.

Test it directly: open http://localhost:8001/docs (interactive Swagger UI).

## 2. Backend (Node/Express)

Requires MongoDB running locally (or a MongoDB Atlas connection string).

```bash
cd backend
cp .env.example .env       # edit MONGODB_URI if needed
npm install
npm run dev
```

Runs on http://localhost:5000. Health check: `GET /api/health`.

## 3. Frontend (React)

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open http://localhost:5173.

## Using it

1. Go to **Upload**, drop in a PDF resume.
2. The backend forwards it to the AI service, which extracts text, detects skills from a
   ~70-skill taxonomy (`ai-service/skills_data.py`), computes an explainable ATS score, and
   suggests the best-matching roles + a learning roadmap.
3. Results are saved to MongoDB and shown on the **Dashboard**.
4. Paste a job description on the dashboard to get a live match % and missing-skill list
   against that specific posting.

## Extending this

- **Skill taxonomy**: add more skills/roles in `ai-service/skills_data.py` — no retraining needed.
- **Smarter extraction**: swap the keyword matcher in `extract_skills()` for spaCy's
  `PhraseMatcher` or a sentence-transformers embedding search if you want fuzzy matching
  (e.g. "reactjs" vs "React.js" vs "React framework").
- **Auth**: add user accounts so people can see their resume history (`GET /api/resumes` already
  supports listing — just scope it by user).
- **Resume rewriting**: the `ai_improvements()` function in `ai-service/main.py` is already wired
  to OpenAI — you could extend it to rewrite bullet points, not just suggest fixes.
- **Scanned/image PDFs**: current extraction uses `pdfplumber` (text-layer PDFs only). Add OCR
  (`pytesseract`) as a fallback for scanned resumes.

## Notes

- Max upload size: 10MB, PDF only (enforced in both `multer` and the dropzone UI).
- CORS is wide open (`*`) for local development — restrict `allow_origins` in
  `ai-service/main.py` and add a proper CORS config in `backend/server.js` before deploying.
