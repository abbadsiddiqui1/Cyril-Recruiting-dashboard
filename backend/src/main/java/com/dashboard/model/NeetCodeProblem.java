package com.dashboard.model;

import jakarta.persistence.*;

/**
 * One of the NeetCode 150 problems. {@code status} cycles
 * "not started" -> "in progress" -> "mastered".
 */
@Entity
@Table(name = "neetcode_problem")
public class NeetCodeProblem implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String section;
    public String name;
    public Integer leetcode;      // LeetCode problem number
    public String difficulty;     // "Easy" | "Medium" | "Hard"
    public String status;         // "not started" | "in progress" | "mastered"
    @Column(length = 2000)
    public String notes;

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }
}
