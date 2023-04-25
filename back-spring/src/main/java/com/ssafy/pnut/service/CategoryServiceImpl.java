package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.category;
import com.ssafy.pnut.repository.CategoryRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    final CategoryRepository categoryRepository;

    public List<category> findAll(){
        return categoryRepository.findAll();
    }

    public Optional<category> findById(Long id){
        return categoryRepository.findById(id);
    }

    public Long countBy() {
        return categoryRepository.countBy();
    };

}
