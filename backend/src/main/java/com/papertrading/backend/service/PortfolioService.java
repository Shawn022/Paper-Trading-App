package com.papertrading.backend.service;

import com.papertrading.backend.exception.ResourceNotFoundException;
import com.papertrading.backend.service.stock.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.papertrading.backend.user.*;
import com.papertrading.backend.portfolio.*;
import com.papertrading.backend.dto.portfolio.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class PortfolioService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PortfolioRepository portfolioRepository;

    @Autowired
    private StockService stockService;

    private static final BigDecimal INITIAL_CAPITAL = BigDecimal.valueOf(100000);

    public PortfolioResponse getPortfolio(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User do not exist with email: " + email));

        List<GetPortfolioResponse> portfolio = portfolioRepository.findByUser(user);
        List<Holding> holdings = new ArrayList<>();

        BigDecimal holdingsValue = BigDecimal.ZERO;
        BigDecimal holdingsCost = BigDecimal.ZERO;
        BigDecimal unrealisedPnL = BigDecimal.ZERO;

        for(GetPortfolioResponse holding: portfolio){
            BigDecimal qty = holding.getQuantity();
            BigDecimal currMarketPrice = stockService.getCurrentMarketPrice(holding.getStockSymbol()).getClose();

            BigDecimal cost = holding.getAvgBuyPrice().multiply(qty);
            holdingsCost = holdingsCost.add(cost);

            BigDecimal positonValue = currMarketPrice.multiply(qty);
            holdingsValue = holdingsValue.add(positonValue);

            BigDecimal pnl = positonValue.subtract(cost);
            unrealisedPnL = unrealisedPnL.add(pnl);

            Holding temp = new Holding(
                    holding.getStockSymbol(),
                    qty,
                    holding.getAvgBuyPrice(),
                    currMarketPrice,
                    positonValue.setScale(2,RoundingMode.HALF_UP),
                    pnl.setScale(2,RoundingMode.HALF_UP)
            );
            holdings.add(temp);
        }

        BigDecimal portfolioValue = user.getBalance().add(holdingsValue);

        BigDecimal unrealisedPnLPercent = BigDecimal.ZERO;
        if (holdingsCost.compareTo(BigDecimal.ZERO) > 0) {
            unrealisedPnLPercent = unrealisedPnL
                    .multiply(BigDecimal.valueOf(100))
                    .divide(holdingsCost, 2, RoundingMode.HALF_UP);
        }

        BigDecimal totalPnL = unrealisedPnL.add(user.getRealisedPnL());
        BigDecimal totalPnLPercent = totalPnL
                .multiply(BigDecimal.valueOf(100))
                .divide(INITIAL_CAPITAL, 2, RoundingMode.HALF_UP);


        portfolioValue = portfolioValue.setScale(2, RoundingMode.HALF_UP);
        holdingsValue = holdingsValue.setScale(2, RoundingMode.HALF_UP);
        unrealisedPnL = unrealisedPnL.setScale(2, RoundingMode.HALF_UP);
        unrealisedPnLPercent = unrealisedPnLPercent.setScale(2,RoundingMode.HALF_UP);
        totalPnL = totalPnL.setScale(2, RoundingMode.HALF_UP);
        totalPnLPercent = totalPnLPercent.setScale(2,RoundingMode.HALF_UP);

        PortfolioResponse response = new PortfolioResponse();

        response.setBalance(user.getBalance());
        response.setPortfolioValue(portfolioValue);
        response.setHoldingsValue(holdingsValue);
        response.setRealisedPnL(user.getRealisedPnL());
        response.setUnrealisedPnL(unrealisedPnL);
        response.setUnrealisedPnLPercent(unrealisedPnLPercent);
        response.setTotalPnL(totalPnL);
        response.setTotalPnLPercent(totalPnLPercent);
        response.setHoldings(holdings);

        return response;

    }


}
