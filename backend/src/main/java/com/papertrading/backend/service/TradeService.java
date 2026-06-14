package com.papertrading.backend.service;

import com.papertrading.backend.exception.BadRequestException;
import com.papertrading.backend.exception.InsufficientBalanceException;
import com.papertrading.backend.exception.ResourceNotFoundException;
import com.papertrading.backend.service.stock.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.math.BigDecimal;

import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.papertrading.backend.trade.Trade;
import com.papertrading.backend.user.User;
import com.papertrading.backend.portfolio.Portfolio;
import com.papertrading.backend.user.UserRepository;
import com.papertrading.backend.trade.TradeRepository;
import com.papertrading.backend.portfolio.PortfolioRepository;

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
    private StockService stockService;

    public List<GetTradeResponse> getAllTrades(String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+ email));

        return tradeRepository.findByUserOrderByTimestampDesc(user);
    }

    @Transactional
    public TradeResponse buyStock(BuyStockRequest request,String email){
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+ email));

        BigDecimal price = stockService.getStock( request.getSymbol() ).getPrice();
        BigDecimal totalCost = request.getQuantity().multiply(price) ;

        if (user.getBalance().compareTo(totalCost) < 0 ) {
            throw new InsufficientBalanceException(
                    "Insufficient balance. Required: " + totalCost +
                            ", Available: " + user.getBalance()
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

        return new TradeResponse(request.getSymbol(), request.getQuantity() ,price ,"BUY");
    }

    @Transactional
    public TradeResponse sellStock(SellStockRequest request,String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: "+ email));

        Portfolio portfolio = portfolioRepository
                .findByUserAndStockSymbol(user, request.getSymbol())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Stock not owned"
                ));

        if (portfolio.getQuantity().compareTo(request.getQuantity()) < 0) {
            throw new BadRequestException("Not enough shares");
        }

        BigDecimal price = stockService.getStock( request.getSymbol() ).getPrice();
        BigDecimal total = request.getQuantity().multiply(price);

        BigDecimal costPrice = request.getQuantity().multiply(portfolio.getAvgBuyPrice());
        BigDecimal PnL = total.subtract(costPrice);

        user.setBalance(user.getBalance().add(total) );
        user.setRealisedPnL(user.getRealisedPnL().add(PnL));

        Trade trade = new Trade();
        trade.setUser(user);
        trade.setStockSymbol(request.getSymbol());
        trade.setQuantity(request.getQuantity());
        trade.setPrice(price);
        trade.setType("SELL");
        trade.setTimestamp(java.time.LocalDateTime.now());

        portfolio.setQuantity(portfolio.getQuantity().subtract(request.getQuantity()) );

        if (portfolio.getQuantity().compareTo(BigDecimal.ZERO) == 0) {
            portfolioRepository.delete(portfolio);
        } else {
            portfolioRepository.save(portfolio);
        }

        tradeRepository.save(trade);

        return new TradeResponse(request.getSymbol(), request.getQuantity() ,price ,"SELL");
    }
}
