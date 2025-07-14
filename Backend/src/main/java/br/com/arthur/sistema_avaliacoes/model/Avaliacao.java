package br.com.arthur.sistema_avaliacoes.model;

public class Avaliacao {
    private int notaDJs;
    private int notaBebidas;
    private int notaBanheiros;
    private int notaLocal;
    private int notaOrganizacao;
    private String comentario;


    public Avaliacao() {
    }

    public int getNotaDJs() {
        return notaDJs;
    }
    public void setNotaDJs(int notaDJs) {
        this.notaDJs = notaDJs;
    }

    public int getNotaBebidas() {
        return notaBebidas;
    }

    public void setNotaBebidas(int notaBebidas) {
        this.notaBebidas = notaBebidas;
    }

    public int getNotaBanheiros() {
        return notaBanheiros;
    }

    public void setNotaBanheiros(int notaBanheiros) {
        this.notaBanheiros = notaBanheiros;
    }

    public int getNotaLocal() {
        return notaLocal;
    }

    public void setNotaLocal(int notaLocal) {
        this.notaLocal = notaLocal;
    }

    public int getNotaOrganizacao() {
        return notaOrganizacao;
    }

    public void setNotaOrganizacao(int notaOrganizacao) {
        this.notaOrganizacao = notaOrganizacao;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}