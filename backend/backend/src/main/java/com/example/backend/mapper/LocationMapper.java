package com.example.backend.mapper;
import com.example.backend.entity.Location;
import com.example.backend.dto.response.LocationResponse;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface LocationMapper {

    LocationResponse toResponse(Location location);

}