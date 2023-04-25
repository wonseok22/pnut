package com.ssafy.pnut.repository;

import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.question;
import com.ssafy.pnut.entity.result;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface ResultRepository extends JpaRepository<result, Long> {

    void deleteByQuestionIdAndUserEmail(question questionId, User userEmail);

    List<result> findByUserEmailOrderByIdAsc(User userEmail);

    Optional<result> findByQuestionIdAndUserEmail(question questionId, User userEmail);


}
