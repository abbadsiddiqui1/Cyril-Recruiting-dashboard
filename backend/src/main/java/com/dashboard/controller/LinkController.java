package com.dashboard.controller;

import com.dashboard.model.LinkItem;
import com.dashboard.repository.LinkItemRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CRUD endpoints under /api/links for the LinkItem entity. */
@RestController
@RequestMapping("/api/links")
public class LinkController extends CrudController<LinkItem> {
    public LinkController(LinkItemRepository repo) {
        super(repo);
    }
}
