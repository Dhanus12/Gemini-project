# Stage 1: Build the Spring Boot application using Maven
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copy pom.xml first to leverage Docker layer caching
COPY pom.xml .

# Download dependencies offline
RUN mvn dependency:go-offline

# Copy source code
COPY src ./src

# Build the Spring Boot application (skip tests for faster build)
RUN mvn clean package -DskipTests

# Stage 2: Run the application with lightweight JDK
FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/target/*.jar app.jar

# Expose the port the Spring Boot app runs on
EXPOSE 8080


# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]
