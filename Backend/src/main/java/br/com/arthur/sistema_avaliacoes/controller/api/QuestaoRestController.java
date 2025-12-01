package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Questao;
import br.com.arthur.sistema_avaliacoes.repository.QuestaoRepository;
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
@RequestMapping("/api/questoes")
@Tag(name = "Questões", description = "Endpoints para gerenciamento de questões")
public class QuestaoRestController {

    @Autowired
    private QuestaoRepository questaoRepository;

    @Operation(summary = "Listar todas as questões", description = "Retorna uma lista com todas as questões cadastradas")
    @ApiResponse(responseCode = "200", description = "Lista de questões retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Questao>> listarTodas() {
        List<Questao> questoes = questaoRepository.findAll();
        return ResponseEntity.ok(questoes);
    }

    @Operation(summary = "Buscar questão por ID", description = "Retorna uma questão específica pelo seu ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Questão encontrada"),
        @ApiResponse(responseCode = "404", description = "Questão não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Questao> buscarPorId(
            @Parameter(description = "ID da questão") @PathVariable Integer id) {
        try {
            Questao questao = questaoRepository.findById(id);
            return ResponseEntity.ok(questao);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Criar nova questão", description = "Cria uma nova questão no sistema")
    @ApiResponse(responseCode = "201", description = "Questão criada com sucesso")
    @PostMapping
    public ResponseEntity<Void> criar(
            @Parameter(description = "Dados da questão") @RequestBody Questao questao) {
        questaoRepository.save(questao);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Deletar questão", description = "Remove uma questão do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Questão deletada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro ao deletar questão")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@Parameter(description = "ID da questão") @PathVariable Integer id) {
        try {
            questaoRepository.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
