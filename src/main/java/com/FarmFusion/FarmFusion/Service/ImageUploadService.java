package com.FarmFusion.FarmFusion.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class ImageUploadService {

    private final Cloudinary cloudinary;

    public ImageUploadService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) throws IOException {
        // Using getInputStream() is more memory efficient than getBytes()
        // especially for large image files
        Map uploadResult = cloudinary.uploader().upload(
                file.getInputStream(),
                ObjectUtils.asMap(
                        "folder", "farmfusion/products",
                        "resource_type", "image"
                )
        );
        return uploadResult.get("secure_url").toString();
    }
}