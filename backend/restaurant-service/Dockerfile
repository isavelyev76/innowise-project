FROM eclipse-temurin:17-jre
WORKDIR /app
COPY build/libs/restaurant-service-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 9090