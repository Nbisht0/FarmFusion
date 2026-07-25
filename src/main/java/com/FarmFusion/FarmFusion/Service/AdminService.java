package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.Orders;
import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.OrdersRepository;
import com.FarmFusion.FarmFusion.repository.ProductRepository;
import com.FarmFusion.FarmFusion.repository.UserRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrdersRepository ordersRepository;

    public AdminService(UserRepository userRepository, ProductRepository productRepository, OrdersRepository ordersRepository) {
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.ordersRepository = ordersRepository;
    }

    // ---------------- FARMER MANAGEMENT ----------------

    // Get all farmers (sanitized - no password) so admin can review and approve/block
    public List<User> getAllFarmers() {
        List<User> farmers = userRepository.findByRole("FARMER");
        farmers.forEach(this::sanitize);
        return farmers;
    }

    public User approveFarmer(Long farmerId) {
        User farmer = getFarmerOrThrow(farmerId);
        farmer.setStatus("ACTIVE");
        User saved = userRepository.save(farmer);
        return sanitize(saved);
    }

    public User blockFarmer(Long farmerId) {
        User farmer = getFarmerOrThrow(farmerId);
        farmer.setStatus("BLOCKED");
        User saved = userRepository.save(farmer);
        return sanitize(saved);
    }

    private User getFarmerOrThrow(Long farmerId) {
        User user = userRepository.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found: " + farmerId));
        if (!"FARMER".equalsIgnoreCase(user.getRole())) {
            throw new IllegalArgumentException("User " + farmerId + " is not a farmer");
        }
        return user;
    }

    // Strip sensitive fields before sending to frontend (password never leaves the backend)
    private User sanitize(User user) {
        user.setPassword(null);
        return user;
    }

    // ---------------- PRODUCT MODERATION ----------------

    // Get all products (paginated), same shape as the public /products endpoint
    public Page<Products> getAllProductsForAdmin(Pageable pageable) {
        return productRepository.findAll(pageable);
    }

    // Remove an inappropriate product
    public void removeProduct(Long productId) {
        if (!productRepository.existsById(productId)) {
            throw new ResourceNotFoundException("Product not found: " + productId);
        }
        productRepository.deleteById(productId);
    }

    // ---------------- ORDER OVERVIEW / STATS ----------------

    public Map<String, Object> getOrderStats() {
        List<Orders> allOrders = ordersRepository.findAll();

        long totalOrders = allOrders.size();

        double totalRevenue = allOrders.stream()
                .filter(o -> !"CANCELLED".equalsIgnoreCase(o.getStatus()))
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        Map<String, Long> ordersByStatus = new HashMap<>();
        for (Orders o : allOrders) {
            String status = o.getStatus() != null ? o.getStatus() : "UNKNOWN";
            ordersByStatus.merge(status, 1L, Long::sum);
        }

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", totalOrders);
        stats.put("totalRevenue", totalRevenue);
        stats.put("ordersByStatus", ordersByStatus);

        return stats;
    }
}