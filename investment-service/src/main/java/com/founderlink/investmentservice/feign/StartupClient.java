package com.founderlink.investmentservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.founderlink.investmentservice.config.FeignConfig;
import com.founderlink.investmentservice.dto.StartupResponse;

@FeignClient(name = "STARTUP-SERVICE", configuration = FeignConfig.class)
public interface StartupClient {

    @GetMapping("/startups/{id}")
    StartupResponse getStartup(@PathVariable Long id);
}