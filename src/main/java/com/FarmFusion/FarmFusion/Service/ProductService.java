package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.entity.User;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.ProductRepository;
import com.FarmFusion.FarmFusion.repository.UserRepository;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {

    private final ProductRepository repo;
    private final UserRepository userRepo;
    private final Cloudinary cloudinary;

    public ProductService(ProductRepository repo, UserRepository userRepo, Cloudinary cloudinary) {
        this.repo = repo;
        this.userRepo = userRepo;
        this.cloudinary = cloudinary;
    }

    // ADD PRODUCT WITH CLOUDINARY IMAGE UPLOAD
    public Products addProductWithImage(Products product, MultipartFile imageFile) throws IOException {

        if (imageFile != null && !imageFile.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(
                    imageFile.getInputStream(),
                    ObjectUtils.asMap(
                            "folder", "farmfusion/products",
                            "resource_type", "image"
                    )
            );
            String imageUrl = uploadResult.get("secure_url").toString();
            product.setImageUrl(imageUrl);
        }

        return repo.save(product);
    }

    // ADD PRODUCT FOR FARMER (without image)
    public Products addProductForFarmer(Products product, Long farmerId) {
        User farmer = userRepo.findById(farmerId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmer not found: " + farmerId));
        product.setAddedBy(farmer);
        return repo.save(product);
    }

    // GET ALL PRODUCTS (for consumer browse)
    public List<Products> getAllProducts() {
        return repo.findAll();
    }

    // GET PRODUCTS BY FARMER ID (for farmer dashboard)
    public List<Products> getProductsByFarmerId(Long farmerId) {
        return repo.findByAddedById(farmerId);
    }

    // GET SINGLE PRODUCT BY ID
    public Products getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    }

    // UPDATE PRODUCT
    public Products update(Long id, Products updatedProduct) {
        Products existing = getById(id);
        existing.setName(updatedProduct.getName());
        existing.setDescription(updatedProduct.getDescription());
        existing.setPrice(updatedProduct.getPrice());
        existing.setQuantity(updatedProduct.getQuantity());
        existing.setCategory(updatedProduct.getCategory());
        existing.setImageUrl(updatedProduct.getImageUrl());
        return repo.save(existing);
    }

    // DELETE PRODUCT
    public void delete(Long id) {
        repo.deleteById(id);
    }

    // GET PRODUCTS BY CATEGORY
    public List<Products> getByCategory(String category) {
        return repo.findByCategory(category);
    }

    public void saveProduct(Products product) {
        repo.save(product);
    }
}