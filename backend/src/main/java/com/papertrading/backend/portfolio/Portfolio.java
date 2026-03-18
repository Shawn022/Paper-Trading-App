package com.papertrading.backend.portfolio;

import jakarta.persistence.*;
import java.math.BigDecimal;

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
    private BigDecimal quantity;
    private BigDecimal avgBuyPrice;

    //constructors
    public Portfolio(){}

    public Portfolio(User user, String symbol, BigDecimal quantity, BigDecimal avgBuyPrice) {
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

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public BigDecimal getAvgBuyPrice() { return avgBuyPrice; }

    public void setAvgBuyPrice(BigDecimal price) { this.avgBuyPrice = price; }

    public BigDecimal getTotal(){
        return quantity.multiply(avgBuyPrice);
    }

}
