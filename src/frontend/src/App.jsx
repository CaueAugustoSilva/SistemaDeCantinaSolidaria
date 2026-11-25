import { useEffect, useState } from 'react';
import { apiRequest } from './services/api';
import PerfilVendedorPage from './pages/PerfilVendedorPage';

export default function App() {
  const [usuario, setUsuario] = useState(null);
  const [tokenInput, setTokenInput] = useState(localStorage.getItem('cantina_token') || '');
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (localStorage.getItem('cantina_token')) {
      carregarUsuario();
    }
  }, []);

  async function carregarUsuario() {
    try {
      setErro('');
      const dados = await apiRequest('/usuarios/me');
      setUsuario(dados);
    } catch (err) {
      setErro('Token inválido ou expirado. Cole um token válido gerado no /usuarios/login.');
      localStorage.removeItem('cantina_token');
      setUsuario(null);
    }
  }

  function handleConectarToken(e) {
    e.preventDefault();
    localStorage.setItem('cantina_token', tokenInput.trim());
    carregarUsuario();
  }

  if (!usuario) {
    return (
      <div className="app-shell" style={{ padding: 16 }}>
        <div className="card-section" style={{ marginTop: 32 }}>
          <h2 style={{ color: 'var(--ifrj-verde-escuro)', marginBottom: 8 }}>
            Cantina Solidária IFRJ — Teste de Sessão
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--texto-secundario)', marginBottom: 14 }}>
            Cole abaixo o <code>access_token</code> obtido na rota <code>POST /usuarios/login</code> para testar o Perfil de Vendedor:
          </p>
          {erro && <div className="alert-box alert-error">{erro}</div>}
          <form onSubmit={handleConectarToken}>
            <div className="form-group">
              <input
                type="text"
                className="form-input"
                placeholder="Cole o access_token JWT aqui..."
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary">Entrar na Loja</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: '#1A1D1B', color: '#fff', padding: '6px 16px', fontSize: '0.78rem', display: 'flex', justifyContent: 'space-between' }}>
        <span>Logado como: <strong>{usuario.nome}</strong> ({usuario.papel})</span>
        <button
          onClick={() => { localStorage.removeItem('cantina_token'); setUsuario(null); }}
          style={{ background: 'transparent', border: 'none', color: '#8CE99A', cursor: 'pointer', fontWeight: 600 }}
        >
          Trocar usuário
        </button>
      </div>
      <PerfilVendedorPage usuario={usuario} onAtualizarUsuario={setUsuario} />
    </div>
  );
}