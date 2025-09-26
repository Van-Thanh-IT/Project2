package com.example.backend.enums;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum ShipmentStatus {
    PREPARING,
    SHIPPED,
    DELIVERED,
    RETURNED;
    @JsonCreator
    public static ShipmentStatus fromString(String value) {
        return value == null ? null : ShipmentStatus.valueOf(value.toUpperCase());
    }
}
