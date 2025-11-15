package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.Service.Productservice;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/products")
public class ProductController {

    private final Productservice service;

    public ProductController(Productservice service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Products> create(@Valid @RequestBody Products product) {
        return ResponseEntity.ok(service.create(product));
    }

    @GetMapping
    public ResponseEntity<List<Products>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Products> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Products> update(@PathVariable Long id,
                                          @Valid @RequestBody Products product) {
        return ResponseEntity.ok(service.update(id, product));
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam String name,
            @RequestParam Double price,
            @RequestParam("image") MultipartFile imageFile
    ) {
        try {
            Collections ObjectUtils;
            Map uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = uploadResult.get("secure_url").toString();

            Products product = new Products();
            product.setName(name);
            product.setPrice(price);
            product.setImageUrl(imageUrl);

            ProductRepository.save(product);

            return ResponseEntity.ok(product);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
