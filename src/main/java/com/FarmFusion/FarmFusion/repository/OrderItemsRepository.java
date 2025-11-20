package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.OrderItems;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemsRepository extends JpaRepository<OrderItems, Long> {
}
