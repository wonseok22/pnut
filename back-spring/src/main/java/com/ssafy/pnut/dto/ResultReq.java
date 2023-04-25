package com.ssafy.pnut.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class ResultReq {
    private List<String> responses;

    @Builder
    public ResultReq(List<String> responses) {
        this.responses = responses;
    }

}
