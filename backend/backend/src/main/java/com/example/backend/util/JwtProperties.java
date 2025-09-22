package com.example.backend.util;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {
    private String secret;
    private Integer expiration;

    // getters & setters
    public String getSecret() { return secret; }
    public void setSecret(String secret) { this.secret = secret; }

    public Integer getExpiration() { return expiration; }
    public void setExpiration(Integer expiration) { this.expiration = expiration; }
}
