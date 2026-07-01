package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.Service.ProductService;
import com.FarmFusion.FarmFusion.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/products")

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
            @RequestParam("farmerId") Long farmerId,
            @RequestParam("imageFile") MultipartFile imageFile
    ) {
        try {
            User farmer = userRepository.findById(farmerId)
                    .orElseThrow(() -> new RuntimeException("Farmer not found with id: " + farmerId));

            Products product = new Products();
            product.setName(name);
            product.setQuantity(quantity);
            product.setPrice(price);
            product.setDescription(description);
            product.setCategory(category);
            product.setAddedBy(farmer);

            Products saved = service.addProductWithImage(product, imageFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Product upload failed: " + e.getMessage());
        }
    }

    // ---------------- ADD PRODUCT (JSON with imageUrl already uploaded) ----------------
    @PostMapping("/add")
    public ResponseEntity<?> addProductJson(@RequestBody Products product) {
        try {
            if (product.getAddedBy() == null || product.getAddedBy().getId() == null) {
                return ResponseEntity.badRequest().body("Farmer ID is required");
            }
            User farmer = userRepository.findById(product.getAddedBy().getId())
                    .orElseThrow(() -> new RuntimeException("Farmer not found"));
            product.setAddedBy(farmer);
            Products saved = service.addProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add product: " + e.getMessage());
        }
    }

    // ---------------- GET ALL PRODUCTS (PAGINATED) ----------------
    @GetMapping
    public ResponseEntity<Page<Products>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Products> productPage = service.getAllProducts(pageable);
        return ResponseEntity.ok(productPage);
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