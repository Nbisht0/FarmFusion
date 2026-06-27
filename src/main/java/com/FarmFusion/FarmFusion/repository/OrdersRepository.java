package com.FarmFusion.FarmFusion.repository;

import com.FarmFusion.FarmFusion.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {
    List<Orders> findByCustomer_Id(Long customerId);
    List<Orders> findByStatus(String status);

    // Fetch all orders that contain at least one product listed by this farmer
    @Query("SELECT DISTINCT o FROM Orders o " +
            "JOIN o.orderItems oi " +
            "JOIN oi.product p " +
            "WHERE p.addedBy.id = :farmerId")
    List<Orders> findOrdersByFarmerId(@Param("farmerId") Long farmerId);
}