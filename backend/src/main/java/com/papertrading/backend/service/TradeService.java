package com.papertrading.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.papertrading.backend.trade.Trade;
import com.papertrading.backend.user.User;
import com.papertrading.backend.portfolio.Portfolio;
import com.papertrading.backend.user.UserRepository;
import com.papertrading.backend.trade.TradeRepository;
import com.papertrading.backend.portfolio.PortfolioRepository;

import com.papertrading.backend.dto.BuyStockRequest;
import com.papertrading.backend.dto.SellStockRequest;


@Service
public class TradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    public List<Trade> getAllTrades(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
        return tradeRepository.findByUser_idOrderByTimestampDesc(userId);
    }

    public void buyStock(BuyStockRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
        Double totalCost = request.getQuantity()*request.getPrice();

        if (user.getBalance()<totalCost) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient balance"
            );
        }

        user.setBalance(user.getBalance() - totalCost);

        Portfolio portfolio = portfolioRepository
                .findByUserAndStockSymbol(user, request.getSymbol())
                .orElse(null);

        if (portfolio == null) {
            portfolio = new Portfolio(user, request.getSymbol(), request.getQuantity(), request.getPrice());
        } else {
            Double newAvgBuyPrice = ( portfolio.getAvgBuyPrice()* portfolio.getQuantity() + totalCost )/(portfolio.getQuantity() + request.getQuantity()) ;
            portfolio.setAvgBuyPrice(newAvgBuyPrice);
            portfolio.setQuantity(portfolio.getQuantity() + request.getQuantity());
        }
        portfolioRepository.save(portfolio);


        Trade trade = new Trade();
        trade.setUser(user);
        trade.setStockSymbol(request.getSymbol());
        trade.setQuantity(request.getQuantity());
        trade.setPrice(request.getPrice());
        trade.setType("BUY");
        trade.setTimestamp(LocalDateTime.now());

        tradeRepository.save(trade);
    }

    public void sellStock(SellStockRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        Portfolio portfolio = portfolioRepository
                .findByUserAndStockSymbol(user, request.getSymbol())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Stock not owned"
                ));

        if (portfolio.getQuantity() < request.getQuantity()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Not enough shares"
            );
        }

        portfolio.setQuantity(portfolio.getQuantity() - request.getQuantity());

        double total = request.getQuantity() * request.getPrice();

        user.setBalance(user.getBalance() + total);

        portfolioRepository.save(portfolio);

        Trade trade = new Trade();
        trade.setUser(user);
        trade.setStockSymbol(request.getSymbol());
        trade.setQuantity(request.getQuantity());
        trade.setPrice(request.getPrice());
        trade.setType("SELL");
        trade.setTimestamp(java.time.LocalDateTime.now());

        tradeRepository.save(trade);
    }
}
