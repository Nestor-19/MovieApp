# ─── Stage 1: Build your JAR ───────────────────────────────────────
FROM maven:3.9.8-eclipse-temurin-21 AS builder

WORKDIR /app
#   • All subsequent commands run in /app inside the container

COPY pom.xml .
#   • Copy your Maven pom (so dependency resolution can be cached)

COPY src ./src
#   • Copy your Java source code

RUN mvn clean package -DskipTests
#   • Compile & package your app into a JAR
#   • -DskipTests speeds up the build; tests run in CI instead

# ─── Stage 2: Runtime ────────────────────────────────────────────
FROM openjdk:21-jdk-slim
#   • A slim JRE/JDK base for the smallest possible footprint

WORKDIR /movieapp
#   • Set working dir for the runtime container

COPY --from=builder /app/target/movieapp-*.jar ./movieapp.jar
#   • Copy just the built JAR from the “builder” stage

ENV SPRING_PROFILES_ACTIVE=prod
#   • Activate your production Spring profile (if you use one)

EXPOSE 8080
#   • Document that your app listens on port 8080

ENTRYPOINT ["java", "-jar", "movieapp.jar"]
#   • When the container starts, run your Spring Boot JAR