package com.ssafy.pnut.util;

import com.ssafy.pnut.dto.UserMailMessageDto;

public interface MailService {
    boolean eamilCheck(String email);
    boolean emailCertification(String email);
    String sendMail(UserMailMessageDto mailMessage, String type);
    String createCode();
    String setContext(String code, String type);
    boolean checkCode(String email, String code);
    boolean checkAuthentification(String email);
}
