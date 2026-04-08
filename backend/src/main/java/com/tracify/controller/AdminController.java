package com.tracify.controller;

import com.tracify.dto.response.*;
import com.tracify.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final DashboardService dashboardService;
    private final UserService userService;
    private final ClaimService claimService;
    private final ComplaintService complaintService;
    private final LostItemService lostItemService;
    private final FoundItemService foundItemService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats", dashboardService.getStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserResponse>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("All users", userService.getAllUsers(page, size)));
    }

    @PutMapping("/users/{id}/toggle-block")
    public ResponseEntity<ApiResponse<UserResponse>> toggleBlock(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("User updated", userService.toggleBlockUser(id)));
    }

    @GetMapping("/claims")
    public ResponseEntity<ApiResponse<PagedResponse<ClaimResponse>>> getAllClaims(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("All claims", claimService.getAllClaims(page, size, status)));
    }

    @GetMapping("/claims/{id}")
    public ResponseEntity<ApiResponse<ClaimResponse>> getClaimById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Claim details", claimService.getClaimById(id)));
    }

    @PutMapping("/claims/{id}/approve")
    public ResponseEntity<ApiResponse<ClaimResponse>> approveClaim(
            @PathVariable Long id, @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(ApiResponse.success("Claim approved",
                claimService.approveClaim(id, adminNotes)));
    }

    @PutMapping("/claims/{id}/reject")
    public ResponseEntity<ApiResponse<ClaimResponse>> rejectClaim(
            @PathVariable Long id, @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(ApiResponse.success("Claim rejected",
                claimService.rejectClaim(id, adminNotes)));
    }

    @PutMapping("/claims/{id}/review")
    public ResponseEntity<ApiResponse<ClaimResponse>> reviewClaim(
            @PathVariable Long id, @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(ApiResponse.success("Claim marked under review",
                claimService.markClaimUnderReview(id, adminNotes)));
    }

    @PutMapping("/claims/{id}/status")
    public ResponseEntity<ApiResponse<ClaimResponse>> updateClaimStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminNotes) {
        return ResponseEntity.ok(ApiResponse.success("Claim updated",
                claimService.updateClaimStatus(id, status, adminNotes))); // Fallback for final RETURNED/CLOSED actions
    }

    @GetMapping("/complaints")
    public ResponseEntity<ApiResponse<PagedResponse<ComplaintResponse>>> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("All complaints",
                complaintService.getAllComplaints(page, size, status)));
    }

    @PutMapping("/complaints/{id}/respond")
    public ResponseEntity<ApiResponse<ComplaintResponse>> respondToComplaint(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String adminResponse) {
        return ResponseEntity.ok(ApiResponse.success("Complaint responded",
                complaintService.respondToComplaint(id, status, adminResponse)));
    }

    @PutMapping("/lost-items/{id}/status")
    public ResponseEntity<ApiResponse<LostItemResponse>> updateLostItemStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", lostItemService.updateStatus(id, status)));
    }

    @PutMapping("/found-items/{id}/status")
    public ResponseEntity<ApiResponse<FoundItemResponse>> updateFoundItemStatus(
            @PathVariable Long id, @RequestParam String status) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", foundItemService.updateStatus(id, status)));
    }
}
