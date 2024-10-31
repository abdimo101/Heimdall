### Build
FROM eclipse-temurin:21 AS build
ENV HOME=/usr/app
RUN mkdir -p $HOME
WORKDIR $HOME
ADD . $HOME

COPY mvnw $HOME/mvnw
COPY .mvn $HOME/.mvn
RUN chmod +x $HOME/mvnw
RUN --mount=type=cache,target=/root/.m2 $HOME/mvnw -f $HOME/pom.xml clean -DskipTests=true package

### Package
FROM eclipse-temurin:21 AS package
ARG TARGET=/usr/app/target
COPY --from=build $TARGET /app
ARG JAR_FILE=/app/*.jar
RUN mv $JAR_FILE /app/app.jar
ENV SPRING_PROFILES_ACTIVE=docker
ENTRYPOINT ["java", "-jar", "/app/app.jar"]