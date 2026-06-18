# AI Interview Preparation Assistant

## Overview

AI Interview Preparation Assistant is a full-stack web application that helps users prepare for technical interviews using AI-generated questions, answer evaluation, and performance tracking.

## Features

- User Registration and Login
- JWT Authentication
- AI-Based Interview Question Generation
- AI Answer Evaluation and Feedback
- Interview History Tracking
- Performance Analytics Dashboard
- Topic-Based Interview Preparation
  - Java
  - DSA
  - DBMS
  - Operating Systems
  - Spring Boot
  - Full Stack Development

## Tech Stack

### Frontend
- React.js
- Axios
- Material UI
- Recharts

### Backend
- Java 17
- Spring Boot
- Spring Security
- JWT Authentication
- REST APIs

### Database
- MySQL

### AI Integration
- OpenRouter API

## Project Structure

```text
AI-Interview-Preparation-Assistant
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── application.properties
│
├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── README.md
└── .gitignore
```

## Installation

### Clone Repository

```bash
git clone https://github.com/ThrishaPulagam/Ai-interview-assistant.git
```

### Backend Setup

```bash
cd backend
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

## Configuration

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ai_interview_db
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD

spring.jpa.hibernate.ddl-auto=update

openrouter.api.key=YOUR_OPENROUTER_API_KEY
```

## API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Interview

```http
POST /api/interview/start
POST /api/interview/generate-question
POST /api/interview/evaluate
GET  /api/interview/history/{userId}
```

## Workflow

1. Register or Login
2. Select Interview Category
3. Generate Interview Question
4. Submit Answer
5. Receive AI Feedback
6. View Interview History
7. Track Performance Analytics

## Author

Thrisha Pulagam

GitHub: https://github.com/ThrishaPulagam
