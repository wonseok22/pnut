package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.question;
import com.ssafy.pnut.entity.result;
import com.ssafy.pnut.repository.ResultRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class ResultServiceImpl implements ResultService {

    final ResultRepository resultRepository;

    public void save(result Result) {
        resultRepository.save(Result);
    }

    public void deleteByQuestionIdAndUserEmail(question questionId, User userEmail) {
        resultRepository.deleteByQuestionIdAndUserEmail(questionId, userEmail);
    }

    public Optional<result> findById(Long id) {
        return resultRepository.findById(id);
    }

    public Optional<result> findByQuestionIdAndUserEmail(question questionId, User userEmail){
        return resultRepository.findByQuestionIdAndUserEmail(questionId, userEmail);
    }



    public List<result> findByUserEmailOrderByIdAsc(User userEmail) {
        return resultRepository.findByUserEmailOrderByIdAsc(userEmail);
    }
}
