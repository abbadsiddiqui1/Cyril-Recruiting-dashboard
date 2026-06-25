package com.dashboard.controller;

import com.dashboard.model.ReminderLog;
import com.dashboard.repository.ReminderLogRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CRUD endpoints under /api/reminder-log for the ReminderLog entity. */
@RestController
@RequestMapping("/api/reminder-log")
public class ReminderLogController extends CrudController<ReminderLog> {
    public ReminderLogController(ReminderLogRepository repo) {
        super(repo);
    }
}
