package br.com.arthur.sistema_avaliacoes.model;

public class Questao {
    private int idQuestao;
    private String enunciado;
    private String tipo; // NOTA, TEXTO, MULTIPLA_ESCOLHA

    public Questao() {
    }

    public int getIdQuestao() {
        return idQuestao;
    }

    public void setIdQuestao(int idQuestao) {
        this.idQuestao = idQuestao;
    }

    public String getEnunciado() {
        return enunciado;
    }

    public void setEnunciado(String enunciado) {
        this.enunciado = enunciado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }
}
