package com.founderlink.teamservice.dto;


import org.springframework.stereotype.Component;
import com.founderlink.teamservice.entity.Team;

@Component
public class TeamMapper {

    public Team toEntity(InviteRequest request, String founderEmail) {
        return Team.builder()
                .startupId(request.getStartupId())
                .userEmail(request.getUserEmail())
                .role(request.getRole())
                .founderEmail(founderEmail)
                .build();
    }

    public TeamResponse toDTO(Team team) {
        return TeamResponse.builder()
                .id(team.getId())
                .startupId(team.getStartupId())
                .userEmail(team.getUserEmail())
                .role(team.getRole().name())
                .status(team.getStatus())
                .joinedAt(team.getJoinedAt())
                .build();
    }
}