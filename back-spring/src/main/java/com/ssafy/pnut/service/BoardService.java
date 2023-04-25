package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.BoardDto;
import com.ssafy.pnut.dto.RecipeCreateReq;
import com.ssafy.pnut.dto.SelectAllRecipeRes;
import com.ssafy.pnut.dto.SelectOneRecipeRes;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;

import java.util.List;
import java.util.Optional;

public interface BoardService {

    void deleteById(Long id);

    void save(board Board);

    board save(RecipeCreateReq recipeCreateReq, String fileName);

    List<BoardDto> findAll();
    Optional<board> findByIdAndUserEmail(Long id, User userEmail);

    Optional<board> findById(Long id);
    List<SelectAllRecipeRes> findTop3ByOrderByLikesDesc();

    List<BoardDto> findByTitleContainingOrderByCreateDate(String title);
    List<BoardDto> findByTitleContainingOrderByLikesDesc(String title);

    List<BoardDto> findAllByUserEmail(User userEmail);
}
