package com.FarmFusion.FarmFusion.config;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(ObjectUtils.asMap(
                "cloud_name", "dqc5pglks",
                "api_key", "411561134342359",
                "api_secret", "tckATx6yiVb",
                "secure", true
        ));
    }
}
