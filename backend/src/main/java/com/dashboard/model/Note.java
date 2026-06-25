package com.dashboard.model;

import jakarta.persistence.*;

/** A free-form note captured by tag. */
@Entity
@Table(name = "note")
public class Note implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;
    @Column(length = 10000)
    public String body;
    public String tag;
    public String created;        // human-readable date string set by the client

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }
}
