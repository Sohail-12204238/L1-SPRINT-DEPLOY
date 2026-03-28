package com.founderlink.teamservice.service;

import java.util.List;

import com.founderlink.teamservice.dto.*;

public interface TeamService {

    TeamResponse invite(String founderEmail, InviteRequest request);

    TeamResponse join(String userEmail, JoinRequest request);

    List<TeamResponse> getTeamByStartup(Long startupId, String email);

    List<TeamResponse> getMyTeams(String email);
}