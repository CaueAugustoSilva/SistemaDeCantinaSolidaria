import { useState } from 'react';
import { LogIn, UserPlus, AlertCircle, Utensils } from 'lucide-react';
import { apiRequest } from '../services/api';

const VINCULOS_OPCOES = ['Estudante', 'Servidor', 'Terceirizado'];

const PAPEIS_OPCOES = [
  {
    valor: 'comprador',
    titulo: 'Comprador',
    descricao: 'Encomendar lanches no campus',
  },
  {
    valor: 'vendedor',
    titulo: 'Vendedor',
    descricao: 'Divulgar e vender produtos',
  },
  {
    valor: 'ambos',
    titulo: 'Ambos',
    descricao: 'Comprar e vender na cantina',
  },
];

export default function AuthPage({ onAutenticado }) {
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');

  // Campos de Login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginSenha, setLoginSenha] = useState('');

  // Campos de Cadastro
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [vinculo, setVinculo] = useState('Estudante');
  const [campus, setCampus] = useState('Niterói');
  const [telefone, setTelefone] = useState('');
  const [papel, setPapel] = useState('comprador');

  function alternarModo(novoModo) {
    setModo(novoModo);
    setErro('');
  }

  async function handleLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      const resposta = await apiRequest('/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({
          email: loginEmail.trim(),
          senha: loginSenha,
        }),
      });

      localStorage.setItem('cantina_token', resposta.access_token);
      onAutenticado(resposta.usuario);
    } catch (err) {
      setErro(err.message || 'Falha ao autenticar. Verifique seu e-mail e senha.');
    } finally {
      setCarregando(false);
    }
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setCarregando(true);
    setErro('');

    try {
      // 1. Cria a conta no back-end (Supabase Auth + public.usuarios)
      await apiRequest('/usuarios/cadastro', {
        method: 'POST',
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          vinculo,
          campus: campus.trim() || 'Niterói',
          telefone: telefone.trim(),
          papel,
        }),
      });

      // 2. Realiza login automático para já obter o JWT e redirecionar conforme o papel
      const loginRes = await apiRequest('/usuarios/login', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim(),
          senha,
        }),
      });

      localStorage.setItem('cantina_token', loginRes.access_token);
      onAutenticado(loginRes.usuario);
    } catch (err) {
      setErro(err.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="app-shell">
      {/* Cabeçalho Institucional IFRJ estilo 99Food */}
      <header className="store-banner">
        <div className="store-banner-top">
          <span className="badge-campus">
            <span className="badge-dot-red" />
            IFRJ • Economia Solidária
          </span>
          <Utensils size={20} />
        </div>
        <h1 style={{ fontSize: '1.45rem', fontWeight: 800 }}>Cantina Solidária</h1>
        <p style={{ fontSize: '0.9rem', opacity: 0.92, marginTop: 4 }}>
          Alimentação colaborativa entre estudantes e servidores do campus.
        </p>
      </header>

      {/* Cartão Principal Sobreposto */}
      <main className="card-99">
        <div className="auth-tabs" role="tablist" aria-label="Opções de acesso">
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'login'}
            className={`auth-tab ${modo === 'login' ? 'active' : ''}`}
            onClick={() => alternarModo('login')}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'cadastro'}
            className={`auth-tab ${modo === 'cadastro' ? 'active' : ''}`}
            onClick={() => alternarModo('cadastro')}
          >
            Criar Conta
          </button>
        </div>

        {erro && (
          <div
            role="alert"
            className="alert-box alert-error"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{erro}</span>
          </div>
        )}

        {modo === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">
                E-mail cadastrado
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="seu.nome@aluno.ifrj.edu.br"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-senha" className="form-label">
                Senha
              </label>
              <input
                id="login-senha"
                type="password"
                className="form-input"
                placeholder="Digite sua senha"
                value={loginSenha}
                onChange={(e) => setLoginSenha(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={carregando}>
              <LogIn size={18} />
              {carregando ? 'Entrando...' : 'Entrar na Cantina'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCadastro}>
            <div className="form-group">
              <label htmlFor="cad-nome" className="form-label">
                Nome completo
              </label>
              <input
                id="cad-nome"
                type="text"
                className="form-input"
                minLength={2}
                maxLength={150}
                placeholder="Ex: Ana Clara Souza"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cad-email" className="form-label">
                E-mail
              </label>
              <input
                id="cad-email"
                type="email"
                className="form-input"
                placeholder="seu.email@ifrj.edu.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cad-senha" className="form-label">
                Senha (mínimo 6 caracteres)
              </label>
              <input
                id="cad-senha"
                type="password"
                className="form-input"
                minLength={6}
                placeholder="Crie uma senha segura"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cad-vinculo" className="form-label">
                Vínculo com o IFRJ
              </label>
              <select
                id="cad-vinculo"
                className="form-select"
                value={vinculo}
                onChange={(e) => setVinculo(e.target.value)}
                required
              >
                {VINCULOS_OPCOES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="cad-campus" className="form-label">
                Campus
              </label>
              <input
                id="cad-campus"
                type="text"
                className="form-input"
                maxLength={100}
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="cad-telefone" className="form-label">
                Telefone / WhatsApp
              </label>
              <input
                id="cad-telefone"
                type="tel"
                className="form-input"
                minLength={8}
                maxLength={20}
                placeholder="(21) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <span className="form-label" id="grupo-papel-label">
                Como você deseja atuar na Cantina?
              </span>
              <div className="role-grid" role="radiogroup" aria-labelledby="grupo-papel-label">
                {PAPEIS_OPCOES.map((opcao) => {
                  const selecionado = papel === opcao.valor;
                  return (
                    <button
                      key={opcao.valor}
                      type="button"
                      role="radio"
                      aria-checked={selecionado}
                      className={`role-card ${selecionado ? 'active' : ''}`}
                      onClick={() => setPapel(opcao.valor)}
                    >
                      <span className="role-card-title">{opcao.titulo}</span>
                      <span className="role-card-desc">{opcao.descricao}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={carregando}>
              <UserPlus size={18} />
              {carregando ? 'Criando conta...' : 'Concluir Cadastro'}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}