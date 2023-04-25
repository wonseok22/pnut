package com.ssafy.pnut.controller;

import com.ssafy.pnut.dto.FoodDto;
import com.ssafy.pnut.dto.IngredientDto;
import com.ssafy.pnut.service.FoodService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/foods")
@Api(tags = {"요리 정보 관련 API"})
public class FoodController {
    @Autowired
    private FoodService foodService;

    public static final Logger logger = LoggerFactory.getLogger(FoodController.class);
    private static final String SUCCESS = "success in FoodController";
    private static final String FAIL = "fail in FoodController";
    private static final String ALEADY_EXIST = "already exists in FoodController";

    @ApiOperation(value = "요리 재료 리스트", notes = "자동완성용 요리 재료 리스트 전달 API", response = Map.class)
    @GetMapping("/ingredients")
    public ResponseEntity<?> getIngredients(){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        try{
            List<String> result = foodService.getIngredients();
            if(result==null){
                logger.debug("재료 조회 결과 : {}", "재료 없음");
                resultMap.put("result", null);
                resultMap.put("message", "재료가 존재하지 않음");
                status = HttpStatus.ACCEPTED;
                return new ResponseEntity<>(resultMap, status);
            }
            logger.debug("재료 조회 결과: {}", "성공");
            resultMap.put("list", result);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.OK;
        }catch (Exception e){
            e.printStackTrace();
            logger.error("재료 조회 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "요리 음식 리스트", notes = "자동완성용 요리 음식 리스트 전달 API", response = Map.class)
    @GetMapping("/food")
    public ResponseEntity<?> getFoods(){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        try{
            List<String> result = foodService.getFoods();
            if(result==null){
                logger.debug("음식 조회 결과 : {}", "음식 없음");
                resultMap.put("result", null);
                resultMap.put("message", "음식이 존재하지 않음");
                status = HttpStatus.ACCEPTED;
                return new ResponseEntity<>(resultMap, status);
            }
            logger.debug("음식 조회 결과 : {}", "성공");
            resultMap.put("list", result);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.OK;
        }catch (Exception e){
            e.printStackTrace();
            logger.error("음식 조회 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }
}
