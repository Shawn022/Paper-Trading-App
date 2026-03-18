package com.papertrading.backend.service;

import com.papertrading.backend.dto.stock.StockPriceResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.papertrading.backend.trade.Trade;
import com.papertrading.backend.user.User;
import com.papertrading.backend.portfolio.Portfolio;
import com.papertrading.backend.user.UserRepository;
import com.papertrading.backend.trade.TradeRepository;
import com.papertrading.backend.portfolio.PortfolioRepository;
import com.papertrading.backend.service.stock.StockCache;

import com.papertrading.backend.dto.trade.*;


@Service
public class TradeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TradeRepository tradeRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private StockCache stockCache;

    public List<GetTradeResponse> getAllTrades(Long userId){
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
        BigDecimal price = stockCache.getStock( request.getSymbol() ).getPrice();
        BigDecimal totalCost = request.getQuantity().multiply(price) ;

        if (user.getBalance().compareTo(totalCost) < 0 ) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Insufficient balance"
            );
        }

        user.setBalance(user.getBalance().subtract(totalCost) );

        Portfolio portfolio = portfolioRepository
                .findByUserAndStockSymbol(user, request.getSymbol())
                .orElse(null);

        if (portfolio == null) {
            portfolio = new Portfolio(user, request.getSymbol(), request.getQuantity(), price);
        } else {
            BigDecimal newAvgBuyPrice = ( portfolio.getTotal().add(totalCost) )
                    .divide(portfolio.getQuantity().add(request.getQuantity()), 2, RoundingMode.HALF_UP);
            portfolio.setAvgBuyPrice(newAvgBuyPrice);
            portfolio.setQuantity(portfolio.getQuantity().add(request.getQuantity()) );
        }
        portfolioRepository.save(portfolio);


        Trade trade = new Trade();
        trade.setUser(user);
        trade.setStockSymbol(request.getSymbol());
        trade.setQuantity(request.getQuantity());
        trade.setPrice(price);
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

        if (portfolio.getQuantity().compareTo(request.getQuantity()) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Not enough shares"
            );
        }

        BigDecimal price = stockCache.getStock( request.getSymbol() ).getPrice();
        BigDecimal total = request.getQuantity().multiply(price);

        user.setBalance(user.getBalance().add(total) );

        Trade trade = new Trade();
        trade.setUser(user);
        trade.setStockSymbol(request.getSymbol());
        trade.setQuantity(request.getQuantity());
        trade.setPrice(price);
        trade.setType("SELL");
        trade.setTimestamp(java.time.LocalDateTime.now());

        portfolio.setQuantity(portfolio.getQuantity().subtract(request.getQuantity()) );
        portfolioRepository.save(portfolio);

        tradeRepository.save(trade);
    }
}
