package com.tracify.controller;

import com.tracify.dto.request.FoundItemRequest;
import com.tracify.dto.response.ApiResponse;
import com.tracify.dto.response.FoundItemResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.service.FoundItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/found-items")
@RequiredArgsConstructor
public class FoundItemController {

    private final FoundItemService foundItemService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<FoundItemResponse>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestPart("item") FoundItemRequest request,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Found item posted",
                        foundItemService.createFoundItem(userDetails.getUsername(), request, images)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundItemResponse>> update(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody FoundItemRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Found item updated",
                foundItemService.updateFoundItem(id, userDetails.getUsername(), request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoundItemResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Found item found", foundItemService.getFoundItemById(id)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<FoundItemResponse>>> getAll(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(ApiResponse.success("Found items",
                foundItemService.getAllFoundItems(page, size, keyword, categoryId, status)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<PagedResponse<FoundItemResponse>>> getMyItems(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(ApiResponse.success("My found items",
                foundItemService.getMyFoundItems(userDetails.getUsername(), page, size)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        foundItemService.deleteFoundItem(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Found item deleted"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<FoundItemResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody java.util.Map<String, String> payload) {
        return ResponseEntity.ok(ApiResponse.success("Found item status updated",
                foundItemService.updateStatus(id, payload.get("status"))));
    }
}
