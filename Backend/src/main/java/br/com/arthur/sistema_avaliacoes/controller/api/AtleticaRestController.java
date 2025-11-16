package br.com.arthur.sistema_avaliacoes.controller.api;

import br.com.arthur.sistema_avaliacoes.model.Atletica;
import br.com.arthur.sistema_avaliacoes.repository.AtleticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/atleticas")
public class AtleticaRestController {

    @Autowired
    private AtleticaRepository atleticaRepository;

    @GetMapping
    public ResponseEntity<List<Atletica>> listarTodas() {
        List<Atletica> atleticas = atleticaRepository.listarTodas();
        return ResponseEntity.ok(atleticas);
    }

    @GetMapping("/{cnpj}")
    public ResponseEntity<Atletica> buscarPorCnpj(@PathVariable String cnpj) {
        return atleticaRepository.findByCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Void> criar(@RequestBody Atletica atletica) {
        atleticaRepository.salvar(atletica);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
