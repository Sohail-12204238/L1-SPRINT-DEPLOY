package com.founderlink.investmentservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.founderlink.investmentservice.entity.InvestorRequest;

public interface InvestorRequestRepository extends JpaRepository<InvestorRequest, Long> {

    List<InvestorRequest> findByInvestorEmail(String email);

    boolean existsByStartupIdAndInvestorEmail(Long startupId, String investorEmail);
}
