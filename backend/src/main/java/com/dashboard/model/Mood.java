package com.dashboard.model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

/**
 * Embedded value for a mood selection. Serializes as a nested {@code mood} object
 * ({emoji, label, value}) to match the shape the frontend already renders.
 */
@Embeddable
public class Mood {
    public String emoji;
    public String label;
    // "value" is a reserved SQL word, so store it under a safe column name. The
    // JSON property stays "value" (Jackson uses the field name, not the column).
    @Column(name = "mood_value")
    public Integer value;         // 1..5
}
