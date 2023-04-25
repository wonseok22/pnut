package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.category;

import java.util.List;
import java.util.Optional;

public interface CategoryService {
    List<category> findAll();

    Optional<category> findById(Long id);

    Long countBy();
}
