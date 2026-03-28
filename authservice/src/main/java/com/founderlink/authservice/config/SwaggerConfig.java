package com.founderlink.authservice.config;


import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.*;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import io.swagger.v3.oas.models.servers.Server;


@Configuration
public class SwaggerConfig {

	@Bean
	public OpenAPI customOpenAPI() {
	    return new OpenAPI()
	            .servers(List.of(new Server().url("http://localhost:8085")))
	            .components(new Components()
	                    .addSecuritySchemes("bearerAuth",
	                            new SecurityScheme()
	                                    .type(SecurityScheme.Type.HTTP)
	                                    .scheme("bearer")
	                                    .bearerFormat("JWT")))
	            .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
	}
}
