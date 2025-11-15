package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Products, Long> {

    // JpaRepository already provides CRUD methods (save, findAll, findById, deleteById, etc.)

}


//Products → Entity it manages.
//Long → Type of the primary key (id).
//save(product) → INSERT or UPDATE
//findAll() → SELECT *
//findById(id) → SELECT WHERE id
//deleteById(id) → DELETE

