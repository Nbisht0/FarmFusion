package com.FarmFusion.FarmFusion.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "addresses")
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String street;
    private String city;
    private String state;
    private String pincode;

    // Link to User
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Address() {}

    public Address(String street, String city, String state, String zipcode, User user) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.pincode = zipcode;
        this.user = user;
    }


    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getStreet() { return street; }
    public void setStreet(String street) { this.street = street; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getZipcode() { return pincode; }
    public void setZipcode(String zipcode) { this.pincode = zipcode; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}
