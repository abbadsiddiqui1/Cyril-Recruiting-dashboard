package com.dashboard.controller;

import com.dashboard.model.Identifiable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Generic REST CRUD for a single entity type. Concrete controllers just supply a
 * repository and a {@code @RequestMapping} path, giving every domain the same
 * list / get / create / update / delete endpoints with no duplicated code.
 *
 * Spring resolves the {@code <T>} of {@code @RequestBody} from the concrete
 * subclass, so request bodies deserialize to the right entity.
 */
@CrossOrigin(origins = "*", allowedHeaders = "*")
public abstract class CrudController<T extends Identifiable> {

    protected final JpaRepository<T, Long> repo;

    protected CrudController(JpaRepository<T, Long> repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<T> all() {
        return repo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<T> one(@PathVariable Long id) {
        return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public T create(@RequestBody T entity) {
        entity.setId(null);               // ignore any client-sent id; the DB assigns it
        return repo.save(entity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<T> update(@PathVariable Long id, @RequestBody T entity) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        entity.setId(id);
        return ResponseEntity.ok(repo.save(entity));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
