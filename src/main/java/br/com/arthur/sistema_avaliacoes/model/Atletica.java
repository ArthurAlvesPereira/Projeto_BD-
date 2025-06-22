package br.com.arthur.sistema_avaliacoes.model;

public class Atletica {
    private String cnpj;
    private String nome;
    private String sigla;
    private String mascote;

    public Atletica(){
    }

    // Construtor com parâmetros
    public Atletica(String cnpj, String nome, String sigla, String mascote) {
        this.cnpj = cnpj;
        this.nome = nome;
        this.sigla = sigla;
        this.mascote = mascote;
    }

    // Getters e Setters
    public String getCnpj() {
        return cnpj;
    }
    public void setCnpj(String cnpj) {
        this.cnpj = cnpj;
    }
    public String getNome() {
        return nome;
    }
    public void setNome(String nome) {
        this.nome = nome;
    }
    public String getSigla() {
        return sigla;
    }
    public void setSigla(String sigla) {
        this.sigla = sigla;
    }
    public String getMascote() {
        return mascote;
    }
    public void setMascote(String mascote) {
        this.mascote = mascote;
    }
}


