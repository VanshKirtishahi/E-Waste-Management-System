package com.ewaste.ewaste.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

// DTO for scheduling a pickup
public class ScheduleRequest {

    @NotNull(message = "Pickup person ID is required")
    private Long personId;

    @NotNull(message = "Pickup time is required")
    @Future(message = "Scheduled time must be in the future") // Ensure it's a future time
    private LocalDateTime pickupTime;

    // Getters and Setters
    public Long getPersonId() { return personId; }
    public void setPersonId(Long personId) { this.personId = personId; }
    public LocalDateTime getPickupTime() { return pickupTime; }
    public void setPickupTime(LocalDateTime pickupTime) { this.pickupTime = pickupTime; }
}