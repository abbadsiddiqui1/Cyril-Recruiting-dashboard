package com.dashboard.model;

import jakarta.persistence.*;

/**
 * A company in the Career Tracker. Mirrors the object shape the frontend used in
 * localStorage so no client-side reshaping is needed.
 */
@Entity
@Table(name = "company")
public class Company implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String tier;
    public String company;
    public String role;
    public String opens;          // ISO date string, e.g. "2026-08-01"
    @Column(length = 2000)
    public String url;
    public Integer priority;
    @Column(length = 2000)
    public String notes;
    public boolean applied;
    public boolean oa;
    public boolean interview;
    public String result;         // "", "offer", "rejected", "withdrawn"

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }
}
