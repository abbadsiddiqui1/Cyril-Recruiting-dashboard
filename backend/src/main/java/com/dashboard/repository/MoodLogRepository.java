package com.dashboard.repository;

import com.dashboard.model.MoodLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MoodLogRepository extends JpaRepository<MoodLog, Long> {}
