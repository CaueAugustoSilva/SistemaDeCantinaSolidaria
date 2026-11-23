-- Habilitar extensão para geração de UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela USUARIOS (vinculada ao auth.users do Supabase)[cite: 9]
CREATE TABLE public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    vinculo VARCHAR(50) NOT NULL, -- Estudante, Docente, Técnico-Administrativo, Terceirizado[cite: 1]
    campus VARCHAR(100) NOT NULL DEFAULT 'Niterói',[cite: 1]
    telefone VARCHAR(20) NOT NULL,
    papel VARCHAR(30) NOT NULL CHECK (papel IN ('comprador', 'vendedor', 'ambos', 'admin')),[cite: 9]
    ativo BOOLEAN NOT NULL DEFAULT TRUE, -- Suporte à suspensão de contas (RF15 / RN12)[cite: 9]
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabela PERFIS_VENDEDOR (relação 1 para 0..1 com USUARIOS)[cite: 9]
CREATE TABLE public.perfis_vendedor (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID UNIQUE NOT NULL REFERENCES public.usuarios(id) ON DELETE CASCADE,
    apresentacao TEXT,
    turnos_habituais VARCHAR(100),
    chave_pix VARCHAR(150) -- Opcional no MVP[cite: 9]
);

-- 3. Tabela PRODUTOS[cite: 9]
CREATE TABLE public.produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendedor_id UUID NOT NULL REFERENCES public.perfis_vendedor(id) ON DELETE CASCADE,
    nome VARCHAR(120) NOT NULL,
    descricao TEXT,
    tipo VARCHAR(20) NOT NULL CHECK (tipo IN ('comida', 'bebida')),[cite: 2, 9]
    categoria VARCHAR(60) NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL CHECK (preco_unitario > 0),[cite: 9]
    url_foto TEXT, -- Opcional no MVP[cite: 9]
    disponivel BOOLEAN NOT NULL DEFAULT TRUE, -- FALSE = Esgotado na vitrine (RF05 / RN09)[cite: 9]
    aceita_encomenda BOOLEAN NOT NULL DEFAULT TRUE, -- Regra RN10[cite: 9]
    ativo BOOLEAN NOT NULL DEFAULT TRUE -- Soft delete / Pausa (RN06)[cite: 9]
);

-- 4. Tabela OFERTAS_DATA[cite: 9]
CREATE TABLE public.ofertas_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
    data_disponivel DATE NOT NULL,
    turno VARCHAR(50), -- Opcional no MVP[cite: 9]
    quantidade_prevista INTEGER CHECK (quantidade_prevista IS NULL OR quantidade_prevista >= 0), -- Opcional no MVP[cite: 9]
    UNIQUE (produto_id, data_disponivel, turno)
);