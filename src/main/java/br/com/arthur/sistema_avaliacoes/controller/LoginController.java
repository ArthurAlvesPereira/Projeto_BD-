package br.com.arthur.sistema_avaliacoes.controller;

import br.com.arthur.sistema_avaliacoes.model.Aluno;
import br.com.arthur.sistema_avaliacoes.model.Atletica;
import br.com.arthur.sistema_avaliacoes.repository.AtleticaRepository;
import br.com.arthur.sistema_avaliacoes.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
public class LoginController {

    @Autowired
    private AtleticaRepository atleticaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping("/")
    public String showHomePage() {
        return "index";
    }

    @PostMapping("/login/atletica")
    public String handleAtleticaLogin(@RequestParam String cnpj, RedirectAttributes redirectAttributes) {
        Optional<Atletica> atletica = atleticaRepository.findByCnpj(cnpj);

        if (atletica.isPresent()) {
            return "redirect:/atleticas/" + cnpj;
        } else {
            redirectAttributes.addFlashAttribute("erro", "CNPJ não encontrado!");
            return "redirect:/";
        }
    }

    @PostMapping("/login/aluno")
    public String handleAlunoLogin(@RequestParam Integer matricula, RedirectAttributes redirectAttributes) {
        Optional<Aluno> aluno = alunoRepository.findByMatricula(matricula);

        if (aluno.isPresent()) {
            redirectAttributes.addFlashAttribute("sucesso", "Login como aluno bem-sucedido! Matrícula: " + matricula);
            return "redirect:/festas/" + matricula;
        } else {
            redirectAttributes.addFlashAttribute("erro", "Matrícula não encontrada!");
            return "redirect:/";
        }
    }
}