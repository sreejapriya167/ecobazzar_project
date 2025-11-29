package com.ecobazzar.ecobazzar.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.Components;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI ecoBazaarOpenAPI() {
        return new OpenAPI()
                // 🔐 Add JWT security scheme so you can test protected APIs
                .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
                .components(new Components()
                        .addSecuritySchemes("BearerAuth",
                                new SecurityScheme()
                                        .name("Authorization")
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                        ))
                // ℹ️ Add basic API info shown at top of Swagger page
                .info(new Info()
                        .title("🌿 EcoBazaar API Documentation")
                        .description("REST API documentation for EcoBazaar — your eco-friendly shopping backend.")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("EcoBazaar Team")
                                .email("support@ecobazaar.com")
                                .url("https://ecobazaar.com"))
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0.html"))
                );
    }
}
