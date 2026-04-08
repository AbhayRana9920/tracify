package com.tracify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LostItemResponse {
    private Long id;
    private String title;
    private String itemName;
    private Long categoryId;
    private String categoryName;
    private String description;
    private String color;
    private String brand;
    private String locationLost;
    private LocalDate dateLost;
    private String identificationMarks;
    private BigDecimal rewardAmount;
    private String contactPreference;
    private String status;
    private Long userId;
    private String userName;
    private String userProfilePhoto;
    private List<String> imageUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
