package com.FarmFusion.FarmFusion.Service;

import com.FarmFusion.FarmFusion.entity.Address;
import com.FarmFusion.FarmFusion.exception.ResourceNotFoundException;
import com.FarmFusion.FarmFusion.repository.AddressRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;

    public AddressService(AddressRepository addressRepository) {
        this.addressRepository = addressRepository;
    }

    // GET ALL ADDRESSES
    public List<Address> getAllAddresses() {
        return addressRepository.findAll();
    }

    // GET SINGLE ADDRESS BY ID
    public Address getAddressById(Long id) {
        return addressRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Address not found: " + id));
    }

    // GET ALL ADDRESSES FOR A USER
    public List<Address> getAddressesByUserId(Long userId) {
        return addressRepository.findByUserId(userId);
    }

    // SAVE ADDRESS
    public Address saveAddress(Address address) {
        return addressRepository.save(address);
    }

    // UPDATE ADDRESS
    public Address updateAddress(Long id, Address updatedAddress) {
        Address existing = getAddressById(id);

        if (updatedAddress.getStreet() != null) existing.setStreet(updatedAddress.getStreet());
        if (updatedAddress.getCity() != null) existing.setCity(updatedAddress.getCity());
        if (updatedAddress.getState() != null) existing.setState(updatedAddress.getState());
        if (updatedAddress.getPincode() != null) existing.setPincode(updatedAddress.getPincode());
        if (updatedAddress.getCountry() != null) existing.setCountry(updatedAddress.getCountry());

        return addressRepository.save(existing);
    }

    // DELETE ADDRESS
    public void deleteAddress(Long id) {
        addressRepository.deleteById(id);
    }
}