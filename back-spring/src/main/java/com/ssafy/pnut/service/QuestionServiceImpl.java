package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.category;
import com.ssafy.pnut.entity.question;
import com.ssafy.pnut.repository.QuestionRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class QuestionServiceImpl implements QuestionService {

    final QuestionRepository questionRepository;

    public List<question> findAll() {
        return questionRepository.findAll();
    }

    public Optional<question> findById(Long id) {
        return questionRepository.findById(id);
    }

    public List<question> findAllByCategoryIdOrderById(category categoryId) {
        return questionRepository.findAllByCategoryIdOrderById(categoryId);
    }
}
