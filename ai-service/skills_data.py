"""
Skill taxonomy for keyword/phrase-based extraction.
Free, no API key required. Extend these lists any time.
Keys = canonical skill name shown to the user.
Values = list of surface forms to match in resume/job text (lowercase).
"""

SKILL_TAXONOMY = {
    # Languages
    "Python": ["python"],
    "JavaScript": ["javascript", "js", "es6"],
    "TypeScript": ["typescript", "ts"],
    "Java": ["java "],
    "C++": ["c++", "cpp"],
    "C": [" c language", " c programming"],
    "Go": ["golang", " go "],
    "SQL": ["sql"],

    # Web / Frontend
    "React": ["react.js", "reactjs", "react "],
    "Next.js": ["next.js", "nextjs"],
    "Vue": ["vue.js", "vuejs", "vue "],
    "Angular": ["angular"],
    "HTML/CSS": ["html", "css"],
    "Tailwind CSS": ["tailwind"],

    # Backend
    "Node.js": ["node.js", "nodejs", "node "],
    "Express": ["express.js", "expressjs", "express "],
    "FastAPI": ["fastapi"],
    "Django": ["django"],
    "Flask": ["flask"],
    "REST APIs": ["rest api", "restful", "rest apis"],
    "GraphQL": ["graphql"],

    # Data / AI / ML
    "Machine Learning": ["machine learning", "ml "],
    "Deep Learning": ["deep learning"],
    "NLP": ["nlp", "natural language processing"],
    "TensorFlow": ["tensorflow"],
    "PyTorch": ["pytorch"],
    "Scikit-learn": ["scikit-learn", "sklearn"],
    "Pandas": ["pandas"],
    "NumPy": ["numpy"],
    "Transformers": ["transformers", "huggingface", "hugging face", "bert"],
    "Data Analysis": ["data analysis", "data analytics"],
    "Power BI": ["power bi"],
    "Tableau": ["tableau"],

    # Cloud / DevOps
    "AWS": ["aws", "amazon web services"],
    "Azure": ["azure"],
    "GCP": ["gcp", "google cloud"],
    "Docker": ["docker"],
    "Kubernetes": ["kubernetes", "k8s"],
    "CI/CD": ["ci/cd", "continuous integration", "continuous deployment"],
    "Git": ["git ", "github", "gitlab"],
    "Linux": ["linux"],

    # Databases
    "MongoDB": ["mongodb", "mongo db"],
    "MySQL": ["mysql"],
    "PostgreSQL": ["postgresql", "postgres"],
    "Redis": ["redis"],
    "Firebase": ["firebase"],

    # Other / Soft & CS fundamentals
    "System Design": ["system design"],
    "Data Structures & Algorithms": ["data structures", "algorithms", "dsa"],
    "OOP": ["object-oriented", "oops concepts", "oop"],
    "Agile": ["agile", "scrum"],
    "Testing": ["unit testing", "jest", "pytest", "selenium"],
}

# Simple role -> required-skills map used when the user has no specific
# job description to compare against (fallback "suggested roles" mode).
ROLE_REQUIREMENTS = {
    "Frontend Developer": ["JavaScript", "React", "HTML/CSS", "Git", "REST APIs"],
    "Backend Developer": ["Node.js", "Express", "SQL", "REST APIs", "Git", "MongoDB"],
    "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL", "MongoDB", "Git", "REST APIs"],
    "Data Analyst": ["SQL", "Python", "Pandas", "Data Analysis", "Power BI", "Tableau"],
    "Machine Learning Engineer": ["Python", "Machine Learning", "Scikit-learn", "TensorFlow", "PyTorch", "NumPy", "Pandas"],
    "DevOps Engineer": ["Docker", "Kubernetes", "CI/CD", "AWS", "Linux", "Git"],
    "Cloud Engineer": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "Linux"],
}
