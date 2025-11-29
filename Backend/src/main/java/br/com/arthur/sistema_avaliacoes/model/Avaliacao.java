package br.com.arthur.sistema_avaliacoes.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

public class Avaliacao {
    private int idAvaliacao;
    private int idFesta;
    private int matriculaAluno;
    private String comentarioGeral;
    private LocalDateTime dataHoraAvaliacao;
    
    private List<Resposta> respostas = new ArrayList<>();

    public Avaliacao() {
    }

    public int getIdAvaliacao() {
        return idAvaliacao;
    }

    public void setIdAvaliacao(int idAvaliacao) {
        this.idAvaliacao = idAvaliacao;
    }

    public int getIdFesta() {
        return idFesta;
    }

    public void setIdFesta(int idFesta) {
        this.idFesta = idFesta;
    }

    public int getMatriculaAluno() {
        return matriculaAluno;
    }

    public void setMatriculaAluno(int matriculaAluno) {
        this.matriculaAluno = matriculaAluno;
    }

    public String getComentarioGeral() {
        return comentarioGeral;
    }

    public void setComentarioGeral(String comentarioGeral) {
        this.comentarioGeral = comentarioGeral;
    }

    public LocalDateTime getDataHoraAvaliacao() {
        return dataHoraAvaliacao;
    }

    public void setDataHoraAvaliacao(LocalDateTime dataHoraAvaliacao) {
        this.dataHoraAvaliacao = dataHoraAvaliacao;
    }

    public List<Resposta> getRespostas() {
        return respostas;
    }

    public void setRespostas(List<Resposta> respostas) {
        this.respostas = respostas;
    }
}