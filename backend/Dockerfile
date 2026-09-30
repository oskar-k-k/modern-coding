FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml ./
COPY src ./src
RUN --mount=type=cache,target=/root/.m2 mvn -B -ntp package

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S demo && adduser -S demo -G demo && mkdir -p /app/data/objects && chown -R demo:demo /app
WORKDIR /app
COPY --from=build /workspace/target/modern-coding-1.0.0-SNAPSHOT.jar app.jar
USER demo
EXPOSE 8085
ENTRYPOINT ["java", "-Djava.awt.headless=true", "-jar", "app.jar"]
