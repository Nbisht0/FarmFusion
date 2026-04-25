package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.Orders;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.OrdersRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrdersService {

    private final OrdersRepository ordersRepository;

    public OrdersService(OrdersRepository ordersRepository) {
        this.ordersRepository = ordersRepository;
    }

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    public Orders getOrderById(Long id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    public List<Orders> getOrdersByCustomerId(Long customerId) {
        return ordersRepository.findByCustomerId(customerId);
    }

    public Orders saveOrder(Orders order) {
        order.calculateTotalAmount();
        return ordersRepository.save(order);
    }

    public Orders updateOrderStatus(Long id, String status) {
        Orders order = getOrderById(id);
        order.setStatus(status.toUpperCase());
        return ordersRepository.save(order);
    }

    public void deleteOrder(Long id) {
        ordersRepository.deleteById(id);
    }
}