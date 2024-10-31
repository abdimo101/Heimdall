package dk.northtech.springskeleton.controllers.dtos;

import dk.northtech.springskeleton.enums.ApplicationPhase;
import dk.northtech.springskeleton.enums.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApplicationListDTO
{
    private UUID uuid;
    private UUID organization_uuid;
    private String app_key;
    private String name;
    private String version;
    private UUID phase_uuid;
    private String phase_name;
    private UUID next_phase_uuid;
    private Long po_id;
    private String po_name; // Added field for PO name
    private Long pm_id;
    private String pm_name; // Added field for PM name
    private String description;
}
