package br.com.arthur.sistema_avaliacoes.repository;

import br.com.arthur.sistema_avaliacoes.model.Aluno;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class AlunoRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void salvar(Aluno aluno) {
        String sql = "INSERT INTO Aluno (Matricula, Nome, CodigoCurso_FK) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, aluno.getMatricula(), aluno.getNome(), aluno.getCodigoCurso_FK());
    }


    public List<Aluno> listarTodos() {
        String sql = "SELECT * FROM Aluno ORDER BY Nome ASC";
        return jdbcTemplate.query(sql, new AlunoRowMapper());
    }

    private static class AlunoRowMapper implements RowMapper<Aluno> {
        @Override
        public Aluno mapRow(ResultSet rs, int rowNum) throws SQLException {
            Aluno aluno = new Aluno();
            aluno.setMatricula(rs.getInt("Matricula"));
            aluno.setNome(rs.getString("Nome"));
            aluno.setCodigoCurso_FK(rs.getString("CodigoCurso_FK"));
            return aluno;
        }
    }

    public Optional<Aluno> findByMatricula(int matricula) {
        String sql = "SELECT * FROM Aluno WHERE Matricula = ?";
        try {
            Aluno aluno = jdbcTemplate.queryForObject(sql, new AlunoRowMapper(), matricula);
            return Optional.ofNullable(aluno);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public String findCursoByMatricula(int matricula) {
        String sql = "SELECT CodigoCurso_FK FROM Aluno WHERE Matricula = ?";
        return jdbcTemplate.queryForObject(sql, String.class, matricula);
    }
}