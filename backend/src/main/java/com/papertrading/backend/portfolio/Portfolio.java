package com.papertrading.backend.portfolio;

import jakarta.persistence.*;

import com.papertrading.backend.user.User;

@Entity
@Table(
        name = "portfolio",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"user_id", "stockSymbol"})
        }
)
public class Portfolio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String stockSymbol;
    private Double quantity;
    private Double avgBuyPrice;

    //constructors
    public Portfolio(){}

    public Portfolio(User user, String symbol, Double quantity, Double avgBuyPrice) {
        this.user = user;
        this.stockSymbol = symbol;
        this.quantity = quantity;
        this.avgBuyPrice = avgBuyPrice;
    }

    public Long getId() {
        return id;
    }

    public String getSymbol() {
        return stockSymbol;
    }

    public void setSymbol(String symbol) {
        this.stockSymbol = symbol;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Double getAvgBuyPrice() { return avgBuyPrice; }

    public void setAvgBuyPrice(Double price) { this.avgBuyPrice = price; }

}
