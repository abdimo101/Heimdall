#!/bin/sh

# Wait until the backend container is healthy
until curl -f http://backend:8081/actuator/health; do
    echo "Waiting for backend to be healthy..."
    sleep 5
done

# Restart the db container
echo "Backend is healthy. Restarting db container..."
docker restart heimdallbe-db-1