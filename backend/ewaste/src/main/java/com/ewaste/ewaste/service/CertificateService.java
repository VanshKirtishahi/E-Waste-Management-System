package com.ewaste.ewaste.service;

import com.ewaste.ewaste.model.RequestStatus;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.EwasteRequestRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CertificateService {

    private final UserRepository userRepository;
    private final EwasteRequestRepository ewasteRequestRepository;
    private final PdfGenerationService pdfGenerationService;

    private static final int REQUIRED_SUBMISSIONS = 10;

    /**
     * NEW METHOD: Calculates if a user is eligible for a certificate.
     * This was missing, causing your compilation error.
     */
    public Map<String, Object> getCertificateEligibility(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Sum up both COMPLETED and COLLECTED requests
        long completedCount = ewasteRequestRepository.countByUserIdAndStatus(user.getId(), RequestStatus.COMPLETED);
        long collectedCount = ewasteRequestRepository.countByUserIdAndStatus(user.getId(), RequestStatus.COLLECTED);

        long totalQualified = completedCount + collectedCount;

        Map<String, Object> response = new HashMap<>();
        response.put("totalQualified", totalQualified);
        response.put("isEligible", totalQualified >= REQUIRED_SUBMISSIONS);
        response.put("required", REQUIRED_SUBMISSIONS);
        response.put("recipientName", user.getName());

        return response;
    }

    public ByteArrayInputStream generateCertificateForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Same logic for generation to prevent unauthorized downloads
        long completedCount = ewasteRequestRepository.countByUserIdAndStatus(user.getId(), RequestStatus.COMPLETED);
        long collectedCount = ewasteRequestRepository.countByUserIdAndStatus(user.getId(), RequestStatus.COLLECTED);

        long totalQualified = completedCount + collectedCount;

        if (totalQualified < REQUIRED_SUBMISSIONS) {
            throw new RuntimeException("You do not qualify for a certificate yet. You need " +
                    REQUIRED_SUBMISSIONS + " completed/collected submissions. You have " + totalQualified + ".");
        }

        // User qualifies, generate the PDF
        return pdfGenerationService.generateAppreciationCertificate(user);
    }
}