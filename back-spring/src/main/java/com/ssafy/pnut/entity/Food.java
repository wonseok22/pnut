package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Food {
    @Column(name = "food_id")
    @Id
    private Long foodId;
    private String name;
    private String description;
    private int time;
    private String efficiency;
    private int amount;
    private String unit;
    private String ingredients;
    private String url;
}
