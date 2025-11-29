package br.com.arthur.sistema_avaliacoes.repository;

import br.com.arthur.sistema_avaliacoes.model.Questao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class QuestaoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Questao> findAll() {
        String sql = "SELECT * FROM Questao";
        return jdbcTemplate.query(sql, new QuestaoRowMapper());
    }

    public Questao findById(int id) {
        String sql = "SELECT * FROM Questao WHERE ID_Questao = ?";
        return jdbcTemplate.queryForObject(sql, new QuestaoRowMapper(), id);
    }

    public void save(Questao questao) {
        String sql = "INSERT INTO Questao (Enunciado, Tipo) VALUES (?, ?)";
        jdbcTemplate.update(sql, questao.getEnunciado(), questao.getTipo());
    }

    public void update(Questao questao) {
        String sql = "UPDATE Questao SET Enunciado = ?, Tipo = ? WHERE ID_Questao = ?";
        jdbcTemplate.update(sql, questao.getEnunciado(), questao.getTipo(), questao.getIdQuestao());
    }

    public void delete(int id) {
        String sql = "DELETE FROM Questao WHERE ID_Questao = ?";
        jdbcTemplate.update(sql, id);
    }

    private static class QuestaoRowMapper implements RowMapper<Questao> {
        @Override
        public Questao mapRow(ResultSet rs, int rowNum) throws SQLException {
            Questao questao = new Questao();
            questao.setIdQuestao(rs.getInt("ID_Questao"));
            questao.setEnunciado(rs.getString("Enunciado"));
            questao.setTipo(rs.getString("Tipo"));
            return questao;
        }
    }
}
