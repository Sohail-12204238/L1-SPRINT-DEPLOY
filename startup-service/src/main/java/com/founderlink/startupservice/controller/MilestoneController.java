package com.founderlink.startupservice.controller;

import com.founderlink.startupservice.entity.Milestone;
import com.founderlink.startupservice.repository.MilestoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/milestones")
@RequiredArgsConstructor
public class MilestoneController {

    private final MilestoneRepository repository;

    @GetMapping("/startup/{startupId}")
    public List<Milestone> getByStartup(@PathVariable Long startupId) {
        return repository.findByStartupId(startupId);
    }

    @PostMapping
    public Milestone create(@RequestBody Milestone milestone) {
        if (milestone.getStatus() == null) {
            milestone.setStatus(Milestone.MilestoneStatus.PLANNED);
        }
        return repository.save(milestone);
    }

    @PutMapping("/{id}/status")
    public Milestone updateStatus(@PathVariable Long id, @RequestParam Milestone.MilestoneStatus status) {
        Milestone m = repository.findById(id).orElseThrow();
        m.setStatus(status);
        return repository.save(m);
    }
    
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
