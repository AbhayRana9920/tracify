package com.tracify.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @Size(max = 100)
    private String fullName;

    @Size(max = 20)
    private String phone;

    private String bio;
}
