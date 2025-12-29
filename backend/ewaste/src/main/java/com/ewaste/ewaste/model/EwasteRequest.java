package com.ewaste.ewaste.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Entity
@Table(name = "ewaste_requests")
@Data
@NoArgsConstructor
public class EwasteRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String deviceType;
    private String brand;
    private String model;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConditionStatus conditionStatus;

    @Column(nullable = false)
    private int quantity;

    // FIX: Changed to TEXT to allow unlimited image URLs
    @Column(columnDefinition = "TEXT")
    private String imageUrls;

    @Column(nullable = false)
    private String pickupAddress;

    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.PENDING;

    private String rejectionReason;
    private String adminRemarks;
    private Instant scheduledPickupDate;
    private Instant completedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_pickup_person_id")
    private PickupPerson assignedPickupPerson;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(nullable = false)
    private Instant updatedAt = Instant.now();

    @PreUpdate
    protected void onUpdate() { updatedAt = Instant.now(); }
}