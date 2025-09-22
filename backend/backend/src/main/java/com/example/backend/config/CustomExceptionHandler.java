package com.example.backend.config;
import com.example.backend.dto.response.APIResponse;
import com.example.backend.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;

@Configuration
public class CustomExceptionHandler {

    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.setContentType("application/json;charset=UTF-8");

            APIResponse<?> apiResponse = APIResponse.builder()
                    .code(ErrorCode.UNAUTHORIZED.getCode())
                    .messages(ErrorCode.UNAUTHORIZED.getMessage())
                    .build();

            new ObjectMapper().writeValue(response.getOutputStream(), apiResponse);
        };
    }

    @Bean
    public AccessDeniedHandler accessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setStatus(HttpStatus.FORBIDDEN.value());
            response.setContentType("application/json;charset=UTF-8");

            APIResponse<?> apiResponse = APIResponse.builder()
                    .code(ErrorCode.FORBIDDEN.getCode())
                    .messages(ErrorCode.FORBIDDEN.getMessage())
                    .build();

            new ObjectMapper().writeValue(response.getOutputStream(), apiResponse);
        };
    }
}
