package br.com.arthur.sistema_avaliacoes.controller;

import br.com.arthur.sistema_avaliacoes.model.Atletica;
import br.com.arthur.sistema_avaliacoes.model.Festa;
import br.com.arthur.sistema_avaliacoes.repository.AtleticaRepository;
import br.com.arthur.sistema_avaliacoes.repository.FestaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/atleticas")
public class AtleticaController {

    @Autowired
    private AtleticaRepository repository;

    @Autowired
    private FestaRepository festaRepository;

    @GetMapping
    public String listarAtleticas(Model model) {
        List<Atletica> atleticas = repository.listarTodas();

        model.addAttribute("listaAtleticas", atleticas);
        model.addAttribute("novaAtletica", new Atletica());
        return "atleticas";
    }

    @PostMapping
    public String salvarAtletica(@ModelAttribute Atletica novaAtletica) {
        repository.salvar(novaAtletica);
        return "redirect:/atleticas";
    }

    @GetMapping("/{cnpj}")
    public String dashboardAtletica(@PathVariable String cnpj, Model model) {
        Atletica atletica = repository.findByCnpj(cnpj)
                .orElseThrow(() -> new IllegalArgumentException("CNPJ inválido:" + cnpj));

        List<Festa> festasDaAtletica = festaRepository.findByOrganizador(cnpj);

        model.addAttribute("atletica", atletica);
        model.addAttribute("festasDaAtletica", festasDaAtletica);
        

        return "atletica-dashboard";
    }
}