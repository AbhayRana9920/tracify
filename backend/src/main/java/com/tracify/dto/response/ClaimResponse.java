package com.tracify.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponse {
    private Long id;
    private Long foundItemId;
    private String foundItemTitle;
    private Long claimantId;
    private String claimantName;
    private String claimantProfilePhoto;
    private String claimantEmail;
    private String claimantPhone;
    private String finderEmail;
    private String finderPhone;
    private String claimMessage;
    private String proofOfOwnership;
    private String identifyingInfo;
    private String proofDocumentUrl;
    private String status;
    private String adminNotes;
    private LocalDateTime verifiedAt;
    private LocalDateTime returnedAt;
    private boolean finderConfirmedHandover;
    private boolean ownerConfirmedReceipt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
