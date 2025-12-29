# Stage 1: Build the application
FROM gradle:jdk17-alpine AS build
WORKDIR /app
COPY . .
RUN ./gradlew clean build -x test --no-daemon

# Stage 2: Run the application
# CHANGED: Use eclipse-temurin instead of openjdk
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]