package com.dashboard.model;

import jakarta.persistence.*;

/** A daily mood check-in. Serializes as { id, date, mood:{emoji,label,value}, note }. */
@Entity
@Table(name = "mood_log")
public class MoodLog implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String date;           // human-readable date string set by the client

    @Embedded
    public Mood mood;

    @Column(length = 2000)
    public String note;

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }
}
