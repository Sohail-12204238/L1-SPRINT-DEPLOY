package com.founderlink.authservice.config;

import com.founderlink.authservice.entity.Role;
import com.founderlink.authservice.repository.RoleRepository;
import com.founderlink.authservice.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class RoleInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        List<String> roles = List.of("ROLE_FOUNDER", "ROLE_INVESTOR", "ROLE_COFOUNDER", "ROLE_ADMIN");
        
        for (String roleName : roles) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                System.out.println("Initialized missing role: " + roleName);
            }
        }

        userRepository.findByEmail("admin@gmail.com").ifPresentOrElse(
            admin -> {
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRoles(java.util.Set.of(roleRepository.findByName("ROLE_ADMIN").orElseThrow()));
                userRepository.save(admin);
                System.out.println("Updated existing admin user password: admin@gmail.com");
            },
            () -> {
                Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
                com.founderlink.authservice.entity.User admin = com.founderlink.authservice.entity.User.builder()
                        .name("Admin User")
                        .email("admin@gmail.com")
                        .password(passwordEncoder.encode("123456"))
                        .roles(java.util.Set.of(adminRole))
                        .build();
                userRepository.save(admin);
                System.out.println("Initialized new admin user: admin@gmail.com");
            }
        );
    }
}
