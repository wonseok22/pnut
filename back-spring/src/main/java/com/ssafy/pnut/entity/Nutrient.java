package com.ssafy.pnut.entity;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Nutrient {
    @Id
    private long nutrient_id;
    private String name;
    private String guide;
    private String description;
    private String tag1;
    private String tag2;
    private String unit;

}
