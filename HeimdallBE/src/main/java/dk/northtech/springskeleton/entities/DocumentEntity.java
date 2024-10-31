package dk.northtech.springskeleton.entities;


import dk.northtech.springskeleton.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DocumentEntity
{
    private UUID uuid;
    private UUID organization_uuid;
    private UUID document_type_uuid;
    private String document_type_name;
    private String link;
    private List<UUID> approvals;
    private UUID application_uuid;
    private UUID artifact_uuid;
}
