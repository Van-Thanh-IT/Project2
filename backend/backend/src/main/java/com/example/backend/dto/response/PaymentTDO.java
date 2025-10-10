package com.example.backend.dto.response;

import lombok.Data;

import java.io.Serializable;

@Data
public class PaymentTDO implements Serializable {
    private  String status;
    private String  messages;
    private String URL;
}
