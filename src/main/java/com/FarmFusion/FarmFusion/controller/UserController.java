package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.Service.UserService;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(
        origins = "http://localhost:3000",
        allowCredentials = "true"
)
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        // CHECK IF EMAIL EXISTS
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    new java.util.HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Email already registered");
                    }}
            );
        }

        // ROLE VALIDATION
        if (user.getRole() == null ||
                !(user.getRole().equalsIgnoreCase("FARMER") ||
                        user.getRole().equalsIgnoreCase("CUSTOMER"))) {

            return ResponseEntity.badRequest().body(
                    new java.util.HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Role must be FARMER or CUSTOMER");
                    }}
            );
        }

        // FARMER VALIDATION
        if (user.getRole().equalsIgnoreCase("FARMER")) {
            if (user.getAadhaar() == null || user.getAddress() == null) {
                return ResponseEntity.badRequest().body(
                        new java.util.HashMap<String, Object>() {{
                            put("success", false);
                            put("message", "Farmers must provide Aadhaar and Address");
                        }}
                );
            }
        }

        // CUSTOMER VALIDATION
        if (user.getRole().equalsIgnoreCase("CUSTOMER")) {
            if (user.getAge() == null || user.getGender() == null) {
                return ResponseEntity.badRequest().body(
                        new java.util.HashMap<String, Object>() {{
                            put("success", false);
                            put("message", "Customers must provide Age and Gender");
                        }}
                );
            }
        }

        // SAVE USER
        User saved = userService.saveUser(user);

        return ResponseEntity.ok(
                new java.util.HashMap<String, Object>() {{
                    put("success", true);
                    put("user", saved);
                }}
        );
    }


    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginReq) {

        User user = userRepository.findByEmail(loginReq.getEmail())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(
                    new java.util.HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "User not found");
                    }}
            );
        }

        if (!user.getPassword().equals(loginReq.getPassword())) {
            return ResponseEntity.badRequest().body(
                    new java.util.HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "Invalid password");
                    }}
            );
        }

        // REMOVE SENSITIVE FIELDS
        User safeUser = new User();
        safeUser.setId(user.getId());
        safeUser.setName(user.getName());
        safeUser.setEmail(user.getEmail());
        safeUser.setRole(user.getRole());
        safeUser.setPhone(user.getPhone());
        safeUser.setAge(user.getAge());
        safeUser.setGender(user.getGender());
        safeUser.setCity(user.getCity());
        safeUser.setState(user.getState());
        safeUser.setAddress(user.getAddress());
        safeUser.setAadhaar(user.getAadhaar());
        safeUser.setProfileImage(user.getProfileImage());

        return ResponseEntity.ok(
                new java.util.HashMap<String, Object>() {{
                    put("success", true);
                    put("user", safeUser);
                }}
        );
    }

    // GET PROFILE
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id) {

        User user = userService.getUserById(id);

        if (user == null) {
            return ResponseEntity.badRequest().body(
                    new java.util.HashMap<String, Object>() {{
                        put("success", false);
                        put("message", "User not found");
                    }}
            );
        }

        // REMOVE PASSWORD BEFORE SENDING
        User safeUser = new User();
        safeUser.setId(user.getId());
        safeUser.setName(user.getName());
        safeUser.setEmail(user.getEmail());
        safeUser.setRole(user.getRole());
        safeUser.setPhone(user.getPhone());
        safeUser.setAge(user.getAge());
        safeUser.setGender(user.getGender());
        safeUser.setCity(user.getCity());
        safeUser.setState(user.getState());
        safeUser.setAddress(user.getAddress());
        safeUser.setAadhaar(user.getAadhaar());
        safeUser.setProfileImage(user.getProfileImage());

        return ResponseEntity.ok(
                new java.util.HashMap<String, Object>() {{
                    put("success", true);
                    put("user", safeUser);
                }}
        );
    }
    // UPDATE PROFILE
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {

        try {
            User saved = userService.updateUser(id, updatedUser);

            return ResponseEntity.ok(
                    new java.util.HashMap<String, Object>() {{
                        put("success", true);
                        put("user", saved);
                    }}
            );

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    new java.util.HashMap<String, Object>() {{
                        put("success", false);
                        put("message", e.getMessage());
                    }}
            );
        }
    }


}
