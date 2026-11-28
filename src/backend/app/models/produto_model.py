from datetime import date
from typing import List, Literal, Optional
from pydantic import BaseModel, Field


class OfertaDataItem(BaseModel):
    data_disponivel: date
    turno: Optional[str] = Field(None, max_length=50, description="Ex: Manhã, Tarde, Noite")
    quantidade_prevista: Optional[int] = Field(None, ge=0)


class ProdutoCreate(BaseModel):
    nome: str = Field(..., min_length=2, max_length=120)
    descricao: Optional[str] = Field(None, max_length=500)
    tipo: Literal["comida", "bebida"]
    categoria: str = Field(..., max_length=60)
    preco_unitario: float = Field(..., gt=0)
    url_foto: Optional[str] = None
    disponivel: bool = Field(default=True)
    aceita_encomenda: bool = Field(default=True)
    datas_oferta: Optional[List[OfertaDataItem]] = Field(
        default=None,
        description="Lista opcional de datas/turnos em que o produto estará disponível (RF03)"
    )


class ProdutoUpdate(BaseModel):
    nome: Optional[str] = Field(None, min_length=2, max_length=120)
    descricao: Optional[str] = Field(None, max_length=500)
    tipo: Optional[Literal["comida", "bebida"]] = None
    categoria: Optional[str] = Field(None, max_length=60)
    preco_unitario: Optional[float] = Field(None, gt=0)
    url_foto: Optional[str] = None
    disponivel: Optional[bool] = None
    aceita_encomenda: Optional[bool] = None


class DisponibilidadePatch(BaseModel):
    disponivel: bool


class OfertasDataCreate(BaseModel):
    ofertas: List[OfertaDataItem]


class ProdutoResponse(BaseModel):
    id: str
    vendedor_id: str
    nome: str
    descricao: Optional[str] = None
    tipo: str
    categoria: str
    preco_unitario: float
    url_foto: Optional[str] = None
    disponivel: bool
    aceita_encomenda: bool
    ativo: bool
    datas_oferta: List[OfertaDataItem] = []