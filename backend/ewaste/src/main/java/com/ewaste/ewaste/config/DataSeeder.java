package com.ewaste.ewaste.config;

 // Import your Enum
import com.ewaste.ewaste.model.Role;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired UserRepository userRepository;
    @Autowired PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // Create default Admin
        if (!userRepository.existsByEmail("admin@ewaste.com")) {
            User adminUser = new User("Admin User", "admin@ewaste.com", passwordEncoder.encode("admin123"));
            adminUser.setRole(Role.ROLE_ADMIN); // Use Enum
            userRepository.save(adminUser);
            System.out.println("--- Created default admin user (admin@ewaste.com) ---");
        }

        // Create default User
        if (!userRepository.existsByEmail("user@example.com")) {
            User regularUser = new User("Regular User", "user@example.com", passwordEncoder.encode("user123"));
            regularUser.setRole(Role.ROLE_USER); // Use Enum
            userRepository.save(regularUser);
            System.out.println("--- Created default regular user (user@example.com) ---");
        }
    }
}