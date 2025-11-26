package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Curso;
import br.com.arthur.sistema_avaliacoes.repository.CursoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@Tag(name = "Cursos", description = "Endpoints para gerenciamento de cursos")
public class CursoRestController {

    @Autowired
    private CursoRepository cursoRepository;

    @Operation(summary = "Listar todos os cursos", description = "Retorna uma lista com todos os cursos cadastrados")
    @ApiResponse(responseCode = "200", description = "Lista de cursos retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Curso>> listarTodos() {
        List<Curso> cursos = cursoRepository.listarTodos();
        return ResponseEntity.ok(cursos);
    }
}