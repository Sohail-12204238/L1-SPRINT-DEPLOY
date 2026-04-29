package com.founderlink.authservice.config;

import com.founderlink.authservice.entity.Role;
import com.founderlink.authservice.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        List<String> roles = List.of("ROLE_FOUNDER", "ROLE_INVESTOR", "ROLE_COFOUNDER", "ROLE_ADMIN");
        
        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                System.out.println("Initialized missing role: " + roleName);
            }
        }
    }
}
