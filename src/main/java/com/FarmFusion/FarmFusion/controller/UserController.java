package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.Service.UserService;
import com.FarmFusion.FarmFusion.config.JwtUtil;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;
    private final JwtUtil jwtUtil;

    public UserController(UserRepository userRepository, UserService userService, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    // -------------------- REGISTER --------------------
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(response(false, "Email already registered", null));
        }

        if (user.getRole() == null ||
                !(user.getRole().equalsIgnoreCase("FARMER") ||
                        user.getRole().equalsIgnoreCase("CUSTOMER"))) {
            return ResponseEntity.badRequest().body(response(false, "Role must be FARMER or CUSTOMER", null));
        }

        if (user.getRole().equalsIgnoreCase("FARMER")) {
            if (user.getAadhaar() == null || user.getAddress() == null) {
                return ResponseEntity.badRequest().body(response(false, "Farmers must provide Aadhaar and Address", null));
            }
        }

        if (user.getRole().equalsIgnoreCase("CUSTOMER")) {
            if (user.getAge() == null || user.getGender() == null) {
                return ResponseEntity.badRequest().body(response(false, "Customers must provide Age and Gender", null));
            }
        }

        user.setRole(user.getRole().toUpperCase());

        User saved = userService.saveUser(user);
        return ResponseEntity.ok(response(true, null, sanitize(saved)));
    }

    // -------------------- LOGIN --------------------
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {

        User user = userRepository.findByEmail(loginReq.getEmail()).orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(response(false, "User not found", null));
        }

        if (!userService.checkPassword(loginReq.getPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(response(false, "Invalid password", null));
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        Map<String, Object> resp = response(true, null, sanitize(user));
        resp.put("token", token);

        return ResponseEntity.ok(resp);
    }

    // -------------------- GET PROFILE --------------------
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {
        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.badRequest().body(response(false, "User not found", null));
        }

        return ResponseEntity.ok(response(true, null, sanitize(user)));
    }

    // -------------------- UPDATE PROFILE --------------------
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            User saved = userService.updateUser(id, updatedUser);
            return ResponseEntity.ok(response(true, null, sanitize(saved)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(response(false, e.getMessage(), null));
        }
    }

    // -------------------- UPDATE PROFILE IMAGE ONLY --------------------
    // Body: { "profileImage": "https://res.cloudinary.com/..." }
    @PutMapping("/{id}/profile-image")
    public ResponseEntity<?> updateProfileImage(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String imageUrl = body.get("profileImage");

        if (imageUrl == null || imageUrl.isBlank()) {
            return ResponseEntity.badRequest().body(response(false, "profileImage URL is required", null));
        }

        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().body(response(false, "User not found", null));
        }

        user.setProfileImage(imageUrl);
        User saved = userRepository.save(user);

        return ResponseEntity.ok(response(true, null, sanitize(saved)));
    }

    // -------------------- HELPERS --------------------
    private User sanitize(User user) {
        User safe = new User();
        safe.setId(user.getId());
        safe.setName(user.getName());
        safe.setEmail(user.getEmail());
        safe.setRole(user.getRole());
        safe.setPhone(user.getPhone());
        safe.setAge(user.getAge());
        safe.setGender(user.getGender());
        safe.setCity(user.getCity());
        safe.setState(user.getState());
        safe.setAddress(user.getAddress());
        safe.setAadhaar(user.getAadhaar());
        safe.setProfileImage(user.getProfileImage());
        return safe;
    }

    private Map<String, Object> response(boolean success, String message, Object data) {
        Map<String, Object> map = new HashMap<>();
        map.put("success", success);
        if (message != null) map.put("message", message);
        if (data != null) map.put("user", data);
        return map;
    }
}