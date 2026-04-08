# Tracify - Lost and Found Management System

Tracify is a comprehensive web application for managing lost and found items. It facilitates the recovery process by bridging the gap between those who lose items and those who find them.

## Features
- **User Roles:** Admin, Finder, Owner
- **Report & Claim:** Report lost items, browse found items, and claim ownership.
- **Workflow:** End-to-end claim review and approval workflows.
- **Notifications:** In-app real-time notification mechanism.

## Tech Stack
- Frontend: React JS (Vite)
- Backend: Spring Boot (Java 17)
- Database: MySQL
- Authentication: JWT

## Local Setup

### Database
1. Create a MySQL database (or let Spring Boot create it according to `application.properties`).
2. Ensure MySQL is running on `locahost:3306` with default credentials.

### Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Demo & Deployment
This project is configured for easy deployment on free hosting providers like Render and Aiven.
See [DEPLOYMENT.md](./DEPLOYMENT.md) for full instructions.

### Demo Credentials (if seeded)
- **Admin**: `admin@tracify.com` / `password`
- **User**: `user@tracify.com` / `password`
