package com.FarmFusion.FarmFusion.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "farmer_products")
public class FarmerProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private double price;

    private double quantity;

    @Column(columnDefinition = "LONGTEXT")
    private String image;  // base64 string

    private Long farmerId; // linking product to farmer user

    public FarmerProduct() {}

    public FarmerProduct(String name, double price, double quantity, String image, Long farmerId) {
        this.name = name;
        this.price = price;
        this.quantity = quantity;
        this.image = image;
        this.farmerId = farmerId;
    }

    // ---------------------------
    // Getters & Setters
    // ---------------------------

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }

    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }

    public void setPrice(double price) { this.price = price; }

    public double getQuantity() { return quantity; }

    public void setQuantity(double quantity) { this.quantity = quantity; }

    public String getImage() { return image; }

    public void setImage(String image) { this.image = image; }

    public Long getFarmerId() { return farmerId; }

    public void setFarmerId(Long farmerId) { this.farmerId = farmerId; }
}
