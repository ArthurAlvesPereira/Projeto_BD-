package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Aluno;
import br.com.arthur.sistema_avaliacoes.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
public class AlunoRestController {

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping
    public ResponseEntity<List<Aluno>> listarTodos() {
        List<Aluno> alunos = alunoRepository.listarTodos();
        return ResponseEntity.ok(alunos);
    }

    @GetMapping("/{matricula}")
    public ResponseEntity<Aluno> buscarPorMatricula(@PathVariable Integer matricula) {
        return alunoRepository.findByMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody Aluno aluno) {
        alunoRepository.salvar(aluno);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
