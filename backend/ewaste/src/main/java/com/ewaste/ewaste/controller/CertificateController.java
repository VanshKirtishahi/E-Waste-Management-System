package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.service.CertificateService; // Import Service
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
@CrossOrigin
@RequiredArgsConstructor
public class CertificateController {

    // FIX: Only inject CertificateService.
    // Removed Repo and PdfService as they are internal to CertificateService.
    private final CertificateService certificateService;

    @GetMapping("/certificate/generate")
    public ResponseEntity<?> generateCertificate(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            // FIX: Delegate logic to Service
            ByteArrayInputStream bis = certificateService.generateCertificateForUser(userDetails.getUsername());

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=certificate.pdf");

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(new InputStreamResource(bis));

        } catch (RuntimeException e) {
            // Returns 400 Bad Request with the error message from service if they don't qualify
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}