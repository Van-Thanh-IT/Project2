package com.example.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum PaymentStatus {
    PENDING,
    PAID,
    FAILED,
    REFUNDED;

    @JsonCreator
    public static PaymentStatus fromString(String value) {
        return value == null ? null : PaymentStatus.valueOf(value.toUpperCase());
    }
}
