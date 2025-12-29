package com.ewaste.ewaste.dto;
public class MessageResponse {
    private String message;
    public MessageResponse(String message) { this.message = message; }
    // Getter & Setter
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}