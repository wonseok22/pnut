package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.category;
import com.ssafy.pnut.entity.question;

import java.util.List;
import java.util.Optional;

public interface QuestionService {

    List<question> findAll();

    List<question> findAllByCategoryIdOrderById(category categoryId);

    Optional<question> findById(Long id);
}
