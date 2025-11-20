package com.FarmFusion.FarmFusion.Service; // this service layer holds business logic (rules of the app)

import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // tells Spring that this class contains business logic and should be managed as a Spring bean
public class UserService {

    private final UserRepository userRepository;  // we need UserRepository to talk to the DB

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // --- CRUD Methods ---

    public List<User> getAllUsers() { // returns all users from DB
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // --- UPDATE METHODS ---

    // Upsert-style update: update allowed fields if provided
    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update only provided (non-null) fields
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        if (updatedUser.getPhone() != null) {
            existingUser.setPhone(updatedUser.getPhone());
        }
        if (updatedUser.getCity() != null) {
            existingUser.setCity(updatedUser.getCity());
        }
        if (updatedUser.getState() != null) {
            existingUser.setState(updatedUser.getState());
        }

        return userRepository.save(existingUser);
    }

    // Partial update (PATCH) - kept for semantic clarity if needed
    public User partiallyUpdateUser(Long id, User userDetails) {
        User user = userRepository.findById(id).orElseThrow(() ->
                new RuntimeException("User not found with id " + id));

        if (userDetails.getName() != null) user.setName(userDetails.getName());
        if (userDetails.getEmail() != null) user.setEmail(userDetails.getEmail());
        if (userDetails.getPassword() != null) user.setPassword(userDetails.getPassword());
        if (userDetails.getRole() != null) user.setRole(userDetails.getRole());

        return userRepository.save(user);
    }

}
