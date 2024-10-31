package dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApplicationDetailsDTO
{
    private UUID uuid;
    private UUID organization_uuid;
    private String app_key;
    private String name;
    private String version;
    private UUID phase_uuid;
    private UUID next_phase_uuid;
    private String phase_name;
    private Long po_id;
    private String po_name;
    private Long pm_id;
    private String pm_name;
    private String description;

    private List<ApplicationDetailsTeamDTO> teams;
    private List<ApplicationDetailsTaskDTO> tasks;
    private List<ApplicationDetailsDocumentDTO> documents;
}
