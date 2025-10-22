# FROM eclipse-temurin:21-jdk-jammy
# WORKDIR /app
# COPY backend/backend/target/backend-0.0.1-SNAPSHOT.jar app.jar
# EXPOSE 8080
# ENTRYPOINT ["java","-jar","/app/app.jar"]
# Stage 1: Build the JAR using Maven
FROM maven:3.9.8-eclipse-temurin-21 AS builder
WORKDIR /app

# Copy source code
COPY backend /app

# Build project (skip tests for faster build)
RUN mvn clean package -DskipTests

# Stage 2: Run the JAR file
FROM eclipse-temurin:21-jdk-jammy
WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
