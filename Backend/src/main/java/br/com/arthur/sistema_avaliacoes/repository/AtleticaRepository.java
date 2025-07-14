package br.com.arthur.sistema_avaliacoes.repository;

import br.com.arthur.sistema_avaliacoes.model.Atletica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import java.util.Optional;

@Repository
public class AtleticaRepository {


    @Autowired
    private JdbcTemplate jdbcTemplate;


    public void salvar(Atletica atletica) {
        String sql = "INSERT INTO Atletica (CNPJ, Nome, Sigla, Mascote) VALUES (?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                atletica.getCnpj(),
                atletica.getNome(),
                atletica.getSigla(),
                atletica.getMascote());
    }

    public List<Atletica> listarTodas() {
        String sql = "SELECT * FROM Atletica";
        return jdbcTemplate.query(sql, new AtleticaRowMapper());
    }

    private static class AtleticaRowMapper implements RowMapper<Atletica> {
        @Override
        public Atletica mapRow(ResultSet rs, int rowNum) throws SQLException {
            String cnpj = rs.getString("CNPJ");
            String nome = rs.getString("Nome");
            String sigla = rs.getString("Sigla");
            String mascote = rs.getString("Mascote");


            return new Atletica(cnpj, nome, sigla, mascote);
        }
    }

    public Optional<Atletica> findByCnpj(String cnpj) {
    String sql = "SELECT * FROM Atletica WHERE CNPJ = ?";
    try {
        Atletica atletica = jdbcTemplate.queryForObject(sql, new AtleticaRowMapper(), cnpj);
        return Optional.ofNullable(atletica);
    } catch (org.springframework.dao.EmptyResultDataAccessException e) {
        return Optional.empty();
    }
}

}