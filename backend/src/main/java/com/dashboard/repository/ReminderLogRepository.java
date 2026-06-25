package com.dashboard.repository;

import com.dashboard.model.ReminderLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReminderLogRepository extends JpaRepository<ReminderLog, Long> {}
