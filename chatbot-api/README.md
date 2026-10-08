# chatbot-api — API FastAPI de Pawly 🐾

Backend du chatbot pet sitting de PawCare (FastAPI + Groq) et notebook de la Phase 1 du TP.

```bash
uv sync                                         # installer les dépendances
cp .env.example .env                            # puis renseigner GROQ_API_KEY
uv run uvicorn main:app --reload --port 8000    # lancer l'API → http://localhost:8000/docs
```

Documentation complète (installation, configuration, API, tests, limites) : voir le [README principal](../README.md).
