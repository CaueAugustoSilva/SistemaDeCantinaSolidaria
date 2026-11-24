from typing import Literal
from pydantic import BaseModel, EmailStr, Field

# RN12: Autocadastro permite apenas comprador, vendedor ou ambos (nunca admin)
PapelCadastro = Literal["comprador", "vendedor", "ambos"]

class UsuarioCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    senha: str = Field(..., min_length=6)
    vinculo: str = Field(..., min_length=2, max_length=50)
    campus: str = Field(default="Niterói", max_length=100)
    telefone: str = Field(..., min_length=8, max_length=20)
    papel: PapelCadastro

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioResponse(BaseModel):
    id: str
    nome: str
    email: str
    vinculo: str
    campus: str
    telefone: str
    papel: str
    ativo: bool