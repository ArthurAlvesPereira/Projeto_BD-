package br.com.arthur.sistema_avaliacoes.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Sistema de Avaliações de Festas API")
                        .version("1.0")
                        .description("API para gerenciamento de festas, atléticas e avaliações de alunos")
                        .contact(new Contact()
                                .name("Arthur")
                                .url("https://github.com/ArthurAlvesPereira")));
    }
}
