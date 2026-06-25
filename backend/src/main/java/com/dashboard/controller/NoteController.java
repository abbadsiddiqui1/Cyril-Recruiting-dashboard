package com.dashboard.controller;

import com.dashboard.model.Note;
import com.dashboard.repository.NoteRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CRUD endpoints under /api/notes for the Note entity. */
@RestController
@RequestMapping("/api/notes")
public class NoteController extends CrudController<Note> {
    public NoteController(NoteRepository repo) {
        super(repo);
    }
}
