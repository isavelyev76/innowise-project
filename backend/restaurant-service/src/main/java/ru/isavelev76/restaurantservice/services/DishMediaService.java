package ru.isavelev76.restaurantservice.services;

import io.minio.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ru.isavelev76.restaurantservice.config.MinioProperties;
import ru.isavelev76.restaurantservice.entities.Dish;

import java.net.URI;
import java.nio.file.Paths;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

/**
 * @author Ilya Savelyev
 * @since 09.12.2025
 */

@Slf4j
@RequiredArgsConstructor
@Service
@Transactional
public class DishMediaService {
    private final MinioProperties minioProperties;
    private final MinioClient minioClient;
    private static final long MAX_IMAGE_SIZE = 3 * 1024 * 1024; // 3 МБ
    private static final List<String> ALLOWED_CONTENT_TYPES = List.of("image/jpeg", "image/png");

    @PostConstruct
    private void initialize() {
        try {
            boolean exists = minioClient.bucketExists(BucketExistsArgs.builder().bucket(minioProperties.bucketName()).build());
            if (!exists) {
                minioClient.makeBucket(
                        MakeBucketArgs.builder()
                                .bucket(minioProperties.bucketName())
                                .build());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize MinIO: " + e.getMessage(), e);
        }
    }

    public void uploadDishImage(MultipartFile file, Dish dish) {
        validateFile(file);

        String fileName = UUID.randomUUID() + "_" + Objects.requireNonNull(file.getOriginalFilename());
        String safeName = fileName
                .replaceAll("\\s+", "_")
                .replaceAll("[^a-zA-Z0-9._-]", "");
        try {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioProperties.bucketName())
                            .object(safeName)
                            .stream(file.getInputStream(), file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build());

            String url = generatePublicUrl(safeName);
            dish.setImageUrl(url);
        } catch (Exception e) {
            log.error("Failed to upload file {}: {}", fileName, e.getMessage(), e);
            throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
        }
    }

    public void deleteDishImage(Dish dish) {
        if (dish.getImageUrl() == null) return;
        String fileName = extractFileNameFromUrl(dish.getImageUrl());
        try {
            minioClient.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(minioProperties.bucketName())
                            .object(fileName)
                            .build());

            dish.setImageUrl(null);
        } catch (Exception e) {
            log.error("Failed to delete file {}: {}", fileName, e.getMessage(), e);
            throw new RuntimeException("Failed to delete file: " + fileName, e);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new RuntimeException("Max image size is 3MB");
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new RuntimeException("Invalid file type. Only JPEG and PNG are allowed");
        }
    }

    private String generatePublicUrl(String fileName) {
        return minioProperties.baseUrl() + "/" + fileName;
    }

    private String extractFileNameFromUrl(String url) {
        return Paths.get(URI.create(url).getPath()).getFileName().toString();
    }

    public byte[] getDishImage(String fileName) {
        try {
            GetObjectResponse object = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(minioProperties.bucketName())
                            .object(fileName)
                            .build()
            );

           return object.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("Image not found: " + fileName, e);
        }
    }
}