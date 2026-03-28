package com.founderlink.teamservice.dto;

import lombok.Data;


import com.founderlink.teamservice.entity.TeamRole;

@Data
public class InviteRequest {
    private Long startupId;
    private String userEmail;
    private TeamRole role;
}