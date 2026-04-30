package com.founderlink.startupservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Milestone {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long startupId;
    private String title;
    private String description;
    private LocalDate targetDate;
    
    @Enumerated(EnumType.STRING)
    private MilestoneStatus status;

    public enum MilestoneStatus {
        PLANNED, IN_PROGRESS, COMPLETED
    }
}
