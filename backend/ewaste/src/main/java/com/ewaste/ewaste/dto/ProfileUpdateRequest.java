package com.ewaste.ewaste.dto;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String name;
    private String contactInfo;
    private String pickupAddress;

    // Add password fields
    private String currentPassword;
    private String newPassword;

    // For Pickup Person
    private String vehicleNumber;
}