package com.tracify.controller;

import com.tracify.dto.request.ClaimRequestDto;
import com.tracify.dto.response.ApiResponse;
import com.tracify.dto.response.ClaimResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    public ResponseEntity<ApiResponse<ClaimResponse>> submitClaim(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestPart("claim") ClaimRequestDto request,
            @RequestPart(value = "proofDocument", required = false) MultipartFile proofDocument) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim submitted", claimService.submitClaim(userDetails.getUsername(), request, proofDocument)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Claim found", claimService.getClaimById(id)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<ClaimResponse>>> getMyClaims(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("My claims", claimService.getMyClaims(userDetails.getUsername(), page, size)));
    }

    @GetMapping("/item/{foundItemId}")
    public ResponseEntity<ApiResponse<PagedResponse<ClaimResponse>>> getClaimsForItem(
            @PathVariable Long foundItemId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("Item claims", claimService.getClaimsForItem(foundItemId, page, size)));
    }

    @PatchMapping("/{id}/finder-confirm")
    public ResponseEntity<ApiResponse<ClaimResponse>> finderConfirmHandover(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Handover confirmed", 
                claimService.finderConfirmHandover(id, userDetails.getUsername())));
    }

    @PatchMapping("/{id}/owner-confirm")
    public ResponseEntity<ApiResponse<ClaimResponse>> ownerConfirmReceipt(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Receipt confirmed", 
                claimService.ownerConfirmReceipt(id, userDetails.getUsername())));
    }
}
