package com.ewaste.ewaste.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// DTO for sending a rejection reason
public class RejectRequest {

    @NotBlank(message = "Rejection reason is required")
    @Size(min = 5, max = 500, message = "Reason must be between 5 and 500 characters")
    private String rejectionReason;

    // Getter
    public String getRejectionReason() {
        return rejectionReason;
    }

    // Setter
    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}

