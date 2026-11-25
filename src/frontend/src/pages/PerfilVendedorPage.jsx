import { useEffect, useState } from 'react';
import { Store, Clock, KeyRound, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { apiRequest } from '../services/api';

const TURNOS_OPCOES = ['Manhã', 'Tarde', 'Noite'];

export default function PerfilVendedorPage({ usuario, onAtualizarUsuario }) {
  const [perfil, setPerfil] = useState(null);
  const [apresentacao, setApresentacao] = useState('');
  const [turnosSelecionados, setTurnosSelecionados] = useState([]);
  const [chavePix, setChavePix] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState(null);

  const ehVendedor = usuario?.papel === 'vendedor' || usuario?.papel === 'ambos';

  useEffect(() => {
    if (!ehVendedor) {
      setCarregando(false);
      return;
    }

    async function carregarPerfil() {
      try {
        const dados = await apiRequest('/vendedores/meu-perfil');
        setPerfil(dados);
        setApresentacao(dados.apresentacao || '');
        setChavePix(dados.chave_pix || '');
        if (dados.turnos_habituais) {
          setTurnosSelecionados(
            dados.turnos_habituais.split(',').map((t) => t.trim()).filter(Boolean)
          );
        }
      } catch (err) {
        setMensagem({ tipo: 'erro', texto: err.message });
      } finally {
        setCarregando(false);
      }
    }

    carregarPerfil();
  }, [ehVendedor]);

  function alternarTurno(turno) {
    setTurnosSelecionados((prev) =>
      prev.includes(turno) ? prev.filter((t) => t !== turno) : [...prev, turno]
    );
  }

  async function handleAtivarVendedor() {
    setSalvando(true);
    setMensagem(null);
    try {
      const novoPerfil = await apiRequest('/vendedores/ativar-perfil', { method: 'POST' });
      setPerfil(novoPerfil);
      if (onAtualizarUsuario) {
        onAtualizarUsuario({ ...usuario, papel: 'ambos' });
      }
      setMensagem({ tipo: 'sucesso', texto: 'Modo vendedor ativado! Configure sua loja abaixo.' });
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setSalvando(false);
    }
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    setMensagem(null);

    try {
      const payload = {
        apresentacao: apresentacao.trim() || null,
        turnos_habituais: turnosSelecionados.length > 0 ? turnosSelecionados.join(', ') : null,
        chave_pix: chavePix.trim() || null, // Opcional no MVP (HU03 - Critério 2)
      };

      const atualizado = await apiRequest('/vendedores/meu-perfil', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      setPerfil(atualizado);
      setMensagem({ tipo: 'sucesso', texto: 'Perfil da loja atualizado com sucesso!' });
    } catch (err) {
      setMensagem({ tipo: 'erro', texto: err.message });
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <div className="app-shell">
        <div className="store-banner">
          <h2>Carregando dados da loja...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      {/* Cabeçalho estilo 99Food com identidade IFRJ */}
      <header className="store-banner">
        <div className="store-banner-top">
          <span className="badge-campus">
            <span className="badge-dot-red" />
            IFRJ • Campus {usuario?.campus || 'Niterói'}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Cantina Solidária</span>
        </div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Minha Loja no Campus</h1>
        <p style={{ fontSize: '0.88rem', opacity: 0.9, marginTop: 4 }}>
          Configure como os estudantes e servidores veem sua banca.
        </p>
      </header>

      {/* Cartão sobreposto de resumo da loja (Assinatura 99Food) */}
      <section className="card-99" aria-label="Resumo do Perfil de Vendedor">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              backgroundColor: 'var(--ifrj-verde-claro)',
              color: 'var(--ifrj-verde-escuro)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Store size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{usuario?.nome}</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--texto-secundario)' }}>
              {usuario?.vinculo} • {turnosSelecionados.length > 0 ? turnosSelecionados.join(' • ') : 'Turnos não definidos'}
            </p>
          </div>
        </div>

        {apresentacao && (
          <p
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid var(--borda-suave)',
              fontSize: '0.88rem',
              color: 'var(--texto-secundario)',
              lineHeight: 1.45,
            }}
          >
            “{apresentacao}”
          </p>
        )}
      </section>

      {/* Caso o usuário ainda seja apenas comprador (HU03 - Bloqueio / Ativação) */}
      {!ehVendedor ? (
        <section className="card-section">
          <h3 style={{ fontSize: '1.05rem', marginBottom: 8 }}>Você ainda não possui perfil de vendedor</h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--texto-secundario)', marginBottom: 16, lineHeight: 1.5 }}>
            Sua conta atual está configurada apenas como <strong>Comprador</strong>. Ative seu perfil comercial para cadastrar alimentos e bebidas na Cantina Solidária.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={handleAtivarVendedor}
            disabled={salvando}
          >
            <Sparkles size={18} />
            {salvando ? 'Ativando...' : 'Ativar Perfil de Vendedor'}
          </button>
        </section>
      ) : (
        /* Formulário de Edição do Perfil de Vendedor (HU03) */
        <section className="card-section">
          {mensagem && (
            <div
              role="alert"
              className={`alert-box ${mensagem.tipo === 'sucesso' ? 'alert-success' : 'alert-error'}`}
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{mensagem.texto}</span>
            </div>
          )}

          <form onSubmit={handleSalvar}>
            <div className="form-group">
              <label htmlFor="apresentacao" className="form-label">
                Apresentação da Banca / Produtos
              </label>
              <textarea
                id="apresentacao"
                className="form-textarea"
                rows={3}
                maxLength={500}
                placeholder="Ex: Bolos no pote caseiros, salgados assados e sucos naturais feitos no dia!"
                value={apresentacao}
                onChange={(e) => setApresentacao(e.target.value)}
              />
              <span className="form-hint">Conte aos compradores o que você costuma vender e onde costuma ficar no campus.</span>
            </div>

            <div className="form-group">
              <span className="form-label">
                <Clock size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                Turnos Habituais de Atendimento
              </span>
              <div className="chips-row" role="group" aria-label="Turnos habituais">
                {TURNOS_OPCOES.map((turno) => {
                  const ativo = turnosSelecionados.includes(turno);
                  return (
                    <button
                      key={turno}
                      type="button"
                      className={`chip ${ativo ? 'active' : ''}`}
                      onClick={() => alternarTurno(turno)}
                      aria-pressed={ativo}
                    >
                      {turno}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="chavePix" className="form-label">
                <KeyRound size={15} style={{ verticalAlign: 'middle', marginRight: 5 }} />
                Chave Pix (Opcional)
              </label>
              <input
                id="chavePix"
                type="text"
                className="form-input"
                maxLength={150}
                placeholder="CPF, e-mail, telefone ou chave aleatória"
                value={chavePix}
                onChange={(e) => setChavePix(e.target.value)}
              />
              <span className="form-hint">
                Opcional no MVP. Exibida para facilitar o pagamento combinado na retirada (sem transação automática).
              </span>
            </div>

            <button type="submit" className="btn-primary" disabled={salvando}>
              {salvando ? 'Salvando alterações...' : 'Salvar Perfil de Vendedor'}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}