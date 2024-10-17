CREATE TABLE Usuario (
    id SERIAL PRIMARY KEY,
    passaport INTEGER NOT NULL,
    nome VARCHAR(255) NOT NULL,
    nome_discord VARCHAR(255) NOT NULL,
    senha VARCHAR(255) NOT NULL,
    liberado INTEGER NOT NULL DEFAULT 0,
    ativo INTEGER NOT NULL DEFAULT 1, 
    CONSTRAINT usuario_ativo CHECK (ativo IN (0, 1)),
    CONSTRAINT liberado_check CHECK (liberado IN (0, 1))
);