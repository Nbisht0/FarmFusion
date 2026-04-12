package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET USER BY ID
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    // SAVE NEW USER
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // DELETE USER
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // UPDATE USER — only updates fields that are provided
    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);

        if (updatedUser.getName() != null) existing.setName(updatedUser.getName());
        if (updatedUser.getEmail() != null) existing.setEmail(updatedUser.getEmail());
        if (updatedUser.getPassword() != null) existing.setPassword(updatedUser.getPassword());
        if (updatedUser.getRole() != null) existing.setRole(updatedUser.getRole().toUpperCase());
        if (updatedUser.getAge() != null) existing.setAge(updatedUser.getAge());
        if (updatedUser.getGender() != null) existing.setGender(updatedUser.getGender());
        if (updatedUser.getPhone() != null) existing.setPhone(updatedUser.getPhone());
        if (updatedUser.getCity() != null) existing.setCity(updatedUser.getCity());
        if (updatedUser.getState() != null) existing.setState(updatedUser.getState());
        if (updatedUser.getAddress() != null) existing.setAddress(updatedUser.getAddress());
        if (updatedUser.getAadhaar() != null) existing.setAadhaar(updatedUser.getAadhaar());
        if (updatedUser.getProfileImage() != null) existing.setProfileImage(updatedUser.getProfileImage());

        return userRepository.save(existing);
    }
}