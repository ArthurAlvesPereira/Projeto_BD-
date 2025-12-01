package br.com.arthur.sistema_avaliacoes.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;


@Repository
public class RelatorioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> rankingFestasMelhorAvaliadas(int limit) {
        String sql = """
            SELECT 
                f.ID_Festa,
                f.Nome,
                f.TipoFesta,
                f.Local,
                f.Horario,
                a.Nome AS OrganizadorNome,
                ROUND(AVG(r.Valor_Numerico), 2) AS MediaGeral,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes
            FROM Festa f
            INNER JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            INNER JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
            LEFT JOIN Festa_Organizador_Atletica foa ON f.ID_Festa = foa.ID_Festa_FK
            LEFT JOIN Atletica a ON foa.CNPJ_Atletica_FK = a.CNPJ
            WHERE r.Valor_Numerico IS NOT NULL
            GROUP BY f.ID_Festa, f.Nome, f.TipoFesta, f.Local, f.Horario, a.Nome
            HAVING COUNT(DISTINCT av.ID_Avaliacao) >= 1
            ORDER BY MediaGeral DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, limit);
    }

    public Map<String, Object> estatisticasDetalhadasFesta(int idFesta) {
        String sql = """
            SELECT 
                f.Nome AS NomeFesta,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG(CASE WHEN q.Enunciado ILIKE '%DJ%' OR q.Enunciado ILIKE '%Som%' THEN r.Valor_Numerico END), 2) AS MediaDJs,
                ROUND(AVG(CASE WHEN q.Enunciado ILIKE '%Bebida%' OR q.Enunciado ILIKE '%Bar%' THEN r.Valor_Numerico END), 2) AS MediaBebidas,
                ROUND(AVG(CASE WHEN q.Enunciado ILIKE '%Banheiro%' THEN r.Valor_Numerico END), 2) AS MediaBanheiros,
                ROUND(AVG(CASE WHEN q.Enunciado ILIKE '%Local%' OR q.Enunciado ILIKE '%Estrutura%' THEN r.Valor_Numerico END), 2) AS MediaLocal,
                ROUND(AVG(CASE WHEN q.Enunciado ILIKE '%Organiza%' THEN r.Valor_Numerico END), 2) AS MediaOrganizacao,
                ROUND(AVG(r.Valor_Numerico), 2) AS MediaGeral
            FROM Festa f
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            LEFT JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
            LEFT JOIN Questao q ON r.ID_Questao_FK = q.ID_Questao
            WHERE f.ID_Festa = ?
            GROUP BY f.ID_Festa, f.Nome
        """;
        return jdbcTemplate.queryForMap(sql, idFesta);
    }

    public List<Map<String, Object>> rankingAtleticasPorAvaliacao() {
        String sql = """
            SELECT 
                a.CNPJ,
                a.Nome,
                a.Sigla,
                COUNT(DISTINCT f.ID_Festa) AS TotalFestasRealizadas,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG(r.Valor_Numerico), 2) AS MediaGeralFestas
            FROM Atletica a
            INNER JOIN Festa_Organizador_Atletica foa ON a.CNPJ = foa.CNPJ_Atletica_FK
            INNER JOIN Festa f ON foa.ID_Festa_FK = f.ID_Festa
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            LEFT JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
            GROUP BY a.CNPJ, a.Nome, a.Sigla
            HAVING COUNT(DISTINCT f.ID_Festa) > 0
            ORDER BY MediaGeralFestas DESC NULLS LAST
        """;
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> distribuicaoAvaliacoesPorCurso() {
        String sql = """
            SELECT 
                c.NomeCurso AS Curso,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG(r.Valor_Numerico), 2) AS MediaGeral
            FROM Avaliacao av
            INNER JOIN Aluno al ON av.Matricula_Aluno_FK = al.Matricula
            INNER JOIN Curso c ON al.CodigoCurso_FK = c.CodigoCurso
            LEFT JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
            GROUP BY c.NomeCurso
            ORDER BY TotalAvaliacoes DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> festasMaiorParticipacao(int limit) {
        String sql = """
            SELECT 
                f.ID_Festa,
                f.Nome,
                f.TipoFesta,
                f.Horario,
                a.Nome AS NomeAtletica,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes
            FROM Festa f
            INNER JOIN Festa_Organizador_Atletica foa ON f.ID_Festa = foa.ID_Festa_FK
            INNER JOIN Atletica a ON foa.CNPJ_Atletica_FK = a.CNPJ
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            GROUP BY f.ID_Festa, f.Nome, f.TipoFesta, f.Horario, a.Nome
            ORDER BY TotalAvaliacoes DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, limit);
    }

    public List<Map<String, Object>> analiseComparativaCategorias() {
        String sql = """
            WITH PartyCategoryStats AS (
                SELECT
                    f.Nome AS FestaNome,
                    CASE 
                        WHEN q.Enunciado ILIKE '%DJ%' OR q.Enunciado ILIKE '%Som%' THEN 'DJs'
                        WHEN q.Enunciado ILIKE '%Bebida%' OR q.Enunciado ILIKE '%Bar%' THEN 'Bebidas'
                        WHEN q.Enunciado ILIKE '%Banheiro%' THEN 'Banheiros'
                        WHEN q.Enunciado ILIKE '%Local%' OR q.Enunciado ILIKE '%Estrutura%' THEN 'Local'
                        WHEN q.Enunciado ILIKE '%Organiza%' THEN 'Organização'
                        ELSE 'Outros'
                    END AS Categoria,
                    AVG(r.Valor_Numerico) AS Media
                FROM Festa f
                JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
                JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
                JOIN Questao q ON r.ID_Questao_FK = q.ID_Questao
                WHERE r.Valor_Numerico IS NOT NULL
                GROUP BY f.Nome, 
                    CASE 
                        WHEN q.Enunciado ILIKE '%DJ%' OR q.Enunciado ILIKE '%Som%' THEN 'DJs'
                        WHEN q.Enunciado ILIKE '%Bebida%' OR q.Enunciado ILIKE '%Bar%' THEN 'Bebidas'
                        WHEN q.Enunciado ILIKE '%Banheiro%' THEN 'Banheiros'
                        WHEN q.Enunciado ILIKE '%Local%' OR q.Enunciado ILIKE '%Estrutura%' THEN 'Local'
                        WHEN q.Enunciado ILIKE '%Organiza%' THEN 'Organização'
                        ELSE 'Outros'
                    END
            ),
            CategoryRanked AS (
                SELECT 
                    Categoria,
                    AVG(Media) OVER(PARTITION BY Categoria) as MediaGeral,
                    FestaNome,
                    Media,
                    ROW_NUMBER() OVER(PARTITION BY Categoria ORDER BY Media DESC) as RankBest,
                    ROW_NUMBER() OVER(PARTITION BY Categoria ORDER BY Media ASC) as RankWorst
                FROM PartyCategoryStats
            )
            SELECT 
                Categoria,
                ROUND(MAX(MediaGeral), 2) as MediaNota,
                MAX(CASE WHEN RankBest = 1 THEN FestaNome END) as MelhorFesta,
                MAX(CASE WHEN RankWorst = 1 THEN FestaNome END) as PiorFesta
            FROM CategoryRanked
            GROUP BY Categoria
            ORDER BY MediaNota DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> estatisticasPorTipoFesta() {
        String sql = """
            SELECT 
                f.TipoFesta,
                COUNT(DISTINCT f.ID_Festa) AS TotalFestas,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG(r.Valor_Numerico), 2) AS MediaGeral,
                COUNT(DISTINCT al.CodigoCurso_FK) AS CursosDiferentes
            FROM Festa f
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            LEFT JOIN Aluno al ON av.Matricula_Aluno_FK = al.Matricula
            LEFT JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
            GROUP BY f.TipoFesta
            ORDER BY MediaGeral DESC NULLS LAST
        """;
        return jdbcTemplate.queryForList(sql);
    }

    public List<Map<String, Object>> alunosMaisAtivos(int limit) {
        String sql = """
            SELECT 
                al.Matricula,
                al.Nome,
                c.NomeCurso AS Curso,
                COUNT(av.ID_Avaliacao) AS TotalFestasAvaliadas
            FROM Aluno al
            INNER JOIN Curso c ON al.CodigoCurso_FK = c.CodigoCurso
            INNER JOIN Avaliacao av ON al.Matricula = av.Matricula_Aluno_FK
            GROUP BY al.Matricula, al.Nome, c.NomeCurso
            ORDER BY TotalFestasAvaliadas DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, limit);
    }

    public List<Map<String, Object>> tendenciaAvaliacoesTemporal() {
        String sql = """
            SELECT 
                DATE_TRUNC('month', f.Horario) AS Mes,
                COUNT(DISTINCT av.ID_Avaliacao) AS TotalAvaliacoes,
                COUNT(DISTINCT f.ID_Festa) AS TotalFestas,
                ROUND(AVG(r.Valor_Numerico), 2) AS MediaGeral
            FROM Festa f
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            LEFT JOIN Resposta r ON av.ID_Avaliacao = r.ID_Avaliacao_FK
            GROUP BY DATE_TRUNC('month', f.Horario)
            ORDER BY Mes DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }
}
