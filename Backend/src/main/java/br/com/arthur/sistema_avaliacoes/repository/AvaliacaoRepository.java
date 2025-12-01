package br.com.arthur.sistema_avaliacoes.repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

import br.com.arthur.sistema_avaliacoes.model.Resposta;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
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
        String sql = "SELECT COUNT(*) FROM Avaliacao WHERE Matricula_Aluno_FK = ? AND ID_Festa_FK = ?";
        Integer count = jdbcTemplate.queryForObject(sql, Integer.class, matricula, idFesta);
        return count != null && count > 0;
    }

    @Transactional
    public void salvar(Avaliacao avaliacao) {
        String sqlAvaliacao = "INSERT INTO Avaliacao (ID_Festa_FK, Matricula_Aluno_FK, Comentario_Geral) VALUES (?, ?, ?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sqlAvaliacao, Statement.RETURN_GENERATED_KEYS);
            ps.setInt(1, avaliacao.getIdFesta());
            ps.setInt(2, avaliacao.getMatriculaAluno());
            ps.setString(3, avaliacao.getComentarioGeral());
            return ps;
        }, keyHolder);

        int idAvaliacao = (int) keyHolder.getKeys().get("ID_Avaliacao");

        // 2. Inserir Respostas
        String sqlResposta = "INSERT INTO Resposta (ID_Avaliacao_FK, ID_Questao_FK, Valor_Numerico, Valor_Texto) VALUES (?, ?, ?, ?)";
        
        if (avaliacao.getRespostas() != null) {
            for (Resposta resp : avaliacao.getRespostas()) {
                jdbcTemplate.update(sqlResposta,
                        idAvaliacao,
                        resp.getIdQuestao(),
                        resp.getValorNumerico(),
                        resp.getValorTexto());
            }
        }
    }

    public List<Avaliacao> findByFestaId(int idFesta) {
        String sql = "SELECT * FROM Avaliacao WHERE ID_Festa_FK = ?";
        List<Avaliacao> avaliacoes = jdbcTemplate.query(sql, new AvaliacaoRowMapper(), idFesta);
        
        for (Avaliacao avaliacao : avaliacoes) {
            List<Resposta> respostas = buscarRespostasPorAvaliacao(avaliacao.getIdAvaliacao());
            avaliacao.setRespostas(respostas);
        }
        
        return avaliacoes;
    }
    
    private List<Resposta> buscarRespostasPorAvaliacao(int idAvaliacao) {
        String sql = "SELECT * FROM Resposta WHERE ID_Avaliacao_FK = ?";
        return jdbcTemplate.query(sql, new RespostaRowMapper(), idAvaliacao);
    }
    
    private static class RespostaRowMapper implements RowMapper<Resposta> {
        @Override
        public Resposta mapRow(ResultSet rs, int rowNum) throws SQLException {
            Resposta resposta = new Resposta();
            resposta.setIdResposta(rs.getInt("ID_Resposta"));
            resposta.setIdAvaliacao(rs.getInt("ID_Avaliacao_FK"));
            resposta.setIdQuestao(rs.getInt("ID_Questao_FK"));
            
            // Verifica se o valor numérico não é null
            Object valorNumerico = rs.getObject("Valor_Numerico");
            if (valorNumerico != null) {
                resposta.setValorNumerico(rs.getInt("Valor_Numerico"));
            }
            
            resposta.setValorTexto(rs.getString("Valor_Texto"));
            return resposta;
        }
    }

    private static class AvaliacaoRowMapper implements RowMapper<Avaliacao> {
        @Override
        public Avaliacao mapRow(ResultSet rs, int rowNum) throws SQLException {
            Avaliacao avaliacao = new Avaliacao();
            avaliacao.setIdAvaliacao(rs.getInt("ID_Avaliacao"));
            avaliacao.setIdFesta(rs.getInt("ID_Festa_FK"));
            avaliacao.setMatriculaAluno(rs.getInt("Matricula_Aluno_FK"));
            avaliacao.setComentarioGeral(rs.getString("Comentario_Geral"));
            avaliacao.setDataHoraAvaliacao(rs.getTimestamp("DataHoraAvaliacao").toLocalDateTime());
            return avaliacao;
        }
    }
}