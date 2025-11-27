package br.com.arthur.sistema_avaliacoes.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

/**
 * Repository para queries de relatórios complexos com SQL avançado
 * Inclui: JOINs, agregações, agrupamentos, ranking, subconsultas
 */
@Repository
public class RelatorioRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Ranking das festas melhor avaliadas (média geral)
     * Usa: JOIN, AVG, GROUP BY, ORDER BY, LIMIT
     */
    public List<Map<String, Object>> rankingFestasMelhorAvaliadas(int limit) {
        String sql = """
            SELECT 
                f.ID_Festa,
                f.Nome,
                f.TipoFesta,
                f.Local,
                f.Horario,
                ROUND(AVG((av.Nota_DJs + av.Nota_Bebidas + av.Nota_Banheiros + 
                           av.Nota_Local + av.Nota_Organizacao) / 5.0), 2) AS MediaGeral,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes
            FROM Festa f
            INNER JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            GROUP BY f.ID_Festa, f.Nome, f.TipoFesta, f.Local, f.Horario
            HAVING COUNT(av.ID_Avaliacao) >= 1
            ORDER BY MediaGeral DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, limit);
    }

    /**
     * Estatísticas detalhadas por categoria de avaliação de uma festa
     * Usa: múltiplos AVG, COUNT, JOIN
     */
    public Map<String, Object> estatisticasDetalhadasFesta(int idFesta) {
        String sql = """
            SELECT 
                f.Nome AS NomeFesta,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG(av.Nota_DJs), 2) AS MediaDJs,
                ROUND(AVG(av.Nota_Bebidas), 2) AS MediaBebidas,
                ROUND(AVG(av.Nota_Banheiros), 2) AS MediaBanheiros,
                ROUND(AVG(av.Nota_Local), 2) AS MediaLocal,
                ROUND(AVG(av.Nota_Organizacao), 2) AS MediaOrganizacao,
                ROUND(AVG((av.Nota_DJs + av.Nota_Bebidas + av.Nota_Banheiros + 
                           av.Nota_Local + av.Nota_Organizacao) / 5.0), 2) AS MediaGeral
            FROM Festa f
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            WHERE f.ID_Festa = ?
            GROUP BY f.ID_Festa, f.Nome
        """;
        return jdbcTemplate.queryForMap(sql, idFesta);
    }

    /**
     * Ranking de atléticas por média de avaliações das suas festas
     * Usa: múltiplos JOINs, subconsulta, agregação, GROUP BY, ORDER BY
     */
    public List<Map<String, Object>> rankingAtleticasPorAvaliacao() {
        String sql = """
            SELECT 
                a.CNPJ,
                a.Nome,
                a.Sigla,
                COUNT(DISTINCT f.ID_Festa) AS TotalFestasRealizadas,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG((av.Nota_DJs + av.Nota_Bebidas + av.Nota_Banheiros + 
                           av.Nota_Local + av.Nota_Organizacao) / 5.0), 2) AS MediaGeralFestas
            FROM Atletica a
            INNER JOIN Festa_Organizador_Atletica foa ON a.CNPJ = foa.CNPJ_Atletica_FK
            INNER JOIN Festa f ON foa.ID_Festa_FK = f.ID_Festa
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            GROUP BY a.CNPJ, a.Nome, a.Sigla
            HAVING COUNT(DISTINCT f.ID_Festa) > 0
            ORDER BY MediaGeralFestas DESC NULLS LAST
        """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Distribuição de avaliações por curso
     * Usa: JOIN, COUNT, GROUP BY, agregação
     */
    public List<Map<String, Object>> distribuicaoAvaliacoesPorCurso() {
        String sql = """
            SELECT 
                av.CodigoCurso_FK AS CodigoCurso,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG((av.Nota_DJs + av.Nota_Bebidas + av.Nota_Banheiros + 
                           av.Nota_Local + av.Nota_Organizacao) / 5.0), 2) AS MediaGeral
            FROM Avaliacao av
            GROUP BY av.CodigoCurso_FK
            ORDER BY TotalAvaliacoes DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Festas com maior participação (número de avaliações)
     * Usa: JOIN, COUNT, GROUP BY, ORDER BY, subconsulta no WHERE
     */
    public List<Map<String, Object>> festasMaiorParticipacao(int limit) {
        String sql = """
            SELECT 
                f.ID_Festa,
                f.Nome,
                f.TipoFesta,
                f.Horario,
                a.Nome AS NomeAtletica,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes
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

    /**
     * Análise comparativa de categorias - qual aspecto é melhor/pior avaliado
     * Usa: múltiplos AVG, UNION, subconsultas
     */
    public List<Map<String, Object>> analiseComparativaCategorias() {
        String sql = """
            SELECT 'DJs' AS Categoria, ROUND(AVG(Nota_DJs), 2) AS MediaNota
            FROM Avaliacao
            UNION ALL
            SELECT 'Bebidas' AS Categoria, ROUND(AVG(Nota_Bebidas), 2) AS MediaNota
            FROM Avaliacao
            UNION ALL
            SELECT 'Banheiros' AS Categoria, ROUND(AVG(Nota_Banheiros), 2) AS MediaNota
            FROM Avaliacao
            UNION ALL
            SELECT 'Local' AS Categoria, ROUND(AVG(Nota_Local), 2) AS MediaNota
            FROM Avaliacao
            UNION ALL
            SELECT 'Organização' AS Categoria, ROUND(AVG(Nota_Organizacao), 2) AS MediaNota
            FROM Avaliacao
            ORDER BY MediaNota DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Festas por tipo com estatísticas
     * Usa: COUNT, AVG, GROUP BY, CASE
     */
    public List<Map<String, Object>> estatisticasPorTipoFesta() {
        String sql = """
            SELECT 
                f.TipoFesta,
                COUNT(DISTINCT f.ID_Festa) AS TotalFestas,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes,
                ROUND(AVG((av.Nota_DJs + av.Nota_Bebidas + av.Nota_Banheiros + 
                           av.Nota_Local + av.Nota_Organizacao) / 5.0), 2) AS MediaGeral,
                COUNT(DISTINCT CASE WHEN av.ID_Avaliacao IS NOT NULL 
                              THEN av.CodigoCurso_FK END) AS CursosDiferentes
            FROM Festa f
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            GROUP BY f.TipoFesta
            ORDER BY MediaGeral DESC NULLS LAST
        """;
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * Alunos mais ativos (que mais avaliaram festas)
     * Usa: JOIN múltiplo, COUNT, GROUP BY, ORDER BY
     */
    public List<Map<String, Object>> alunosMaisAtivos(int limit) {
        String sql = """
            SELECT 
                al.Matricula,
                al.Nome,
                al.CodigoCurso_FK AS Curso,
                COUNT(aaf.ID_Festa_FK) AS TotalFestasAvaliadas
            FROM Aluno al
            INNER JOIN Aluno_Avaliou_Festa aaf ON al.Matricula = aaf.Matricula_Aluno_FK
            GROUP BY al.Matricula, al.Nome, al.CodigoCurso_FK
            ORDER BY TotalFestasAvaliadas DESC
            LIMIT ?
        """;
        return jdbcTemplate.queryForList(sql, limit);
    }

    /**
     * Tendência temporal - avaliações ao longo do tempo
     * Usa: DATE_TRUNC, COUNT, AVG, GROUP BY, ORDER BY
     */
    public List<Map<String, Object>> tendenciaAvaliacoesTemporal() {
        String sql = """
            SELECT 
                DATE_TRUNC('month', f.Horario) AS Mes,
                COUNT(av.ID_Avaliacao) AS TotalAvaliacoes,
                COUNT(DISTINCT f.ID_Festa) AS TotalFestas,
                ROUND(AVG((av.Nota_DJs + av.Nota_Bebidas + av.Nota_Banheiros + 
                           av.Nota_Local + av.Nota_Organizacao) / 5.0), 2) AS MediaGeral
            FROM Festa f
            LEFT JOIN Avaliacao av ON f.ID_Festa = av.ID_Festa_FK
            GROUP BY DATE_TRUNC('month', f.Horario)
            ORDER BY Mes DESC
        """;
        return jdbcTemplate.queryForList(sql);
    }
}
