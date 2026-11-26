import { useState } from 'react';
import { ShoppingBag, Sparkles, CheckCircle2, AlertCircle, Store } from 'lucide-react';
import { apiRequest } from '../services/api';

export default function AreaCompradorPage({ usuario, onAtualizarUsuario, onIrParaPainelVendedor }) {
  const [ativando, setAtivando] = useState(false);
  const [erro, setErro] = useState('');

  const apenasComprador = usuario?.papel === 'comprador';

  async function handleQueroVender() {
    setAtivando(true);
    setErro('');
    try {
      await apiRequest('/vendedores/ativar', { method: 'POST' });
      const usuarioAtualizado = { ...usuario, papel: 'ambos' };
      onAtualizarUsuario(usuarioAtualizado);
      onIrParaPainelVendedor();
    } catch (err) {
      setErro(err.message || 'Não foi possível ativar o perfil de vendedor.');
    } finally {
      setAtivando(false);
    }
  }

  return (
    <div className="app-shell app-shell-with-nav">
      <header className="store-banner">
        <div className="store-banner-top">
          <span className="badge-campus">
            <span className="badge-dot-red" />
            IFRJ • Campus {usuario?.campus || 'Niterói'}
          </span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Área do Comprador</span>
        </div>
        <h1 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Olá, {usuario?.nome?.split(' ')[0]}!</h1>
        <p style={{ fontSize: '0.88rem', opacity: 0.92, marginTop: 4 }}>
          Explore os lanches disponíveis hoje no campus ou acompanhe suas encomendas.
        </p>
      </header>

      <section className="card-99">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              backgroundColor: 'var(--ifrj-verde-claro)',
              color: 'var(--ifrj-verde-escuro)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShoppingBag size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Vitrine Digital & Meus Pedidos</h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--texto-secundario)' }}>
              A vitrine de produtos e encomendas será conectada nas próximas etapas (Módulo 2 e 3).
            </p>
          </div>
        </div>
      </section>

      {apenasComprador ? (
        <section className="card-section">
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 6 }}>
            Quer divulgar seus próprios lanches no campus?
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--texto-secundario)', marginBottom: 14, lineHeight: 1.45 }}>
            Você pode acumular o perfil de vendedor na mesma conta sem perder seu acesso de comprador.
          </p>

          {erro && (
            <div className="alert-box alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} />
              <span>{erro}</span>
            </div>
          )}

          <button
            type="button"
            className="btn-primary"
            onClick={handleQueroVender}
            disabled={ativando}
          >
            <Sparkles size={18} />
            {ativando ? 'Ativando perfil...' : 'Quero vender na Cantina'}
          </button>
        </section>
      ) : (
        <section className="card-section">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ifrj-verde-escuro)', fontWeight: 600, fontSize: '0.9rem' }}>
            <CheckCircle2 size={18} />
            <span>Você possui perfil de Vendedor ativo nesta conta.</span>
          </div>
          <button
            type="button"
            className="btn-primary"
            style={{ marginTop: 12 }}
            onClick={onIrParaPainelVendedor}
          >
            <Store size={18} />
            Ir para Painel do Vendedor
          </button>
        </section>
      )}
    </div>
  );
}