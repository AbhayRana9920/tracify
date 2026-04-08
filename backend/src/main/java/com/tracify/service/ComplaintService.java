package com.tracify.service;

import com.tracify.dto.request.ComplaintRequest;
import com.tracify.dto.response.ComplaintResponse;
import com.tracify.dto.response.PagedResponse;
import com.tracify.entity.Complaint;
import com.tracify.entity.User;
import com.tracify.entity.enums.ComplaintStatus;
import com.tracify.entity.enums.NotificationType;
import com.tracify.exception.ResourceNotFoundException;
import com.tracify.repository.ComplaintRepository;
import com.tracify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Transactional
    public ComplaintResponse fileComplaint(String username, ComplaintRequest request) {
        User reporter = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));

        Complaint complaint = Complaint.builder()
                .reporter(reporter)
                .targetType(request.getTargetType())
                .targetId(request.getTargetId())
                .reason(request.getReason())
                .description(request.getDescription())
                .build();

        return mapToResponse(complaintRepository.save(complaint));
    }

    public PagedResponse<ComplaintResponse> getMyComplaints(String username, int page, int size) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username", username));
        Page<Complaint> complaints = complaintRepository.findByReporterId(user.getId(),
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return mapToPagedResponse(complaints);
    }

    public PagedResponse<ComplaintResponse> getAllComplaints(int page, int size, String status) {
        Page<Complaint> complaints;
        if (status != null) {
            complaints = complaintRepository.findByStatus(ComplaintStatus.valueOf(status),
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        } else {
            complaints = complaintRepository.findAll(
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        }
        return mapToPagedResponse(complaints);
    }

    @Transactional
    public ComplaintResponse respondToComplaint(Long id, String status, String adminResponse) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint", "id", id));

        complaint.setStatus(ComplaintStatus.valueOf(status));
        complaint.setAdminResponse(adminResponse);

        notificationService.createNotification(
                complaint.getReporter().getId(),
                NotificationType.COMPLAINT_UPDATE,
                "Complaint Update",
                "Your complaint has been " + status.toLowerCase() + ".",
                null
        );

        return mapToResponse(complaintRepository.save(complaint));
    }

    private ComplaintResponse mapToResponse(Complaint complaint) {
        return ComplaintResponse.builder()
                .id(complaint.getId())
                .reporterId(complaint.getReporter().getId())
                .reporterName(complaint.getReporter().getFullName())
                .targetType(complaint.getTargetType())
                .targetId(complaint.getTargetId())
                .reason(complaint.getReason())
                .description(complaint.getDescription())
                .status(complaint.getStatus().name())
                .adminResponse(complaint.getAdminResponse())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .build();
    }

    private PagedResponse<ComplaintResponse> mapToPagedResponse(Page<Complaint> page) {
        return PagedResponse.<ComplaintResponse>builder()
                .content(page.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .page(page.getNumber())
                .size(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }
}
