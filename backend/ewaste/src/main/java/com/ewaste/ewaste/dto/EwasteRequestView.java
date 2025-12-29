package com.ewaste.ewaste.dto;

import com.ewaste.ewaste.model.EwasteRequest;
import com.ewaste.ewaste.model.RequestStatus;
import java.time.LocalDateTime;
import java.time.ZoneId;

public class EwasteRequestView {
    private Long id;
    private String deviceType;
    private String brand;
    private String model;
    private String condition;
    private Integer quantity;
    private String pickupAddress;
    private String remarks;
    private RequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // --- Fields for User/PDF ---
    private String rejectionReason;
    private String assignedPersonName;
    private LocalDateTime scheduledPickupDate;
    private String userName;
    private String userEmail;
    private String userContactInfo;
    private String userAddress; // <--- ADDED FIELD

    public static EwasteRequestView fromEntity(EwasteRequest request) {
        EwasteRequestView dto = new EwasteRequestView();
        dto.setId(request.getId());
        dto.setDeviceType(request.getDeviceType());
        dto.setBrand(request.getBrand());
        dto.setModel(request.getModel());

        if (request.getConditionStatus() != null) {
            dto.setCondition(request.getConditionStatus().name());
        }

        dto.setQuantity(request.getQuantity());
        dto.setPickupAddress(request.getPickupAddress());
        dto.setRemarks(request.getRemarks());
        dto.setStatus(request.getStatus());

        if (request.getCreatedAt() != null) {
            dto.setCreatedAt(LocalDateTime.ofInstant(request.getCreatedAt(), ZoneId.systemDefault()));
        }
        if (request.getUpdatedAt() != null) {
            dto.setUpdatedAt(LocalDateTime.ofInstant(request.getUpdatedAt(), ZoneId.systemDefault()));
        }

        dto.setRejectionReason(request.getRejectionReason());

        if (request.getUser() != null) {
            dto.setUserName(request.getUser().getName());
            dto.setUserEmail(request.getUser().getEmail());
            dto.setUserContactInfo(request.getUser().getContactInfo());
            dto.setUserAddress(request.getUser().getAddress()); // <--- POPULATE ADDRESS
        }

        if (request.getAssignedPickupPerson() != null) {
            dto.setAssignedPersonName(request.getAssignedPickupPerson().getUser().getName());
        }

        if (request.getScheduledPickupDate() != null) {
            dto.setScheduledPickupDate(LocalDateTime.ofInstant(request.getScheduledPickupDate(), ZoneId.systemDefault()));
        }

        return dto;
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getDeviceType() { return deviceType; }
    public void setDeviceType(String deviceType) { this.deviceType = deviceType; }
    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }
    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }
    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public String getAssignedPersonName() { return assignedPersonName; }
    public void setAssignedPersonName(String assignedPersonName) { this.assignedPersonName = assignedPersonName; }
    public LocalDateTime getScheduledPickupDate() { return scheduledPickupDate; }
    public void setScheduledPickupDate(LocalDateTime scheduledPickupDate) { this.scheduledPickupDate = scheduledPickupDate; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }
    public String getUserContactInfo() { return userContactInfo; }
    public void setUserContactInfo(String userContactInfo) { this.userContactInfo = userContactInfo; }
    public String getUserAddress() { return userAddress; } // <--- ADDED GETTER
    public void setUserAddress(String userAddress) { this.userAddress = userAddress; } // <--- ADDED SETTER
}