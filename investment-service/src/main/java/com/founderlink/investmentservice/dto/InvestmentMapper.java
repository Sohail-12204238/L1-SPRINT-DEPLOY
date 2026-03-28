package com.founderlink.investmentservice.dto;

	
import com.founderlink.investmentservice.entity.Investment;
import com.founderlink.investmentservice.entity.InvestmentStatus;
import org.springframework.stereotype.Component;

@Component
public class InvestmentMapper {

    public Investment toEntity(InvestmentRequest request) {
        return Investment.builder()
                .startupId(request.getStartupId())
                .amount(request.getAmount())
                .status(InvestmentStatus.PENDING)
                .build();
    }

    public InvestmentResponse toDTO(Investment investment) {
        return InvestmentResponse.builder()
                .id(investment.getId())
                .startupId(investment.getStartupId())
                .investorEmail(investment.getInvestorEmail())
                .amount(investment.getAmount())
                .status(investment.getStatus())
                .build();
    }
}
