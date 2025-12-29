package com.ewaste.ewaste.repository;

import com.ewaste.ewaste.model.SupportQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SupportQueryRepository extends JpaRepository<SupportQuery, Long> {

    // THIS IS THE MISSING METHOD CAUSING THE ERROR
    List<SupportQuery> findByUser_EmailOrderByCreatedAtDesc(String email);

    // Fetch all tickets for Admin review
    List<SupportQuery> findAllByOrderByCreatedAtDesc();
}