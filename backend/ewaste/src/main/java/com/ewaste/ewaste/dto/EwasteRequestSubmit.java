package com.ewaste.ewaste.dto;

import jakarta.validation.constraints.*;

// DTO for submitting a new E-waste request
public class EwasteRequestSubmit {

    @NotBlank(message = "Device type is required")
    @Size(max = 100)
    private String deviceType;

    @Size(max = 100)
    private String brand;

    @Size(max = 100)
    private String model;

    @NotBlank(message = "Condition is required")
    @Size(max = 50)
    private String condition;

    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String imagePaths; // For simplicity, we'll pass filenames as string

    @NotBlank(message = "Pickup address is required")
    @Size(max = 300)
    private String pickupAddress;

    private String remarks;

    // Getters and Setters
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
    public String getImagePaths() { return imagePaths; }
    public void setImagePaths(String imagePaths) { this.imagePaths = imagePaths; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}

