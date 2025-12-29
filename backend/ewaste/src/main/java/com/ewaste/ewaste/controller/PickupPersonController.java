package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.AdminRequestView;
import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.RequestStatus;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.UserRepository;
import com.ewaste.ewaste.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pickup")
@CrossOrigin
@RequiredArgsConstructor
public class PickupPersonController {

    private final EwasteRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${google.maps.api.key}")
    private String googleMapsApiKey;

    // In-memory storage for OTPs <RequestId, OTP>
    // Note: For production, use Redis or a database table with expiration
    private final Map<Long, String> otpStorage = new ConcurrentHashMap<>();

    // --- 1. Dashboard & Assignments Endpoint ---
    @GetMapping("/my-assigned-requests")
    public ResponseEntity<?> getAssignedRequests(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long pickupPersonId = user.getPickupPersonProfile() != null ?
                    user.getPickupPersonProfile().getId() : null;

            if(pickupPersonId == null) {
                return ResponseEntity.badRequest().body("User is not a pickup person");
            }

            List<EwasteRequest> requests = requestRepository.findByAssignedPickupPersonId(pickupPersonId);

            List<AdminRequestView> dtos = requests.stream()
                    .map(AdminRequestView::fromEntity)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dtos);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to fetch assigned requests: " + e.getMessage());
        }
    }

    // --- 2. Route Map Endpoint ---
    @GetMapping("/route-data")
    public ResponseEntity<?> getRouteData(Authentication authentication) {
        try {
            User user = userRepository.findByEmail(authentication.getName())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Long pickupPersonId = user.getPickupPersonProfile() != null ?
                    user.getPickupPersonProfile().getId() : null;

            if(pickupPersonId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "User is not a pickup person"));
            }

            List<EwasteRequest> requests = requestRepository.findByAssignedPickupPersonId(pickupPersonId);

            List<Map<String, Object>> routeStops = requests.stream()
                    .filter(req -> req.getStatus() == RequestStatus.SCHEDULED)
                    .map(this::createRouteStop)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(Map.of(
                    "stops", routeStops,
                    "totalStops", routeStops.size()
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch route data: " + e.getMessage()));
        }
    }

    // --- 3. Initiate Verification (Send OTP) ---
    @PostMapping("/request/{id}/initiate-verification")
    public ResponseEntity<?> initiateVerification(@PathVariable Long id) {
        try {
            EwasteRequest request = requestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            User customer = request.getUser();
            if (customer == null || customer.getEmail() == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Customer email not found"));
            }

            // Generate 6-digit OTP
            String otp = String.format("%06d", new Random().nextInt(999999));
            otpStorage.put(id, otp);

            // Send Email
            emailService.sendOtpEmail(customer.getEmail(), otp, customer.getName());

            return ResponseEntity.ok(Map.of("message", "OTP sent to customer"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to send OTP: " + e.getMessage()));
        }
    }

    // --- 4. Validate OTP & Complete ---
    @PostMapping("/request/{id}/verify-complete")
    public ResponseEntity<?> verifyAndComplete(@PathVariable Long id, @RequestParam String otp) {
        try {
            String storedOtp = otpStorage.get(id);

            if (storedOtp == null || !storedOtp.equals(otp)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
            }

            EwasteRequest request = requestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            request.setStatus(RequestStatus.COMPLETED);
            request.setCompletedDate(Instant.now());
            requestRepository.save(request);

            // Clear used OTP
            otpStorage.remove(id);

            return ResponseEntity.ok(Map.of("message", "Request verified and completed"));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/request/{id}/update-status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            EwasteRequest request = requestRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Request not found"));

            request.setStatus(RequestStatus.valueOf(status.toUpperCase()));
            requestRepository.save(request);

            return ResponseEntity.ok(Map.of("message", "Status updated successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Failed to update status: " + e.getMessage()));
        }
    }

    @GetMapping("/map-key")
    public ResponseEntity<?> getGoogleMapsApiKey() {
        if (googleMapsApiKey == null || googleMapsApiKey.trim().isEmpty()) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Google Maps API key not configured"));
        }
        return ResponseEntity.ok(Map.of("apiKey", googleMapsApiKey));
    }

    private Map<String, Object> createRouteStop(EwasteRequest request) {
        double baseLat = 40.7128;
        double baseLng = -74.0060;
        double lat = baseLat + (request.getId() % 100) * 0.01;
        double lng = baseLng + (request.getId() % 100) * 0.01;

        String customerName = "Customer";
        if (request.getUser() != null && request.getUser().getName() != null) {
            customerName = request.getUser().getName();
        }

        return Map.of(
                "id", request.getId(),
                "address", request.getPickupAddress() != null ? request.getPickupAddress() : "Address not available",
                "customer", customerName,
                "device", String.format("%s - %s %s",
                        request.getDeviceType() != null ? request.getDeviceType() : "Device",
                        request.getBrand() != null ? request.getBrand() : "",
                        request.getModel() != null ? request.getModel() : ""),
                "scheduledTime", request.getScheduledPickupDate() != null ?
                        request.getScheduledPickupDate().toString() : "N/A",
                "coordinates", Map.of("lat", lat, "lng", lng),
                "status", "UPCOMING"
        );
    }
}