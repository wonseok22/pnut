package com.ssafy.pnut.repository;

import com.ssafy.pnut.entity.category;
import com.ssafy.pnut.entity.question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<question, Long> {

    List<question> findAllByCategoryIdOrderById(category categoryId);
}
