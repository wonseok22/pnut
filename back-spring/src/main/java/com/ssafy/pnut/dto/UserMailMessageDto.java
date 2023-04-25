package com.ssafy.pnut.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
public class UserMailMessageDto {
    private String to;
    private String subject;
    private String message;
}
