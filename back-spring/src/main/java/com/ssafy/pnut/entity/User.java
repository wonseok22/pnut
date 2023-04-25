package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.time.LocalDateTime;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class User {
    @Id
    private String email;
    private String password;
    private String salt;
    private String refreshToken;
    private String nickname;
    private String name;
    private String type;
    private LocalDateTime join_date;
    private String profile_image_url;
    private int age;
    private int gender;
    private String auth;


}
