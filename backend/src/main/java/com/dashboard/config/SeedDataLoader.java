package com.dashboard.config;

import com.dashboard.model.Company;
import com.dashboard.model.LinkItem;
import com.dashboard.model.NeetCodeProblem;
import com.dashboard.repository.CompanyRepository;
import com.dashboard.repository.LinkItemRepository;
import com.dashboard.repository.NeetCodeProblemRepository;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.function.Consumer;

/**
 * On startup, seeds the pre-loaded companies / NeetCode problems / default links
 * the first time the app runs (only when a table is empty). This replaces the old
 * client-side behavior where companies.js was copied into localStorage. User edits
 * live in the DB afterward and are never overwritten.
 */
@Component
public class SeedDataLoader implements CommandLineRunner {

    private final CompanyRepository companies;
    private final NeetCodeProblemRepository neetcode;
    private final LinkItemRepository links;
    private final ObjectMapper mapper = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    public SeedDataLoader(CompanyRepository companies, NeetCodeProblemRepository neetcode, LinkItemRepository links) {
        this.companies = companies;
        this.neetcode = neetcode;
        this.links = links;
    }

    @Override
    public void run(String... args) {
        seed("seed/companies.json", Company[].class, companies, c -> c.setId(null), "companies");
        seed("seed/neetcode.json", NeetCodeProblem[].class, neetcode, p -> p.setId(null), "NeetCode problems");
        seed("seed/links.json", LinkItem[].class, links, l -> l.setId(null), "links");
    }

    /** Loads a JSON array resource into the repo only if the table is currently empty. */
    private <T> void seed(String resource, Class<T[]> type, JpaRepository<T, Long> repo,
                          Consumer<T> clearId, String label) {
        if (repo.count() > 0) return;
        try (InputStream in = new ClassPathResource(resource).getInputStream()) {
            List<T> items = List.of(mapper.readValue(in, type));
            items.forEach(clearId);           // let the DB assign fresh ids
            repo.saveAll(items);
            System.out.println("Seeded " + items.size() + " " + label + " from " + resource);
        } catch (Exception e) {
            System.err.println("Failed to seed " + label + " from " + resource + ": " + e.getMessage());
        }
    }
}
