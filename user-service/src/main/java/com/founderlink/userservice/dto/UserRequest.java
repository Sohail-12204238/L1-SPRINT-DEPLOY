package com.founderlink.userservice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 50, message = "Name must be between 3 and 50 characters")
    private String name;

    @NotBlank(message = "Skills are required")
    @Size(min = 2, max = 200, message = "Skills must be between 2 and 200 characters")
    private String skills;

    @NotBlank(message = "Experience is required")
    @Size(max = 100, message = "Experience must not exceed 100 characters")
    private String experience;

    @NotBlank(message = "Bio is required")
    @Size(min = 10, max = 500, message = "Bio must be between 10 and 500 characters")
    private String bio;

    @Size(max = 300, message = "Portfolio links must not exceed 300 characters")
    private String portfolioLinks;
}