package com.tracify.controller;

import com.tracify.dto.request.MessageRequest;
import com.tracify.dto.response.ApiResponse;
import com.tracify.dto.response.MessageResponse;
import com.tracify.service.MessageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<ApiResponse<MessageResponse>> sendMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent",
                        messageService.sendMessage(userDetails.getUsername(), request)));
    }

    @GetMapping("/claim/{claimId}")
    public ResponseEntity<ApiResponse<List<MessageResponse>>> getClaimMessages(@PathVariable Long claimId) {
        return ResponseEntity.ok(ApiResponse.success("Messages",
                messageService.getClaimMessages(claimId)));
    }

    @PutMapping("/claim/{claimId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @PathVariable Long claimId,
            @AuthenticationPrincipal UserDetails userDetails) {
        messageService.markMessagesAsRead(claimId, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Messages marked as read"));
    }
}
