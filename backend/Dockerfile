# Stage 1: Build the application
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app
# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src
# Build the application
RUN mvn clean package -DskipTests

# Stage 2: Run the application
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy the jar from the build stage
COPY --from=build /app/target/tracify-backend-1.0.0.jar app.jar
# Expose the port
EXPOSE 8080
# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
