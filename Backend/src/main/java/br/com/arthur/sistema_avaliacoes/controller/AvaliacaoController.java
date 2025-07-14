package br.com.arthur.sistema_avaliacoes.controller;

import br.com.arthur.sistema_avaliacoes.model.*;
import br.com.arthur.sistema_avaliacoes.repository.*;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AvaliacaoController {

    @Autowired private FestaRepository festaRepository;
    @Autowired private AvaliacaoRepository avaliacaoRepository;
    @Autowired private AlunoRepository alunoRepository;

    @GetMapping("/avaliar/{idFesta}/{matricula}")
    public String showFormularioAvaliacao(@PathVariable int idFesta, @PathVariable int matricula, Model model, RedirectAttributes redirect) {
        if (avaliacaoRepository.alunoJaAvaliou(matricula, idFesta)) {
            redirect.addFlashAttribute("erro", "Você já avaliou esta festa!");
            return "redirect:/festas/" + matricula;
        }

        Festa festa = festaRepository.findById(idFesta);
        model.addAttribute("festa", festa);
        model.addAttribute("avaliacao", new Avaliacao());
        model.addAttribute("matricula", matricula);
        return "avaliacao-form";
    }

    @PostMapping("/avaliar/salvar")
    public String salvarAvaliacao(@ModelAttribute Avaliacao avaliacao, @RequestParam int idFesta, @RequestParam int matricula, RedirectAttributes redirect) {
        String codigoCurso = alunoRepository.findCursoByMatricula(matricula);
        avaliacaoRepository.salvar(avaliacao, idFesta, codigoCurso, matricula);
        redirect.addFlashAttribute("sucesso", "Avaliação enviada com sucesso!");
        return "redirect:/festas/" + matricula;
    }

    @GetMapping("/avaliacoes/festa/{idFesta}")
    public String listarAvaliacoesFesta(@PathVariable int idFesta, Model model) {
        Festa festa = festaRepository.findById(idFesta);

        List<Avaliacao> avaliacoes = avaliacaoRepository.findByFestaId(idFesta);
        model.addAttribute("festa", festa);
        model.addAttribute("avaliacoes", avaliacoes);

        return "festa-avaliacoes";
    }
}