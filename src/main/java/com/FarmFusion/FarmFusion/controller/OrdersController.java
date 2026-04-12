package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.Orders;
import com.FarmFusion.FarmFusion.Service.OrdersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrdersController {

    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    // GET ALL ORDERS (admin use)
    @GetMapping
    public ResponseEntity<List<Orders>> getAllOrders() {
        return ResponseEntity.ok(ordersService.getAllOrders());
    }

    // GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ordersService.getOrderById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with id: " + id);
        }
    }

    // GET ALL ORDERS FOR A SPECIFIC CUSTOMER
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<Orders>> getOrdersByCustomer(@PathVariable Long customerId) {
        return ResponseEntity.ok(ordersService.getOrdersByCustomerId(customerId));
    }

    // PLACE A NEW ORDER
    @PostMapping
    public ResponseEntity<?> addOrder(@RequestBody Orders order) {
        try {
            Orders saved = ordersService.saveOrder(order);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to place order: " + e.getMessage());
        }
    }

    // UPDATE ORDER STATUS (e.g. CONFIRMED, SHIPPED, DELIVERED)
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Orders updated = ordersService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with id: " + id);
        }
    }

    // DELETE ORDER
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            ordersService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order not found with id: " + id);
        }
    }
}