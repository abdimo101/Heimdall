package dk.northtech.springskeleton.configuration;

import org.jdbi.v3.core.argument.Argument;
import org.jdbi.v3.core.argument.ArgumentFactory;
import org.jdbi.v3.core.config.ConfigRegistry;
import org.jdbi.v3.core.statement.StatementContext;
import org.postgresql.util.PGInterval;

import java.lang.reflect.Type;
import java.sql.Types;
import java.util.Optional;

public class PGIntervalArgumentFactory implements ArgumentFactory {

    @Override
    public Optional<Argument> build(Type type, Object value, ConfigRegistry config) {
        if (value instanceof PGInterval) {
            return Optional.of((position, statement, ctx) -> statement.setObject(position, value, Types.OTHER));
        }
        return Optional.empty();
    }
}
