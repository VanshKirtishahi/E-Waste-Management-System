package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.model.SupportQuery;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.SupportQueryRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@CrossOrigin
public class SupportQueryController {

    private final SupportQueryRepository supportQueryRepository;
    private final UserRepository userRepository;

    // --- USER ENDPOINTS ---

    @PostMapping("/create")
    public ResponseEntity<?> createTicket(@RequestBody SupportQuery query,
                                          @AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        query.setUser(user);
        query.setStatus("Open");
        query.setCreatedAt(LocalDateTime.now());

        SupportQuery savedQuery = supportQueryRepository.save(query);
        return ResponseEntity.ok(savedQuery);
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<?> getMyTickets(@AuthenticationPrincipal UserDetails userDetails) {
        List<SupportQuery> tickets = supportQueryRepository.findByUser_EmailOrderByCreatedAtDesc(userDetails.getUsername());
        return ResponseEntity.ok(tickets);
    }

    // --- ADMIN ENDPOINTS ---

    @GetMapping("/admin/all")
    public ResponseEntity<?> getAllTickets() {
        return ResponseEntity.ok(supportQueryRepository.findAllByOrderByCreatedAtDesc());
    }

    // FIX: Use Map<String, String> to extract the 'reply' key from the JSON object
    @PutMapping("/admin/{id}/reply")
    public ResponseEntity<?> replyToTicket(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        SupportQuery ticket = supportQueryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        // Extract the value associated with the "reply" key
        String replyText = payload.get("reply");

        if (replyText == null || replyText.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Reply cannot be empty");
        }

        ticket.setAdminReply(replyText); // Sets only "tttt", not "{\"reply\":\"tttt\"}"
        ticket.setStatus("Resolved");
        ticket.setResolvedAt(LocalDateTime.now());

        return ResponseEntity.ok(supportQueryRepository.save(ticket));
    }
}