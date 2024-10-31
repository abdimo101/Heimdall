package dk.northtech.springskeleton.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrganizationEntity {
    private UUID uuid;
    private String name;
}
