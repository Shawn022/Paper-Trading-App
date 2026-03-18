# 📈 Paper Trading Backend

A robust **Spring Boot** application designed to simulate stock market trading. This project allows users to practice trading strategies in a risk-free environment by providing a virtual brokerage experience. 

This project demonstrates proficiency in **REST API design**, **layered architecture**, and the complex **business logic** required for financial transactions.

---

## 🛠 Tech Stack

* **Language:** Java 17+
* **Framework:** Spring Boot (Web, Data JPA)
* **Database:** MySQL
* **Build Tool:** Maven
* **API Testing:** Postman / Swagger

---

## 🏗 Architecture

The project follows a standard layered architecture to ensure separation of concerns and maintainability.



### Layers
* **Controller:** Handles incoming REST requests and maps them to service methods.
* **Service:** The "brain" of the app. Manages trade validation, balance checks, and portfolio logic.
* **Repository:** Interacts with the MySQL database using Spring Data JPA.
* **Entity:** Defines the database schema (Users, Trades, Portfolios).
* **DTO (Data Transfer Object):** Facilitates secure and optimized data transfer between client and server.

---

## 📡 API Endpoints

### User Management
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/users/register` | `POST` | Create a new user account |
| `/api/users/login` | `POST` | Authenticate user credentials |

### Trading Operations
| Endpoint | Method | Description | Validation |
| :--- | :--- | :--- | :--- |
| `/api/users/trade/buy` | `POST` | Purchase shares | Sufficient cash balance required |
| `/api/users/trade/sell` | `POST` | Sell owned shares | Must own the asset & sufficient quantity |

### Portfolio & History
| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/users/{userId}/portfolio` | `GET` | View current holdings and average buy prices |
| `/api/users/{userId}/trades` | `GET` | Retrieve full history of buy/sell transactions |

---

## 🚀 Getting Started

### Prerequisites
* JDK 17 or higher
* Maven 3.6+
* MySQL Server

### Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/paper-trading-backend.git](https://github.com/YOUR_USERNAME/paper-trading-backend.git)
    cd paper-trading-backend
    ```

2.  **Database Configuration**
    Create a new schema in MySQL:
    ```sql
    CREATE DATABASE paper_trading;
    ```

3.  **Configure `application.properties`**
    Update `src/main/resources/application.properties` with your credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/paper_trading
    spring.datasource.username=your_username
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```

4.  **Run the Application**
    ```bash
    mvn spring-boot:run
    ```
    The server will start at `http://localhost:8080`.

---

## 💡 Key Features & Logic

* **Transaction Integrity:** Ensures that a user cannot buy more than they can afford or sell more than they own.
* **Portfolio Tracking:** Automatically updates quantities and calculates the average purchase price as trades occur.
* **Relational Mapping:** Uses JPA associations to link users to their specific trade history and current holdings.

---

## 🔮 Future Improvements
* [ ] **JWT Authentication:** Secure endpoints with token-based login.
* [ ] **Real-time Data:** Integrate a third-party API (like Alpha Vantage) for live prices.
* [ ] **Analytics:** Add Portfolio Profit/Loss (P&L) tracking.
* [ ] **Docker:** Containerize the application for easy deployment.

---

## 🎓 Learning Outcomes
* Architecting scalable Java applications using Spring Boot.
* Managing complex relational data with Hibernate/JPA.
* Implementing strict financial validation logic.
* Standardizing API responses and error handling.
