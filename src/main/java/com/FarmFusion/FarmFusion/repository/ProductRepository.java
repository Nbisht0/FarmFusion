package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Products, Long> {

    // Get all products by a specific farmer
    List<Products> findByAddedById(Long farmerId);

    // Get all products by category
    List<Products> findByCategory(String category);

    // Search products by name (case insensitive)
    List<Products> findByNameContainingIgnoreCase(String name);

}