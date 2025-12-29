// backend/ewaste/src/main/java/com/ewaste/ewaste/service/EmailService.java
package com.ewaste.ewaste.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@ewaste-smart.com");
        message.setTo(toEmail);
        message.setSubject("Pickup Verification OTP - Smart e-Waste");
        message.setText("Hello " + userName + ",\n\n" +
                "Your e-waste pickup verification code is: " + otp + "\n\n" +
                "Please share this code with the pickup person to complete the request.\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Regards,\nSmart e-Waste Collection Team");

        mailSender.send(message);
    }

    // Send email to Customer when Admin approves
    public void sendApprovalEmail(String toEmail, String userName, Long requestId, String deviceType) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@ewaste-smart.com");
        message.setTo(toEmail);
        message.setSubject("Request Approved - Smart e-Waste (ID: #" + requestId + ")");
        message.setText("Hello " + userName + ",\n\n" +
                "Good news! Your e-waste collection request for '" + deviceType + "' (ID: #" + requestId + ") has been APPROVED by our admin team.\n\n" +
                "Next Steps:\n" +
                "1. Our team will assign a pickup agent shortly.\n" +
                "2. You will receive another notification once the pickup is scheduled.\n" +
                "3. You can track the status in your dashboard.\n\n" +
                "Thank you for contributing to a greener planet!\n\n" +
                "Regards,\nSmart e-Waste Collection Team");

        mailSender.send(message);
    }

    // --- NEW: Send email to Pickup Person when assigned ---
    public void sendPickupAssignmentEmail(String toEmail, String pickupPersonName, Long requestId,
                                          String deviceType, String customerName, String customerPhone,
                                          String pickupAddress, String scheduledDate) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@ewaste-smart.com");
        message.setTo(toEmail);
        message.setSubject("New Pickup Assignment - Smart e-Waste (ID: #" + requestId + ")");
        message.setText("Hello " + pickupPersonName + ",\n\n" +
                "You have been assigned a new e-waste pickup job.\n\n" +
                "--- JOB DETAILS ---\n" +
                "Request ID: #" + requestId + "\n" +
                "Device: " + deviceType + "\n" +
                "Scheduled Time: " + scheduledDate + "\n\n" +
                "--- CUSTOMER DETAILS ---\n" +
                "Name: " + customerName + "\n" +
                "Phone: " + (customerPhone != null ? customerPhone : "N/A") + "\n" +
                "Address: " + pickupAddress + "\n\n" +
                "Please verify the item upon arrival and ask the customer for the OTP to complete the job.\n\n" +
                "Regards,\nSmart e-Waste Admin Team");

        mailSender.send(message);
    }
}