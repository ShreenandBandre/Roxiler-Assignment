#  Store Rating System Matrix (SRP)

A high-performance, enterprise-grade distributed platform built for managing, scaling, and auditing multi-tenant store performance rating indices. Designed with a strict microservices infrastructure approach, the ecosystem is fully containerized using **Docker & Docker-Compose**. It leverages **Express.js (Vite/React)** for asynchronous state handling, and **Prisma ORM** coupled with a relational **PostgreSQL** cluster as the core transactional state matrix.

---

###  Access Layer Matrix (Pre-Seeded Roles)
The system boots up natively with structural guardrails restricting endpoints based on cryptographic JSON Web Tokens (JWT). For immediate validation during recruitment reviews, the database layer auto-seeds with the following administrative criteria:

* **System Administrator Interface Node**
  * **Interface Gateway:** `http://localhost:3000/login`
  * **Root Access Email:** `admin@storerating.com`
  * **Master Access Key:** `SecureAdmin2026!` *(Enforces strict uppercase, digit, and special character layout criteria)*

---

##  System Architecture & Dynamic Topology

The infrastructure maps out completely into independent isolated networks communicating via internal DNS gateways exposed inside the containerized virtualization layer:

###  Core Component Breakdowns
## TechStack Table

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React (Vite) + Tailwind CSS, React Router, Axios |
| **Backend** | Node.js + Express.js |
| **ORM / DB Access** | Prisma ORM |
| **Database** | PostgreSQL |
| **Auth** | JWT (`jsonwebtoken`) + `bcrypt` password hashing |
| **Validation** | `zod` (shared validation logic, backend-enforced) |
| **Containerization** | Docker + Docker Compose |
| **Logging** | Winston (console + file transport) |

---

## 🐳 Docker Services Architecture

| Service | Responsibility | Image / Environment |
| :--- | :--- | :--- |
| **db** | PostgreSQL data store, persisted via a named volume (`pgdata`) | `postgres:16-alpine` |
| **backend** | Express API Gateway + Automatic Prisma migrations on runtime startup | Custom (`Node:20-alpine`) |
| **frontend** | React build layer served via Nginx (Prod orchestration) or Vite development server | Custom (`Node:20` / `Nginx`) |

---

## 🗄️ Database Schema & Relational Models (Prisma)

Three core data models comprehensively satisfy every functional requirements listed in the system brief. 

> 📊 **Calculated Analytics Note:** Average ratings (overall store scores and the Store Owner dashboard aggregates) are calculated dynamically on-demand using rapid **Prisma Aggregate Queries** (`_avg` of value grouped by `storeId`) rather than being stored as a denormalized database column. This guarantees absolute data accuracy at all times without sync lag.

### Model Definitions
| Model | Key Fields | Analytical Notes / System Guards |
| :--- | :--- | :--- |
| **User** | `id`, `name`, `email` (unique), `password` (hashed via Bcrypt), `address`, `role` | Role schema uses strict Enums: `ADMIN` \| `NORMAL_USER` \| `STORE_OWNER` |
| **Store** | `id`, `name`, `email`, `address`, `ownerId` (Foreign Key -> User) | `ownerId` enforces a 1:1 or 1:M relationship mapping a Store to its verified Store Owner. |
| **Rating** | `id`, `value` (1-5 integer), `userId` (FK), `storeId` (FK), `createdAt`, `updatedAt` | Unique multi-column constraint on `(userId, storeId)` preventing double submissions. Ratings are created once and structurally mutated subsequently. |

---

##  Direct Interface Endpoint Tree

All network routes entering system parameters must be prefixed with `/api`. Authenticated resources mandate a valid bearer parameter passed inside the header: `Authorization: Bearer <JSON_WEB_TOKEN>`.

### 1. Authentication Engine (`/api/auth`)
| Method | Endpoint | Description | Access Layer |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/signup` | Registers a new evaluation Normal User identity node. | Public |
| **POST** | `/api/auth/login` | Resolves role parameters and returns a valid authorization JWT. | Public |
| **PUT** | `/api/auth/update-password` | Unified security channel to modify active passcode structures. | Authenticated (All Roles) |
| **POST** | `/api/auth/logout` | Clears client-side session state and drops active token cache. | Authenticated (All Roles) |

### 2. Administrator Infrastructure (`/api/admin`)
| Method | Endpoint | Description | Access Layer |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/dashboard` | Extracts global telemetry metrics (Counts of users, stores, ratings). | Admin Only |
| **POST** | `/api/admin/users` | Natively provisions a new Normal User or Admin directly. | Admin Only |
| **POST** | `/api/admin/stores` | Maps an enterprise Store instance and binds it to a designated Owner. | Admin Only |
| **GET** | `/api/admin/users` | Lists users; supports sorting and filtering by name, email, address, or role. | Admin Only |
| **GET** | `/api/admin/stores` | Lists stores; supports sorting and filtering by name, email, or address. | Admin Only |
| **GET** | `/api/admin/users/:id` | Fetches deep profile detail (Includes rating charts if user is a Store Owner). | Admin Only |

###  3. Normal User Controls (`/api/stores` & `/api/ratings`)
| Method | Endpoint | Description | Access Layer |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/stores` | Lists stores with sorting/searching, overall ratings, and caller's personal vote. | Normal User |
| **POST** | `/api/ratings` | Submits an immutable core rating score (1-5 range matrix) for a store. | Normal User |
| **PUT** | `/api/ratings/:storeId` | Modifies caller's active evaluation metrics for a designated store. | Normal User |

###  4. Store Owner Performance Feed (`/api/store-owner`)
| Method | Endpoint | Description | Access Layer |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/store-owner/dashboard`| Compiles real-time weighted scoring index + a roster of reviewer logs. | Store Owner Only |

---

##  Form Validation Rules (Zod Enforcement Matrix)

Data parameters are checked at the gate using strict **Zod Schemas** executed natively as asynchronous backend middleware (the absolute source of truth) and completely mirrored on the React architecture client-side for rapid runtime visual feedback:

| Field Token | Data Constraint / Engineering Ruleset |
| :--- | :--- |
| **Name** | Minimum **20 characters** constraint, capped at a maximum of **60 characters**. |
| **Address** | Highly descriptive, allowing a maximum structure of **400 characters**. |
| **Password** | Enforces a length boundary between **8 and 16 characters**, strictly requiring at least **one uppercase letter** and **one special character**. |
| **Email** | Standard RFC-compliant cryptographic email string layout verification. |
| **Rating** | Explicit integer check bounded inclusively between **1 and 5**. |

---

1. **Frontend Interface (`srp-frontend-app`)**: Single Page Application built on top of React.js optimized via Vite. Utilizes structural Context Providers (`useAuth`) to intercept unauthorized page requests, routing them back into authentication channels based on server-side roles.
2. **Backend API Gateway (`srp-backend-api`)**: A resilient Express.js engine acting as the centralized state mutation node. It integrates custom routing tables aggregated via a central controller pipeline (`routes/index.js`).
3. **Data Storage Engine (`srp-postgres-db`)**: Relational ACID-compliant PostgreSQL database decoupled from local hosts using persistent externalized Docker volumes (`pgdata`).
4. **Database Visualizer Node (`srp-pgadmin`)**: Single-instance database workbench bound directly into internal routing schemas. Server links are automatically mapped natively via backend configurations—no manual `servers.json` generation is required by the reviewer.

---

##  Key Features & Unified Endpoint Matrix

* **Dynamic Role-Based Access Control (RBAC)**: Distinct interfaces for `ADMIN` (System Command Center), `STORE_OWNER` (Console Panel for metrics ledger), and `USER` (Store Feed evaluations).
* **Unified Cryptographic Security Patch**: Single entry point `PUT /api/users/update-password` supporting cross-tier token evaluation. It extracts, verifies, hashes via `bcryptjs`, and saves user identifiers on the fly for all roles.
* **Automatic Seed Synchronization Pipeline**: Boot scripts use automatic migrations via `prisma migrate deploy` coupled with deterministic seeding algorithms (`node prisma/seed.js`).

---

##  Direct Interface Endpoint Tree(Theory)

All network requests routing into backend parameters must be prefixed with `/api`. Secure resources mandate a token parameter: `Authorization: Bearer <JSON_WEB_TOKEN>`.

###  Authentication Schema (`/api/auth`)
* `POST /auth/signup` - Registers a new evaluation user signature.
* `POST /auth/login` - Resolves identity keys and returns user parameters with an explicit authorization payload.

###  System User Controls (`/api/users`)
* `PUT /users/update-password` - Unified route to modify active passcode signatures. Validates current keys via Bcrypt before executing database commits.

###  Store Management Engine (`/api/stores`)
* `GET /stores` - Retrieves active metrics for verified stores mapped in the matrix.

###  Owner Analytical Panel (`/api/store-owner`)
* `GET /store-owner/dashboard` - Extracts weighted average rating indices, total customer evaluation ledgers, and network node identifiers.

---

##  Local Implementation Guide (Getting Started)

###  Prerequisites
Ensure your local terminal instance possesses the necessary containerization runtimes:
* Docker Engine (v24.0+)
* Docker-Compose (v2.20+)

### Instantiation Command
To initialize the microservice fabric, configure environment tables, build individual engine binaries, run entity migrations, and seed default records, execute a single command from the project root:

```bash
docker-compose up -d --build

More Command if required: 
# Check global runtime status across services
docker-compose ps

# Fetch real-time streaming backend logs
docker logs -f srp-backend-api

# Execute manual database seeding overriding automated triggers
docker exec -it srp-backend-api npx prisma db seed
```
### Live Port Portals (Exposed Access Points)
Once instantiation finishes, you can map the entire ecosystem live through these ports:

* Frontend Web App Client: http://localhost:3000

* Central Core Server API: http://localhost:5000

* pgAdmin Database Visualizer: http://localhost:5050

### Demo Folder Structure 

## Backend

backend/
├── prisma/
│   ├── schema.prisma              # User, Store, Rating models + Role enum
│   └── migrations/                # Auto-generated migration SQL files
│
├── src/
│   ├── config/
│   │   ├── index.js               # Environment variables validation (Zod)
│   │   ├── logger.js              # Winston logger (console + file transports)
│   │   └── prisma.js              # Prisma client singleton instance
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── store.controller.js
│   │   ├── rating.controller.js
│   │   └── storeOwner.controller.js
│   │
│   ├── services/
│   │   ├── auth.service.js        # Business logic & database operations
│   │   ├── admin.service.js
│   │   ├── store.service.js
│   │   ├── rating.service.js
│   │   └── storeOwner.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js     # JWT verification & role-based authorization
│   │   ├── validate.middleware.js # Request validation using Zod schemas
│   │   ├── cors.middleware.js
│   │   ├── error.middleware.js    # Global error handling
│   │   └── req.middleware.js      # Request ID injection
│   │
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── admin.route.js
│   │   ├── store.route.js
│   │   ├── rating.route.js
│   │   ├── storeOwner.route.js
│   │   └── index.js               # Mounts all routes under /api
│   │
│   ├── validators/
│   │   └── *.schema.js            # Zod schemas for request validation
│   │
│   └── utils/
│       ├── asyncHandler.js        # Async route wrapper
│       ├── error.js               # Custom AppError classes
│       └── index.js               # Utility exports
│
├── index.js                       # Application entry point
├── Dockerfile
├── .env                           # Environment variables (gitignored)
├── .env.example                   # Environment template
└── package.json

## Frontend 

frontend/
├── public/
│
├── src/
│   ├── api/                       # Axios instance & API service modules
│   │
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar
│   │   ├── DataTable
│   │   ├── Modal
│   │   ├── RatingStars
│   │   └── FormInput
│   │
│   ├── context/
│   │   └── AuthContext            # Authentication state management
│   │
│   ├── hooks/
│   │   ├── useAuth
│   │   ├── useDebounce
│   │   └── useFetch
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   │
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Stores.jsx
│   │   │   ├── AddUser.jsx
│   │   │   ├── AddStore.jsx
│   │   │   └── UserDetail.jsx
│   │   │
│   │   ├── user/
│   │   │   ├── StoreList.jsx
│   │   │   └── UpdatePassword.jsx
│   │   │
│   │   └── storeOwner/
│   │       └── Dashboard.jsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   ├── ProtectedRoute.jsx
│   │   └── RoleRoute.jsx
│   │
│   ├── utils/
│   │   ├── validators.js
│   │   └── constants.js
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
├── .env
└── package.json


---

##  Architectural Summary & Conclusion

###  Technical Summary
The **Store Rating System Matrix (SRP)** is a fully containerized, microservices-driven multi-tenant application engineered to solve real-time data aggregation challenges securely and at scale. 

By separating responsibilities into distinct decoupled tiers—**React (Vite)** for a blazing-fast UI, **Express.js** acting as a hardened API Gateway, **Prisma ORM** for structural safety, and **PostgreSQL** as the transactional bedrock—the system eliminates common distributed bottlenecks. 

Key architectural highlights include:
* **Absolute Source of Truth:** Complex server-side data parameters are enforced via strict **Zod validation layers**, mitigating malicious payload injection.
* **On-Demand Computations:** Eliminates stale analytical data by utilizing dynamic **Prisma Aggregate queries** to compile multi-tenant ratings rather than relying on risky, denormalized database columns.
* **Cryptographic Guardrails:** A unified password mutation pipeline utilizing **Bcrypt hashing** protects user identities across all structural tiers seamlessly.

###  Production Conclusion
This project successfully demonstrates a production-grade development workflow. It addresses crucial real-world engineering concerns including **Role-Based Access Control (RBAC)**, infrastructure state synchronization via automated **Docker orchestration**, database integrity through deterministic database seeding, and rigorous server-side boundary validations. 

The resulting matrix is a robust, highly maintainable, and seamlessly scalable architecture ready for deployment in modern enterprise ecosystems.
