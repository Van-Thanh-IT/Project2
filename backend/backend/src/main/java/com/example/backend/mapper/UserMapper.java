package com.example.backend.mapper;

import com.example.backend.dto.requset.UserRequest;
import com.example.backend.dto.response.UserResponse;
import com.example.backend.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toRegister(UserRequest request);

    UserResponse toUserResponse(User user);


}
