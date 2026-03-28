package com.founderlink.teamservice.feign;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.founderlink.teamservice.dto.UserResponse;

@FeignClient(name = "user-service")
public interface UserClient {

    @GetMapping("/users/email/{email}")
    UserResponse getByEmail(@PathVariable String email);
}