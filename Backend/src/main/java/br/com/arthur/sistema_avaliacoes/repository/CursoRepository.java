package br.com.arthur.sistema_avaliacoes.repository;

import br.com.arthur.sistema_avaliacoes.model.Curso;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository
public class CursoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<Curso> listarTodos() {
        String sql = "SELECT * FROM Curso ORDER BY NomeCurso ASC";
        return jdbcTemplate.query(sql, new CursoRowMapper());
    }

    private static class CursoRowMapper implements RowMapper<Curso> {
        @Override
        public Curso mapRow(ResultSet rs, int rowNum) throws SQLException {
            Curso curso = new Curso();
            curso.setCodigoCurso(rs.getString("CodigoCurso"));
            curso.setNomeCurso(rs.getString("NomeCurso"));
            curso.setCnpjAtleticaFK(rs.getString("CNPJ_Atletica_FK"));
            return curso;
        }
    }
}