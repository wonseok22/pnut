package com.ssafy.pnut.repository;

import com.ssafy.pnut.entity.category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<category, Long> {

    Long countBy();
}
