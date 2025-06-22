package br.com.arthur.sistema_avaliacoes.repository;

import br.com.arthur.sistema_avaliacoes.model.Atletica;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@Repository // 1. Anotação que marca esta classe como um componente de acesso a dados
public class AtleticaRepository {

    // 2. Injeção de dependência: O Spring vai nos fornecer uma instância do JdbcTemplate
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // 3. Método para salvar uma nova atlética
    public void salvar(Atletica atletica) {
        String sql = "INSERT INTO Atletica (CNPJ, Nome, Sigla, Mascote) VALUES (?, ?, ?, ?)";
        // O método 'update' é usado para INSERT, UPDATE e DELETE
        jdbcTemplate.update(sql,
                atletica.getCnpj(),
                atletica.getNome(),
                atletica.getSigla(),
                atletica.getMascote());
    }

    // 4. Método para listar todas as atléticas
    public List<Atletica> listarTodas() {
        String sql = "SELECT * FROM Atletica";
        // O método 'query' é usado para SELECTs que retornam múltiplas linhas
        // Ele precisa de um 'RowMapper' para saber como converter cada linha em um objeto Atletica
        return jdbcTemplate.query(sql, new AtleticaRowMapper());
    }

    // 5. Classe interna que implementa o RowMapper
    private static class AtleticaRowMapper implements RowMapper<Atletica> {
        @Override
        public Atletica mapRow(ResultSet rs, int rowNum) throws SQLException {
            // Para cada linha do resultado da consulta, este método é chamado
            String cnpj = rs.getString("CNPJ");
            String nome = rs.getString("Nome");
            String sigla = rs.getString("Sigla");
            String mascote = rs.getString("Mascote");

            // Cria e retorna um objeto Atletica com os dados da linha
            return new Atletica(cnpj, nome, sigla, mascote);
        }
    }

    // Você pode adicionar outros métodos aqui depois, como buscarPorCnpj, atualizar, excluir...
}