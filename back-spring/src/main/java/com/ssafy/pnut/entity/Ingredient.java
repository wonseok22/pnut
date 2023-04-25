package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Ingredient {
    @Id
    @Column(name = "ingredient_id")
    private long ingredientId;
    private String name;
}
