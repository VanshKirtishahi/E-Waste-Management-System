package com.ewaste.ewaste.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {
    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try { Files.createDirectories(root); } catch (IOException e) { throw new RuntimeException("Could not init folder"); }
    }

    public String storeFile(MultipartFile file) {
        try {
            String filename = UUID.randomUUID() + "-" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), root.resolve(filename));
            return "/uploads/" + filename; // Return URL path
        } catch (Exception e) {
            throw new RuntimeException("Error storing file: " + e.getMessage());
        }
    }
}