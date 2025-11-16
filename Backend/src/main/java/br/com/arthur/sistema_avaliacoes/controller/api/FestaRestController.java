package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Festa;
import br.com.arthur.sistema_avaliacoes.repository.FestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/festas")
public class FestaRestController {

    @Autowired
    private FestaRepository festaRepository;

    @GetMapping
    public ResponseEntity<List<Festa>> listarTodas() {
        List<Festa> festas = festaRepository.listarTodas();
        return ResponseEntity.ok(festas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Festa> buscarPorId(@PathVariable Integer id) {
        Festa festa = festaRepository.findById(id);
        if (festa != null) {
            return ResponseEntity.ok(festa);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/organizador/{cnpj}")
    public ResponseEntity<List<Festa>> buscarPorOrganizador(@PathVariable String cnpj) {
        List<Festa> festas = festaRepository.findByOrganizador(cnpj);
        return ResponseEntity.ok(festas);
    }

    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody Festa festa, @RequestParam String cnpjOrganizador) {
        festaRepository.salvar(festa, cnpjOrganizador);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Integer id) {
        try {
            festaRepository.deletar(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
