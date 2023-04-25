package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "nut_quest")
public class NutQuest {
    @Id
    private long nut_quest_id;
    private long question_id;
    private long nutrient_id;
}
