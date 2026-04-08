package com.tracify.repository;

import com.tracify.entity.LostItem;
import com.tracify.entity.enums.LostItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {

    Page<LostItem> findByUserId(Long userId, Pageable pageable);

    Page<LostItem> findByStatus(LostItemStatus status, Pageable pageable);

    @Query("SELECT l FROM LostItem l WHERE " +
           "(:keyword IS NULL OR LOWER(l.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(l.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(l.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categoryId IS NULL OR l.category.id = :categoryId) " +
           "AND (:status IS NULL OR l.status = :status)")
    Page<LostItem> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("status") LostItemStatus status,
            Pageable pageable);

    long countByStatus(LostItemStatus status);

    List<LostItem> findByStatusAndCategory_Id(LostItemStatus status, Long categoryId);
}
