from fastapi import APIRouter, Depends, HTTPException, status
from app.database import supabase
from app.models.usuario_model import UsuarioCreate, UsuarioLogin, UsuarioResponse
from app.services.auth_service import obter_usuario_atual


router = APIRouter(prefix="/usuarios", tags=["Usuários e Autenticação"])

@router.post("/cadastro", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
def cadastrar_usuario(dados: UsuarioCreate):
    # 1. Verifica duplicidade de e-mail na tabela usuarios (HU01 - Critério 2)
    existente = supabase.table("usuarios").select("id").eq("email", dados.email).execute()
    if existente.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Este e-mail já está cadastrado no sistema."
        )

    # 2. Cria usuário no Supabase Auth (senha com hash seguro - RNF04)
    try:
        auth_res = supabase.auth.admin.create_user({
            "email": dados.email,
            "password": dados.senha,
            "email_confirm": True
        })
        user_id = auth_res.user.id
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Erro ao criar credenciais de acesso: {str(e)}"
        )

    # 3. Persiste dados na tabela public.usuarios
    novo_usuario = {
        "id": user_id,
        "nome": dados.nome,
        "email": dados.email,
        "vinculo": dados.vinculo,
        "campus": dados.campus,
        "telefone": dados.telefone,
        "papel": dados.papel,
        "ativo": True
    }
    
    db_res = supabase.table("usuarios").insert(novo_usuario).execute()
    if not db_res.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Falha ao salvar os dados do perfil."
        )

    # 4. Se já escolheu ser vendedor ou ambos, inicializa o registro em perfis_vendedor
    if dados.papel in ("vendedor", "ambos"):
        supabase.table("perfis_vendedor").insert({"usuario_id": user_id}).execute()

    return db_res.data[0]

@router.post("/login")
def login_usuario(credenciais: UsuarioLogin):
    try:
        auth_res = supabase.auth.sign_in_with_password({
            "email": credenciais.email,
            "password": credenciais.senha
        })
        user_id = auth_res.user.id
        token = auth_res.session.access_token
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="E-mail ou senha inválidos."
        )

    # Verifica se a conta está ativa (HU02 - Critério 3)
    db_res = supabase.table("usuarios").select("*").eq("id", user_id).execute()
    if not db_res.data:
        raise HTTPException(status_code=404, detail="Usuário não encontrado.")
        
    usuario = db_res.data[0]
    if not usuario.get("ativo", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Sua conta está suspensa. Entre em contato com a administração."
        )

    return {
        "access_token": token,
        "token_type": "bearer",
        "usuario": usuario
    }

@router.get("/me", response_model=UsuarioResponse)
def consultar_meu_perfil(usuario_atual: dict = Depends(obter_usuario_atual)):
    """Rota protegida por JWT para validar sessão e retornar dados do usuário logado."""
    return usuario_atual