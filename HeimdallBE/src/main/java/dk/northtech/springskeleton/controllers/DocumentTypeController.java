package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.DocumentTypeDTO;
import dk.northtech.springskeleton.controllers.dtos.SearchDTO;
import dk.northtech.springskeleton.entities.DocumentTypeEntity;
import dk.northtech.springskeleton.services.DocumentService;
import dk.northtech.springskeleton.translators.DocumentTypeTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import dk.northtech.springskeleton.services.DocumentTypeService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@Path("/document-types")
public class DocumentTypeController
{

    private final DocumentTypeService documentTypeService;

    @Autowired
    public DocumentTypeController(DocumentTypeService documentTypeService) {
        this.documentTypeService = documentTypeService;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllDocumentTypes() {
        List<DocumentTypeDTO> documentTypes = documentTypeService.findAll().stream()
                .map(DocumentTypeTranslator::toDTO)
                .collect(Collectors.toList());
        return Response.ok(documentTypes).build();
    }

    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDocumentTypeByUuid(@PathParam("uuid") UUID uuid) {
        DocumentTypeEntity documentType = documentTypeService.findByUuid(uuid);
        DocumentTypeDTO documentTypeDTO = DocumentTypeTranslator.toDTO(documentType);
        return Response.ok(documentTypeDTO).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response updateDocumentType(@RequestBody DocumentTypeDTO documentTypeDTO) {
        DocumentTypeEntity documentType = DocumentTypeTranslator.toEntity(documentTypeDTO);
        documentTypeService.createOrUpdate(documentType);
        return Response.ok(DocumentTypeTranslator.toDTO(documentType)).build();
    }

    @DELETE
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteDocumentType(@PathParam("uuid") UUID uuid) {
        documentTypeService.deleteByUuid(uuid);
        return Response.noContent().build();
    }

    @GET
    @Path("/team/{teamUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDocumentTypesByTeamUuid(@PathParam("teamUuid") UUID teamUuid) {
        List<DocumentTypeDTO> documentTypes = documentTypeService.findByTeamUuid(teamUuid).stream()
                .map(DocumentTypeTranslator::toDTO)
                .collect(Collectors.toList());
        return Response.ok(documentTypes).build();
    }

    @GET
    @Path("/team/{teamUuid}/phase/{phaseUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDocumentTypesByTeamUuidAndPhaseUuid(@PathParam("teamUuid") UUID teamUuid, @PathParam("phaseUuid") UUID phaseUuid) {
        List<DocumentTypeDTO> documentTypes = documentTypeService.findByTeamUuidAndPhaseUuid(teamUuid, phaseUuid).stream()
                .map(DocumentTypeTranslator::toDTO)
                .collect(Collectors.toList());
        return Response.ok(documentTypes).build();
    }

    @GET
    @Path("/phase/{phaseUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDocumentTypesByPhaseUuid(@PathParam("phaseUuid") UUID phaseUuid) {
        List<DocumentTypeDTO> documentTypes = documentTypeService.findByPhaseUuid(phaseUuid).stream()
                .map(DocumentTypeTranslator::toDTO)
                .collect(Collectors.toList());
        return Response.ok(documentTypes).build();
    }

    @POST
    @Path("/search")
    @Produces(MediaType.APPLICATION_JSON)
    public Response searchDocumentTypes(@RequestBody SearchDTO searchDTO) {
        return Response.ok(DocumentTypeTranslator.toDTOs(documentTypeService.search(searchDTO.getQuery()))).build();
    }

    @GET
    @Path("/missing/{application_uuid}/{phase}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkDocumentsByRequirement(@PathParam("application_uuid") UUID application_uuid, @PathParam("phase") UUID phase){
        List<DocumentTypeEntity> result = documentTypeService.getMissingByApplicationPhase(application_uuid, phase);
        return Response.ok(DocumentTypeTranslator.toDTOs(result)).build();
    }
}