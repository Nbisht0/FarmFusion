package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.Service.UserService;
import com.FarmFusion.FarmFusion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3001")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Map<String, Object> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            response.put("success", false);
            response.put("message", "Email already registered!");
            return response;
        }

        userRepository.save(user);
        response.put("success", true);
        response.put("message", "Registered successfully!");
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> loginUser(@RequestBody Map<String, String> credentials) {
        Map<String, Object> response = new HashMap<>();
        String emailOrName = credentials.get("email");
        String password = credentials.get("password");

        Optional<User> existingUser = userRepository.findByEmail(emailOrName);
        if (existingUser.isEmpty()) {
            existingUser = userRepository.findByName(emailOrName);
        }

        if (existingUser.isPresent() && existingUser.get().getPassword().equals(password)) {
            response.put("success", true);
            response.put("user", existingUser.get());
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials!");
        }

        return response;
    }

    @GetMapping("/test")
    public String testAPI() {
        return "UserController is working!";
    }

    @PutMapping("/update/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        Map<String, Object> response = new HashMap<>();
        try {
            User savedUser = userService.updateUser(id, updatedUser);
            response.put("success", true);
            response.put("user", savedUser);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
        }
        return response;
    }

}
