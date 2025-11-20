package com.FarmFusion.FarmFusion.repository;


import com.FarmFusion.FarmFusion.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrdersRepository extends JpaRepository<Orders, Long> {

}
