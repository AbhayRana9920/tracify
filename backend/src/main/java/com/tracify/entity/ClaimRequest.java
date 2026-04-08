package com.tracify.entity;

import com.tracify.entity.enums.ClaimStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "claim_requests")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class ClaimRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_item_id", nullable = false)
    private FoundItem foundItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimant_id", nullable = false)
    private User claimant;

    @Column(name = "claim_message", columnDefinition = "TEXT")
    private String claimMessage;

    @Column(name = "proof_of_ownership", columnDefinition = "TEXT")
    private String proofOfOwnership;

    @Column(name = "identifying_info", columnDefinition = "TEXT")
    private String identifyingInfo;

    @Column(name = "proof_document_url")
    private String proofDocumentUrl;

    @Column(name = "finder_email")
    private String finderEmail;

    @Column(name = "finder_name")
    private String finderName;

    @Column(name = "finder_phone")
    private String finderPhone;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.PENDING;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    @Column(name = "finder_confirmed_handover")
    @Builder.Default
    private Boolean finderConfirmedHandover = false;

    @Column(name = "owner_confirmed_receipt")
    @Builder.Default
    private Boolean ownerConfirmedReceipt = false;

    @OneToMany(mappedBy = "claimRequest", cascade = CascadeType.ALL)

    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
