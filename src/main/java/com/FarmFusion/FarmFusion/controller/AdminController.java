package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.Service.AdminService;
import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ---------------- FARMER MANAGEMENT ----------------

    // GET /api/admin/farmers  -> list all farmers for review
    @GetMapping("/farmers")
    public ResponseEntity<List<User>> getAllFarmers() {
        return ResponseEntity.ok(adminService.getAllFarmers());
    }

    // PUT /api/admin/farmers/{id}/approve
    @PutMapping("/farmers/{id}/approve")
    public ResponseEntity<?> approveFarmer(@PathVariable Long id) {
        try {
            User updated = adminService.approveFarmer(id);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/admin/farmers/{id}/block
    @PutMapping("/farmers/{id}/block")
    public ResponseEntity<?> blockFarmer(@PathVariable Long id) {
        try {
            User updated = adminService.blockFarmer(id);
            return ResponseEntity.ok(updated);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ---------------- PRODUCT MODERATION ----------------

    // GET /api/admin/products?page=0&size=12  -> all products, paginated
    @GetMapping("/products")
    public ResponseEntity<Page<Products>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        return ResponseEntity.ok(adminService.getAllProductsForAdmin(pageable));
    }

    // DELETE /api/admin/products/{id}  -> remove an inappropriate product
    @DeleteMapping("/products/{id}")
    public ResponseEntity<?> removeProduct(@PathVariable Long id) {
        try {
            adminService.removeProduct(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ---------------- ORDER OVERVIEW ----------------

    // GET /api/admin/orders/stats  -> total orders, total revenue, breakdown by status
    @GetMapping("/orders/stats")
    public ResponseEntity<Map<String, Object>> getOrderStats() {
        return ResponseEntity.ok(adminService.getOrderStats());
    }
}