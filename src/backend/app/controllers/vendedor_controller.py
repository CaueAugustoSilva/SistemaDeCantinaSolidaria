from fastapi import APIRouter, Depends, HTTPException, status
from app.database import supabase
from app.models.vendedor_model import PerfilVendedorUpdate, PerfilVendedorResponse
from app.services.auth_service import obter_usuario_atual, exigir_vendedor

router = APIRouter(prefix="/vendedores", tags=["Perfil de Vendedor"])

@router.post("/ativar", response_model=PerfilVendedorResponse, status_code=status.HTTP_201_CREATED)
def ativar_perfil_vendedor(usuario: dict = Depends(obter_usuario_atual)):
    """Promove uma conta de 'comprador' para 'ambos' (Comprador+Vendedor) e cria o registro em perfis_vendedor."""
    if usuario.get("papel") in ("vendedor", "ambos"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Seu usuário já possui perfil de vendedor ativo."
        )
    if usuario.get("papel") == "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Contas administrativas não podem atuar como vendedores."
        )

    # Atualiza papel do usuário para 'ambos' (RN12)
    supabase.table("usuarios").update({"papel": "ambos"}).eq("id", usuario["id"]).execute()

    # Cria o registro inicial em perfis_vendedor
    res = supabase.table("perfis_vendedor").insert({"usuario_id": usuario["id"]}).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao ativar o perfil de vendedor."
        )
    return res.data[0]

@router.get("/perfil", response_model=PerfilVendedorResponse)
def consultar_perfil_vendedor(vendedor: dict = Depends(exigir_vendedor)):
    """Retorna os dados comerciais do vendedor autenticado (RF14)."""
    res = supabase.table("perfis_vendedor").select("*").eq("usuario_id", vendedor["id"]).execute()
    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Perfil de vendedor não encontrado."
        )
    return res.data[0]

@router.put("/perfil", response_model=PerfilVendedorResponse)
def atualizar_perfil_vendedor(
    dados: PerfilVendedorUpdate,
    vendedor: dict = Depends(exigir_vendedor)
):
    """Atualiza apresentação, turnos habituais e chave Pix opcional (RF14)."""
    payload = dados.model_dump(exclude_unset=True)

    existente = supabase.table("perfis_vendedor").select("id").eq("usuario_id", vendedor["id"]).execute()
    if not existente.data:
        payload["usuario_id"] = vendedor["id"]
        res = supabase.table("perfis_vendedor").insert(payload).execute()
    else:
        res = (
            supabase.table("perfis_vendedor")
            .update(payload)
            .eq("usuario_id", vendedor["id"])
            .execute()
        )

    if not res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao atualizar o perfil de vendedor."
        )
    return res.data[0]