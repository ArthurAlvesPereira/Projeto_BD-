package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.repository.RelatorioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioRestController {

    @Autowired
    private RelatorioRepository relatorioRepository;

    @GetMapping("/ranking-festas")
    public ResponseEntity<List<Map<String, Object>>> rankingFestasMelhorAvaliadas(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(relatorioRepository.rankingFestasMelhorAvaliadas(limit));
    }

    @GetMapping("/festa/{idFesta}/estatisticas")
    public ResponseEntity<Map<String, Object>> estatisticasDetalhadasFesta(@PathVariable int idFesta) {
        return ResponseEntity.ok(relatorioRepository.estatisticasDetalhadasFesta(idFesta));
    }

    @GetMapping("/ranking-atleticas")
    public ResponseEntity<List<Map<String, Object>>> rankingAtleticasPorAvaliacao() {
        return ResponseEntity.ok(relatorioRepository.rankingAtleticasPorAvaliacao());
    }

    @GetMapping("/distribuicao-cursos")
    public ResponseEntity<List<Map<String, Object>>> distribuicaoAvaliacoesPorCurso() {
        return ResponseEntity.ok(relatorioRepository.distribuicaoAvaliacoesPorCurso());
    }

    @GetMapping("/maior-participacao")
    public ResponseEntity<List<Map<String, Object>>> festasMaiorParticipacao(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(relatorioRepository.festasMaiorParticipacao(limit));
    }

    @GetMapping("/categorias-comparacao")
    public ResponseEntity<List<Map<String, Object>>> analiseComparativaCategorias() {
        return ResponseEntity.ok(relatorioRepository.analiseComparativaCategorias());
    }

    @GetMapping("/tipo-festa")
    public ResponseEntity<List<Map<String, Object>>> estatisticasPorTipoFesta() {
        return ResponseEntity.ok(relatorioRepository.estatisticasPorTipoFesta());
    }

    @GetMapping("/alunos-ativos")
    public ResponseEntity<List<Map<String, Object>>> alunosMaisAtivos(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(relatorioRepository.alunosMaisAtivos(limit));
    }

    @GetMapping("/tendencia-temporal")
    public ResponseEntity<List<Map<String, Object>>> tendenciaAvaliacoesTemporal() {
        return ResponseEntity.ok(relatorioRepository.tendenciaAvaliacoesTemporal());
    }
}
