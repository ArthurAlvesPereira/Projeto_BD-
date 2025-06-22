package br.com.arthur.sistema_avaliacoes.controller;

import br.com.arthur.sistema_avaliacoes.model.Atletica;
import br.com.arthur.sistema_avaliacoes.repository.AtleticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/atleticas")
public class AtleticaController {

    @Autowired
    private AtleticaRepository repository;


    @GetMapping
    public String listarAtleticas(Model model) {
        List<Atletica> atleticas = repository.listarTodas();

        model.addAttribute("listaAtleticas", atleticas);
        model.addAttribute("novaAtletica", new Atletica());
        return "atleticas";
    }

    // 4. Método para SALVAR uma nova atlética
    @PostMapping
    public String salvarAtletica(@ModelAttribute Atletica novaAtletica) {
        // O Spring automaticamente pega os dados do formulário e cria o objeto "novaAtletica"
        repository.salvar(novaAtletica);
        // Redireciona o usuário de volta para a página de listagem (/atleticas)
        return "redirect:/atleticas";
    }
}