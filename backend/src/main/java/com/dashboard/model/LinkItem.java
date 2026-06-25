package com.dashboard.model;

import jakarta.persistence.*;

/** A saved link in the Links section. */
@Entity
@Table(name = "link_item")
public class LinkItem implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;
    @Column(length = 2000)
    public String url;
    public String category;       // "Jobs" | "DSA" | "Programs" | ...
    @Column(length = 2000)
    public String notes;

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }
}
