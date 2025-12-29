package com.ewaste.ewaste.service;

import com.ewaste.ewaste.dto.RequestStats; // Import the DTO
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final EwasteRequestRepository ewasteRequestRepository;
    private final UserRepository userRepository;

    public List<Map<String, Object>> getGlobalRequestStats() {
        return ewasteRequestRepository.countRequestsByStatus();
    }

    /**
     * Get request counts by status for a specific user's dashboard.
     * Returns a List of RequestStats DTOs.
     */
    public List<RequestStats> getUserRequestStats(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ewasteRequestRepository.countUserRequestsByStatus(user.getId());
    }
}