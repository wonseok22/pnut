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
@Table(name = "food_nut")
public class FoodNut {
    @Id
    private long food_nut_id;
    private long nutrient_nutrient_id;
    private long food_food_id;
    private float weight;
}
