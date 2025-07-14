CREATE TABLE Atletica (
    CNPJ VARCHAR(14) PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Sigla VARCHAR(20) UNIQUE,
    Mascote VARCHAR(100)
);

CREATE TABLE Curso (
    CodigoCurso VARCHAR(20) PRIMARY KEY,
    NomeCurso VARCHAR(100) NOT NULL,
    CNPJ_Atletica_FK VARCHAR(14) NOT NULL,
    CONSTRAINT fk_curso_atletica
        FOREIGN KEY (CNPJ_Atletica_FK)
        REFERENCES Atletica(CNPJ)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Aluno (
    Matricula INTEGER PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    CodigoCurso_FK VARCHAR(20) NOT NULL,
    CONSTRAINT fk_aluno_curso
        FOREIGN KEY (CodigoCurso_FK)
        REFERENCES Curso(CodigoCurso)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Festa (
    ID_Festa SERIAL PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Horario TIMESTAMP NOT NULL,
    TipoFesta VARCHAR(50) NOT NULL,
    Local VARCHAR(255) NOT NULL
);

CREATE TABLE Festa_Organizador_Atletica (
    ID_Festa_FK INTEGER NOT NULL,
    CNPJ_Atletica_FK VARCHAR(14) NOT NULL,
    PRIMARY KEY (ID_Festa_FK, CNPJ_Atletica_FK),
    CONSTRAINT fk_festaorg_festa
        FOREIGN KEY (ID_Festa_FK)
        REFERENCES Festa(ID_Festa)
        ON DELETE CASCADE,
    CONSTRAINT fk_festaorg_atletica
        FOREIGN KEY (CNPJ_Atletica_FK)
        REFERENCES Atletica(CNPJ)
        ON DELETE CASCADE
);

CREATE TABLE Avaliacao (
    ID_Avaliacao SERIAL PRIMARY KEY,
    ID_Festa_FK INTEGER NOT NULL,
    CodigoCurso_FK VARCHAR(20) NOT NULL,
    Nota_DJs INTEGER NOT NULL,
    Nota_Bebidas INTEGER NOT NULL,
    Nota_Banheiros INTEGER NOT NULL,
    Nota_Local INTEGER NOT NULL,
    Nota_Organizacao INTEGER NOT NULL,
    Comentario TEXT,
    DataHoraAvaliacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_avaliacao_festa
        FOREIGN KEY (ID_Festa_FK)
        REFERENCES Festa(ID_Festa)
        ON DELETE CASCADE,
    CONSTRAINT fk_avaliacao_curso
        FOREIGN KEY (CodigoCurso_FK)
        REFERENCES Curso(CodigoCurso)
        ON DELETE RESTRICT,
    CONSTRAINT check_nota_djs CHECK (Nota_DJs >= 1 AND Nota_DJs <= 10),
    CONSTRAINT check_nota_bebidas CHECK (Nota_Bebidas >= 1 AND Nota_Bebidas <= 10),
    CONSTRAINT check_nota_banheiros CHECK (Nota_Banheiros >= 1 AND Nota_Banheiros <= 10),
    CONSTRAINT check_nota_local CHECK (Nota_Local >= 1 AND Nota_Local <= 10),
    CONSTRAINT check_nota_organizacao CHECK (Nota_Organizacao >= 1 AND Nota_Organizacao <= 10)
);

CREATE TABLE Aluno_Avaliou_Festa (
    Matricula_Aluno_FK INTEGER NOT NULL,
    ID_Festa_FK INTEGER NOT NULL,
    PRIMARY KEY (Matricula_Aluno_FK, ID_Festa_FK),
    CONSTRAINT fk_alunoavaliou_aluno
        FOREIGN KEY (Matricula_Aluno_FK)
        REFERENCES Aluno(Matricula)
        ON DELETE CASCADE,
    CONSTRAINT fk_alunoavaliou_festa
        FOREIGN KEY (ID_Festa_FK)
        REFERENCES Festa(ID_Festa)
        ON DELETE CASCADE
);
