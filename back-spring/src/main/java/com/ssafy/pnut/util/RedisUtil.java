package com.ssafy.pnut.util;

public interface RedisUtil {
    String getData(String key);
    void setDataExpire(String key, String value, long duration);
}
