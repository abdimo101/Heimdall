package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.RequirementDTO;
import dk.northtech.springskeleton.controllers.dtos.RequirementDocumentTypeDTO;
import dk.northtech.springskeleton.controllers.dtos.RequirementWithNamesDTO;
import dk.northtech.springskeleton.entities.RequirementEntity;
import dk.northtech.springskeleton.services.RequirementService;
import dk.northtech.springskeleton.services.DocumentService;
import dk.northtech.springskeleton.translators.RequirementTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Path("/requirements")
public class RequirementController
{
    private RequirementService requirementService;
    private DocumentService documentService;

    public RequirementController(RequirementService requirementService, DocumentService documentService) {
        this.requirementService = requirementService;
        this.documentService = documentService;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRequirements() {
        List<RequirementDTO> requirements = RequirementTranslator.translateToDTO(requirementService.findAll());
        return Response.ok(requirements).build();
    }

    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRequirement(@PathParam("uuid") UUID uuid) {
        RequirementDTO requirement = RequirementTranslator.translateToDTO(requirementService.findByUuid(uuid));
        return Response.ok(requirement).build();
    }

    @GET
    @Path("/team/{teamUuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRequirementByTeam(@PathParam("teamUuid") UUID teamUuid) {
        List<RequirementDTO> requirements = RequirementTranslator.translateToDTO(requirementService.findByTeamUuid(teamUuid));
        return Response.ok(requirements).build();
    }

    @POST
    @Path("/teams/phase/{phase}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response getRequirementByTeamsAndPhase(List<UUID> teamUuids, @PathParam("phase") UUID phase) {
        List<RequirementEntity> requirements = requirementService.findByTeamUuidsAndPhase(teamUuids, phase);
        requirementService.mergeRequirements(requirements);
        List<RequirementDTO> requirementDTOS = RequirementTranslator.translateToDTO(requirements);
        return Response.ok(requirementDTOS).build();
    }

    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createOrUpdateRequirement(RequirementDTO requirementDTO) {
        requirementService.createOrUpdate(RequirementTranslator.translateToEntity(requirementDTO));
        return Response.ok().build();
    }

    @DELETE
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteRequirement(@PathParam("uuid") UUID uuid) {
        requirementService.delete(uuid);
        return Response.noContent().build();
    }

    @GET
    @Path("/team/{teamUuid}/requirement-document-types")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getRequirementDocumentTypes(@PathParam("teamUuid") UUID teamUuid) {
        List<RequirementDocumentTypeDTO> requirementDocumentTypes = requirementService.findByTeamUuidWithDocumentTypeDetails(teamUuid);
        return Response.ok(requirementDocumentTypes).build();
    }

    @GET
    @Path("/all-requirements-except/{teamUuid}/{phase_uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllRequirementsExceptTeam(@PathParam("teamUuid") UUID teamUuid, @PathParam("phase_uuid") UUID phase_uuid) {
        List<RequirementWithNamesDTO> requirements = requirementService.getAllRequirementsExceptTeam(teamUuid, phase_uuid);
        return Response.ok(requirements).build();
    }

}
