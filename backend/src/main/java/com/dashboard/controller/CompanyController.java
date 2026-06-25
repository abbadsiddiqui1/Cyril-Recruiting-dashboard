package com.dashboard.controller;

import com.dashboard.model.Company;
import com.dashboard.repository.CompanyRepository;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** CRUD endpoints under /api/companies for the Company entity. */
@RestController
@RequestMapping("/api/companies")
public class CompanyController extends CrudController<Company> {
    public CompanyController(CompanyRepository repo) {
        super(repo);
    }
}
