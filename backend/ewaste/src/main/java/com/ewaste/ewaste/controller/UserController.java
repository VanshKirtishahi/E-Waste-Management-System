package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.ProfileUpdateRequest;
import com.ewaste.ewaste.service.EwasteRequestService;
import com.ewaste.ewaste.service.PdfGenerationService;
import com.ewaste.ewaste.service.StatsService;
import com.ewaste.ewaste.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin
public class UserController {

    private final EwasteRequestService ewasteRequestService;
    private final PdfGenerationService pdfGenerationService;
    private final StatsService statsService;
    private final UserService userService; // Inject UserService

    // --- Profile Update Endpoint ---
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateRequest request,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        try {
            userService.updateProfile(userDetails.getUsername(), request);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (RuntimeException e) {
            // Returns 400 Bad Request for errors like "Incorrect current password"
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-requests")
    public ResponseEntity<?> getMyRequests(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ewasteRequestService.getRequestsForUser(userDetails.getUsername()));
    }

    @GetMapping("/request/{requestId}/report")
    public ResponseEntity<InputStreamResource> getSubmissionReport(@PathVariable Long requestId, @AuthenticationPrincipal UserDetails userDetails) {
        ByteArrayInputStream bis = pdfGenerationService.generateRequestReportPdf(requestId, userDetails.getUsername());

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "inline; filename=request_report_" + requestId + ".pdf");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(bis));
    }

    @GetMapping("/my-stats/requests-by-status")
    public ResponseEntity<?> getMyRequestStats(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(statsService.getUserRequestStats(userDetails.getUsername()));
    }
}