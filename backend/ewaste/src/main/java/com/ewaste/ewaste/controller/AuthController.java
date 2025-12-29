package com.ewaste.ewaste.controller;

import com.ewaste.ewaste.dto.AuthResponse;
import com.ewaste.ewaste.dto.LoginRequest;
import com.ewaste.ewaste.dto.RegisterRequest;
import com.ewaste.ewaste.model.Role; // Ensure this matches your package (model vs models)
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.UserRepository;
import com.ewaste.ewaste.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        System.out.println("Login attempt for: " + loginRequest.getEmail()); // DEBUG LOG

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateJwtToken(authentication);

            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found after auth"));

            System.out.println("Login successful for: " + user.getName() + " Role: " + user.getRole()); // DEBUG LOG
            return ResponseEntity.ok(new AuthResponse(jwt, user));

        } catch (BadCredentialsException e) {
            System.err.println("Login Failed: Bad Credentials for " + loginRequest.getEmail()); // DEBUG LOG
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
        } catch (Exception e) {
            System.err.println("Login Error: " + e.getMessage()); // DEBUG LOG
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email is already in use!");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setPhoneNumber(signUpRequest.getPhone());
        user.setAddress(signUpRequest.getAddress());
        user.setRole(Role.ROLE_USER); // Default role for public registration

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully");
    }
}