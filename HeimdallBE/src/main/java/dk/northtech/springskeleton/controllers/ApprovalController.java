package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.enums.ApprovalStatus;
import dk.northtech.springskeleton.services.ApprovalService;
import dk.northtech.springskeleton.translators.ApprovalTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@Path("/approvals")
public class ApprovalController {

    private final ApprovalService approvalService;

    @Autowired
    public ApprovalController(ApprovalService approvalService) {
        this.approvalService = approvalService;
    }

    @GET
    @Path("/{uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getApprovalByUuid(@PathParam("uuid") UUID uuid)
    {
        return Response.ok(ApprovalTranslator.toDto(approvalService.findByUuid(uuid))).build();
    }

    @PUT
    @Path("/set-status")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response setStatus(@RequestBody Map<String, Object> requestBody) {
        UUID approvalUuid = UUID.fromString((String) requestBody.get("approval_uuid"));
        ApprovalStatus status = ApprovalStatus.valueOf((String) requestBody.get("status"));
        String comment = (String) requestBody.get("comment");
        approvalService.setStatus(approvalUuid, status, comment);
        return Response.ok().build();
    }
}
