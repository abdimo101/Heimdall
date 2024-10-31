package dk.northtech.springskeleton.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhaseEntity {
    private UUID uuid;
    private UUID organization_uuid;
    private String name;
    private Long order_number;
}
