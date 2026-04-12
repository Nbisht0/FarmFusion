package com.FarmFusion.FarmFusion.controller;

import com.FarmFusion.FarmFusion.entity.Address;
import com.FarmFusion.FarmFusion.Service.AddressService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = "http://localhost:3000")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    // GET ALL ADDRESSES (admin use)
    @GetMapping
    public ResponseEntity<List<Address>> getAllAddresses() {
        return ResponseEntity.ok(addressService.getAllAddresses());
    }

    // GET SINGLE ADDRESS BY ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAddressById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(addressService.getAddressById(id));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found with id: " + id);
        }
    }

    // GET ALL ADDRESSES FOR A SPECIFIC USER
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Address>> getAddressesByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(addressService.getAddressesByUserId(userId));
    }

    // ADD NEW ADDRESS
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody Address address) {
        try {
            Address saved = addressService.saveAddress(address);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to save address: " + e.getMessage());
        }
    }

    // UPDATE ADDRESS
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Long id, @RequestBody Address updatedAddress) {
        try {
            Address updated = addressService.updateAddress(id, updatedAddress);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found with id: " + id);
        }
    }

    // DELETE ADDRESS
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Long id) {
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Address not found with id: " + id);
        }
    }
}