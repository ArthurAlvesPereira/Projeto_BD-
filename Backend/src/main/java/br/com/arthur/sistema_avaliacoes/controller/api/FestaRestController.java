package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Festa;
import br.com.arthur.sistema_avaliacoes.repository.FestaRepository;
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
@RequestMapping("/api/festas")
@Tag(name = "Festas", description = "Endpoints para gerenciamento de festas")
public class FestaRestController {

    @Autowired
    private FestaRepository festaRepository;

    @Operation(summary = "Listar todas as festas", description = "Retorna uma lista com todas as festas cadastradas")
    @ApiResponse(responseCode = "200", description = "Lista de festas retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Festa>> listarTodas() {
        List<Festa> festas = festaRepository.listarTodas();
        return ResponseEntity.ok(festas);
    }

    @Operation(summary = "Buscar festa por ID", description = "Retorna uma festa específica pelo seu ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Festa encontrada"),
        @ApiResponse(responseCode = "404", description = "Festa não encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Festa> buscarPorId(
            @Parameter(description = "ID da festa") @PathVariable Integer id) {
        Festa festa = festaRepository.findById(id);
        if (festa != null) {
            return ResponseEntity.ok(festa);
        }
        return ResponseEntity.notFound().build();
    }

    @Operation(summary = "Buscar festas por organizador", description = "Retorna todas as festas organizadas por uma atlética específica")
    @ApiResponse(responseCode = "200", description = "Lista de festas retornada com sucesso")
    @GetMapping("/organizador/{cnpj}")
    public ResponseEntity<List<Festa>> buscarPorOrganizador(
            @Parameter(description = "CNPJ da atlética organizadora") @PathVariable String cnpj) {
        List<Festa> festas = festaRepository.findByOrganizador(cnpj);
        return ResponseEntity.ok(festas);
    }

    @Operation(summary = "Criar nova festa", description = "Cria uma nova festa no sistema")
    @ApiResponse(responseCode = "201", description = "Festa criada com sucesso")
    @PostMapping
    public ResponseEntity<Void> criar(
            @Parameter(description = "Dados da festa") @RequestBody Festa festa, 
            @Parameter(description = "CNPJ da atlética organizadora") @RequestParam String cnpjOrganizador) {
        festaRepository.salvar(festa, cnpjOrganizador);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @Operation(summary = "Atualizar festa", description = "Atualiza os dados de uma festa existente")
    @ApiResponse(responseCode = "200", description = "Festa atualizada com sucesso")
    @PutMapping("/{id}")
    public ResponseEntity<Void> atualizar(
            @Parameter(description = "ID da festa") @PathVariable Integer id,
            @Parameter(description = "Dados atualizados da festa") @RequestBody Festa festa) {
        festa.setId(id);
        festaRepository.atualizar(festa);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Deletar festa", description = "Remove uma festa do sistema")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Festa deletada com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro ao deletar festa")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@Parameter(description = "ID da festa") @PathVariable Integer id) {
        try {
            festaRepository.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
