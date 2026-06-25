package com.dashboard.model;

import jakarta.persistence.*;

/**
 * History of reminders sent or scheduled, shown in the Reminders tab. Previously
 * kept only in localStorage; now persisted so the log survives across devices.
 */
@Entity
@Table(name = "reminder_log")
public class ReminderLog implements Identifiable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String title;
    public String sentAt;         // e.g. "6/25/2026, 9:00:00 AM" or "Will send at ..."

    @Override public Long getId() { return id; }
    @Override public void setId(Long id) { this.id = id; }
}
