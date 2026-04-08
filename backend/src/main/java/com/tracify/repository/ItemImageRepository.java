package com.tracify.repository;

import com.tracify.entity.ItemImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemImageRepository extends JpaRepository<ItemImage, Long> {
    List<ItemImage> findByLostItemId(Long lostItemId);
    List<ItemImage> findByFoundItemId(Long foundItemId);
    void deleteByLostItemId(Long lostItemId);
    void deleteByFoundItemId(Long foundItemId);
}
