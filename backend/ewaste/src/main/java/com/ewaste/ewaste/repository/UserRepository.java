// src/main/java/com/ewaste/ewaste/repository/UserRepository.java
package com.ewaste.ewaste.repository;

import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}