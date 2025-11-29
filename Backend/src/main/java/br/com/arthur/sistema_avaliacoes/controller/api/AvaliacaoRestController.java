package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Avaliacao;
import br.com.arthur.sistema_avaliacoes.repository.AlunoRepository;
import br.com.arthur.sistema_avaliacoes.repository.AvaliacaoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avaliacoes")
@Tag(name = "Avaliações", description = "Endpoints para gerenciamento de avaliações de festas")
public class AvaliacaoRestController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Operation(summary = "Listar avaliações por festa", description = "Retorna todas as avaliações de uma festa específica")
    @ApiResponse(responseCode = "200", description = "Lista de avaliações retornada com sucesso")
    @GetMapping("/festa/{idFesta}")
    public ResponseEntity<List<Avaliacao>> listarPorFesta(
            @Parameter(description = "ID da festa") @PathVariable Integer idFesta) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByFestaId(idFesta);
        return ResponseEntity.ok(avaliacoes);
    }

    @Operation(summary = "Verificar se aluno já avaliou festa", description = "Verifica se um aluno já realizou avaliação de uma festa específica")
    @ApiResponse(responseCode = "200", description = "Status de avaliação retornado com sucesso")
    @GetMapping("/verificar/{matricula}/{idFesta}")
    public ResponseEntity<Map<String, Boolean>> verificarAvaliacao(
            @Parameter(description = "Matrícula do aluno") @PathVariable Integer matricula, 
            @Parameter(description = "ID da festa") @PathVariable Integer idFesta) {
        boolean jaAvaliou = avaliacaoRepository.alunoJaAvaliou(matricula, idFesta);
        Map<String, Boolean> response = new HashMap<>();
        response.put("jaAvaliou", jaAvaliou);
        return ResponseEntity.ok(response);
    }

    @Operation(summary = "Criar nova avaliação", description = "Registra uma nova avaliação de festa por um aluno")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Avaliação criada com sucesso"),
        @ApiResponse(responseCode = "409", description = "Aluno já avaliou esta festa")
    })
    @PostMapping
    public ResponseEntity<Void> criar(
            @Parameter(description = "Dados da avaliação") @RequestBody Avaliacao avaliacao,
            @Parameter(description = "ID da festa") @RequestParam Integer idFesta,
            @Parameter(description = "Matrícula do aluno") @RequestParam Integer matricula) {
        
        if (avaliacaoRepository.alunoJaAvaliou(matricula, idFesta)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        avaliacao.setIdFesta(idFesta);
        avaliacao.setMatriculaAluno(matricula);
        avaliacaoRepository.salvar(avaliacao);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
