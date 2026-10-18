<h1 align="center">EVENTRIX</h1>

> EVENTRIX is a full-stack Event Management Platform developed as a 4-week sprint final project. The platform lets users browse, book, and pay for events, while giving administrators tools to manage events, review event reception, and keep track of transactions.

---

## TECH STACK

| Category | Technologies |
|---|---|
| **Languages** | ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css&logoColor=white) |
| **Frontend** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| **Backend & Database** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) |
| **Tools & Build** | ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) |

---

## SYSTEM MODULES

| Role | Modules |
|---|---|
| **PUBLIC** | Landing, About Us, Support, FAQs, Login, Register |
| **USER** | Home, View Events, Bookings, Support, Cart |
| **ADMIN** | Dashboard, Manage Events, Transactions Log |

> **Note:** Both USER and ADMIN roles have access to the Profile and Settings modules.

---

## PROJECT STRUCTURE

```
EVENTRIX/
├── backend/
│   └── src/
│       ├── main/java/com/example/demo/
│       │   ├── config/                     # Spring Security setup
│       │   ├── controller/
│       │   ├── jwt/                        # token creation/validation
│       │   ├── model/
│       │   │   ├── dto/
│       │   │   └── Events/                 # Event-related entities
│       │   ├── repository/
│       │   └── services/
│       └── test/
└── frontend/
    ├── public/
    └── src/
        ├── api/
        ├── assets/                         # fonts/ and images/
        ├── components/
        │   ├── auth/
        │   ├── layout/
        │   └── ui/
        ├── context/
        ├── data/                           # navs and static content
        └── pages/                          # Public and Authenticated pages
            └── admin/
```

---

## GETTING STARTED

### Prerequisites

| Requirement | Version |
|---|---|
| Java (JDK) | 21 |
| Node.js | 18+ (for React 19 / react-scripts 5) |
| PostgreSQL | latest |
| Gradle | not required — wrapper (`gradlew` / `gradlew.bat`) is included |

### 1. Clone the repository

```bash
git clone <repository-url-here>
cd eventrix
```

### 2. Set up the database

Create a PostgreSQL database named `eventrixdb`.

### 3. Configure the backend

```properties
spring.application.name=backend
spring.datasource.url=jdbc:postgresql://localhost:5432/eventrixdb
spring.datasource.username=<your-postgres-username>
spring.datasource.password=<your-postgres-password>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
jwt.secret=<your-own-256-bit-secret>
```

### 4. Run the backend (Spring Boot)

```bash
cd backend
./gradlew bootRun        # macOS/Linux
gradlew.bat bootRun      # Windows
```

The API runs on `http://localhost:8080/api` by default.

### 5. Run the frontend (React)

```bash
cd frontend
npm install
npm run dev
```

The web app runs on `http://localhost:5173` by default.

---

## LICENSE

This project is unlicensed, so whatever ideas you think of are probably going to get you in trouble.

---