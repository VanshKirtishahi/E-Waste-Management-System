package com.ewaste.ewaste.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // Import this
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "pickup_persons")
@Data
@NoArgsConstructor
public class PickupPerson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER) // Changed to EAGER to ensure User data is available
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String vehicleNumber;
    private boolean isAvailable = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    // FIX: Add @JsonIgnore to prevent infinite recursion
    @OneToMany(mappedBy = "assignedPickupPerson")
    @JsonIgnore
    private List<EwasteRequest> assignedRequests;
}