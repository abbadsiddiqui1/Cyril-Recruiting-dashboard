package com.dashboard.controller;

import com.dashboard.model.NeetCodeProblem;
import com.dashboard.repository.NeetCodeProblemRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CRUD endpoints under /api/neetcode for the NeetCodeProblem entity. */
@RestController
@RequestMapping("/api/neetcode")
public class NeetCodeController extends CrudController<NeetCodeProblem> {
    public NeetCodeController(NeetCodeProblemRepository repo) {
        super(repo);
    }
}
