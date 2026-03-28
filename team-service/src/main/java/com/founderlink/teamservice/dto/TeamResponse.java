package com.founderlink.teamservice.dto;

import java.time.LocalDateTime;

import com.founderlink.teamservice.entity.TeamStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TeamResponse {

    private Long id;
    private Long startupId;
    private String userEmail;
    private String role;
    private TeamStatus status;
    private LocalDateTime joinedAt;
}