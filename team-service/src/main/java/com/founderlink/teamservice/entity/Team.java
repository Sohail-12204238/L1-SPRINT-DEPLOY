package com.founderlink.teamservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long startupId;

    private String founderEmail;

    private String userEmail;

    @Enumerated(EnumType.STRING)
    private TeamRole role;

    @Enumerated(EnumType.STRING)
    private TeamStatus status;

    private LocalDateTime joinedAt;
}