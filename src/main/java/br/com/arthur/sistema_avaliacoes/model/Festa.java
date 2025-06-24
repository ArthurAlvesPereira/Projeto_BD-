package br.com.arthur.sistema_avaliacoes.model;

import java.time.LocalDateTime;

public class Festa {

    private int id;
    private String nome;
    private LocalDateTime horario;
    private String tipoFesta;
    private String local;

  
    public Festa() {}
    public Festa(int id, String nome, LocalDateTime horario, String tipoFesta, String local) {
        this.id = id;
        this.nome = nome;
        this.horario = horario;
        this.tipoFesta = tipoFesta;
        this.local = local;
    }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public LocalDateTime getHorario() { return horario; }
    public void setHorario(LocalDateTime horario) { this.horario = horario; }
    public String getTipoFesta() { return tipoFesta; }
    public void setTipoFesta(String tipoFesta) { this.tipoFesta = tipoFesta; }
    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }
}