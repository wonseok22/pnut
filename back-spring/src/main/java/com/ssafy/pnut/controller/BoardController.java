package com.ssafy.pnut.controller;

import com.ssafy.pnut.common.response.BaseResponseBody;
import com.ssafy.pnut.dto.*;
import com.ssafy.pnut.entity.*;
import com.ssafy.pnut.service.*;
import io.swagger.annotations.*;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.boot.autoconfigure.neo4j.Neo4jProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Api(value = "게시판 API", tags = {"Board"})
@RequiredArgsConstructor
@RestController
@RequestMapping("/boards")
public class BoardController {

    private final BoardServiceImpl boardService;
    private final BoardStepsServiceImpl boardStepsService;
    private final AwsS3Service awsS3Service;

    private final UserServiceImpl userService;

    private final LikeServiceImpl likeService;

    private final CommentServiceImpl commentService;


    @PostMapping("/create")
    @ApiOperation(value = "게시판 글 작성", notes = "<strong>게시판 글 작성</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> createRecipe(@RequestPart @ApiParam(value="게시글 정보", required = true) RecipeCreateReq recipeCreateReq, @RequestPart @ApiParam(value="file", required = false) List<MultipartFile> file, HttpServletRequest request) {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            recipeCreateReq.setUserEmail(userDto.getEmail());  //  글 작성 유저 정보 저장

            String thumbnailImg = awsS3Service.uploadImage(file.get(0));  // 썸네일 이미지 S3에 올림
            file.remove(0);  // 리스트에서 썸네일 삭제

            board Board = boardService.save(recipeCreateReq, thumbnailImg);  // 단계들 빼고 글, 사진 DB에 올리고 게시글 번호 반환
            List<String> ImgNameList = awsS3Service.uploadImages(file);  // 레시피 단계 사진들 S3에 게시

            boardStepsService.save(recipeCreateReq.getRecipe_steps(), Board, ImgNameList, recipeCreateReq.getStepNums());  // 레시피 단계 글이랑 사진 DB에 저장

            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(200).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @PatchMapping("/{boardId}")
    @ApiOperation(value = "게시판 글 수정", notes = "<strong>게시판 글 수정</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> patchRecipe(@PathVariable("boardId") Long id, @RequestPart @ApiParam(value="게시글 정보", required = true) RecipeCreateReq recipeCreateReq, @RequestPart @ApiParam(value="file", required = false) List<MultipartFile> file, HttpServletRequest request) {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            Optional<board> Board = boardService.findById(id);  // 작성한 게시판 불러옴
            if(!Board.isPresent())  // id에 맞는 게시글이 없으면 null리턴
                return ResponseEntity.status(200).body(BaseResponseBody.of(401, "There's no such BoardId"));

            if(Board.get().getUserEmail().getEmail() != userDto.getEmail()) {  // 본인이 작성한 레시피가 아니라면
                return ResponseEntity.status(200).body(BaseResponseBody.of(401, "Unauthorized"));
            }

            String thumbnailImg = awsS3Service.uploadImage(file.get(0));  // 썸네일 이미지 S3에 올림
            file.remove(0);  // 리스트에서 썸네일 삭제

            Board.get().setContent(recipeCreateReq.getContent());
            Board.get().setTime(recipeCreateReq.getTime());
            Board.get().setTitle(recipeCreateReq.getTitle());
            Board.get().setQuantity(recipeCreateReq.getQuantity());
            Board.get().setIngredients(recipeCreateReq.getIngredients());
            Board.get().setThumbnailImageUrl(thumbnailImg);

            boardService.save(Board.get());  // 단계들 빼고 글, 사진 DB에 올리고 게시글 번호 반환

            // 기존 레시피 단계들 다 삭제
            List<boardSteps> steps = boardStepsService.findAllByBoardIdOrderByIdAsc(Board.get());
            for(int i = 0; i < steps.size(); i++) {
                awsS3Service.deleteImage(steps.get(i).getImageUrl());  //  S3에 올렸던 단계별 이미지들 다 삭제
            }
            boardStepsService.deleteAllByBoardId(Board.get());  // 단계들 다 삭제

            List<String> ImgNameList = awsS3Service.uploadImages(file);  // 레시피 단계 사진들 S3에 게시

            boardStepsService.save(recipeCreateReq.getRecipe_steps(), Board.get(), ImgNameList, recipeCreateReq.getStepNums());  // 레시피 단계 글이랑 사진 DB에 저장

            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @DeleteMapping("/{id}")
    @ApiOperation(value = "게시판 글 삭제", notes = "<strong>게시판 글 삭제</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> deleteRecipe(@PathVariable("id") Long id, HttpServletRequest request) {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            Optional<board> Board = boardService.findByIdAndUserEmail(id, userDto.toEntity());
            if(!Board.isPresent())  // id에 맞는 게시글이 없으면 null리턴
                return ResponseEntity.status(400).body(BaseResponseBody.of(400, "There's no such BoardId"));
            else {
                if(Board.get().getUserEmail().getEmail() != userDto.getEmail()) {  // 본인이 작성한 레시피가 아니라면
                    return ResponseEntity.status(200).body(BaseResponseBody.of(401, "Unauthorized"));
                }

                boardService.deleteById(id);
            }
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("")
    @ApiOperation(value = "게시판 글 전체 조회", notes = "<strong>게시판 글 전체 조회</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> selectAllRecipe() throws IOException {
        try {

            List<BoardDto> Boards = boardService.findAll();
            List<SelectAllRecipeRes> Recipes = new ArrayList<>();
            for(int i = 0; i < Boards.size(); i++) {
                String img = Boards.get(i).getThumbnail_image_url();
                SelectAllRecipeRes selectAllRecipeRes = new SelectAllRecipeRes(Boards.get(i).getId(), "https://pnut.s3.ap-northeast-2.amazonaws.com/"+img, Boards.get(i).getTitle(), Boards.get(i).getVisit(), Boards.get(i).getUserEmail().getNickname(), Boards.get(i).getLikes());
                Recipes.add(selectAllRecipeRes);
            }

            return ResponseEntity.status(200).body(Recipes);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body(BaseResponseBody.of(400, "Bad Request"));
        }
    }

    @GetMapping("/board/{id}")
    @ApiOperation(value = "게시판 상세 페이지", notes = "<strong>게시판 글 상세 페이지</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> selectRecipe(@PathVariable("id") Long id, HttpServletRequest request) throws IOException {
        try {
            Optional<board> Board = boardService.findById(id);

            if(!Board.isPresent())  // id에 맞는 게시글이 없으면 null리턴
                return ResponseEntity.status(200).body(BaseResponseBody.of(401, "There's no such BoardId"));
            else {  // id에 맞는 게시글이 있다면

                // 조회수 올리기
                int visit = Board.get().getVisit() + 1;
                Board.get().setVisit(visit);
                boardService.save(Board.get());

                SelectOneRecipeRes selectOneRecipeRes = new SelectOneRecipeRes();

                // 사용자가 좋아요 했는지 여부를 판단 위함 + 토큰 여부
                int tokenChk = 0;   // 토큰 없음
                if(request.getHeader("Authorization") == null) {
                    selectOneRecipeRes.setLikeOrNot(0);  // 좋아요 체크 안한상태로 보냄
                } else {
                    tokenChk = 1;
                }

                selectOneRecipeRes.setTime(Board.get().getTime());
                selectOneRecipeRes.setQuantity(Board.get().getQuantity());
                selectOneRecipeRes.setTitle(Board.get().getTitle());
                selectOneRecipeRes.setIngredients(Board.get().getIngredients());
                selectOneRecipeRes.setContent(Board.get().getContent());
                selectOneRecipeRes.setThumbnailImageUrl("https://pnut.s3.ap-northeast-2.amazonaws.com/"+Board.get().getThumbnailImageUrl());
                selectOneRecipeRes.setVisit(Board.get().getVisit());
                selectOneRecipeRes.setNickName(Board.get().getUserEmail().getNickname());

                List<boardSteps> BoardSteps = boardStepsService.findAllByBoardIdOrderByIdAsc(Board.get());
                Map<String, String> steps = new LinkedHashMap<>();  // 레시피 단계 담을 해시맵
                for(int i = 0; i < BoardSteps.size(); i++) {
                    if(BoardSteps.get(i).getImageUrl() == null)
                        steps.put(BoardSteps.get(i).getContent(), BoardSteps.get(i).getImageUrl());
                    else
                        steps.put(BoardSteps.get(i).getContent(), "https://pnut.s3.ap-northeast-2.amazonaws.com/"+BoardSteps.get(i).getImageUrl());
                }

                selectOneRecipeRes.setRecipeSteps(steps);

                // 좋아요 수
                long likes = likeService.countByBoardId(Board.get());
                selectOneRecipeRes.setLikes(likes);

                // 댓글들
                List<CommentRes> comments = commentService.findAllByBoardId(Board.get());
                selectOneRecipeRes.setComments(comments);

                // 현재 사용자가 좋아요 했는지 여부
                if(tokenChk == 1) {  // 토큰이 있다면!
                    UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
                    Optional<likeTable> like = likeService.findByBoardIdAndUserEmail(Board.get(), userDto.toEntity());
                    if (!like.isPresent()) {
                        selectOneRecipeRes.setLikeOrNot(0);  // 좋아요 하지 않음
                    } else {
                        selectOneRecipeRes.setLikeOrNot(1);  // 좋아요 표시함
                    }
                }

                return ResponseEntity.status(200).body(selectOneRecipeRes);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(400).body(BaseResponseBody.of(400, "Bad Request"));
        }
    }

    @PostMapping("/like/{id}")
    @ApiOperation(value = "게시판 글 좋아요", notes = "<strong>게시판 글 좋아요</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> likeRecipe(@PathVariable("id") Long id, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            Optional<board> Board = boardService.findById(id);
            if(!Board.isPresent()) {
                return ResponseEntity.status(400).body(BaseResponseBody.of(400, "There's no such BoardId"));
            }
            LikeDto likeDto = new LikeDto(userDto.toEntity(), Board.get());
            likeService.save(likeDto);
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @DeleteMapping("/like/{id}")
    @ApiOperation(value = "게시판 글 좋아요 취소", notes = "<strong>게시판 글 좋아요 취소</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> cancelLikeRecipe(@PathVariable("id") Long id, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            Optional<board> Board = boardService.findById(id);
            if(!Board.isPresent()) {
                return ResponseEntity.status(400).body(BaseResponseBody.of(400, "There's no such BoardId"));
            }
            if(userDto.getEmail() != commentService.findById(id).get().getUserEmail().getEmail()) {  // 본인이 아니라면
                return ResponseEntity.status(400).body(BaseResponseBody.of(401, "UnAuthorized"));
            }
            Optional<likeTable> like = likeService.findByBoardIdAndUserEmail(Board.get(), userDto.toEntity());
            likeService.deleteById(like.get().getId());
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @PostMapping("/comments/{boardId}")
    @ApiOperation(value = "게시판 댓글 작성", notes = "<strong>게시판 댓글 작성</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> commentBoard(@PathVariable("boardId") Long id, @RequestBody @ApiParam(value="댓글 내용", required = true) CommentReq commentReq, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            Optional<board> Board = boardService.findById(id);
            if(!Board.isPresent()) {
                return ResponseEntity.status(400).body(BaseResponseBody.of(401, "There's no such BoardId"));
            }
            CommentDto commentDto = new CommentDto(userDto.toEntity(), Board.get(), commentReq.getContent(), LocalDateTime.now());
            commentService.save(commentDto.toEntity());
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @PatchMapping("/comments/{commentId}")
    @ApiOperation(value = "게시판 댓글 수정", notes = "<strong>게시판 댓글 수정</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> patchCommentBoard(@PathVariable("commentId") Long id, @RequestBody @ApiParam(value="댓글 내용", required = true) CommentReq commentReq, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            Optional<comment> comment = commentService.findById(id);
            if(!comment.isPresent()) {
                return ResponseEntity.status(400).body(BaseResponseBody.of(401, "There's no such commentId"));
            }
            if(userDto.getEmail() != commentService.findById(id).get().getUserEmail().getEmail()) {  // 본인이 아니라면
                return ResponseEntity.status(400).body(BaseResponseBody.of(401, "UnAuthorized"));
            }
            comment.get().setContent(commentReq.getContent());
            commentService.save(comment.get());
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }


    @DeleteMapping("/comments/{commentId}")
    @ApiOperation(value = "게시판 댓글 삭제", notes = "<strong>게시판 댓글 삭제</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> deleteCommentBoard(@PathVariable("commentId") Long id, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            if(!commentService.findById(id).isPresent()) {
                return ResponseEntity.status(400).body(BaseResponseBody.of(400, "There's no such BoardId"));
            }
            if(userDto.getEmail() != commentService.findById(id).get().getUserEmail().getEmail()) {
                return ResponseEntity.status(400).body(BaseResponseBody.of(401, "UnAuthorized"));
            }
            commentService.deleteById(id);
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("/top3")
    @ApiOperation(value = "게시판 글 3위까지 조회", notes = "<strong>게시판 글 3위까지 조회</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> getTopRecipes() throws IOException {
        try {
            List<SelectAllRecipeRes> boards = boardService.findTop3ByOrderByLikesDesc();
            return ResponseEntity.status(200).body(boards);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("/search/date/{cuisineName}")
    @ApiOperation(value = "게시판에서 요리 이름 찾기_최신순", notes = "<strong>게시판에서 요리 이름으로 찾기_최신순</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> getBoardCuisineOrderByDate(@PathVariable("cuisineName") String title) throws IOException {
        try {
            List<BoardDto> Boards = boardService.findByTitleContainingOrderByCreateDate(title);
            List<SelectAllRecipeRes> Recipes = new ArrayList<>();
            for(int i = 0; i < Boards.size(); i++) {
                String img = Boards.get(i).getThumbnail_image_url();
                SelectAllRecipeRes selectAllRecipeRes = new SelectAllRecipeRes(Boards.get(i).getId(), "https://pnut.s3.ap-northeast-2.amazonaws.com/"+img, Boards.get(i).getTitle(), Boards.get(i).getVisit(), Boards.get(i).getUserEmail().getNickname(), Boards.get(i).getLikes());
                Recipes.add(selectAllRecipeRes);
            }

            return ResponseEntity.status(200).body(Recipes);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("/search/likes/{cuisineName}")
    @ApiOperation(value = "게시판에서 요리 이름 찾기_좋아요순", notes = "<strong>게시판에서 요리 이름으로 찾기_좋아요순</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> getBoardCuisineOrderByLikes(@PathVariable("cuisineName") String title) throws IOException {
        try {
            List<BoardDto> Boards = boardService.findByTitleContainingOrderByLikesDesc(title);
            List<SelectAllRecipeRes> Recipes = new ArrayList<>();
            for(int i = 0; i < Boards.size(); i++) {
                String img = Boards.get(i).getThumbnail_image_url();
                SelectAllRecipeRes selectAllRecipeRes = new SelectAllRecipeRes(Boards.get(i).getId(), "https://pnut.s3.ap-northeast-2.amazonaws.com/"+img, Boards.get(i).getTitle(), Boards.get(i).getVisit(), Boards.get(i).getUserEmail().getNickname(), Boards.get(i).getLikes());
                Recipes.add(selectAllRecipeRes);
            }

            return ResponseEntity.status(200).body(Recipes);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("/mypage")
    @ApiOperation(value = "내가 작성한 레시피 전체 조회", notes = "<strong>내가 작성한 레시피 전체 조회</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> getMyRecipes(HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            List<BoardDto> Boards = boardService.findAllByUserEmail(userDto.toEntity());
            List<SelectAllRecipeRes> Recipes = new ArrayList<>();
            for(int i = 0; i < Boards.size(); i++) {
                String img = Boards.get(i).getThumbnail_image_url();
                SelectAllRecipeRes selectAllRecipeRes = new SelectAllRecipeRes(Boards.get(i).getId(), "https://pnut.s3.ap-northeast-2.amazonaws.com/"+img, Boards.get(i).getTitle(), Boards.get(i).getVisit(), Boards.get(i).getUserEmail().getNickname(), Boards.get(i).getLikes());
                Recipes.add(selectAllRecipeRes);
            }

            return ResponseEntity.status(200).body(Recipes);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

}
