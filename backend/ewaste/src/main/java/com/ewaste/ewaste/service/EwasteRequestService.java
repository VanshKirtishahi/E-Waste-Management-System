// src/main/java/com/ewaste/ewaste/service/EwasteRequestService.java
package com.ewaste.ewaste.service;

import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EwasteRequestService {
    private final EwasteRequestRepository requestRepository;
    private final UserRepository userRepository;

    public List<EwasteRequest> getRequestsForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return requestRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }
}