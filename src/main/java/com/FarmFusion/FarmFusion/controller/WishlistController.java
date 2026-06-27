package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.Service.WishlistService;
import com.FarmFusion.FarmFusion.entity.Wishlist;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "http://localhost:3000")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    // ---------------- GET WISHLIST BY USER ----------------
    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getWishlist(@PathVariable Long userId) {
        List<Wishlist> items = wishlistService.getByUserId(userId);
        return ResponseEntity.ok(items.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    // ---------------- ADD TO WISHLIST ----------------
    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(@RequestBody Map<String, Long> body) {
        try {
            Long userId = body.get("userId");
            Long productId = body.get("productId");
            Wishlist saved = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to add to wishlist: " + e.getMessage());
        }
    }

    // ---------------- REMOVE FROM WISHLIST ----------------
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromWishlist(
            @RequestParam Long userId,
            @RequestParam Long productId
    ) {
        try {
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to remove from wishlist: " + e.getMessage());
        }
    }

    // ---------------- HELPER: shape response for frontend ----------------
    private Map<String, Object> toResponse(Wishlist w) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", w.getId());
        map.put("productId", w.getProduct().getId());
        map.put("name", w.getProduct().getName());
        map.put("price", w.getProduct().getPrice());
        map.put("imageUrl", w.getProduct().getImageUrl());
        return map;
    }
}