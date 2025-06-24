package br.com.arthur.sistema_avaliacoes.controller;

import br.com.arthur.sistema_avaliacoes.model.Aluno;
import br.com.arthur.sistema_avaliacoes.repository.AlunoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/admin/alunos") // Usando /admin para diferenciar
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @GetMapping
    public String gerenciarAlunos(Model model) {
        List<Aluno> alunos = alunoRepository.listarTodos();
        model.addAttribute("listaAlunos", alunos);
        model.addAttribute("novoAluno", new Aluno());
        return "admin-alunos";
    }

    @PostMapping
    public String salvarAluno(@ModelAttribute Aluno novoAluno) {
        alunoRepository.salvar(novoAluno);
        return "redirect:/admin/alunos"; // Redireciona de volta para a listagem
    }
}