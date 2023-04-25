package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@ToString
@Table(name = "nut_ingre")
public class NutIngre {
    @Id
    private long nut_ingre_id;
    private long ingredient_ingredient_id;
    private long nutrient_nutrient_id;
}
