package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.repository.RelatorioRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
@Tag(name = "Relatórios", description = "Endpoints para geração de relatórios e estatísticas")
public class RelatorioRestController {

    @Autowired
    private RelatorioRepository relatorioRepository;

    @Operation(summary = "Ranking de festas melhor avaliadas", description = "Retorna o ranking das festas com as melhores avaliações")
    @ApiResponse(responseCode = "200", description = "Ranking retornado com sucesso")
    @GetMapping("/ranking-festas")
    public ResponseEntity<List<Map<String, Object>>> rankingFestasMelhorAvaliadas(
            @Parameter(description = "Limite de festas no ranking") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(relatorioRepository.rankingFestasMelhorAvaliadas(limit));
    }

    @Operation(summary = "Estatísticas detalhadas de festa", description = "Retorna estatísticas completas de uma festa específica")
    @ApiResponse(responseCode = "200", description = "Estatísticas retornadas com sucesso")
    @GetMapping("/festa/{idFesta}/estatisticas")
    public ResponseEntity<Map<String, Object>> estatisticasDetalhadasFesta(
            @Parameter(description = "ID da festa") @PathVariable int idFesta) {
        return ResponseEntity.ok(relatorioRepository.estatisticasDetalhadasFesta(idFesta));
    }

    @Operation(summary = "Ranking de atléticas por avaliação", description = "Retorna o ranking das atléticas baseado nas avaliações de suas festas")
    @ApiResponse(responseCode = "200", description = "Ranking retornado com sucesso")
    @GetMapping("/ranking-atleticas")
    public ResponseEntity<List<Map<String, Object>>> rankingAtleticasPorAvaliacao() {
        return ResponseEntity.ok(relatorioRepository.rankingAtleticasPorAvaliacao());
    }

    @Operation(summary = "Distribuição de avaliações por curso", description = "Retorna a distribuição de avaliações agrupadas por curso")
    @ApiResponse(responseCode = "200", description = "Distribuição retornada com sucesso")
    @GetMapping("/distribuicao-cursos")
    public ResponseEntity<List<Map<String, Object>>> distribuicaoAvaliacoesPorCurso() {
        return ResponseEntity.ok(relatorioRepository.distribuicaoAvaliacoesPorCurso());
    }

    @Operation(summary = "Festas com maior participação", description = "Retorna as festas com maior número de avaliações")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/maior-participacao")
    public ResponseEntity<List<Map<String, Object>>> festasMaiorParticipacao(
            @Parameter(description = "Limite de festas no resultado") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(relatorioRepository.festasMaiorParticipacao(limit));
    }

    @Operation(summary = "Análise comparativa de categorias", description = "Retorna análise comparativa das diferentes categorias de avaliação")
    @ApiResponse(responseCode = "200", description = "Análise retornada com sucesso")
    @GetMapping("/categorias-comparacao")
    public ResponseEntity<List<Map<String, Object>>> analiseComparativaCategorias() {
        return ResponseEntity.ok(relatorioRepository.analiseComparativaCategorias());
    }

    @Operation(summary = "Estatísticas por tipo de festa", description = "Retorna estatísticas agrupadas por tipo de festa")
    @ApiResponse(responseCode = "200", description = "Estatísticas retornadas com sucesso")
    @GetMapping("/tipo-festa")
    public ResponseEntity<List<Map<String, Object>>> estatisticasPorTipoFesta() {
        return ResponseEntity.ok(relatorioRepository.estatisticasPorTipoFesta());
    }

    @Operation(summary = "Alunos mais ativos", description = "Retorna os alunos que mais realizaram avaliações")
    @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso")
    @GetMapping("/alunos-ativos")
    public ResponseEntity<List<Map<String, Object>>> alunosMaisAtivos(
            @Parameter(description = "Limite de alunos no resultado") @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(relatorioRepository.alunosMaisAtivos(limit));
    }

    @Operation(summary = "Tendência temporal de avaliações", description = "Retorna a evolução temporal das avaliações")
    @ApiResponse(responseCode = "200", description = "Tendência retornada com sucesso")
    @GetMapping("/tendencia-temporal")
    public ResponseEntity<List<Map<String, Object>>> tendenciaAvaliacoesTemporal() {
        return ResponseEntity.ok(relatorioRepository.tendenciaAvaliacoesTemporal());
    }
}
