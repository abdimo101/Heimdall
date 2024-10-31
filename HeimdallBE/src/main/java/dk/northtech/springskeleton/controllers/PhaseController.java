package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.services.PhaseService;
import dk.northtech.springskeleton.translators.PhaseTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import dk.northtech.springskeleton.controllers.dtos.PhaseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@Path("/phases")
public class PhaseController {

    private final PhaseService phaseService;

    @Autowired
    public PhaseController(PhaseService phaseService) {
        this.phaseService = phaseService;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllPhases() {
        return Response.ok(PhaseTranslator.toDTOs(phaseService.getAllPhases())).build();
    }

    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updatePhase(@RequestBody PhaseDTO dto) {
        phaseService.createOrUpdatePhase(PhaseTranslator.toEntity(dto));
        return Response.ok(dto).build();
    }
    @DELETE
    @Path("/{uuid}")
    public Response deletePhase(@PathParam("uuid") String uuid) {
        phaseService.deletePhase(UUID.fromString(uuid));
        return Response.noContent().build();
    }

}