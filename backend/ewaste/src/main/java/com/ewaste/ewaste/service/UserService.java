package com.ewaste.ewaste.service;

import com.ewaste.ewaste.dto.ProfileUpdateRequest;
import com.ewaste.ewaste.model.PickupPerson;
import com.ewaste.ewaste.model.User;
import com.ewaste.ewaste.repository.PickupPersonRepository;
import com.ewaste.ewaste.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PickupPersonRepository pickupPersonRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with email: " + email));
        return UserDetailsImpl.build(user);
    }

    @Transactional
    public User updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 1. Update Basic Info
        if (request.getName() != null && !request.getName().isEmpty()) {
            user.setName(request.getName());
        }
        // Mapping 'contactInfo' from DTO to 'phoneNumber' in User model
        if (request.getContactInfo() != null && !request.getContactInfo().isEmpty()) {
            user.setPhoneNumber(request.getContactInfo());
        }
        // Mapping 'pickupAddress' from DTO to 'address' in User model
        if (request.getPickupAddress() != null && !request.getPickupAddress().isEmpty()) {
            user.setAddress(request.getPickupAddress());
        }

        // 2. Update Password (if provided)
        if (request.getCurrentPassword() != null && !request.getCurrentPassword().isEmpty() &&
                request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Incorrect current password");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        // 3. Update Pickup Person Vehicle (if applicable)
        if (request.getVehicleNumber() != null && user.getPickupPersonProfile() != null) {
            PickupPerson pp = user.getPickupPersonProfile();
            pp.setVehicleNumber(request.getVehicleNumber());
            pickupPersonRepository.save(pp);
        }

        return userRepository.save(user);
    }
}