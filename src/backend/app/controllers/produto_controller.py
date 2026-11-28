from datetime import date
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.database import supabase
from app.models.produto_model import (
    OfertaDataItem,
    ProdutoCreate,
    ProdutoUpdate,
    DisponibilidadePatch,
    OfertasDataCreate,
    ProdutoResponse,
)
from app.services.auth_service import exigir_vendedor

router = APIRouter(prefix="/produtos", tags=["Produtos e Ofertas"])


def _obter_perfil_vendedor_id(usuario_id: str) -> str:
    res = (
        supabase.table("perfis_vendedor")
        .select("id")
        .eq("usuario_id", usuario_id)
        .execute()
    )
    if res.data:
        return res.data[0]["id"]

    novo_perfil = supabase.table("perfis_vendedor").insert({"usuario_id": usuario_id}).execute()
    if not novo_perfil.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Não foi possível localizar ou inicializar o perfil de vendedor."
        )
    return novo_perfil.data[0]["id"]


def _buscar_ofertas_produto(produto_id: str) -> List[dict]:
    res = (
        supabase.table("ofertas_data")
        .select("data_disponivel, turno, quantidade_prevista")
        .eq("produto_id", produto_id)
        .order("data_disponivel")
        .execute()
    )
    return res.data or []


def _salvar_ofertas_produto(produto_id: str, ofertas: List[OfertaDataItem]) -> List[dict]:
    supabase.table("ofertas_data").delete().eq("produto_id", produto_id).execute()
    if not ofertas:
        return []

    # Evita duplicidade pela constraint UNIQUE (produto_id, data_disponivel, turno)
    unicas = {}
    for item in ofertas:
        chave = (item.data_disponivel.isoformat(), item.turno)
        unicas[chave] = {
            "produto_id": produto_id,
            "data_disponivel": item.data_disponivel.isoformat(),
            "turno": item.turno,
            "quantidade_prevista": item.quantidade_prevista,
        }

    registros = list(unicas.values())
    res = supabase.table("ofertas_data").insert(registros).execute()
    return res.data or registros


def _validar_propriedade_produto(produto_id: str, perfil_vendedor_id: str) -> dict:
    res = (
        supabase.table("produtos")
        .select("*")
        .eq("id", produto_id)
        .eq("ativo", True)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Produto não encontrado."
        )
    produto = res.data[0]
    if produto["vendedor_id"] != perfil_vendedor_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para alterar este produto."
        )
    return produto


@router.post("", response_model=ProdutoResponse, status_code=status.HTTP_201_CREATED)
def criar_produto(
    dados: ProdutoCreate,
    vendedor: dict = Depends(exigir_vendedor)
):
    """Cadastra um produto no catálogo do vendedor autenticado (RF02)."""
    perfil_vendedor_id = _obter_perfil_vendedor_id(vendedor["id"])

    payload = dados.model_dump(exclude={"datas_oferta"})
    payload["vendedor_id"] = perfil_vendedor_id
    payload["ativo"] = True

    res = supabase.table("produtos").insert(payload).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao cadastrar o produto."
        )

    produto_criado = res.data[0]
    ofertas_salvas = []
    if dados.datas_oferta:
        ofertas_salvas = _salvar_ofertas_produto(produto_criado["id"], dados.datas_oferta)

    produto_criado["datas_oferta"] = ofertas_salvas
    return produto_criado


@router.get("", response_model=List[ProdutoResponse])
def listar_produtos(
    vendedor_id: Optional[str] = Query(None, description="Filtrar por ID do perfil de vendedor"),
    categoria: Optional[str] = Query(None, description="Filtrar por categoria"),
    data: Optional[date] = Query(None, description="Filtrar por data disponível (YYYY-MM-DD)"),
    apenas_disponiveis: bool = Query(False, description="Exibir apenas itens não esgotados")
):
    """Lista produtos ativos (RN06) com suporte a filtros de vitrine e painel do vendedor."""
    query = supabase.table("produtos").select("*").eq("ativo", True)

    if vendedor_id:
        query = query.eq("vendedor_id", vendedor_id)
    if categoria:
        query = query.ilike("categoria", categoria)
    if apenas_disponiveis:
        query = query.eq("disponivel", True)

    res = query.execute()
    produtos = res.data or []

    ids_na_data = None
    if data:
        ofertas_res = (
            supabase.table("ofertas_data")
            .select("produto_id")
            .eq("data_disponivel", data.isoformat())
            .execute()
        )
        ids_na_data = {item["produto_id"] for item in (ofertas_res.data or [])}

    resultado = []
    for prod in produtos:
        if ids_na_data is not None and prod["id"] not in ids_na_data:
            continue
        prod["datas_oferta"] = _buscar_ofertas_produto(prod["id"])
        resultado.append(prod)

    return resultado


@router.put("/{produto_id}", response_model=ProdutoResponse)
def atualizar_produto(
    produto_id: str,
    dados: ProdutoUpdate,
    vendedor: dict = Depends(exigir_vendedor)
):
    """Atualiza os dados de um produto do vendedor autenticado (RF02)."""
    perfil_vendedor_id = _obter_perfil_vendedor_id(vendedor["id"])
    _validar_propriedade_produto(produto_id, perfil_vendedor_id)

    payload = dados.model_dump(exclude_unset=True)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Nenhum campo enviado para atualização."
        )

    res = (
        supabase.table("produtos")
        .update(payload)
        .eq("id", produto_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o produto."
        )

    atualizado = res.data[0]
    atualizado["datas_oferta"] = _buscar_ofertas_produto(produto_id)
    return atualizado


@router.patch("/{produto_id}/disponibilidade", response_model=ProdutoResponse)
def alternar_disponibilidade(
    produto_id: str,
    dados: DisponibilidadePatch,
    vendedor: dict = Depends(exigir_vendedor)
):
    """Alterna rapidamente entre Disponível (True) e Esgotado (False) (RF02 / RF05)."""
    perfil_vendedor_id = _obter_perfil_vendedor_id(vendedor["id"])
    _validar_propriedade_produto(produto_id, perfil_vendedor_id)

    res = (
        supabase.table("produtos")
        .update({"disponivel": dados.disponivel})
        .eq("id", produto_id)
        .execute()
    )
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao alterar disponibilidade do produto."
        )

    atualizado = res.data[0]
    atualizado["datas_oferta"] = _buscar_ofertas_produto(produto_id)
    return atualizado


@router.post("/{produto_id}/datas", response_model=ProdutoResponse)
def vincular_datas_oferta(
    produto_id: str,
    dados: OfertasDataCreate,
    vendedor: dict = Depends(exigir_vendedor)
):
    """Configura as datas de disponibilidade do produto na tabela OFERTAS_DATA (RF03)."""
    perfil_vendedor_id = _obter_perfil_vendedor_id(vendedor["id"])
    produto = _validar_propriedade_produto(produto_id, perfil_vendedor_id)

    ofertas_salvas = _salvar_ofertas_produto(produto_id, dados.ofertas)
    produto["datas_oferta"] = ofertas_salvas
    return produto


@router.delete("/{produto_id}", status_code=status.HTTP_204_NO_CONTENT)
def remover_produto(
    produto_id: str,
    vendedor: dict = Depends(exigir_vendedor)
):
    """Exclusão lógica (soft delete via coluna ativo = false) conforme RN06."""
    perfil_vendedor_id = _obter_perfil_vendedor_id(vendedor["id"])
    _validar_propriedade_produto(produto_id, perfil_vendedor_id)

    supabase.table("produtos").update({"ativo": False}).eq("id", produto_id).execute()
    return None