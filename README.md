# 📈 Paper Trading App

A full-stack paper trading platform that simulates real-world stock trading without financial risk. Built with Java Spring Boot and React, featuring real-time price updates, portfolio management, and comprehensive P&L tracking.

LIVE WORKING DEMO : https://paper-tading.vercel.app

---

## 🚀 Features

- **JWT Authentication** — Secure register/login with token-based auth
- **Real-Time Stock Prices** — Live price delivery via WebSockets + STOMP protocol
- **Buy & Sell Orders** — Market order execution with balance validation
- **Portfolio Management** — Track holdings with average buy price calculation
- **P&L Tracking** — Realised and unrealised profit/loss calculated in real time
- **Redis Caching** — Stock prices cached for low-latency reads
- **Trade History** — Complete log of all executed trades

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| Java 21 | Core language |
| Spring Boot 4.0.2 | Application framework |
| Spring Security | Authentication & authorization |
| JWT (jjwt) | Token-based auth |
| Spring Data JPA | ORM and database access |
| MySQL 8.0 | Primary database |
| Redis | Price caching |
| WebSocket + STOMP | Real-time price streaming |
| Maven | Build tool |

### Frontend
| Technology | Purpose |
|---|---|
| React + Vite | UI framework |
| Redux Toolkit | State management |
| React Router | Client-side routing |
| Lightweight charts | Realtime Stock Price Charts |
| Axios | HTTP client |
| STOMP.js | WebSocket client |
| Tailwind CSS | Styling |

### DevOps
| Technology | Purpose |
|---|---|
| Docker | Containerization |
| Docker Compose | Multi-container orchestration |

---

## 🏗️ Architecture

```
React Frontend
      │
      ├── REST API (HTTP)
      │         │
      │    Spring Boot
      │         │
      │    ┌────┴─────┐
      │  MySQL      Redis
      │
      └── WebSocket (STOMP)
                │
           Spring Boot
                │
          Price Updates
```

### Backend Layer Structure
```
Controller  →  Service  →  Repository  →  Entity
                │
               DTO
```

---

## 📁 Project Structure

```
Paper-Trading-App/
├── backend/
│   ├── src/main/java/com/papertrading/backend/
│   │   ├── config/          # Security, Redis, WebSocket config
│   │   ├── controller/      # REST API endpoints
│   │   ├── service/         # Business logic
│   │   ├── repository/      # Database access
│   │   ├── dto/             # Data transfer objects
│   │   ├── entity/          # JPA entities
│   │   ├── security/        # JWT filter and utils
│   │   ├── exception/       # Global exception handling
│   │   └── websocket/       # WebSocket price broadcasting
│   └── Dockerfile
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route pages
│       ├── store/           # Redux slices
│       └── services/        # API calls
├── docker-compose.yml
└── .env.example
```

---

## ⚙️ Running Locally

### Prerequisites
- Java 21
- Maven
- MySQL 8.0
- Redis
- Node.js 18+

### Steps

**1. Clone the repository**
```bash
git clone https://github.com/Shawn022/Paper-Trading-App.git
cd Paper-Trading-App
```

**2. Configure environment**
```bash
cp .env.example backend/.env
# Fill in your values in backend/.env
```

**3. Start the backend**
```bash
cd backend
mvn clean package -DskipTests
mvn spring-boot:run
```

**4. Configure environment Frontend**
```bash
cp .env.example frontend/.env
# Fill in your values in frontend/.env
```

**5. Start the frontend**
```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Running with Docker

### Prerequisites
- Docker
- Docker Compose

### Steps

**1. Configure environment**
```bash
cp .env.example .env
# Fill in your values in .env
```

**2. Build and start all containers**
```bash
cd backend
mvn clean package -DskipTests
cd ..
docker-compose up --build
```

This spins up three containers:
- `paper_trading_app` — Spring Boot backend on port 8080
- `paper_trading_mysql` — MySQL database on port 3306
- `paper_trading_redis` — Redis cache on port 6379

**3. Stop containers**
```bash
# Stop but keep data
docker-compose down

# Stop and wipe all data
docker-compose down -v
```

---

## 🔑 Environment Variables

Copy `.env.example` and fill in your values:

```properties
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=paper_trading
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRATION=604800000
```

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Trading
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/user/trade/buy` | Execute a buy order |
| POST | `/api/user/trade/sell` | Execute a sell order |
| GET | `/api/user/trades` | Get trade history |

### Portfolio
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/user/portfolio` | Get portfolio with P&L |

### Stocks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/stock/supported` | Get available stocks |
| GET | `/api/stock/{symbol}` | Get current stock price |
| GET | `/api/stock/{symbol}/history` | Get stock detail |

### WebSocket
| Endpoint | Description |
|---|---|
| `ws://localhost:8080/ws` | WebSocket connection |
| `/topic/stocks/{symbol}` | Subscribe to live price updates |

---

## 💡 Key Technical Decisions

**Why Java Spring Boot?**
Fintech systems demand strong typing, robust transaction management, and enterprise-grade security. Spring Boot's `@Transactional` annotation ensures atomic trade operations — if any step of a buy/sell fails, the entire operation rolls back, preventing data inconsistency.

**Why WebSockets + STOMP?**
HTTP polling for stock prices creates unnecessary load. WebSockets maintain a persistent connection so the server pushes price updates to clients the moment they're available — exactly how real trading platforms work.

**Why Redis?**
Stock prices are read far more often than they change. Caching prices in Redis means portfolio calculations and stock lookups hit memory instead of the database, significantly reducing latency.

---

## 🔒 Security

- Passwords hashed with BCrypt
- JWT tokens expire after 7 days
- User ID extracted from JWT server-side — users cannot access other users' data
- All trade endpoints protected by Spring Security filter chain

---

## 👨‍💻 Author

**Shawn** — 3rd Year B.Tech CSE Student  
[GitHub](https://github.com/Shawn022)
