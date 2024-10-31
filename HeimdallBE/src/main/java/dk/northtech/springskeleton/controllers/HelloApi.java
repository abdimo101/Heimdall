package dk.northtech.springskeleton.controllers;

import dk.northtech.springskeleton.configuration.HelloApiConfiguration;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import org.springframework.stereotype.Component;


import static jakarta.ws.rs.core.MediaType.TEXT_PLAIN;

@Component
@Path("hello")
public class HelloApi {

    private final HelloApiConfiguration configuration;

    public HelloApi(HelloApiConfiguration configuration) {
        this.configuration = configuration;
    }
    @GET
    @Produces(TEXT_PLAIN)
    public String hello() {
        return this.configuration.greetingsText();
    }

}
