package br.com.arthur.sistema_avaliacoes.model;

public class Resposta {
    private int idResposta;
    private int idAvaliacao;
    private int idQuestao;
    private Integer valorNumerico;
    private String valorTexto;
    
    private Questao questao;

    public Resposta() {
    }

    public int getIdResposta() {
        return idResposta;
    }

    public void setIdResposta(int idResposta) {
        this.idResposta = idResposta;
    }

    public int getIdAvaliacao() {
        return idAvaliacao;
    }

    public void setIdAvaliacao(int idAvaliacao) {
        this.idAvaliacao = idAvaliacao;
    }

    public int getIdQuestao() {
        return idQuestao;
    }

    public void setIdQuestao(int idQuestao) {
        this.idQuestao = idQuestao;
    }

    public Integer getValorNumerico() {
        return valorNumerico;
    }

    public void setValorNumerico(Integer valorNumerico) {
        this.valorNumerico = valorNumerico;
    }

    public String getValorTexto() {
        return valorTexto;
    }

    public void setValorTexto(String valorTexto) {
        this.valorTexto = valorTexto;
    }
    
    public Questao getQuestao() {
        return questao;
    }

    public void setQuestao(Questao questao) {
        this.questao = questao;
    }
}
