package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Aluno;
import br.com.arthur.sistema_avaliacoes.repository.AlunoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alunos")
@Tag(name = "Alunos", description = "Endpoints para gerenciamento de alunos")
public class AlunoRestController {

    @Autowired
    private AlunoRepository alunoRepository;

    @Operation(summary = "Listar todos os alunos", description = "Retorna uma lista com todos os alunos cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de alunos retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Aluno>> listarTodos() {
        List<Aluno> alunos = alunoRepository.listarTodos();
        return ResponseEntity.ok(alunos);
    }

    @Operation(summary = "Buscar aluno por matrícula", description = "Retorna um aluno específico pela sua matrícula")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
        @ApiResponse(responseCode = "404", description = "Aluno não encontrado")
    })
    @GetMapping("/{matricula}")
    public ResponseEntity<Aluno> buscarPorMatricula(
            @Parameter(description = "Matrícula do aluno") @PathVariable Integer matricula) {
        return alunoRepository.findByMatricula(matricula)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Criar novo aluno", description = "Cadastra um novo aluno no sistema")
    @ApiResponse(responseCode = "201", description = "Aluno criado com sucesso")
    @PostMapping
    public ResponseEntity<Void> criar(@Parameter(description = "Dados do aluno") @RequestBody Aluno aluno) {
        alunoRepository.salvar(aluno);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
