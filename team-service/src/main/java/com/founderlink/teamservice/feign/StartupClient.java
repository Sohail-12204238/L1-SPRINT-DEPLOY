package com.founderlink.teamservice.feign;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import com.founderlink.teamservice.dto.StartupResponse;

@FeignClient(name = "startup-service")
public interface StartupClient {

    @GetMapping("/startups/{id}")
    StartupResponse getStartup(@PathVariable Long id);
}