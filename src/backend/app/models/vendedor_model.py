from typing import Optional
from pydantic import BaseModel, Field

class PerfilVendedorUpdate(BaseModel):
    apresentacao: Optional[str] = Field(None, max_length=500, description="Descrição breve do vendedor e seus produtos")
    turnos_habituais: Optional[str] = Field(None, max_length=100, description="Ex: Manhã e Tarde")
    chave_pix: Optional[str] = Field(None, max_length=150, description="Chave Pix opcional para recebimento")

class PerfilVendedorResponse(BaseModel):
    id: str
    usuario_id: str
    apresentacao: Optional[str] = None
    turnos_habituais: Optional[str] = None
    chave_pix: Optional[str] = None