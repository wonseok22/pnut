package com.ssafy.pnut.service;

import com.ssafy.pnut.dto.UserDto;
import com.ssafy.pnut.dto.UserSocialLoginDto;
import com.ssafy.pnut.entity.User;
import com.ssafy.pnut.repository.UserRepository;
import com.ssafy.pnut.util.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService{
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private AwsS3Service awsS3Service;
//    @Autowired
//    private S3Upload s3Upload;

    @Override
    public User getUser(String email){return userRepository.findByEmail(email);}

    @Override
    @Transactional
    public User registerUser(User user) throws Exception {
        //Password Encoding
        String pw = user.getPassword();
        String hex = "";
        SecureRandom random = SecureRandom.getInstance("SHA1PRNG");
        byte[] bytes = new byte[16];
        random.nextBytes(bytes);
        String salt = new String(Base64.getEncoder().encode(bytes));
        String rawAndSalt = pw + salt;
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(rawAndSalt.getBytes());
        hex = String.format("%064x", new BigInteger(1, md.digest()));
        //User build
        user.setSalt(salt);
        user.setPassword(hex);
        user.setJoin_date(LocalDateTime.now());
        user.setType("default");

        return userRepository.save(user);
    }

    @Override
    public User loginUser(User user) throws Exception {
        User findUser = userRepository.findByEmail(user.getEmail());
        if(findUser == null) return null;

        String salt = findUser.getSalt();
        String userPwd = user.getPassword();
        userPwd+=salt;
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        //pw+salt encryption
        md.update(userPwd.getBytes());
        userPwd = String.format("%064x", new BigInteger(1, md.digest()));

        if(userPwd.equals(findUser.getPassword())) return findUser;
        else return null;
    }

    @Override
    public User modifyUser(User user) throws Exception {
        User findUser = userRepository.findByEmail(user.getEmail());
        if(findUser==null) return null;
        int flag = 1;
        if(user.getPassword()==null) flag=0;

        String salt = findUser.getSalt();
        String userPwd = user.getPassword();
        userPwd+=salt;
        MessageDigest md = MessageDigest.getInstance("SHA-256");

        //pw+salt encryption
        md.update(userPwd.getBytes());
        userPwd = String.format("%064x", new BigInteger(1, md.digest()));
        findUser.setSalt(salt);
        if(flag==1) findUser.setPassword(userPwd);
        findUser.setAge(user.getAge());
        findUser.setGender(user.getGender());
        findUser.setName(user.getName());
        findUser.setProfile_image_url(user.getProfile_image_url());
        findUser.setNickname(user.getNickname());

        findUser.setType("default");
        return userRepository.save(findUser);
    }

    @Override
    @Transactional
    public int deleteUser(String email) {
        User user = userRepository.findByEmail(email);
        try{
            awsS3Service.deleteImage(user.getProfile_image_url().split("/")[1]);
        }catch(Exception e){
            System.err.println("프로필 사진 삭제 중 에러 발생");
            e.printStackTrace();
        }
        return userRepository.deleteByEmail(email);
    }

    @Override
    public User checkUser(String type, String value) {
        if(type.equals("email")){
            return userRepository.findByEmail(value);
        }else if(type.equals("nickname")){
            return userRepository.findByNickname(value);
        }
        return null;
    }

    @Override
    public void saveRefreshToken(String email, String refreshToken) {
        User user = userRepository.findByEmail(email);
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
    }

    @Override
    public String getRefreshtoken(String email) {
        User user = userRepository.findByEmail(email);
        return user !=null? user.getRefreshToken() : null;
    }

    @Override
    public void delRefreshToken(String email) {
        User user = userRepository.findByEmail(email);
        user.setRefreshToken(null);
        userRepository.save(user);
    }

    @Override
    public Map<String, Object> searchUser(String keyword, int pageNo) {
        Map<String, Object> searchResult = new HashMap<>();
//        Slice<User> slice = userRepository.findAllByNickname("%" + keyword + "%", PageRequest.of(pageNo, 20));
        //잠시대기
        return searchResult;
    }

    @Override
    public UserSocialLoginDto socialLogin(User userDto, String refreshToken) {
        User user = userRepository.findByEmail(userDto.getEmail());
        UserSocialLoginDto socialLoginDto;

        if(user!=null){
            user = new User();

            user.setEmail(userDto.getEmail());
            user.setNickname(userDto.getNickname());
            user.setJoin_date(LocalDateTime.now());
            user.setType(userDto.getType());
            user.setRefreshToken(refreshToken);
            socialLoginDto = UserSocialLoginDto.toDto(user);
            socialLoginDto.setInitial(true);
        }
        else{
            socialLoginDto = UserSocialLoginDto.toDto(user);
        }
        user.setRefreshToken(refreshToken);
        userRepository.save(user);
        return socialLoginDto;
    }

    @Override
    public UserDto getUserByToken(String token) {
        return UserDto.toDto(userRepository.findByEmail(jwtService.getUserNameFromToken(token)));
    }
}
