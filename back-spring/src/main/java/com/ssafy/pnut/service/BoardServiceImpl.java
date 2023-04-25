package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.BoardDto;
import com.ssafy.pnut.dto.RecipeCreateReq;
import com.ssafy.pnut.dto.SelectAllRecipeRes;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.entity.board;
import com.ssafy.pnut.repository.BoardRepository;
import com.ssafy.pnut.repository.BoardStepsRepository;
import com.ssafy.pnut.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@AllArgsConstructor
public class BoardServiceImpl implements BoardService{
    final BoardRepository boardRepository;

    final BoardStepsRepository boardStepsRepository;
    final UserRepository userRepository;

    @Override
    public void deleteById(Long id) {
        boardRepository.deleteById(id);
    }


    @Override
    public void save(board Board){
        boardRepository.save(Board);
    }

    @Override
    public board save(RecipeCreateReq recipeCreateReq, String fileName) {
        BoardDto boardDto = new BoardDto();
        boardDto.setContent(recipeCreateReq.getContent());
        boardDto.setTime(recipeCreateReq.getTime());
        boardDto.setTitle(recipeCreateReq.getTitle());
        boardDto.setQuantity(recipeCreateReq.getQuantity());
        boardDto.setIngredients(recipeCreateReq.getIngredients());
        boardDto.setThumbnail_image_url(fileName);

        User userEmail = userRepository.findByEmail(recipeCreateReq.getUserEmail());
        boardDto.setUserEmail(userEmail);

        board Board = boardDto.toEntity();
        boardRepository.save(Board);
        return Board;
    }


    public Optional<board> findById(Long id) {
        return boardRepository.findById(id);
    }

    public Optional<board> findByIdAndUserEmail(Long id, User userEmail) {
        return boardRepository.findByIdAndUserEmail(id, userEmail);
    }

    public List<BoardDto> findAll() {
        List<board> Boards = boardRepository.findAll();  // 보드 엔티티 모두 찾고
        List<BoardDto> boardDtos = new ArrayList<>();  // DTO로 담을 리스트 생성
        for(int i = 0; i < Boards.size(); i++) {
            BoardDto boardDto = new BoardDto();
            boardDto.setId(Boards.get(i).getId());
            boardDto.setUserEmail(Boards.get(i).getUserEmail());
            boardDto.setTime(Boards.get(i).getTime());
            boardDto.setTitle(Boards.get(i).getTitle());
            boardDto.setContent(Boards.get(i).getContent());
            boardDto.setIngredients(Boards.get(i).getIngredients());
            boardDto.setQuantity(Boards.get(i).getQuantity());
            boardDto.setThumbnail_image_url(Boards.get(i).getThumbnailImageUrl());
            boardDtos.add(boardDto);
        }
        return boardDtos;
    }

    public List<SelectAllRecipeRes> findTop3ByOrderByLikesDesc() {
        List<board> Boards = boardRepository.findTop3ByOrderByLikesDesc();
        List<SelectAllRecipeRes> Recipes = new ArrayList<>();
        for(int i = 0; i < Boards.size(); i++) {
            String img = Boards.get(i).getThumbnailImageUrl();
            SelectAllRecipeRes selectAllRecipeRes = new SelectAllRecipeRes(Boards.get(i).getId(), "https://pnut.s3.ap-northeast-2.amazonaws.com/"+img, Boards.get(i).getTitle(), Boards.get(i).getVisit(), Boards.get(i).getUserEmail().getNickname(), Boards.get(i).getLikes());
            Recipes.add(selectAllRecipeRes);
        }
        return Recipes;
    };

    public List<BoardDto> findByTitleContainingOrderByCreateDate(String title) {
        List<board> Boards = boardRepository.findByTitleContainingOrderByCreateDate(title);  // 보드 엔티티 모두 찾고
        List<BoardDto> boardDtos = new ArrayList<>();  // DTO로 담을 리스트 생성
        for(int i = 0; i < Boards.size(); i++) {
            BoardDto boardDto = new BoardDto();
            boardDto.setId(Boards.get(i).getId());
            boardDto.setUserEmail(Boards.get(i).getUserEmail());
            boardDto.setTime(Boards.get(i).getTime());
            boardDto.setTitle(Boards.get(i).getTitle());
            boardDto.setContent(Boards.get(i).getContent());
            boardDto.setIngredients(Boards.get(i).getIngredients());
            boardDto.setQuantity(Boards.get(i).getQuantity());
            boardDto.setThumbnail_image_url(Boards.get(i).getThumbnailImageUrl());
            boardDtos.add(boardDto);
        }
        return boardDtos;
    }

    public List<BoardDto> findByTitleContainingOrderByLikesDesc(String title) {
        List<board> Boards = boardRepository.findByTitleContainingOrderByLikesDesc(title);  // 보드 엔티티 모두 찾고
        List<BoardDto> boardDtos = new ArrayList<>();  // DTO로 담을 리스트 생성
        for(int i = 0; i < Boards.size(); i++) {
            BoardDto boardDto = new BoardDto();
            boardDto.setId(Boards.get(i).getId());
            boardDto.setUserEmail(Boards.get(i).getUserEmail());
            boardDto.setTime(Boards.get(i).getTime());
            boardDto.setTitle(Boards.get(i).getTitle());
            boardDto.setContent(Boards.get(i).getContent());
            boardDto.setIngredients(Boards.get(i).getIngredients());
            boardDto.setQuantity(Boards.get(i).getQuantity());
            boardDto.setThumbnail_image_url(Boards.get(i).getThumbnailImageUrl());
            boardDtos.add(boardDto);
        }
        return boardDtos;
    }

    public List<BoardDto> findAllByUserEmail(User userEmail) {
        List<board> Boards = boardRepository.findAllByUserEmail(userEmail);  // 보드 엔티티 모두 찾고

        List<BoardDto> boardDtos = new ArrayList<>();  // DTO로 담을 리스트 생성
        for(int i = 0; i < Boards.size(); i++) {
            BoardDto boardDto = new BoardDto();
            boardDto.setId(Boards.get(i).getId());
            boardDto.setUserEmail(Boards.get(i).getUserEmail());
            boardDto.setTime(Boards.get(i).getTime());
            boardDto.setTitle(Boards.get(i).getTitle());
            boardDto.setContent(Boards.get(i).getContent());
            boardDto.setIngredients(Boards.get(i).getIngredients());
            boardDto.setQuantity(Boards.get(i).getQuantity());
            boardDto.setThumbnail_image_url(Boards.get(i).getThumbnailImageUrl());
            boardDtos.add(boardDto);
        }
        return boardDtos;
    }

}
