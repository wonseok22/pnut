package com.ssafy.pnut.dto;

import com.ssafy.pnut.entity.NutQuest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class NutQuestDto {
    private long nutQuestId;
    private long questionId;
    private long nutrientId;

    public static NutQuestDto toDto(NutQuest nutQuest){
        return new NutQuestDto(
                nutQuest.getNut_quest_id(),
                nutQuest.getQuestion_id(),
                nutQuest.getNutrient_id()
        );
    }
    public NutQuest toEntity(){return new NutQuest(nutQuestId, questionId, nutrientId);}
}
