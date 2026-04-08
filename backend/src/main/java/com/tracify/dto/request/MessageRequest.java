package com.tracify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MessageRequest {

    @NotNull(message = "Claim ID is required")
    private Long claimId;

    @NotBlank(message = "Message content is required")
    private String content;
}
