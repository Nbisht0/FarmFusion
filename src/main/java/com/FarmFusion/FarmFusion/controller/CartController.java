package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.Service.CartService;
import com.FarmFusion.FarmFusion.entity.Cart;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    // GET cart by user
    @GetMapping("/{userId}")
    public ResponseEntity<List<Map<String, Object>>> getCart(@PathVariable Long userId) {
        List<Cart> items = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(items.stream().map(this::toResponse).collect(Collectors.toList()));
    }

    // ADD to cart
    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Long> body) {
        try {
            Long userId = body.get("userId");
            Long productId = body.get("productId");
            int quantity = body.containsKey("quantity") ? body.get("quantity").intValue() : 1;
            Cart saved = cartService.addToCart(userId, productId, quantity);
            return ResponseEntity.ok(toResponse(saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to add to cart: " + e.getMessage());
        }
    }

    // REMOVE from cart
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeFromCart(@RequestParam Long userId, @RequestParam Long productId) {
        try {
            cartService.removeFromCart(userId, productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to remove: " + e.getMessage());
        }
    }

    // CLEAR cart
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to clear cart: " + e.getMessage());
        }
    }

    private Map<String, Object> toResponse(Cart cart) {
        Map<String, Object> map = new HashMap<>();
        map.put("id", cart.getId());
        map.put("productId", cart.getProduct().getId());
        map.put("name", cart.getProduct().getName());
        map.put("price", cart.getProduct().getPrice());
        map.put("imageUrl", cart.getProduct().getImageUrl());
        map.put("quantity", cart.getQuantity());
        return map;
    }
}