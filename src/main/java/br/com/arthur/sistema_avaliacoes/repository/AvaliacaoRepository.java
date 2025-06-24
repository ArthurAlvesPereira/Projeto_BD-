package br.com.arthur.sistema_avaliacoes.repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;
import org.springframework.jdbc.core.RowMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import br.com.arthur.sistema_avaliacoes.model.Avaliacao;

@Repository
public class AvaliacaoRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public boolean alunoJaAvaliou(int matricula, int idFesta) {
        String sql = "SELECT COUNT(*) FROM Aluno_Avaliou_Festa WHERE Matricula_Aluno_FK = ? AND ID_Festa_FK = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, matricula, idFesta);
        return count != null && count > 0;
    }

    @Transactional
    public void salvar(Avaliacao avaliacao, int idFesta, String codigoCurso, int matricula) {

        String sqlAvaliacao = "INSERT INTO Avaliacao (ID_Festa_FK, CodigoCurso_FK, Nota_DJs, Nota_Bebidas, Nota_Banheiros, Nota_Local, Nota_Organizacao, Comentario) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sqlAvaliacao,
                idFesta,
                codigoCurso,
                avaliacao.getNotaDJs(),
                avaliacao.getNotaBebidas(),
                avaliacao.getNotaBanheiros(),
                avaliacao.getNotaLocal(),
                avaliacao.getNotaOrganizacao(),
                avaliacao.getComentario());


        String sqlRegistroVoto = "INSERT INTO Aluno_Avaliou_Festa (Matricula_Aluno_FK, ID_Festa_FK) VALUES (?, ?)";
        jdbcTemplate.update(sqlRegistroVoto, matricula, idFesta);
    }

    private static class AvaliacaoRowMapper implements RowMapper<Avaliacao> {
    @Override
    public Avaliacao mapRow(ResultSet rs, int rowNum) throws SQLException {
        Avaliacao avaliacao = new Avaliacao();

        avaliacao.setNotaDJs(rs.getInt("Nota_DJs"));
        avaliacao.setNotaBebidas(rs.getInt("Nota_Bebidas"));
        avaliacao.setNotaBanheiros(rs.getInt("Nota_Banheiros"));
        avaliacao.setNotaLocal(rs.getInt("Nota_Local"));
        avaliacao.setNotaOrganizacao(rs.getInt("Nota_Organizacao"));
        avaliacao.setComentario(rs.getString("Comentario"));
        return avaliacao;
    }
}


public List<Avaliacao> findByFestaId(int idFesta) {
    String sql = "SELECT * FROM Avaliacao WHERE ID_Festa_FK = ?";
    return jdbcTemplate.query(sql, new AvaliacaoRowMapper(), idFesta);
}
}