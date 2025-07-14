# Projeto_BD1

# Descrição do sitema:

O sistema permitirá que usuários avaliem festas que frequentaram, com base em critérios como organização, segurança, música, preço, ambiente, entre outros. As avaliações serão compostas por questões de múltipla escolha e texto livre. Será possível cadastrar novas festas e associar um conjunto de questões a cada uma. Os usuários convidados a avaliar uma festa poderão registrar suas respostas. O sistema gerará relatórios com médias, rankings de festas e comparações entre festas.

# Relatórios esperados:

- Média geral de avaliação de cada festa.
- Comparativo entre festas por categoria (ex: média de música nas festas em um ano).
- Ranking das festas mais bem avaliadas.
- Nuvem de palavras ou lista com comentários mais comuns nas respostas abertas.
- Percentual de usuários satisfeitos com cada aspecto da festa.

# **Esquema relacional?**

* **`Atlética`** (`CNPJ` [PK], `Nome`, `Sigla` [Opcional], `Mascote` [Opcional])
* **`Curso`** (`CodigoCurso` [PK], `NomeCurso`, `CNPJ_Atletica_FK` [FK para Atlética])
* **`Aluno`** (`Matricula` [PK], `Nome`, `CodigoCurso_FK` [FK para Curso])
* **`Festa`** (`ID_Festa` [PK, AutoInc], `Nome`, `Horario`, `TipoFesta`, `Local`)
* **`Festa_Organizador_Atletica`** (`ID_Festa_FK` [PK, FK para Festa], `CNPJ_Atletica_FK` [PK, FK para Atlética])

  * *(Chave Primária Composta: (`ID_Festa_FK`, `CNPJ_Atletica_FK`))*
* **`Avaliacao`** (`ID_Avaliacao` [PK, AutoInc], `ID_Festa_FK` [FK para Festa], `CodigoCurso_FK` [FK para Curso], `Nota_DJs`, `Nota_Bebidas`, `Nota_Banheiros`, `Nota_Local`, `Nota_Organizacao`, `Comentario` [Opcional], `DataHoraAvaliacao`)
* **`Aluno_Avaliou_Festa`** (`Matricula_Aluno_FK` [PK, FK para Aluno], `ID_Festa_FK` [PK, FK para Festa])

  * *(Chave Primária Composta: (`Matricula_Aluno_FK`, `ID_Festa_FK`))*
