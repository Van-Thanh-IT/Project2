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

    // Nhận config từ application.properties hoặc Environment (Koyeb)
    public Cloudinaryutil(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret
    ) {
        System.out.println("🔧 [Cloudinary Config]");
        System.out.println("   CLOUD_NAME = " + cloudName);
        System.out.println("   API_KEY    = " + apiKey);
        System.out.println("   API_SECRET = " + (apiSecret != null && !apiSecret.isEmpty() ? "***HIDDEN***" : "NULL ❌"));

        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true
        ));
    }

    // Upload ảnh lên Cloudinary
    public String saveFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            System.out.println("⚠️ File rỗng hoặc null, không upload lên Cloudinary");
            return null;
        }

        try {
            System.out.println("📤 Đang upload file lên Cloudinary...");
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "uploads/"));

            String url = uploadResult.get("secure_url").toString();
            System.out.println("✅ Upload thành công! URL = " + url);

            return url;
        } catch (IOException e) {
            System.err.println("❌ Lỗi upload file lên Cloudinary: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi upload file: " + e.getMessage(), e);
        }
    }

    // Xóa file khỏi Cloudinary (nếu có public_id)
    public boolean deleteFile(String imageUrl) {
        if (imageUrl == null || imageUrl.isEmpty()) return false;
        try {
            String[] parts = imageUrl.split("/");
            String publicIdWithExt = parts[parts.length - 1];
            String publicId = "uploads/" + publicIdWithExt.split("\\.")[0];

            System.out.println("🗑️ Đang xóa file trên Cloudinary: " + publicId);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            System.out.println("✅ Xóa thành công!");

            return true;
        } catch (Exception e) {
            System.err.println("❌ Lỗi khi xóa ảnh Cloudinary: " + e.getMessage());
            return false;
        }
    }
}
