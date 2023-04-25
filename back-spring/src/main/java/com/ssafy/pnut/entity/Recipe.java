package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Recipe {
    @Id
    private long recipe_id;
    private String ingredients;
    private int time;
    private long food_id;
    private int quantity;
}
