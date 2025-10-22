package com.example.backend.config;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.enums.RoleName;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            //Tạo role ADMIN nếu chưa có ---
            Role adminRole = roleRepository.findByRoleName(RoleName.ADMIN.name())
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRoleName(RoleName.ADMIN.name());
                        return roleRepository.save(role);
                    });

            // Tạo role USER nếu chưa có ---
            Role userRole = roleRepository.findByRoleName(RoleName.USER.name())
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setRoleName(RoleName.USER.name());
                        return roleRepository.save(role);
                    });

            //Seed tài khoản admin nếu chưa có ---
            if (userRepository.findByEmail("lovanthanh34523@gmail.com").isEmpty()) {
                User admin = new User();
                admin.setFullName("Admin");
                admin.setEmail("lovanthanh34523@gmail.com");
                admin.setPassword(passwordEncoder.encode("admin12345"));
                admin.setIsActive(true);
                admin.setCreatedAt(LocalDateTime.now());
                admin.setRoles(new HashSet<>(Set.of(adminRole)));
                userRepository.save(admin);

                System.out.println("✅ Admin user has been created with default password: admin12345");
            }
        };
    }

}

