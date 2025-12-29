// backend/ewaste/src/main/java/com/ewaste/ewaste/controller/AdminController.java
package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.PickupPersonRegister;
import com.ewaste.ewaste.model.PickupPerson;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.UserRepository;
import com.ewaste.ewaste.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/pickup-persons")
    public ResponseEntity<?> getPickupPersons() {
        List<PickupPerson> persons = adminService.getAllPickupPersons();
        return ResponseEntity.ok(persons);
    }

    @PostMapping("/register-pickup-person")
    public ResponseEntity<?> registerPickupPerson(@RequestBody PickupPersonRegister request) {
        System.out.println("Received Registration Request for: " + request.getEmail());
        System.out.println("Data: " + request.toString()); // Ensure toString() is available via @Data

        try {
            User savedUser = adminService.registerPickupPerson(request);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            e.printStackTrace(); // Log the error
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // --- USER MANAGEMENT ENDPOINTS ---

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        userRepository.deleteById(id);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            String newStatus = payload.get("status");
            adminService.updateUserStatus(id, newStatus);
            return ResponseEntity.ok("User status updated");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        try {
            User updatedUser = adminService.updateUser(id, updates);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}