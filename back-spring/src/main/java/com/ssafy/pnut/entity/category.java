package com.ssafy.pnut.entity;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class category {
    @Id
    @Column(name = "category_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id = null;

    @Column(name = "category_name")
    String name;

    @Builder
    public category(String name) {
        this.name = name;
    }
}
