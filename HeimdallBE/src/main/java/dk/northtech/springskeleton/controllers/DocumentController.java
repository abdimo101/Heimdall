package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.controllers.dtos.ApprovalDTO;
import dk.northtech.springskeleton.controllers.dtos.DocumentDTO;
import dk.northtech.springskeleton.entities.DocumentEntity;
import dk.northtech.springskeleton.services.DocumentService;
import dk.northtech.springskeleton.translators.ApprovalTranslator;
import dk.northtech.springskeleton.translators.DocumentTranslator;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import net.minidev.json.JSONArray;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@Path("/documents")
public class DocumentController {

    private final DocumentService documentService;

    @Autowired
    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GET
    @Path("/{uuid}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDocumentByUuid(@PathParam("uuid") UUID uuid)
    {
        return Response.ok(DocumentTranslator.toDto(documentService.findByUuid(uuid))).build();
    }

    @GET
    @Path("/{uuid}/approvals")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response getAllApprovalsByDocument(@PathParam("uuid") UUID uuid)
    {
        List<ApprovalDTO> approvals = ApprovalTranslator.toDtos(documentService.getAllApprovalsByDocument(uuid));
        JSONArray approvalsJSON = new JSONArray();
        approvalsJSON.addAll(approvals);
        return Response.ok(approvalsJSON).build();
    }
    @PUT
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response createOrUpdateDocument(DocumentDTO dto)
    {
        documentService.createOrUpdate(DocumentTranslator.toEntity(dto));
        return Response.ok(dto).build();
    }

    @DELETE
    @Path("/{uuid}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response deleteDocument(@PathParam("uuid") UUID uuid)
    {
        DocumentEntity document = documentService.findByUuid(uuid);
        documentService.delete(document);
        return Response.noContent().build();
    }

    @GET
    @Path("/approvalcheck/{application_uuid}/{phase}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response checkApprovedDocuments(@PathParam("application_uuid") UUID application_uuid, @PathParam("phase") UUID phase){
        List<DocumentDTO> result = DocumentTranslator.toDtos(documentService.checkApprovedDocuments(application_uuid, phase));
        return Response.ok(result).build();
    }

    @POST
    @Path("/initiateapproval")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response initiateDocumentApproval(@RequestBody Map<String, UUID> requestBody) {
        UUID documentUuid = requestBody.get("document_uuid");
        documentService.initiateDocumentApproval(documentUuid);
        return Response.ok().build();
    }
    @GET
    @Path("/approval/{approval_uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getDocumentByApprovalUUID(@PathParam("approval_uuid") UUID approval_uuid)
    {
        return Response.ok(DocumentTranslator.toDto(documentService.findByApprovalUUID(approval_uuid))).build();
    }

    @GET
    @Path("/approvalaudit/{document_uuid}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getLatestApprovalByDocument(@PathParam("document_uuid") UUID document_uuid)
    {
        return Response.ok(documentService.getLatestApprovalByDocument(document_uuid)).build();
    }
}
