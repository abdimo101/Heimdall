package dk.northtech.springskeleton.controllers.dtos.ApplicationDetailsDTO;

import dk.northtech.springskeleton.controllers.dtos.ApprovalDTO;
import dk.northtech.springskeleton.enums.DocumentType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ApplicationDetailsDocumentDTO
{
    private UUID uuid;
    private String document_type_uuid;
    private String type_name;
    private String link;
    private List<ApplicationDetailsApprovalDTO> approvals;
}
