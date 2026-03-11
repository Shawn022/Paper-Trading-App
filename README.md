Paper Trading Backend

A Spring Boot backend application that simulates stock trading.
Users can register, log in, buy and sell stocks, and track their portfolio and trade history.

This project demonstrates REST API development, layered backend architecture, and financial transaction logic.

Tech Stack

Java
Spring Boot
Spring Data JPA
MySQL
Maven
REST APIs

Architecture

The project follows a layered architecture commonly used in backend systems.

Controller → Service → Repository → Database

Controller
Handles API requests and responses.

Service
Contains business logic such as trade validation and portfolio updates.

Repository
Handles database interaction using Spring Data JPA.

Entity
Represents database tables.

DTO
Handles request and response objects.

API Endpoints
User APIs

Register User
POST /api/users/register

Example request:

{
"name": "John",
"email": "john@example.com
",
"password": "password123"
}

Login User
POST /api/users/login

Example request:

{
"email": "john@example.com
",
"password": "password123"
}

Trading APIs

Buy Stock
POST /api/users/trade/buy

Example request:

{
"userId": 1,
"symbol": "AAPL",
"quantity": 10,
"price": 150
}

Validation:
User must have sufficient balance.

Sell Stock
POST /api/users/trade/sell

Example request:

{
"userId": 1,
"symbol": "AAPL",
"quantity": 5,
"price": 160
}

Validation:
User must own the stock.
User must have enough shares.

Portfolio API

Get User Portfolio
GET /api/users/{userId}/portfolio

Example response:

[
{
"symbol": "AAPL",
"quantity": 15,
"averagePrice": 120
}
]

Trade History API

Get User Trades
GET /api/users/{userId}/trades

Example response:

[
{
"symbol": "AAPL",
"type": "BUY",
"quantity": 10,
"price": 150
}
]

Running the Project

Clone the repository

git clone https://github.com/YOUR_USERNAME/paper-trading-backend.git

Navigate to the project

cd paper-trading-backend

Create MySQL database

CREATE DATABASE paper_trading;

Configure database in application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/paper_trading
spring.datasource.username=root
spring.datasource.password=yourpassword

Run the application

mvn spring-boot:run

Server will start at
http://localhost:8080

Future Improvements

JWT authentication
Real-time stock price API integration
Portfolio profit/loss calculation
Stock suggestion engine
Docker deployment

Learning Outcomes

REST API development using Spring Boot
Financial transaction validation
Backend architecture design
Database interaction using JPA
Error handling in APIs
