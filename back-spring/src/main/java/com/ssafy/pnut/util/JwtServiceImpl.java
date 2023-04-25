package com.ssafy.pnut.util;

import com.ssafy.pnut.exception.UnAuthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {
    private static final String SALT = "pnuts";
    private static final int ACCESS_TOKEN_EXPIRE_MINUTES = 30;
    private static final int REFRESH_TOKEN_EXPIRE_WEEKS = 2;


    @Override
    public <T> String createAccessToken(String key, T data) {
        return create(key, data, "access-token", 1000*60*ACCESS_TOKEN_EXPIRE_MINUTES);
    }

    @Override
    public <T> String createRefreshToken(String key, T data) {
        return create(key, data, "refresh-token", 1000*60*60*24*7*REFRESH_TOKEN_EXPIRE_WEEKS);
    }

    //token issued

    /**
     *
     * @param key : it's key value setting on Claim
     * @param data : it's data value setting on Claim
     * @param subject : it's subject value setting on value of sub in payload
     * @param expire : it's setting value on token expire day
     * jwt token composition : header + payload + signature
     */
    @Override
    public <T> String create(String key, T data, String subject, long expire) {
        String jwt = Jwts.builder()
                //set header : type of token, hash algorythm information setting
                .setHeaderParam("typ", "JWT")
                .setHeaderParam("regDate", System.currentTimeMillis())//create time
                //payload setting : expiration, subject, claim etc.. information setting
                .setExpiration(new Date(System.currentTimeMillis()+expire))//token expire date
                .setSubject(subject)//ex) access-token, refresh-token
                .claim(key, data)//save data
                //signature setting : encryption by secret key
                .signWith(SignatureAlgorithm.HS256, this.generateKey())
                .compact();//serialization
        return jwt;
    }
    private byte[] generateKey(){
        byte[] key = null;
        try{
            key = SALT.getBytes("utf-8");
        }catch(UnsupportedEncodingException e){
            e.printStackTrace();
        }
        return key;
    }


    @Override
    public Map<String, Object> get(String key) {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes())
                .getRequest();
        String jwt = request.getHeader("access-token");
        Jws<Claims> claims;
        try{
            claims = Jwts.parser().setSigningKey(SALT.getBytes("utf-8")).parseClaimsJws(jwt);
        }catch(Exception e){
            throw new UnAuthorizedException();
        }
        return claims.getBody();
    }

    @Override
    public String getUserEmail() {
        return (String) this.get("user").get("email");
    }

    @Override
    public boolean checkToken(String jwt) {
        try{
            //json web signature : In server, What sign by private key of server authorization is tokenization
            //setSignatureKey : set scret key for JWS sign verification
            //parseClaimsJws : make original jws
            Jwts.parser().setSigningKey(this.generateKey()).parseClaimsJws(jwt);
            //claims is embodiment of Map
            return true;
        }catch(Exception e){
            e.printStackTrace();
            return false;
        }
    }
    @Override
    public String getUserNameFromToken(String token){
        return Jwts.parser().setSigningKey(generateKey()).parseClaimsJws(token).getBody().get("email").toString();
    }
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver){
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }
    public Claims getAllClaimsFromToken(String token){
        return Jwts.parser().setSigningKey(this.generateKey()).parseClaimsJws(token).getBody();
    }
}
