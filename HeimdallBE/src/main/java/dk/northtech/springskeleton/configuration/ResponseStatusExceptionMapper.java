package dk.northtech.springskeleton.configuration;

import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;
import org.springframework.web.server.ResponseStatusException;

@Provider
public class ResponseStatusExceptionMapper implements ExceptionMapper<ResponseStatusException> {

    @Override
    public Response toResponse(ResponseStatusException exception) {
        return Response.status(exception.getStatusCode().value(), exception.getReason())
                .entity(exception.getReason())
                .build();
    }
}