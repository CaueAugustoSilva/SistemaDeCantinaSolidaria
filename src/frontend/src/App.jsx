import { useEffect, useState } from 'react';
import { ShoppingBag, Store, LogOut } from 'lucide-react';
import { apiRequest } from './services/api';
import AuthPage from './pages/AuthPage';
import AreaCompradorPage from './pages/AreaCompradorPage';
import PerfilVendedorPage from './pages/PerfilVendedorPage';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregandoSessao, setCarregandoSessao] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('vitrine'); // 'vitrine' | 'vendedor'

  useEffect(() => {
    const token = localStorage.getItem('cantina_token');
    if (!token) {
      setCarregandoSessao(false);
      return;
    }

    async function restaurarSessao() {
      try {
        const dados = await apiRequest('/usuarios/me');
        definirUsuarioERedirecionar(dados);
      } catch {
        localStorage.removeItem('cantina_token');
        setUsuario(null);
      } finally {
        setCarregandoSessao(false);
      }
    }

    restaurarSessao();
  }, []);

  function definirUsuarioERedirecionar(dadosUsuario) {
    setUsuario(dadosUsuario);
    // Critério 3: Redirecionamento automático conforme o papel do usuário logado
    if (dadosUsuario.papel === 'vendedor' || dadosUsuario.papel === 'ambos') {
      setAbaAtiva('vendedor');
    } else {
      setAbaAtiva('vitrine');
    }
  }

  function handleLogout() {
    localStorage.removeItem('cantina_token');
    setUsuario(null);
    setAbaAtiva('vitrine');
  }

  if (carregandoSessao) {
    return (
      <div className="app-shell">
        <div className="store-banner">
          <h2>Carregando Cantina Solidária...</h2>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, exibe Login / Cadastro
  if (!usuario) {
    return <AuthPage onAutenticado={definirUsuarioERedirecionar} />;
  }

  const podeComprar = usuario.papel === 'comprador' || usuario.papel === 'ambos';
  const podeVender = usuario.papel === 'vendedor' || usuario.papel === 'ambos';

  return (
    <div>
      {/* Barra superior de sessão */}
      <div
        style={{
          maxWidth: 680,
          margin: '0 auto',
          background: '#1A1D1B',
          color: '#FFFFFF',
          padding: '8px 16px',
          fontSize: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>
          <strong>{usuario.nome}</strong> • <span style={{ textTransform: 'capitalize' }}>{usuario.papel}</span>
        </span>
        <button
          type="button"
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#FFA8A8',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <LogOut size={14} />
          Sair
        </button>
      </div>

      {/* Conteúdo principal conforme aba ativa */}
      {abaAtiva === 'vendedor' && podeVender ? (
        <div className={podeComprar ? 'app-shell-with-nav' : ''}>
          <PerfilVendedorPage
            usuario={usuario}
            onAtualizarUsuario={(atualizado) => setUsuario(atualizado)}
          />
        </div>
      ) : (
        <AreaCompradorPage
          usuario={usuario}
          onAtualizarUsuario={(atualizado) => setUsuario(atualizado)}
          onIrParaPainelVendedor={() => setAbaAtiva('vendedor')}
        />
      )}

      {/* Critério 4: Menu de navegação adaptativo quando o usuário possui ambos os papéis */}
      {podeComprar && podeVender && (
        <nav className="bottom-nav" aria-label="Navegação principal">
          <button
            type="button"
            className={`nav-item ${abaAtiva === 'vitrine' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('vitrine')}
          >
            <ShoppingBag size={20} />
            <span>Vitrine / Meus Pedidos</span>
          </button>
          <button
            type="button"
            className={`nav-item ${abaAtiva === 'vendedor' ? 'active' : ''}`}
            onClick={() => setAbaAtiva('vendedor')}
          >
            <Store size={20} />
            <span>Painel do Vendedor</span>
          </button>
        </nav>
      )}
    </div>
  );
}