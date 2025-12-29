package com.ewaste.ewaste.service;

import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.PickupPerson;
import com.ewaste.ewaste.model.RequestStatus;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.PickupPersonRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PickupPersonService {

    private final UserRepository userRepository;
    private final PickupPersonRepository pickupPersonRepository;
    private final EwasteRequestRepository ewasteRequestRepository;

    private PickupPerson getPickupPersonFromEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return pickupPersonRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Pickup person profile not found"));
    }

    public List<EwasteRequest> getAssignedRequests(String email) {
        PickupPerson pickupPerson = getPickupPersonFromEmail(email);
        return ewasteRequestRepository.findByAssignedPickupPersonId(pickupPerson.getId());
    }

    @Transactional
    public EwasteRequest updateRequestStatus(Long requestId, RequestStatus newStatus, String email) {
        PickupPerson pickupPerson = getPickupPersonFromEmail(email);
        EwasteRequest request = ewasteRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        // Security Check: Ensure this request is actually assigned to this pickup person
        if (!Objects.equals(request.getAssignedPickupPerson().getId(), pickupPerson.getId())) {
            throw new RuntimeException("Access Denied: This request is not assigned to you.");
        }

        // Logic Check: Only allow setting to COLLECTED
        if (newStatus != RequestStatus.COLLECTED) {
            throw new RuntimeException("Invalid status update. Only 'COLLECTED' is allowed.");
        }

        request.setStatus(newStatus);
        return ewasteRequestRepository.save(request);
    }
}