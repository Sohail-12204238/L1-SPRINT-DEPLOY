package com.founderlink.teamservice.dto;

import com.founderlink.teamservice.entity.TeamRole;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class InviteRequest {

    @NotNull(message = "Startup ID is required")
    private Long startupId;

    @NotBlank(message = "User email is required")
    @Email(message = "Invalid email format")
    private String userEmail;

    @NotNull(message = "Role is required")
    private TeamRole role;
}