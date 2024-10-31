package dk.northtech.springskeleton.entities;

import dk.northtech.springskeleton.enums.ApplicationPhase;
import dk.northtech.springskeleton.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApplicationEntity {
    private UUID uuid;
    private UUID organization_uuid;
    private String app_key;
    private String name;
    private UUID phase_uuid;
    private UUID next_phase_uuid;
    private String version;
    private Long po;
    private Long pm;
    private String description;
    private List<UUID> teams = new ArrayList<>();
    private List<UUID> tasks = new ArrayList<>();
    private List<UUID> documents = new ArrayList<>();
}
