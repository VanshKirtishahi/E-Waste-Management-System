package com.ewaste.ewaste.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@Table(name = "support_queries")
public class SupportQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Links the query to the logged-in user

    private String subject;
    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String relatedRequestId; // Optional: Link to a specific request ID

    private String status; // "Open", "Resolved", "Closed"

    @Column(columnDefinition = "TEXT")
    private String adminReply; // Stores the admin's response

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime resolvedAt;
}