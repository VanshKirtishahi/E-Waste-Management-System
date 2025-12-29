package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.AdminRequestView;
import com.ewaste.ewaste.dto.EwasteRequestView;
import com.ewaste.ewaste.model.*;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.PickupPersonRepository;
import com.ewaste.ewaste.repository.UserRepository;
import com.ewaste.ewaste.service.EmailService;
import com.ewaste.ewaste.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin
@RequiredArgsConstructor
public class EwasteRequestController {
    private final EwasteRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final PickupPersonRepository pickupPersonRepository;
    private final EmailService emailService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createRequest(
            @RequestParam(value = "images", required = false) MultipartFile[] files,
            @RequestParam Map<String, String> params,
            Authentication authentication) {

        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        EwasteRequest request = new EwasteRequest();
        request.setUser(user);
        request.setDeviceType(params.get("deviceType"));
        request.setBrand(params.get("brand"));
        request.setModel(params.get("model"));

        String conditionParam = params.get("condition");
        if (conditionParam == null || conditionParam.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Device condition is required");
        }
        try {
            request.setConditionStatus(ConditionStatus.valueOf(conditionParam));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid device condition: " + conditionParam);
        }

        try {
            request.setQuantity(Integer.parseInt(params.get("quantity")));
        } catch (NumberFormatException e) {
            request.setQuantity(1);
        }

        request.setPickupAddress(params.get("pickupAddress"));
        request.setRemarks(params.get("remarks"));

        if (files != null) {
            List<String> fileUrls = Arrays.stream(files)
                    .map(fileStorageService::storeFile)
                    .collect(Collectors.toList());
            request.setImageUrls(String.join(",", fileUrls));
        }
        requestRepository.save(request);
        return ResponseEntity.ok("Request submitted successfully");
    }

    @GetMapping("/user")
    public ResponseEntity<?> getUserRequests(Authentication authentication) {
        User user = userRepository.findByEmail(authentication.getName()).orElseThrow();
        List<EwasteRequest> requests = requestRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<EwasteRequestView> dtos = requests.stream()
                .map(EwasteRequestView::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping
    public ResponseEntity<?> getAllRequests() {
        List<EwasteRequest> requests = requestRepository.findAllByOrderByCreatedAtDesc();
        List<AdminRequestView> dtos = requests.stream()
                .map(AdminRequestView::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        EwasteRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        RequestStatus newStatus = RequestStatus.valueOf(payload.get("status"));
        request.setStatus(newStatus);

        if (payload.containsKey("rejectionReason")) {
            request.setRejectionReason(payload.get("rejectionReason"));
        }

        requestRepository.save(request);

        if (newStatus == RequestStatus.APPROVED) {
            try {
                User user = request.getUser();
                emailService.sendApprovalEmail(
                        user.getEmail(),
                        user.getName(),
                        request.getId(),
                        request.getDeviceType()
                );
            } catch (Exception e) {
                System.err.println("Failed to send approval email: " + e.getMessage());
            }
        }

        return ResponseEntity.ok("Status updated");
    }

    @PutMapping("/{id}/schedule")
    public ResponseEntity<?> schedulePickup(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        EwasteRequest request = requestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Request not found"));

        String dateStr = (String) payload.get("pickupDate");
        if (dateStr != null) {
            // ISO 8601 format usually expected, but flexible parsing can be added if needed
            request.setScheduledPickupDate(Instant.parse(dateStr));
        }

        Object personIdObj = payload.get("pickupPersonId");
        if (personIdObj != null) {
            Long personId = Long.valueOf(personIdObj.toString());
            PickupPerson person = pickupPersonRepository.findById(personId)
                    .orElseThrow(() -> new RuntimeException("Pickup Person not found"));

            request.setAssignedPickupPerson(person);

            // Mark status as Scheduled
            request.setStatus(RequestStatus.SCHEDULED);
            requestRepository.save(request);

            // --- SEND EMAIL TO PICKUP PERSON ---
            try {
                User pickupUser = person.getUser();
                User customer = request.getUser();

                // Format date for readability in email
                String readableDate = dateStr;
                try {
                    if (request.getScheduledPickupDate() != null) {
                        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a")
                                .withZone(ZoneId.systemDefault());
                        readableDate = formatter.format(request.getScheduledPickupDate());
                    }
                } catch (Exception ignored) {}

                emailService.sendPickupAssignmentEmail(
                        pickupUser.getEmail(),
                        pickupUser.getName(),
                        request.getId(),
                        request.getDeviceType(),
                        customer.getName(),
                        customer.getPhoneNumber(),
                        request.getPickupAddress(),
                        readableDate
                );
            } catch (Exception e) {
                System.err.println("Failed to send assignment email to pickup person: " + e.getMessage());
                // Don't fail the request if email fails, just log it
            }
            // -----------------------------------
        } else {
            // Even if no person assigned immediately, save date
            requestRepository.save(request);
        }

        return ResponseEntity.ok("Pickup scheduled successfully");
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        List<Map<String, Object>> deviceStats = requestRepository.countRequestsByDeviceType();
        Map<String, Long> statsMap = new HashMap<>();

        for (Map<String, Object> row : deviceStats) {
            String device = (String) row.get("device");

            if (device == null) {
                device = "Unknown";
            }

            statsMap.put(device, (Long) row.get("count"));
        }
        return ResponseEntity.ok(Map.of("deviceTypeStats", statsMap));
    }
}