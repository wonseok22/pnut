package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.BoardStepsDto;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.entity.boardSteps;
import com.ssafy.pnut.repository.BoardStepsRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Slf4j
@AllArgsConstructor
public class BoardStepsServiceImpl implements BoardStepsService {
    final BoardStepsRepository boardStepsRepository;

    @Override
    @Transactional
    public void deleteAllByBoardId(board Board) {
        boardStepsRepository.deleteAllByBoardId(Board);
    }

    @Override
    public void save(List<String> Recipe_steps, board Board, List<String> file, List<Integer> stepNums) {

        for(int i = 0; i < Recipe_steps.size(); i++) {
            BoardStepsDto boardStepsDto = new BoardStepsDto();
            boardStepsDto.setBoardId(Board);
            if(stepNums.contains(i+1)) {
                boardStepsDto.setImageUrl(file.get(i));
            }
            boardStepsDto.setContent(Recipe_steps.get(i));
            boardStepsRepository.save(boardStepsDto.toEntity());
        }

    }

    @Override
    public List<boardSteps> findAllByBoardIdOrderByIdAsc(board Board) {
        List<boardSteps> steps = boardStepsRepository.findAllByBoardIdOrderByIdAsc(Board);
        System.out.println(steps.size());
        return steps;
    }




}
