package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.Service.ProductService;
import com.FarmFusion.FarmFusion.repository.UserRepository;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService service;
    private final UserRepository userRepository;

    public ProductController(ProductService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    // ---------------- ADD PRODUCT WITH IMAGE ----------------
    @PostMapping(
            value = "/addWithImage",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> addProduct(
            @RequestParam("name") String name,
            @RequestParam("quantity") int quantity,
            @RequestParam("price") double price,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("farmerId") Long farmerId,       // ✅ farmer must send their ID
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            // Fetch the farmer user
            User farmer = userRepository.findById(farmerId)
                    .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + farmerId));

            Products product = new Products();
            product.setName(name);
            product.setQuantity(quantity);
            product.setPrice(price);
            product.setDescription(description);
            product.setCategory(category);
            product.setAddedBy(farmer);  // ✅ link product to farmer

            Products saved = service.addProductWithImage(product, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Product upload failed: " + e.getMessage());
        }
    }

    // ---------------- GET ALL PRODUCTS ----------------
    @GetMapping
    public ResponseEntity<List<Products>> getAllProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    // ---------------- GET PRODUCTS BY FARMER ----------------
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Products>> getProductsByFarmer(@PathVariable Long farmerId) {
        return ResponseEntity.ok(service.getProductsByFarmerId(farmerId));
    }

    // ---------------- GET BY ID ----------------
    @GetMapping("/{id}")
    public ResponseEntity<Products> getProductById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------- UPDATE PRODUCT ----------------
    @PutMapping("/{id}")
    public ResponseEntity<Products> updateProduct(
            @PathVariable Long id,
            @RequestBody Products updatedProduct
    ) {
        try {
            return ResponseEntity.ok(service.update(id, updatedProduct));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // ---------------- DELETE PRODUCT ----------------
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}