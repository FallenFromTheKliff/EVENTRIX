<h1 align="center">
    <img src="/frontend/src/assets/images/EVENTRIX-Title-Neon.png" alt="EVENTRIX" width="40%" />
</h1>

> EVENTRIX is a full-stack Event Management Platform developed as a 4-week sprint final project. The platform lets users browse, book, and pay for events, while giving administrators tools to manage events, respond to event receptions, and keep track of transactions.

---

## TECH STACK

| Category | Technologies |
|---|---|
| **Languages** | ![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) ![CSS](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css&logoColor=white) |
| **Frontend** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) |
| **Backend & Database** | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white) |
| **Tools & Build** | ![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white) ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white) ![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white) |

---

## SYSTEM MODULES

### General

> **USER** and **ADMIN** roles have access to the Profile, Events, and Settings.

### Website

| Role | Modules |
|---|---|
| **PUBLIC** | Landing, About Us, Support, FAQs, Login, Register |
| **USER** | Home, Support, Reviews, Bookings, Cart |
| **ADMIN** | Dashboard, Reception, Transaction History |

---

## PROJECT STRUCTURE

```
EVENTRIX/
├── backend/
│   └── src/
│       ├── main/
│       │   ├── java/com/example/demo/java/com/example/demo/
│       │   │   ├── config/                     # Spring Security setup
│       │   │   ├── controller/
│       │   │   ├── jwt/                        # token creation/validation
│       │   │   ├── model/
│       │   │   │   ├── dto/
│       │   │   │   └── Events/
│       │   │   ├── repository/
│       │   │   ├── services/
│       │   └── resources/
│       │       ├── static/
│       │       └── templates/
│       └── test/
│
└── frontend/
    ├── public/
    └── src/
        ├── api/                                # axios calls
        ├── assets/
        │   ├── fonts/
        │   └── images/
        ├── components/
        │   ├── auth/
        │   ├── events/
        │   ├── layout/
        │   └── ui/
        ├── context/
        ├── data/                               # navs and static content
        ├── pages/
        │   └── admin/
        └── utils/
```

---

## GETTING STARTED

### Prerequisites

| Requirement | Version |
|---|---|
| Java (JDK) | 21 |
| Node.js | 20.19+ or 22.12+ (required by Vite 8) |
| PostgreSQL | latest |
| Gradle | not required — wrapper (`gradlew` / `gradlew.bat`) is included |

### 1. Clone the repository

```bash
git clone <repository-url-here>
cd EVENTRIX
```

### 2. Set up the database

Create a PostgreSQL database named `eventrixdb`.

### 3. Configure the backend

Create `backend/src/main/resources/application.properties` then fill in your own database credentials.

```properties
spring.application.name=backend
spring.datasource.url=jdbc:postgresql://localhost:5432/eventrixdb
spring.datasource.username=<your-postgres-username>
spring.datasource.password=<your-postgres-password>
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
jwt.secret=<your-own-secret-of-at-least-32-characters>
```

### 4. Run the backend (Spring Boot)

```bash
cd backend
./gradlew bootRun        # macOS/Linux
gradlew.bat bootRun      # Windows
```

The API runs on `http://localhost:8080/api` by default, and the tables are created on the first run.

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