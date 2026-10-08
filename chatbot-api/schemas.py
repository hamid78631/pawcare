from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    """Ce que React envoie à POST /chat."""

    # Enlève les espaces au début et à la fin AVANT de vérifier la longueur
    # → "   " devient "" → refusé par min_length=1
    model_config = ConfigDict(str_strip_whitespace=True)

    message: str = Field(min_length=1, max_length=2000)
    conversation_id: str | None = None   # None = nouvelle conversation


class ChatResponse(BaseModel):
    """Ce que l'API renvoie à React."""

    conversation_id: str
    reply: str