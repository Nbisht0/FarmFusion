package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.OrderItems;
import com.FarmFusion.FarmFusion.repository.OrderItemsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderItemsService {
    private final OrderItemsRepository orderItemsRepository;

    public OrderItemsService(OrderItemsRepository orderItemsRepository) {
        this.orderItemsRepository = orderItemsRepository;
    }

    public List<OrderItems> getAllOrderItems() {
        return orderItemsRepository.findAll();
    }

    public OrderItems getOrderItemById(Long id) {
        return orderItemsRepository.findById(id).orElse(null);
    }

    public OrderItems saveOrderItem(OrderItems orderItem) {
        return orderItemsRepository.save(orderItem);
    }

    public void deleteOrderItem(Long id) {
        orderItemsRepository.deleteById(id);
    }

}
