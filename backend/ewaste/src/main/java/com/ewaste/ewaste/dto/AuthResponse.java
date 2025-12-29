// src/main/java/com/ewaste/ewaste/dto/AuthResponse.java
package com.ewaste.ewaste.dto;
import com.ewaste.ewaste.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
@Data
@AllArgsConstructor
public class AuthResponse {
    private String accessToken;
    private User user;
}