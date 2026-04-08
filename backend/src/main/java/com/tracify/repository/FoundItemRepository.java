package com.tracify.repository;

import com.tracify.entity.FoundItem;
import com.tracify.entity.enums.FoundItemStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {

    Page<FoundItem> findByUserId(Long userId, Pageable pageable);

    Page<FoundItem> findByStatus(FoundItemStatus status, Pageable pageable);

    @Query("SELECT f FROM FoundItem f WHERE " +
           "(:keyword IS NULL OR LOWER(f.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(f.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(f.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categoryId IS NULL OR f.category.id = :categoryId) " +
           "AND (:status IS NULL OR f.status = :status)")
    Page<FoundItem> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("status") FoundItemStatus status,
            Pageable pageable);

    long countByStatus(FoundItemStatus status);

    List<FoundItem> findByStatusAndCategory_Id(FoundItemStatus status, Long categoryId);
}
