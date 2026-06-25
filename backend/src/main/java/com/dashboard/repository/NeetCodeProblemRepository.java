package com.dashboard.repository;

import com.dashboard.model.NeetCodeProblem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NeetCodeProblemRepository extends JpaRepository<NeetCodeProblem, Long> {}
