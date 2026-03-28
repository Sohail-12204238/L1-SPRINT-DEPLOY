package com.founderlink.startupservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.founderlink.startupservice.dto.StartupResponse;
import com.founderlink.startupservice.entity.Startup;

@Repository
public interface StartupRepository extends JpaRepository<Startup, Long>{
	List<Startup> findByFounderEmail(String founderEmail);
}
