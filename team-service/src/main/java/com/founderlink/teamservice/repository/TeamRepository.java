package com.founderlink.teamservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.founderlink.teamservice.entity.Team;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByStartupId(Long startupId);

    Optional<Team> findByStartupIdAndUserEmail(Long startupId, String email);

    List<Team> findByUserEmail(String email);

    List<Team> findByFounderEmailOrUserEmail(String founderEmail, String userEmail);
}