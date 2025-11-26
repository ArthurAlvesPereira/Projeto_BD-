package br.com.arthur.sistema_avaliacoes.model;

public class Curso {
    private String codigoCurso;
    private String nomeCurso;
    private String cnpjAtleticaFK;

    // Construtores
    public Curso() {}
    
    public Curso(String codigoCurso, String nomeCurso, String cnpjAtleticaFK) {
        this.codigoCurso = codigoCurso;
        this.nomeCurso = nomeCurso;
        this.cnpjAtleticaFK = cnpjAtleticaFK;
    }

    // Getters e Setters
    public String getCodigoCurso() { return codigoCurso; }
    public void setCodigoCurso(String codigoCurso) { this.codigoCurso = codigoCurso; }

    public String getNomeCurso() { return nomeCurso; }
    public void setNomeCurso(String nomeCurso) { this.nomeCurso = nomeCurso; }

    public String getCnpjAtleticaFK() { return cnpjAtleticaFK; }
    public void setCnpjAtleticaFK(String cnpjAtleticaFK) { this.cnpjAtleticaFK = cnpjAtleticaFK; }
}