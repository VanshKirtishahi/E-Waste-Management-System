// src/main/java/com/ewaste/ewaste/dto/LoginRequest.java
package com.ewaste.ewaste.dto;
import lombok.Data;
@Data
public class LoginRequest {
    private String email;
    private String password;
}