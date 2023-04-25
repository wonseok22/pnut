package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "recipe_steps")
public class RecipeSteps {
    @Id
    private long recipe_steps_id;
    private long recipe_id;
    private String image_url;
    private String content;
    private String recipe_stepscol;
}
