# Stage 1: Build the application
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /app
# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
# Copy the jar from the build stage
COPY --from=build /app/target/tracify-backend-1.0.0.jar app.jar
# Expose the port
EXPOSE 8080
# Run the application with memory limits suitable for Render Free Tier (512MB)
ENTRYPOINT ["java", "-Xmx384m", "-Xms384m", "-jar", "app.jar"]
