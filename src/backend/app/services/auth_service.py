from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.database import supabase

security = HTTPBearer()

def obter_usuario_atual(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    try:
        # Valida o JWT junto ao Supabase Auth
        user_response = supabase.auth.get_user(token)
        if not user_response or not user_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido ou expirado."
            )
        
        user_id = user_response.user.id
        
        # Busca dados complementares na tabela public.usuarios
        db_res = supabase.table("usuarios").select("*").eq("id", user_id).execute()
        if not db_res.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Perfil de usuário não encontrado no banco."
            )
            
        usuario = db_res.data[0]
        
        # HU02 (Critério 3) / RN12: Bloquear acesso de contas suspensas
        if not usuario.get("ativo", True):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Conta suspensa pela administração da Cantina."
            )
            
        return usuario
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Não foi possível autenticar as credenciais."
        )

def exigir_vendedor(usuario: dict = Depends(obter_usuario_atual)) -> dict:
    if usuario.get("papel") not in ("vendedor", "ambos"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado: apenas usuários com perfil de vendedor podem realizar esta operação."
        )
    return usuario