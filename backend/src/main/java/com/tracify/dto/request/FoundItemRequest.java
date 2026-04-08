package com.tracify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class FoundItemRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200)
    private String title;

    @NotBlank(message = "Item name is required")
    @Size(max = 150)
    private String itemName;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String description;

    @Size(max = 50)
    private String color;

    @Size(max = 100)
    private String brand;

    @Size(max = 255)
    private String locationFound;

    private LocalDate dateFound;

    @Size(max = 500)
    private String identificationMarks;

    @Size(max = 255)
    private String storageLocation;
}
