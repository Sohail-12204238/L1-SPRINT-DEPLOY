package com.founderlink.investmentservice.repository;


import com.founderlink.investmentservice.entity.Investment;
import com.founderlink.investmentservice.entity.InvestmentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InvestmentRepository extends JpaRepository<Investment, Long> {

    List<Investment> findByStartupId(Long startupId);

    List<Investment> findByInvestorEmail(String email);
    
    List<Investment> findByStartupIdAndStatus(Long startupId, InvestmentStatus status);
}
