package com.dashboard.model;

/**
 * Implemented by every persisted entity so the generic CRUD controller can read
 * and assign the primary key without knowing the concrete type.
 */
public interface Identifiable {
    Long getId();
    void setId(Long id);
}
