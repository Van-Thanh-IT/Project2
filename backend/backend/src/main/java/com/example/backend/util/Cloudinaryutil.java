package com.example.backend.util;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
public class Cloudinaryutil {
    private final Cloudinary cloudinary;

    // Nhận config từ application.properties hoặc Environment Koyeb
    public Cloudinaryutil(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret
    ) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    // Upload ảnh lên Cloudinary
    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) return null;
        try {
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "uploads/"));
            return uploadResult.get("secure_url").toString(); // URL ảnh trực tuyến
        } catch (IOException e) {
            throw new RuntimeException("Lỗi upload file: " + e.getMessage(), e);
        }
    }

    // Xóa file khỏi Cloudinary (nếu có public_id)
    public boolean deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return false;
        try {
            // Lấy public_id từ URL
            String[] parts = imageUrl.split("/");
            String publicIdWithExt = parts[parts.length - 1];
            String publicId = "uploads/" + publicIdWithExt.split("\\.")[0];

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return true;
        } catch (Exception e) {
            System.err.println("Lỗi xóa ảnh: " + e.getMessage());
            return false;
        }
    }
}
