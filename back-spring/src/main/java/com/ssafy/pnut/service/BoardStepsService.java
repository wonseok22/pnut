package com.ssafy.pnut.service;

import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.boardSteps;

import java.util.List;

public interface BoardStepsService {


    void deleteAllByBoardId(board Board);

    void save(List<String> Recipe_steps, board Board, List<String> file, List<Integer> stepNums);

    List<boardSteps> findAllByBoardIdOrderByIdAsc(board Board);

}
