package com.founderlink.startupservice.repository;

import com.founderlink.startupservice.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByStartupId(Long startupId);
}
