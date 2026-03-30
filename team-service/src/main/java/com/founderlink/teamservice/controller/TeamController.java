package com.founderlink.teamservice.controller;


import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.founderlink.teamservice.dto.*;
import com.founderlink.teamservice.service.TeamService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService service;

    @PostMapping("/invite")
    @PreAuthorize("hasAuthority('ROLE_FOUNDER')")
    public ResponseEntity<TeamResponse> invite(
            @Valid @RequestBody InviteRequest request,
            HttpServletRequest httpRequest) {

        String founderEmail = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.invite(founderEmail, request));
    }

    @PostMapping("/join")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<TeamResponse> join(
            @Valid @RequestBody JoinRequest request,
            HttpServletRequest httpRequest) {

        String userEmail = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.join(userEmail, request));
    }

    @GetMapping("/startup/{startupId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getTeam(
            @PathVariable Long startupId,
            HttpServletRequest request) {

        String email = request.getHeader("X-User");

        return ResponseEntity.ok(service.getTeamByStartup(startupId, email));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<TeamResponse>> getMyTeams(
            HttpServletRequest httpRequest) {

        String email = httpRequest.getHeader("X-User");

        return ResponseEntity.ok(service.getMyTeams(email));
    }
}
