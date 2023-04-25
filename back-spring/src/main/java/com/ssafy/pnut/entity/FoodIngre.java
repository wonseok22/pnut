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
@Table(name = "food_ingre")
public class FoodIngre {
    @Id
    private long food_ingre_id;
    private long ingredient_ingredient_id;
    private long food_food_id;
}
