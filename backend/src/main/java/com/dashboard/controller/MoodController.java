package com.dashboard.controller;

import com.dashboard.model.MoodLog;
import com.dashboard.repository.MoodLogRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CRUD endpoints under /api/mood for the MoodLog entity. */
@RestController
@RequestMapping("/api/mood")
public class MoodController extends CrudController<MoodLog> {
    public MoodController(MoodLogRepository repo) {
        super(repo);
    }
}
