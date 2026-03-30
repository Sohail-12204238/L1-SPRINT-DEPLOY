package com.founderlink.teamservice.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class JoinRequest {

    @NotNull(message = "Startup ID is required")
    private Long startupId;
}