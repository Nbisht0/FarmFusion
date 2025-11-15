package com.FarmFusion.FarmFusion.controller;



import com.FarmFusion.FarmFusion.entity.OrderItems;
import com.FarmFusion.FarmFusion.Service.OrderItemsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemsService orderItemsService;

        public OrderItemController(OrderItemsService orderItemsService) {
            this.orderItemsService = orderItemsService;
        }

        @GetMapping
        public List<OrderItems> getAllOrderItems() {
            return orderItemsService.getAllOrderItems();
        }

        @GetMapping("/{id}")
        public OrderItems getOrderItemById(@PathVariable Long id) {
            return orderItemsService.getOrderItemById(id);
        }

        @PostMapping
        public OrderItems addOrderItem(@RequestBody OrderItems orderItem) {
            return orderItemsService.saveOrderItem(orderItem);
        }

        @DeleteMapping("/{id}")
        public void deleteOrderItem(@PathVariable Long id) {
            orderItemsService.deleteOrderItem(id);
        }
}
