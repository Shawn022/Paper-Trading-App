package com.papertrading.backend.trade;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.papertrading.backend.user.User;
import com.papertrading.backend.dto.trade.GetTradeResponse;

public interface TradeRepository extends JpaRepository<Trade,Long> {
    List<GetTradeResponse> findByUser(User user);

    List<GetTradeResponse> findByUser_idOrderByTimestampDesc(Long userId);

    List<GetTradeResponse> findByUser_Email(String email);
}