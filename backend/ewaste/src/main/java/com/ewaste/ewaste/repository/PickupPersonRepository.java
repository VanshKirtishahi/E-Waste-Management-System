// src/main/java/com/ewaste/ewaste/repository/PickupPersonRepository.java
package com.ewaste.ewaste.repository;

import com.ewaste.ewaste.model.PickupPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PickupPersonRepository extends JpaRepository<PickupPerson, Long> {
    Optional<PickupPerson> findByUserId(Long userId);
}