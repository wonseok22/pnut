package com.ssafy.pnut.controller;

import com.ssafy.pnut.dto.UserDto;
import com.ssafy.pnut.dto.UserMailMessageDto;
import com.ssafy.pnut.dto.UserMailPostDto;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.service.AwsS3Service;
import com.ssafy.pnut.service.UserService;
import com.ssafy.pnut.util.JwtService;
import com.ssafy.pnut.util.MailService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins={"*"}, maxAge = 6000)
@RestController
@RequestMapping("/users")
@Api(tags = {"회원 관리 API"})
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private MailService userMailService;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AwsS3Service awsS3Service;

    public static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private static final String SUCCESS = "success in UserController";
    private static final String FAIL = "fail in UserController";
    private static final String ALREADY_EXIST = "already exists in UserController";
    private static final String BASEURL = "https://pnut.s3.ap-northeast-2.amazonaws.com/";

    @ApiOperation(value = "회원가입", notes = "회원가입 요청 API", response = Map.class)
    @PostMapping("")
    public ResponseEntity<?> registerUser(
            @RequestBody @ApiParam(value="회원가입 시 필요한 정보", required = true) UserDto userDto){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;


        try{
            //create UserEntity by Builder Pattern
//            if(redisUtil.getData(userDto.getEmail()).equals("validate")){
            LocalDateTime time = LocalDateTime.now();
            userDto.setJoinDate(time);
            userDto.setAuth("");
            userDto.setProfileImageUrl("basic_profile_image_37d8I092LMX89-removebg-preview.png");
            userDto.setType("");
                User user = userDto.toEntity();
                User result = userService.registerUser(user);
                if (result != null) {
                    resultMap.put("message", SUCCESS);
                    resultMap.put("email", user.getEmail());
                    resultMap.put("password", user.getPassword());
                    status = HttpStatus.OK;
                    //if success register, return success message , 200 response code
                } else {
                    resultMap.put("message", FAIL);
                    status = HttpStatus.ACCEPTED;
                    // if fail register user, return fail message , user info no validation, 204 response code
                }
//            }else{
//                logger.error("이메일 인증 실패 : {}");
//                resultMap.put("message", "이메일 인증 실패");
//                status = HttpStatus.UNAUTHORIZED;
//            }
        }catch (Exception e){
            logger.error("회원가입 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            //if occurred error during register, return fail message , 500 response code
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "로그인", notes = "access-token, Refresh-token과 로그인 결과 메시지를 반환한다.", response = Map.class)
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(
            @RequestBody @ApiParam(value = "로그인 시 필요한 회원정보.", required = true) UserDto userDto){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        try{
            User loginUser = userService.loginUser(userDto.toEntity());
            if(loginUser != null){
                String accessToken = jwtService.createAccessToken("email", loginUser.getEmail()); //key, value
                String refreshToken = jwtService.createRefreshToken("email", loginUser.getEmail());
                userService.saveRefreshToken(userDto.toEntity().getEmail(), refreshToken);
                logger.debug("로그인 accessToken 정보 : {}", accessToken);
                logger.debug("로그인 refreshToken 정보 : {}", refreshToken);
                resultMap.put("access-token", accessToken);
                resultMap.put("refresh-token", refreshToken);
                resultMap.put("email", loginUser.getEmail());
                resultMap.put("nickname", loginUser.getNickname());
                resultMap.put("type", loginUser.getType());
                resultMap.put("message", SUCCESS);
                System.out.println(accessToken);

                System.out.println(jwtService.getUserNameFromToken(accessToken));
                status = HttpStatus.OK;
            }else{
                logger.debug("password error");
                resultMap.put("message", FAIL);
                status = HttpStatus.ACCEPTED;
            }
        } catch(Exception e){
            e.printStackTrace();
            logger.error("로그인 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "로그아웃", notes = "로그아웃하는 유저의 refresh token을 삭제한다.", response = Map.class)
    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;
        String email = userService.getUserByToken(request.getHeader("access-token")).getEmail();

        try{
            userService.delRefreshToken(email);
            resultMap.put("message", SUCCESS);
            status = HttpStatus.OK;
        }catch(Exception e){
            logger.error("로그아웃 실패 : {}", e);
            resultMap.put("message", e.getMessage());
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "회원정보 수정", notes = "회원정보를 수정한다", response = Map.class)
    @PutMapping(path = "")
    public ResponseEntity<?> modifyUser(
            @RequestPart(value = "userDto") @ApiParam(value = "수정하려는 회원정보") UserDto userDto, HttpServletRequest request, @RequestPart(value = "multipartFile", required = false) @ApiParam(value = "multipartFile")MultipartFile multipartFile){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        if(jwtService.checkToken(request.getHeader("access-token"))){
            try{
                userDto.setAuth("");
                userDto.setType("");
                String email = jwtService.getUserNameFromToken(request.getHeader("access-token"));
                User now = userService.getUser(email);

                String fileName;
                if(userDto.getAge()==null) {
                    userDto.setAge(now.getAge());
                }
                if(userDto.getGender()==null) {
                    userDto.setGender(now.getGender());
                }
                if(userDto.getName()==null){
                    userDto.setName(now.getName());
                }
                if(userDto.getNickname()==null){
                    userDto.setNickname(now.getNickname());
                }
                if(userDto.getProfileImageUrl()==null){
                    fileName = awsS3Service.uploadProfileImage(multipartFile);
                }
                else {
                    fileName = BASEURL+now.getProfile_image_url();
                }
                userDto.setJoinDate(now.getJoin_date());
                userDto.setProfileImageUrl(fileName);
                User result = userService.modifyUser(userDto.toEntity());

                if(result != null){
                    //회원정보 수정 성공한 역ㅇ우, 성공 메시지 반환, 200 응답
                    resultMap.put("message", SUCCESS);
                    logger.debug("수정한 회원정보 : {}", userDto);
                    status = HttpStatus.OK;
                } else{
                    //회원정보 수정 실패한 경우 실패 메시지 반환, 회원 정보 유효 X, 204응답 코드
                    resultMap.put("message", FAIL);
                    status = HttpStatus.ACCEPTED;
                }
            }catch(Exception e){
                //서버 에러 발생한 경우 실패 메시지 반환, 500 응답 코드
                logger.error("회원정보 수정 실패 : {}", e);
                resultMap.put("message", FAIL);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        }else{
            logger.error("access-token 사용 불가능, 재발급 요청");
            resultMap.put("message", FAIL);
            status = HttpStatus.UNAUTHORIZED;
        }

        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "회원탈퇴", notes = "회원정보를 삭제한다", response = Map.class)
    @DeleteMapping("")
    public ResponseEntity<?> deleteUser(
            HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String access_token = request.getHeader("access-token");
        String email = userService.getUserByToken(access_token).getEmail();

        if(access_token == null || "".equals(access_token)){
            logger.error("need access-token : {}");
            resultMap.put("message", FAIL);
            return new ResponseEntity<>(resultMap, status);
        }
        if(jwtService.checkToken(request.getHeader("access-token"))){
            logger.info("회원 탈퇴: 사용 가능한 access-token");
            logger.info("삭제하려는 email : {}", email);
            try{
                int result = userService.deleteUser(email);
                if(result==1){
                    //회원삭제 성공한 경우, 성공 메시지 반환, 200응답 코드
                    logger.debug("탈퇴한 회원 email : {}", email);
                    resultMap.put("message", SUCCESS);
                    status = HttpStatus.OK;
                } else{
                    //회원삭제 실패한 경우 실패 메시지 반환, 회원 정보 유효 x, 204 응답 코드
                    resultMap.put("message", FAIL);
                    status = HttpStatus.ACCEPTED;
                }
            }catch(Exception e){
                //서버에서 에러 발생한 경우 실패 메시지 반환, 500 응답 코드
                logger.error("회원탈퇴 중 에러 발생 : {}", e);
                resultMap.put("message", FAIL);
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        } else{
            logger.error("access-token 사용 불가능, 재발급 요청");
            resultMap.put("message", FAIL);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "회원정보 조회", notes = "회원정보를 반환한다.", response = Map.class)
    @GetMapping("/{userEmail}")
    public ResponseEntity<?> getUser(
            @PathVariable @ApiParam(value = "정보가 필요한 회원의 email", required = true) String userEmail, HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        //전송받은 access-token이 유효할 때만 회원정보를 조회
        if(jwtService.checkToken(request.getHeader("access-token"))){
            logger.info("회원정보 조회 : 사용 가능한 access-token");
            try{
                User user = userService.getUser(userEmail);
                resultMap.put("userInfo", user);
                resultMap.put("message", SUCCESS);
                status = HttpStatus.OK;
            }catch (Exception e){
                logger.error("회원정보 조회 실패 : {}", e);
                resultMap.put("message", e.getMessage());
                status = HttpStatus.INTERNAL_SERVER_ERROR;
            }
        } else{
            logger.error("access-token 사용 불가능, 재발급 요청");
            resultMap.put("message", FAIL);
            status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "access-token 유효성 검사", notes = "access-token 유효성 검사", response = Map.class)
    @PostMapping("/check")
    public ResponseEntity<?> checkToken(HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;
        String token = request.getHeader("access-token");


        //액세스토큰이 유효한지 확인한 후 결과 반환.
        if(jwtService.checkToken(token)){
            resultMap.put("message", SUCCESS);
            status = HttpStatus.OK;
        }else{
            logger.debug("refresh-token 만료.");
            resultMap.put("message", FAIL);
            status = HttpStatus.ACCEPTED;
        }

        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "access-token 재발급", notes = "만료된 access-token을 재발급받는다.", response = Map.class)
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody UserDto userDto, HttpServletRequest request){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status = HttpStatus.ACCEPTED;
        String token = request.getHeader("refresh-token");
        logger.debug("token : {}, userDto : {}", token, userDto);

        //RefreshToken을 받으면 이 토큰이 유효한지 확인한 후 AccessTokne을 재발급한다.
        if(jwtService.checkToken(token)){
            String refreshToken = userService.getRefreshtoken(userDto.getEmail());
            if (refreshToken == null) {
                resultMap.put("message", FAIL);
                return new ResponseEntity<>(resultMap, status);
            }
            if (token.equals(refreshToken)) {
                String accessToken = jwtService.createAccessToken("email", userDto.getEmail());
                logger.debug("refresh-token : {}", accessToken);
                logger.debug("access-token 재발급 완료");
                resultMap.put("access-token", accessToken);
                resultMap.put("message", SUCCESS);
                status = HttpStatus.OK;
            }
        }else{
            logger.debug("refresh-token Expire");
            resultMap.put("message", FAIL);
            status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "중복검사", notes = "email, nickname 중복검사", response = Map.class)
    @PostMapping("/duplication")
    public ResponseEntity<?> checkDuplicate(@RequestParam String type, @RequestParam String value){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        try{
            User result = userService.checkUser(type, value);
            if(result != null){
                if(type.equals("email")) resultMap.put("message", "email duplication");
                else resultMap.put("message", "nickname duplication");
                //존재하는 값인 경우, 200과 중복 메시지 반환
            }else{
                resultMap.put("message", SUCCESS);
            }
            status = HttpStatus.OK;
        }catch (Exception e){
            //서버 에러 발생한 경우 실패 메시지 반환, 500코드
            logger.error("중복 화인중 에러 발생 : {}", e);
            resultMap.put("message", FAIL);
            status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "이메일본인인증요청", notes = "email을 통해 인증번호 요청해 본인인증", response = Map.class)
    @PostMapping("/email")
    public ResponseEntity<?> validateEmail(@RequestBody UserMailPostDto userMailPostDto){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        UserMailMessageDto mailMessage = UserMailMessageDto.builder()
                .to(userMailPostDto.getEmail())
                .subject("Pnut 이메일 인증을 위한 인증 코드 발송")
                .build();

        String code = userMailService.sendMail(mailMessage, "email");
        if (code != null) {
            status = HttpStatus.OK;
            resultMap.put("message", SUCCESS);
        }else{
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            resultMap.put("message", FAIL);
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "이메일본인인증확인", notes = "email을 통해 인증번호 요청해 본인인증", response = Map.class)
    @PostMapping("/email/check")
    public ResponseEntity<?> validateEmailCheck(@RequestBody Map<String, String> map){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;
        System.out.println(map.get("email")+" "+map.get("code"));

        if(userMailService.checkCode(map.get("email"), map.get("code"))){
            resultMap.put("message", SUCCESS);
            status = HttpStatus.OK;
        }else{
            resultMap.put("message", FAIL);
            status = HttpStatus.REQUEST_TIMEOUT;
        }
        return new ResponseEntity<>(resultMap, status);
    }

    @ApiOperation(value = "본인인증 여부 확인", notes = "본인인증이 되었는지 확인", response = Map.class)
    @PostMapping("/auth")
    public ResponseEntity<?> checkAuthentication(@RequestParam String email){
        Map<String, Object> resultMap = new HashMap<>();
        HttpStatus status;

        if(userMailService.checkAuthentification(email)){
            resultMap.put("message", SUCCESS);
            status = HttpStatus.OK;
        }else{
            resultMap.put("message", FAIL);
            status = HttpStatus.UNAUTHORIZED;
        }
        return new ResponseEntity<>(resultMap, status);
    }

//    @ApiOperation(value = "소셜로그인", notes= "access-token, refresh-token과 로그인 결과 메시지 반환", response = Map.class)
//    @PostMapping("/socialLogin")
//    public ResponseEntity<?> socialLogin(
//            @RequestBody @ApiParam(value = "로그인 시 필요한 회원정보.", required = true) UserDto userDto){
//        Map<String, Object> resultMap = new HashMap<>();
//        HttpStatus status;
//
//        try{
//            User loginUser = userDto.toEntity();
//        }
//    }
}
