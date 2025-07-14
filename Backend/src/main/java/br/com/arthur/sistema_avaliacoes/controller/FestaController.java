package br.com.arthur.sistema_avaliacoes.controller;

import br.com.arthur.sistema_avaliacoes.model.Festa;
import br.com.arthur.sistema_avaliacoes.repository.FestaRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/festas")
public class FestaController {

    @Autowired
    private FestaRepository festaRepository;

    @GetMapping("/nova/{cnpjOrganizador}")
    public String showFormularioNovaFesta(@PathVariable String cnpjOrganizador, Model model) {
        model.addAttribute("festa", new Festa());
        model.addAttribute("cnpjOrganizador", cnpjOrganizador);
        return "festa-form";
    }

    @PostMapping("/salvar")
    public String salvarFesta(@ModelAttribute Festa festa, @RequestParam String cnpjOrganizador) {
        festaRepository.salvar(festa, cnpjOrganizador);
        return "redirect:/atleticas/" + cnpjOrganizador;
    }

    @GetMapping("/{matricula}")
    public String listarFestas(@PathVariable Integer matricula, Model model) {
        List<Festa> festas = festaRepository.listarTodas();
        model.addAttribute("listaDeFestas", festas);
        model.addAttribute("matricula", matricula);
        return "festas-lista";
    }
}