package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Avaliacao;
import br.com.arthur.sistema_avaliacoes.repository.AlunoRepository;
import br.com.arthur.sistema_avaliacoes.repository.AvaliacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/avaliacoes")
public class AvaliacaoRestController {

    @Autowired
    private AvaliacaoRepository avaliacaoRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping("/festa/{idFesta}")
    public ResponseEntity<List<Avaliacao>> listarPorFesta(@PathVariable Integer idFesta) {
        List<Avaliacao> avaliacoes = avaliacaoRepository.findByFestaId(idFesta);
        return ResponseEntity.ok(avaliacoes);
    }

    @GetMapping("/verificar/{matricula}/{idFesta}")
    public ResponseEntity<Map<String, Boolean>> verificarAvaliacao(
            @PathVariable Integer matricula, 
            @PathVariable Integer idFesta) {
        boolean jaAvaliou = avaliacaoRepository.alunoJaAvaliou(matricula, idFesta);
        Map<String, Boolean> response = new HashMap<>();
        response.put("jaAvaliou", jaAvaliou);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Void> criar(
            @RequestBody Avaliacao avaliacao,
            @RequestParam Integer idFesta,
            @RequestParam Integer matricula) {
        
        if (avaliacaoRepository.alunoJaAvaliou(matricula, idFesta)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        String codigoCurso = alunoRepository.findCursoByMatricula(matricula);
        avaliacaoRepository.salvar(avaliacao, idFesta, codigoCurso, matricula);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
