package com.example.backend.mapper;

import com.example.backend.dto.requset.RegisterRequest;
import com.example.backend.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toRegister(RegisterRequest request);
}
