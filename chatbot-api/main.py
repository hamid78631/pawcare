import os
import uuid

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import APIConnectionError, APIError, APITimeoutError

from llm import repondre
from schemas import ChatRequest, ChatResponse

app = FastAPI(title="Pawly API", description="Chatbot pet sitting de PawCare")

# CORS : autorise le front React (autre port = autre "origine") à appeler l'API
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Stockage en mémoire : { conversation_id: [messages] }
# (perdu au redémarrage du serveur — suffisant pour le TP)
conversations: dict[str, list[dict]] = {}


@app.get("/health")
def health():
    """Vérifie que le service fonctionne."""
    return {"status": "ok"}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest):
    """Envoie un message et reçoit la réponse de Pawly."""
    # Nouvelle conversation si le client n'envoie pas d'identifiant
    conversation_id = req.conversation_id or str(uuid.uuid4())
    historique = conversations.setdefault(conversation_id, [])

    try:
        reply = repondre(req.message, historique)
    # L'ordre compte : APITimeoutError est un cas particulier de APIConnectionError
    except APITimeoutError:
        raise HTTPException(504, "Le modèle met trop de temps à répondre. Réessayez.")
    except APIConnectionError:
        raise HTTPException(503, "Impossible de joindre le fournisseur du modèle.")
    except APIError:
        raise HTTPException(502, "Le fournisseur du modèle a renvoyé une erreur.")

    # On ne mémorise l'échange que si le modèle a bien répondu
    historique.append({"role": "user", "content": req.message})
    historique.append({"role": "assistant", "content": reply})

    return ChatResponse(conversation_id=conversation_id, reply=reply)


@app.delete("/chat/{conversation_id}")
def reset_chat(conversation_id: str):
    """Réinitialise (supprime) une conversation."""
    conversations.pop(conversation_id, None)   # None = pas d'erreur si elle n'existe pas
    return {"message": "Conversation réinitialisée"}