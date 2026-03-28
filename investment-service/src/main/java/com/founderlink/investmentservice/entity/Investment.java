package com.founderlink.investmentservice.entity;


import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Investment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long startupId;

    private String investorEmail;

    private Double amount;

    @Enumerated(EnumType.STRING)
    private InvestmentStatus status;

    private LocalDateTime createdAt;
}