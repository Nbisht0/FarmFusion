package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.Cart;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUserId(Long userId);
    void deleteByUserIdAndProductId(Long userId, Long productId);
}