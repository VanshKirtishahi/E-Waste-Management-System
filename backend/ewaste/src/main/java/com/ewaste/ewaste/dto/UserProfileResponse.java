package com.ewaste.ewaste.dto;

import com.ewaste.ewaste.model.User;
import java.util.Collections;
import java.util.List;

public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String contactInfo;
    private String pickupAddress;
    private List<String> roles;

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.contactInfo = user.getContactInfo();
        this.pickupAddress = user.getPickupAddress();

        // FIX: Handle Enum to String conversion
        if (user.getRole() != null) {
            this.roles = Collections.singletonList(user.getRole().name());
        } else {
            this.roles = Collections.emptyList();
        }
    }
    // Getters & Setters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getContactInfo() { return contactInfo; }
    public String getPickupAddress() { return pickupAddress; }
    public List<String> getRoles() { return roles; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setEmail(String email) { this.email = email; }
    public void setContactInfo(String contactInfo) { this.contactInfo = contactInfo; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public void setRoles(List<String> roles) { this.roles = roles; }
}