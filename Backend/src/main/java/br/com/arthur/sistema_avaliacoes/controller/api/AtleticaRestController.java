package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Atletica;
import br.com.arthur.sistema_avaliacoes.repository.AtleticaRepository;
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
@RequestMapping("/api/atleticas")
@Tag(name = "Atléticas", description = "Endpoints para gerenciamento de atléticas")
public class AtleticaRestController {

    @Autowired
    private AtleticaRepository atleticaRepository;

    @Operation(summary = "Listar todas as atléticas", description = "Retorna uma lista com todas as atléticas cadastradas")
    @ApiResponse(responseCode = "200", description = "Lista de atléticas retornada com sucesso")
    @GetMapping
    public ResponseEntity<List<Atletica>> listarTodas() {
        List<Atletica> atleticas = atleticaRepository.listarTodas();
        return ResponseEntity.ok(atleticas);
    }

    @Operation(summary = "Buscar atlética por CNPJ", description = "Retorna uma atlética específica pelo seu CNPJ")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Atlética encontrada"),
        @ApiResponse(responseCode = "404", description = "Atlética não encontrada")
    })
    @GetMapping("/{cnpj}")
    public ResponseEntity<Atletica> buscarPorCnpj(
            @Parameter(description = "CNPJ da atlética") @PathVariable String cnpj) {
        return atleticaRepository.findByCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Criar nova atlética", description = "Cadastra uma nova atlética no sistema")
    @ApiResponse(responseCode = "201", description = "Atlética criada com sucesso")
    @PostMapping
    public ResponseEntity<Void> criar(@Parameter(description = "Dados da atlética") @RequestBody Atletica atletica) {
        atleticaRepository.salvar(atletica);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
