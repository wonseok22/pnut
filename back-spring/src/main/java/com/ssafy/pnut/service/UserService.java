package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.UserDto;
import com.ssafy.pnut.dto.UserSocialLoginDto;
import com.ssafy.pnut.entity.User;

import java.util.Map;

public interface UserService {
    User getUser(String email);
    User registerUser(User user) throws Exception;
    User loginUser(User user) throws Exception;
    User modifyUser(User user) throws Exception;
    int deleteUser(String email);
    User checkUser(String type, String value);
    void saveRefreshToken(String email, String refreshToken);
    String getRefreshtoken(String email);
    void delRefreshToken(String email);
    Map<String, Object> searchUser(String keyword, int pageNo);
    UserSocialLoginDto socialLogin(User user, String refreshToken);
    UserDto getUserByToken(String token);

}
