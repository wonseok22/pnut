package com.ssafy.pnut.repository;

import com.ssafy.pnut.dto.BoardDto;
import com.ssafy.pnut.dto.RecipeCreateReq;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<board, Long> {
    void deleteById(Long id);
    List<board> findTop3ByOrderByLikesDesc();
    Optional<board> findByIdAndUserEmail(Long id, User userEmail);

    List<board> findByTitleContainingOrderByCreateDate(String title);
    List<board> findByTitleContainingOrderByLikesDesc(String title);

    List<board> findAllByUserEmail(User userEmail);
}
