package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomerId(Long customerId);
    List<Orders> findByStatus(String status);
}