package com.ssafy.pnut.repository;

import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.boardSteps;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;

@Repository
public interface BoardStepsRepository extends JpaRepository<boardSteps, Long> {
    void deleteById(Long id);

    @Transactional
    void deleteAllByBoardId(board Board);

    List<boardSteps> findAllByBoardIdOrderByIdAsc(board Board);
}
