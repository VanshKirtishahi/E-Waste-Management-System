// backend/ewaste/src/main/java/com/ewaste/ewaste/service/AdminService.java
package com.ewaste.ewaste.service;

import com.ewaste.ewaste.dto.PickupPersonRegister;
import com.ewaste.ewaste.model.*;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.PickupPersonRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PickupPersonRepository pickupPersonRepository;
    private final EwasteRequestRepository ewasteRequestRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User registerPickupPerson(PickupPersonRegister dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        User user = new User();
        user.setEmail(dto.getEmail());
        user.setName(dto.getName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.ROLE_PICKUP_PERSON);
        user.setPhoneNumber(dto.getPhoneNumber());
        user.setAddress(dto.getAddress());
        user.setStatus("ACTIVE"); // Ensure status is set
        User savedUser = userRepository.save(user);

        PickupPerson pickupPerson = new PickupPerson();
        pickupPerson.setUser(savedUser);
        pickupPerson.setVehicleNumber(dto.getVehicleNumber());
        pickupPersonRepository.save(pickupPerson);

        savedUser.setPickupPersonProfile(pickupPerson);
        return savedUser;
    }

    @Transactional
    public EwasteRequest assignRequest(Long requestId, Long pickupPersonId) {
        EwasteRequest request = ewasteRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));
        PickupPerson pickupPerson = pickupPersonRepository.findById(pickupPersonId)
                .orElseThrow(() -> new RuntimeException("Pickup person not found"));

        request.setAssignedPickupPerson(pickupPerson);
        request.setStatus(RequestStatus.SCHEDULED);
        return ewasteRequestRepository.save(request);
    }

    public List<EwasteRequest> getAllRequests(String status) {
        if (status != null && !status.isEmpty()) {
            try {
                RequestStatus requestStatus = RequestStatus.valueOf(status.toUpperCase());
                return ewasteRequestRepository.findAll().stream()
                        .filter(req -> req.getStatus() == requestStatus)
                        .toList();
            } catch (IllegalArgumentException e) {
                return ewasteRequestRepository.findAll();
            }
        }
        return ewasteRequestRepository.findAll();
    }

    public List<PickupPerson> getAllPickupPersons() {
        return pickupPersonRepository.findAll();
    }

    // --- NEW METHODS FOR USER MANAGEMENT ---

    @Transactional
    public void updateUserStatus(Long userId, String status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Transactional
    public User updateUser(Long userId, Map<String, Object> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (updates.containsKey("name")) user.setName((String) updates.get("name"));
        if (updates.containsKey("phoneNumber")) user.setPhoneNumber((String) updates.get("phoneNumber"));
        if (updates.containsKey("address")) user.setAddress((String) updates.get("address"));

        // Handle Role Updates (Optional)
        if (updates.containsKey("role")) {
            user.setRole(Role.valueOf((String) updates.get("role")));
        }

        return userRepository.save(user);
    }
}