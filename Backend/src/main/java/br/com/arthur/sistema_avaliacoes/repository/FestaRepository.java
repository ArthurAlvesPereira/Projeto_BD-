package br.com.arthur.sistema_avaliacoes.repository;

import br.com.arthur.sistema_avaliacoes.model.Festa;
import br.com.arthur.sistema_avaliacoes.model.Questao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.RowMapper;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.List;

@Repository
public class FestaRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Transactional
    public void salvar(Festa festa, String cnpjOrganizador) {
        String sqlFesta = "INSERT INTO Festa (Nome, Horario, TipoFesta, Local) VALUES (?, ?, ?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlFesta, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, festa.getNome());
            ps.setTimestamp(2, Timestamp.valueOf(festa.getHorario()));
            ps.setString(3, festa.getTipoFesta());
            ps.setString(4, festa.getLocal());
            return ps;
        }, keyHolder);

        int idFestaGerado = ((Number) keyHolder.getKeys().get("id_festa")).intValue();
        String sqlOrganizador = "INSERT INTO Festa_Organizador_Atletica (ID_Festa_FK, CNPJ_Atletica_FK) VALUES (?, ?)";
        jdbcTemplate.update(sqlOrganizador, idFestaGerado, cnpjOrganizador);
        
        if (festa.getQuestoes() != null) {
            String sqlQuestao = "INSERT INTO Festa_Questao (ID_Festa_FK, ID_Questao_FK) VALUES (?, ?)";
            for (Questao q : festa.getQuestoes()) {
                jdbcTemplate.update(sqlQuestao, idFestaGerado, q.getIdQuestao());
            }
        }
    }

    private static class FestaRowMapper implements RowMapper<Festa> {
        @Override
        public Festa mapRow(ResultSet rs, int rowNum) throws SQLException {
            Festa festa = new Festa();
            festa.setId(rs.getInt("ID_Festa"));
            festa.setNome(rs.getString("Nome"));
            festa.setHorario(rs.getTimestamp("Horario").toLocalDateTime());
            festa.setTipoFesta(rs.getString("TipoFesta"));
            festa.setLocal(rs.getString("Local"));
            return festa;
        }
    }

    public List<Festa> listarTodas() {
        String sql = "SELECT * FROM Festa ORDER BY Horario ASC"; 
        return jdbcTemplate.query(sql, new FestaRowMapper());
    }

    public Festa findById(int idFesta) {
        String sql = "SELECT * FROM Festa WHERE ID_Festa = ?";
        Festa festa = jdbcTemplate.queryForObject(sql, new FestaRowMapper(), idFesta);
        
        if (festa != null) {
            String sqlQuestoes = "SELECT q.* FROM Questao q " +
                                 "JOIN Festa_Questao fq ON q.ID_Questao = fq.ID_Questao_FK " +
                                 "WHERE fq.ID_Festa_FK = ?";
            List<Questao> questoes = jdbcTemplate.query(sqlQuestoes, (rs, rowNum) -> {
                Questao q = new Questao();
                q.setIdQuestao(rs.getInt("ID_Questao"));
                q.setEnunciado(rs.getString("Enunciado"));
                q.setTipo(rs.getString("Tipo"));
                return q;
            }, idFesta);
            festa.setQuestoes(questoes);
        }
        return festa;
    }

    public List<Festa> findByOrganizador(String cnpj) {
        String sql = "SELECT f.* FROM Festa f " +
                "JOIN Festa_Organizador_Atletica foa ON f.ID_Festa = foa.ID_Festa_FK " +
                "WHERE foa.CNPJ_Atletica_FK = ?";
        return jdbcTemplate.query(sql, new FestaRowMapper(), cnpj);
    }

    public void deletar(int idFesta) {
        String sqlOrganizador = "DELETE FROM Festa_Organizador_Atletica WHERE ID_Festa_FK = ?";
        jdbcTemplate.update(sqlOrganizador, idFesta);

        String sqlAvaliacoes = "DELETE FROM Avaliacao WHERE ID_Festa_FK = ?";
        jdbcTemplate.update(sqlAvaliacoes, idFesta);

        String sqlFesta = "DELETE FROM Festa WHERE ID_Festa = ?";
        jdbcTemplate.update(sqlFesta, idFesta);
    }
}