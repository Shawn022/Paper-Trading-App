package com.papertrading.backend.portfolio;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;
import com.papertrading.backend.user.User;

public interface PortfolioRepository extends JpaRepository<Portfolio,Long> {
    List<Portfolio> findByUser(User user);

    Optional<Portfolio> findByUserAndStockSymbol(User user, String symbol);
}
