package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.repository.ProductRepository;
import com.FarmFusion.FarmFusion.repository.UserRepository;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class FarmerProductController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private Cloudinary cloudinary;

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("price") Double price,
            @RequestParam("quantity") Integer quantity,
            @RequestParam("category") String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("farmerId") Long farmerId
    ) {
        try {
            // find farmer
            User farmer = userRepository.findById(farmerId)
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));

            // upload image
            String imageUrl = null;
            if (image != null && !image.isEmpty()) {
                Map uploadResult = cloudinary.uploader().upload(
                        image.getBytes(),
                        ObjectUtils.asMap("folder", "farmfusion_products")
                );
                imageUrl = uploadResult.get("secure_url").toString();
            }

            // create product
            Products product = new Products();
            product.setName(name);
            product.setPrice(price);
            product.setQuantity(quantity);
            product.setCategory(category);
            product.setImageUrl(imageUrl);
            product.setAddedBy(farmer);

            // save product
            Products savedProduct = productRepository.save(product);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("product", savedProduct);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
