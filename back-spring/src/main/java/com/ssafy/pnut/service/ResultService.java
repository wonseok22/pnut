package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.question;
import com.ssafy.pnut.entity.result;

import java.util.List;
import java.util.Optional;

public interface ResultService {

    void save(result Result);

    void deleteByQuestionIdAndUserEmail(question questionId, User userEmail);

    Optional<result> findByQuestionIdAndUserEmail(question questionId, User userEmail);

    List<result> findByUserEmailOrderByIdAsc(User userEmail);

    Optional<result> findById(Long id);
}
