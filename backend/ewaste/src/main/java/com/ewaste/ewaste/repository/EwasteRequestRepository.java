package com.ewaste.ewaste.repository;

import com.ewaste.ewaste.dto.RequestStats;
import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Map;

public interface EwasteRequestRepository extends JpaRepository<EwasteRequest, Long> {
    List<EwasteRequest> findByUserId(Long userId);
    List<EwasteRequest> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<EwasteRequest> findByAssignedPickupPersonId(Long pickupPersonId);
    List<EwasteRequest> findAllByOrderByCreatedAtDesc();

    long countByUserIdAndStatus(Long userId, RequestStatus status);

    @Query("SELECT e.status as status, COUNT(e) as count FROM EwasteRequest e GROUP BY e.status")
    List<Map<String, Object>> countRequestsByStatus();

    // --- FIX: Return Typed DTO list to guarantee JSON structure ---
    @Query("SELECT new com.ewaste.ewaste.dto.RequestStats(e.status, COUNT(e)) " +
            "FROM EwasteRequest e WHERE e.user.id = :userId GROUP BY e.status")
    List<RequestStats> countUserRequestsByStatus(@Param("userId") Long userId);

    @Query("SELECT e.deviceType as device, COUNT(e) as count FROM EwasteRequest e GROUP BY e.deviceType")
    List<Map<String, Object>> countRequestsByDeviceType();
}