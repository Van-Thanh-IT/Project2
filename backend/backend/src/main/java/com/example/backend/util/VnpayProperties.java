package com.example.backend.util;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "vnpay")
@Data
public class VnpayProperties {
    private String url;
    private String tmnCode;
    private String hashSecret;
    private String returnUrl;
    private String version;
    private String command;
    private String currCode;
}
