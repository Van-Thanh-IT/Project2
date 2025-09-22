package com.example.backend.controller;

import com.example.backend.dto.response.APIResponse;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.service.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/user/")
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserController {
    UserService userService;
    @GetMapping("/info")
    public APIResponse<UserResponse> getInfo(){
        return APIResponse.success(userService.getInfo());
    }
}
