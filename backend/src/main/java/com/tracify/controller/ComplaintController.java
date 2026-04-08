package com.tracify.controller;

import com.tracify.dto.request.ComplaintRequest;
import com.tracify.dto.response.ApiResponse;
import com.tracify.dto.response.ComplaintResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.service.ComplaintService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    public ResponseEntity<ApiResponse<ComplaintResponse>> fileComplaint(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ComplaintRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint filed",
                        complaintService.fileComplaint(userDetails.getUsername(), request)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<ComplaintResponse>>> getMyComplaints(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("My complaints",
                complaintService.getMyComplaints(userDetails.getUsername(), page, size)));
    }
}
