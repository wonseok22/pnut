package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
public class UserSocialLoginDto {
    private String email;
    private String nickname;
    private String type;
    private LocalDateTime join_date;
    private boolean initial;
    public static UserSocialLoginDto toDto(User user){
        return new UserSocialLoginDto(
                user.getEmail(),
                user.getNickname(),
                user.getType(),
                user.getJoin_date(),
                false
        );
    }
}
