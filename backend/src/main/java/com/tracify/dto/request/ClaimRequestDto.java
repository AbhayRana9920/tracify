package com.tracify.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ClaimRequestDto {

    @NotNull(message = "Found item ID is required")
    private Long foundItemId;

    @NotBlank(message = "Claim message is required")
    private String claimMessage;

    private String proofOfOwnership;

    private String identifyingInfo;
}
