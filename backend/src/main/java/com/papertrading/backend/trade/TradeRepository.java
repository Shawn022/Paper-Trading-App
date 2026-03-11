package com.papertrading.backend.trade;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.papertrading.backend.user.User;

public interface TradeRepository extends JpaRepository<Trade,Long> {
    List<Trade> findByUser(User user);

    List<Trade> findByUser_idOrderByTimestampDesc(Long userId);

    List<Trade> findByUser_Email(String email);
}
