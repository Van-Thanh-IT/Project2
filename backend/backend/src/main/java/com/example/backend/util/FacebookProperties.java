package com.example.backend.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "facebook")
public class FacebookProperties {
    private String appId;
    private String appSecret;
}