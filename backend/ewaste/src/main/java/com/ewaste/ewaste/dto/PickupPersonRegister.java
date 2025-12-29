// src/main/java/com/ewaste/ewaste/dto/PickupPersonRegisterDto.java
package com.ewaste.ewaste.dto;
import lombok.Data;
@Data
public class PickupPersonRegister {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String address;
    private String vehicleNumber;
}