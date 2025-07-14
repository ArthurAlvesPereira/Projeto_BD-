package br.com.arthur.sistema_avaliacoes.model;

public class Aluno {
    private Integer matricula;
    private String nome;
    private String email;
    private String senha;
    private String codigoCurso_FK;

    public Aluno() {
    }

    public Aluno(Integer matricula, String nome, String email, String senha) {
        this.matricula = matricula;
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }

    public Integer getMatricula() {
        return matricula;
    }

    public void setMatricula(Integer matricula) {
        this.matricula = matricula;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSenha() {
        return senha;
    }

    public void setSenha(String senha) {
        this.senha = senha;
    }
    
    public String getCodigoCurso_FK() {
        return codigoCurso_FK;
    }
    public void setCodigoCurso_FK(String codigoCurso_FK) {
        this.codigoCurso_FK = codigoCurso_FK;
    }

}
