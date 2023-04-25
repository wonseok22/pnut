package com.ssafy.pnut.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssafy.pnut.common.response.BaseResponseBody;
import com.ssafy.pnut.dto.*;
import com.ssafy.pnut.entity.category;
import com.ssafy.pnut.entity.question;
import com.ssafy.pnut.entity.result;
import com.ssafy.pnut.service.*;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import springfox.documentation.spring.web.json.Json;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.google.common.base.Predicates.equalTo;
import static com.mysema.commons.lang.Assert.assertThat;

@Api(value = "설문 API", tags = {"survey"})
@RequiredArgsConstructor
@RestController
@RequestMapping("/survey")
public class QuestionController {

    private final CategoryServiceImpl categoryService;
    private final QuestionServiceImpl questionService;

    private final ResultServiceImpl resultService;
    private final UserServiceImpl userService;

    @GetMapping("")
    @ApiOperation(value = "설문에서 전체 증상 조회", notes = "<strong>설문에서 전체 증상 조회</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> selectAllSymptoms(HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            List<String> symptoms = new ArrayList<>();
            List<category> categories = categoryService.findAll();
            symptoms.add(userDto.getNickname());  // 처음값은 닉네임..
            for(int i = 0; i < categories.size(); i++) {  // 증상 이름들만 리스트로 수집
                String symptom = categories.get(i).getName();
                symptoms.add(symptom);
            }

            return ResponseEntity.status(200).body(symptoms);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("/{categoryId}")
    @ApiOperation(value = "선택 카테고리의 질문들 조회", notes = "<strong>선택 카테고리의 질문들 조회</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> selectSymptomsByCategory(@PathVariable("categoryId") Long id, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));
            List<String> questionlist = new ArrayList<>();

            questionlist.add(userDto.getNickname());  // 인덱스 0값에는 유저 닉네임 넣어주기

            // id에 맞는 카테고리 엔티티 구하기 (question에 category외래키가 객체로 저장되어있어서)
            Optional<category> category = categoryService.findById(id);

            List<question> questions = questionService.findAllByCategoryIdOrderById(category.get());  // 카테고리에 맞는 질문들을 순서대로 가져오기
            for(int i = 0; i < questions.size(); i++) {  // 질문 내용들만 리스트로 수집
                String str = questions.get(i).getContent();
                questionlist.add(str);
            }

            return ResponseEntity.status(200).body(questionlist);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @PostMapping("/{categoryId}")
    @ApiOperation(value = "설문 질문에 대한 답변 저장", notes = "<strong>설문 질문에 대한 답변 저장</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> saveResult(@PathVariable("categoryId") Long id, @RequestBody ResultReq resultReq, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            // id에 맞는 카테고리 엔티티 구하기 (question에 category외래키가 객체로 저장되어있어서)
            Optional<category> category = categoryService.findById(id);
            List<question> questions = questionService.findAllByCategoryIdOrderById(category.get());  // 카테고리에 맞는 질문들을 순서대로 가져오기

            Optional<result> res = resultService.findByQuestionIdAndUserEmail(questions.get(0), userDto.toEntity());
            if(res.isPresent()) {
                return ResponseEntity.status(409).body(BaseResponseBody.of(409, "data conflict"));
            }

            for(int i = 0; i < questions.size(); i++) {
                Optional<question> questionId = questionService.findById(questions.get(i).getId());
                ResultDto resultDto = new ResultDto(userDto.toEntity(), questionId.get(), Integer.parseInt(resultReq.getResponses().get(i)));
                resultService.save(resultDto.toEntity());
            }

//            String user_email = userDto.getEmail();
//            RequestEntity<String> req2 = RequestEntity.post(new URI("http://j8a704.p.ssafy.io:8000/foods"))
//                    .accept(MediaType.APPLICATION_JSON)
//                    .body(user_email);
//            System.out.println(req2);
//            addHeader(userDto.getEmail());  // 장고 api 호출 => front에서 하기로함
//          ResponseEntity<Resource> response = restTemplete.exchange(request, Resource.class);
            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    public ResponseEntity<? extends Object> addHeader(String user_email) throws URISyntaxException, JsonProcessingException {
//// url 생성
//        URI url = URI.create("http://j8a704.p.ssafy.io:8000/foods/");
//
//// requestEntity 생성 (방법1)
////header, method, url 을 파라미터로 하여 생성자 호출
//        HttpHeaders headers = new HttpHeaders();
//        RequestEntity<String> req = new RequestEntity<>(headers, HttpMethod.GET, url);


// requestEntity 생성 (방법2)
//        RequestEntity<String> req2 = RequestEntity.post(new URI("http://j8a704.p.ssafy.io:8000/foods/"))
//                .accept(MediaType.APPLICATION_JSON)
//                .body(user_email);


//        방법3
//        RestTemplate restTemplate = new RestTemplate();
//
//        // Header set
//        HttpHeaders httpHeaders = new HttpHeaders();
//        httpHeaders.setContentType(MediaType.APPLICATION_JSON);
//
//        // Body set
//        MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
//        body.add("user_email", user_email);
//
//        // Message

//        HttpEntity<?> requestMessage = new HttpEntity<>(body, httpHeaders);
//
//
//        // Request
            String url = "https://pnut.site/foods/calc";
//        HttpEntity<String> response = restTemplate.getForEntity(url, requestMessage, String.class);
//
//        // Response 파싱
//        ObjectMapper objectMapper = new ObjectMapper();
//        objectMapper.configure(DeserializationFeature.ACCEPT_EMPTY_STRING_AS_NULL_OBJECT, true);
//        ResponseDto dto = objectMapper.readValue(response.getBody(), FlaskResponseDto.class);

//        Get으로 하는 방법
        RestTemplate restTemplate = new RestTemplate();

        ResponseEntity<String> response
                = restTemplate.getForEntity(url + "?user_email="+  user_email, String.class);
//        assertThat(response.getStatusCode(), equalTo(HttpStatus.OK));
        return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
    }

    @Transactional
    @DeleteMapping("/mypage/{categoryId}")
    @ApiOperation(value = "기존 증상 관련 설문답변들 삭제", notes = "<strong>기존 증상 관련 설문답변들 삭제</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> deleteMyResult(@PathVariable("categoryId") Long id, HttpServletRequest request) throws IOException {
        try {
            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            // id에 맞는 카테고리 엔티티 구하기 (question에 category외래키가 객체로 저장되어있어서)
            Optional<category> category = categoryService.findById(id);
            List<question> questions = questionService.findAllByCategoryIdOrderById(category.get());  // 카테고리에 맞는 질문들을 순서대로 가져오기
            for(int i = 0; i < questions.size(); i++) {  // 해당 카테고리의 질문들의 수대로 사용자가 저장한 답변들 다 삭제
                resultService.deleteByQuestionIdAndUserEmail(questions.get(i), userDto.toEntity());
            }

            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @GetMapping("/mypage")
    @ApiOperation(value = "마이페이지에서 본인 설문 조회", notes = "<strong>마이페이지에서 본인 설문 조회</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> selectMyResponses(HttpServletRequest request) throws IOException {
        try {

            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            List<result> results = resultService.findByUserEmailOrderByIdAsc(userDto.toEntity());  // 결과 가져옴

            Long cnt = categoryService.countBy();  // 증상 카테고리 전체갯수

            List<List<MyResultReq>> myResultReqs = new ArrayList<>();  // 증상 갯수별로 리스트만듬
            for(int i = 0; i <= cnt; i++) {
                myResultReqs.add(new ArrayList<>());
            }
            for(int i = 0; i < results.size(); i++) {  // 결과들 각각을 리스트의 증상에 맞게 저장함
                MyResultReq myResultReq = new MyResultReq(results.get(i).getQuestionId().getId(), results.get(i).getDegree(), results.get(i).getQuestionId().getCategoryId().getId());
                myResultReqs.get(results.get(i).getQuestionId().getCategoryId().getId().intValue()).add(myResultReq);
            }
            return ResponseEntity.status(200).body(myResultReqs);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }

    @PatchMapping("/mypage/{categoryId}")
    @ApiOperation(value = "마이페이지에서 본인 설문 수정", notes = "<strong>마이페이지에서 본인 설문 수정</strong>")
    @ApiResponses({
            @ApiResponse(code = 200, message = "성공"),
            @ApiResponse(code = 204, message = "No Content"),
            @ApiResponse(code = 401, message = "인증 실패"),
            @ApiResponse(code = 404, message = "사용자 없음"),
            @ApiResponse(code = 500, message = "서버 오류")
    })
    public ResponseEntity<? extends Object> modifyMyResponses(@PathVariable("categoryId") Long id, @RequestBody ResultReq resultReq, HttpServletRequest request) throws IOException {
        try {

            UserDto userDto = userService.getUserByToken(request.getHeader("Authorization").substring(7));

            // 기존 결과 가져오기
            List<result> myresults = resultService.findByUserEmailOrderByIdAsc(userDto.toEntity());
            int idx = 0;
            for(int i = 0; i < myresults.size(); i++) {
                if(myresults.get(i).getQuestionId().getCategoryId().getId() == id) {  // 결과의 카테고리가 수정하려는 증상의 카테고리와 같다면
                    myresults.get(i).setDegree(Integer.parseInt(resultReq.getResponses().get(idx)));  // id순별로 카테고리 질문에 대한 degree를 수정
                    resultService.save(myresults.get(i));
                    idx++;
                }
            }


            return ResponseEntity.status(200).body(BaseResponseBody.of(200, "Success"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(401).body(BaseResponseBody.of(401, "Bad Request"));
        }
    }


}
