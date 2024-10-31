package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.ArtifactDTO;
import dk.northtech.springskeleton.services.ArtifactService;
import dk.northtech.springskeleton.translators.ArtifactTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@Path("/artifacts")
public class ArtifactController {

    public final ArtifactService artifactService;

    @Autowired
    public ArtifactController(ArtifactService artifactService) {
        this.artifactService = artifactService;
    }

    @GET
    @Produces("application/json")
    public Response getAllArtifacts() {
        List<ArtifactDTO> artifacts =  ArtifactTranslator.toDTO(artifactService.findAll());
        return Response.ok(artifacts).build();
    }

    @GET
    @Path("/{uuid}")
    @Produces("application/json")
    public Response getArtifactByUuid(@PathParam("uuid") UUID uuid) {
        ArtifactDTO artifact = ArtifactTranslator.toDTO(artifactService.findByUuid(uuid));
        return Response.ok(artifact).build();
    }

    @PUT
    @Consumes("application/json")
    @Produces("application/json")
    public Response createOrUpdateArtifact(ArtifactDTO artifactDTO) {
        artifactService.createOrUpdate(ArtifactTranslator.toEntity(artifactDTO));
        return Response.ok().build();
    }

    @DELETE
    @Path("/{uuid}")
    @Produces("application/json")
    public Response deleteArtifactByUuid(@PathParam("uuid") UUID uuid) {
        artifactService.delete(uuid);
        return Response.noContent().build();
    }

}
