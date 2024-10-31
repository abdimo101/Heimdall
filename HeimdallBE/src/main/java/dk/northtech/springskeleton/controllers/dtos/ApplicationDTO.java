package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.enums.ApplicationPhase;
import dk.northtech.springskeleton.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApplicationDTO {
    private UUID uuid;
    private UUID organization_uuid;
    private String app_key;
    private String name;
    private String version;
    private UUID phase_uuid;
    private UUID next_phase_uuid;
    private Long po;
    private Long pm;
    private String description;
    private List<UUID> teams;
    private List<UUID> tasks;
    private List<UUID> documents;
}
