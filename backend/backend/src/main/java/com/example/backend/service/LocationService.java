package com.example.backend.service;


import com.example.backend.dto.response.LocationResponse;
import com.example.backend.entity.Location;
import com.example.backend.mapper.LocationMapper;
import com.example.backend.repository.LocationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class LocationService {

    private final LocationRepository locationRepository;
    private final LocationMapper locationMapper;

    public List<LocationResponse> getAllLocations() {
        List<Location> locations = locationRepository.findAll();
        return locations.stream()
                .map(locationMapper::toResponse)
                .collect(Collectors.toList());
    }
}