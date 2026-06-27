package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.dto.OrderRequestDTO;
import com.FarmFusion.FarmFusion.entity.*;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class OrdersService {

    private final OrdersRepository ordersRepository;
    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final ProductRepository productRepository;

    public OrdersService(OrdersRepository ordersRepository,
                         UserRepository userRepository,
                         AddressRepository addressRepository,
                         ProductRepository productRepository) {
        this.ordersRepository = ordersRepository;
        this.userRepository = userRepository;
        this.addressRepository = addressRepository;
        this.productRepository = productRepository;
    }

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll();
    }

    public Orders getOrderById(Long id) {
        return ordersRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found: " + id));
    }

    public List<Orders> getOrdersByCustomerId(Long customerId) {
        return ordersRepository.findByCustomer_Id(customerId);
    }

    public List<Orders> getOrdersByFarmerId(Long farmerId) {
        return ordersRepository.findOrdersByFarmerId(farmerId);
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

    // NEW: Place order from DTO — fetches managed entities before saving
    public Orders placeOrder(OrderRequestDTO dto) {
        User customer = userRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + dto.getCustomerId()));

        Address address = addressRepository.findById(dto.getAddressId())
                .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + dto.getAddressId()));

        Orders order = new Orders();
        order.setCustomer(customer);
        order.setDeliveryAddress(address);
        order.setStatus("PENDING");

        List<OrderItems> items = new ArrayList<>();
        for (OrderRequestDTO.OrderItemDTO itemDto : dto.getOrderItems()) {
            Products product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + itemDto.getProductId()));

            OrderItems item = new OrderItems();
            item.setOrder(order);
            item.setProduct(product);
            item.setQuantity(itemDto.getQuantity());
            item.setPrice(itemDto.getPrice());
            items.add(item);
        }

        order.setOrderItems(items); // also calls calculateTotalAmount()
        return ordersRepository.save(order);
    }
}