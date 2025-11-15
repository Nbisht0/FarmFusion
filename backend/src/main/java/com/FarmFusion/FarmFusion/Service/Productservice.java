package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.Products;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Productservice {

    private final ProductRepository repo;

    public Productservice(ProductRepository repo) {
        this.repo = repo;
    }

    public Products create(Products p) {
        p.setId(null); // ensure insert
        return repo.save(p);
    }


    public List<Products> getAll() {
        return repo.findAll();
    }

    public Products getById(Long id) {
        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id " + id));
    }

    public Products update(Long id, Products updated) {
        Products existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        return repo.save(existing);
    }

    public void delete(Long id) {
        Products existing = getById(id);
        repo.delete(existing);
    }

}
