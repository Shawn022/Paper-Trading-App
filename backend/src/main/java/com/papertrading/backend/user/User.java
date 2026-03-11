package com.papertrading.backend.user;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true,nullable = false)
    private String email;

    private String password;

    private Double balance;

    @Column(nullable = false,updatable = false)
    private LocalDateTime createdAt;

    //constructors
    public User() {}

    public User(String name,String email,String password){
        this.name=name;
        this.email=email;
        this.password=password;
        this.balance = 100000.00;
        createdAt = LocalDateTime.now();

    }

    //getters and setters

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword(){
        return password;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}
