package com.tracify.config;

import com.tracify.entity.Category;
import com.tracify.entity.Role;
import com.tracify.entity.User;
import com.tracify.repository.CategoryRepository;
import com.tracify.repository.RoleRepository;
import com.tracify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initRoles();
        initAdminUser();
        initTestUsers();
        initCategories();
    }

    private void initRoles() {
        if (roleRepository.count() == 0) {
            roleRepository.save(new Role(null, "ROLE_USER"));
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
            log.info("Roles initialized: ROLE_USER, ROLE_ADMIN");
        }
    }

    private void initAdminUser() {
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseThrow();
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();

            User admin = User.builder()
                    .username("admin")
                    .email("admin@tracify.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("System Administrator")
                    .build();
            admin.getRoles().add(adminRole);
            admin.getRoles().add(userRole);
            userRepository.save(admin);
            log.info("Admin user created: admin / admin123");
        }
    }

    private void initTestUsers() {
        if (!userRepository.existsByUsername("user1")) {
            Role userRole = roleRepository.findByName("ROLE_USER").orElseThrow();
            
            User user1 = User.builder()
                    .username("user1")
                    .email("user1@tracify.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Test User 1")
                    .phone("1234567890")
                    .build();
            user1.getRoles().add(userRole);
            userRepository.save(user1);

            User user2 = User.builder()
                    .username("user2")
                    .email("user2@tracify.com")
                    .password(passwordEncoder.encode("user123"))
                    .fullName("Test User 2")
                    .phone("0987654321")
                    .build();
            user2.getRoles().add(userRole);
            userRepository.save(user2);

            log.info("Test users created: user1, user2 (password: user123)");
        }
    }

    private void initCategories() {
        if (categoryRepository.count() == 0) {
            List<Category> categories = List.of(
                    createCategory("Electronics", "Phones, laptops, tablets, chargers", "📱"),
                    createCategory("Documents", "ID cards, passports, certificates", "📄"),
                    createCategory("Keys", "House keys, car keys, office keys", "🔑"),
                    createCategory("Bags & Wallets", "Backpacks, purses, wallets", "👜"),
                    createCategory("Clothing", "Jackets, shoes, accessories", "👕"),
                    createCategory("Jewelry", "Rings, necklaces, watches", "💍"),
                    createCategory("Books & Stationery", "Textbooks, notebooks, pens", "📚"),
                    createCategory("Sports Equipment", "Bottles, gear, equipment", "⚽"),
                    createCategory("Eyewear", "Glasses, sunglasses, cases", "👓"),
                    createCategory("Other", "Miscellaneous items", "📦")
            );
            categoryRepository.saveAll(categories);
            log.info("Categories initialized: {} categories", categories.size());
        }
    }

    private Category createCategory(String name, String description, String icon) {
        Category cat = new Category();
        cat.setName(name);
        cat.setDescription(description);
        cat.setIcon(icon);
        return cat;
    }
}
