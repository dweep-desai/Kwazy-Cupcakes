# JanSetu Platform - System Architecture

## Table of Contents
1. [System Overview](#system-overview)
2. [High-Level Architecture](#high-level-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Architecture](#database-architecture)
6. [Authentication & Authorization Flow](#authentication--authorization-flow)
7. [API Gateway Pattern](#api-gateway-pattern)
8. [Microservices Communication](#microservices-communication)
9. [Data Flow Diagrams](#data-flow-diagrams)
10. [Activity Logging System](#activity-logging-system)

---

## System Overview

**JanSetu** is a unified digital public infrastructure platform that provides citizens access to various government services through a single interface. The platform follows a microservices architecture with an API Gateway pattern, supporting multiple user roles (Citizens, Service Providers, and Admins).

### Key Technologies
- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: FastAPI, Python 3.14, SQLAlchemy ORM
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: JWT tokens, OTP-based login
- **API Gateway**: Custom FastAPI gateway with service routing

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   React Web    │  │  Mobile App    │  │  Third-party   │   │
│  │   Frontend     │  │   (Future)     │  │   Integrations │   │
│  └────────┬───────┘  └────────┬───────┘  └────────┬───────┘   │
└───────────┼────────────────────┼────────────────────┼───────────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │   API GATEWAY LAYER     │
                    │  (jansetu_platform)     │
                    │  - Routing              │
                    │  - Authentication       │
                    │  - Rate Limiting        │
                    │  - Request Logging      │
                    │  - Caching              │
                    └────────────┬────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
┌───────▼────────┐    ┌──────────▼─────────┐   ┌─────────▼─────────┐
│  CORE PLATFORM │    │   MICROSERVICES    │   │   DATABASE        │
│   ROUTERS      │    │   (Downstream)     │   │   LAYER           │
│                │    │                    │   │                   │
│ - auth         │    │ - healthcare       │   │ - users           │
│ - appointments │    │ - agriculture      │   │ - citizens        │
│ - mkisan       │    │ - digilocker       │   │ - service_providers│
│ - admin        │    │ - grievance        │   │ - appointments    │
│ - activity_logs│    │                    │   │ - products        │
│ - citizen      │    │                    │   │ - activity_logs   │
└────────────────┘    └────────────────────┘   └───────────────────┘
```

---

## Frontend Architecture

### Component Structure
```
frontend/src/
├── App.tsx                      # Main application entry point
├── main.tsx                     # React DOM root
├── context/
│   └── AuthContext.tsx          # Global authentication state
├── pages/
│   ├── citizen/                 # Citizen-facing pages
│   │   ├── CitizenDashboard.tsx
│   │   ├── health/              # Health services
│   │   ├── agriculture/         # Agriculture services
│   │   ├── my-city/             # City services
│   │   └── UserHistory.tsx      # Activity history
│   ├── provider/                # Service provider pages
│   └── admin/                   # Admin pages
├── components/
│   ├── ui/                      # Reusable UI components
│   └── common/                  # Shared components
└── services/
    └── api.ts                   # API client with interceptors
```

### Frontend Data Flow

```
User Action (Click/Form Submit)
    │
    ▼
React Component (State Update)
    │
    ▼
API Service Call (api.ts)
    │
    ▼
Axios Interceptor (Add JWT Token)
    │
    ▼
HTTP Request to Backend
    │
    ▼
API Gateway / Direct Router
    │
    ▼
Response → Component State Update
    │
    ▼
UI Re-render
```

### Key Frontend Patterns

1. **Authentication Context**: Global state management for user authentication
   - Stores JWT token in localStorage
   - Provides `isAuthenticated`, `user`, `login()`, `logout()` methods
   - Protected routes check authentication before rendering

2. **Protected Routes**: Role-based route protection
   - `ProtectedRoute` component checks authentication
   - Validates user role against `allowedRoles` prop
   - Redirects to login if unauthorized

3. **API Client**: Centralized HTTP client
   - Base URL configuration
   - Request/response interceptors
   - Automatic token injection
   - Error handling

---

## Backend Architecture

### Platform Core (`jansetu_platform/`)

```
jansetu_platform/
├── main.py                      # FastAPI application entry point
├── config.py                    # Environment configuration
├── database.py                  # SQLAlchemy engine & session
├── database_init.py             # Schema initialization on startup
├── models/                      # SQLAlchemy ORM models
│   ├── user.py                  # User & Role models
│   ├── service.py               # Service registry model
│   └── observability.py         # Request logging model
├── routers/                     # API route handlers
│   ├── auth.py                  # Authentication endpoints
│   ├── appointments.py          # e-Sanjeevani appointments
│   ├── mkisan.py                # mKisan products & purchases
│   ├── activity_logs.py         # User activity logging
│   ├── gateway.py               # API Gateway router
│   ├── admin.py                 # Admin operations
│   └── citizen.py               # Citizen operations
├── schemas/                     # Pydantic request/response models
├── security/                    # Authentication & authorization
│   ├── jwt.py                   # JWT token generation/verification
│   ├── otp.py                   # OTP generation/verification
│   └── dependencies.py          # FastAPI dependencies
└── services/                    # Business logic services
    ├── gateway_service.py       # Gateway routing logic
    ├── cache_service.py         # Response caching
    └── throttling.py            # Rate limiting
```

### Request Processing Flow

```
HTTP Request arrives at FastAPI
    │
    ▼
CORS Middleware (add CORS headers)
    │
    ▼
Request Logging Middleware (log request metadata)
    │
    ▼
Route Matching (FastAPI router)
    │
    ▼
Dependency Injection
    │
    ├─ get_db() → Database session
    ├─ get_current_user() → User authentication
    └─ require_role() → Role authorization
    │
    ▼
Route Handler Function
    │
    ├─ Business Logic
    ├─ Database Query/Update
    └─ Activity Logging (optional)
    │
    ▼
Response Serialization (Pydantic models)
    │
    ▼
JSON Response sent to client
```

### Startup Sequence

1. **Database Initialization**
   ```
   init_schemas_on_startup()
       ├─ init_admin_schema_on_startup()
       ├─ init_citizens_schema_on_startup()
       │   └─ init_service_providers_schema_on_startup()
       ├─ init_appointments_schema_on_startup()
       └─ init_activity_logs_schema_on_startup()
   ```

2. **FastAPI Application Setup**
   - CORS middleware configuration
   - Request logging middleware registration
   - Router inclusion (auth, services, admin, gateway, etc.)

3. **Service Registration**
   - Microservices register with platform on startup
   - Service metadata stored in `services` table

---

## Database Architecture

### Core Tables

#### 1. **Users & Authentication**
- `users`: Platform users (links to roles)
- `roles`: User roles (CITIZEN, SERVICE_PROVIDER, ADMIN)
- `admins`: Admin accounts (username/password)

#### 2. **Citizens**
- `citizens`: Core citizen data (aadhaar_hash, name, phone, etc.)
- `esanjeevani_citizens`: Healthcare-specific citizen data
- `mkisan_citizens`: Agriculture-specific citizen data

#### 3. **Service Providers**
- `service_providers`: Core SP data (links to users)
- `esanjeevani_service_providers`: Healthcare SP data (doctors, nurses)
- `mkisan_service_providers`: Agriculture SP data (buyers)

#### 4. **Services & Bookings**
- `services`: Service registry (microservices metadata)
- `consultation_requests`: e-Sanjeevani appointments
- `mkisan_products`: Products listed by farmers
- `mkisan_purchases`: Product purchase records

#### 5. **Activity Logging**
- `user_activity_logs`: All user activities (bookings, listings, etc.)

### Database Relationships

```
users
  ├─ role_id → roles
  └─ aadhaar_hash → citizens (via hash)

citizens
  ├─ citizen_id → esanjeevani_citizens
  ├─ citizen_id → mkisan_citizens
  └─ citizen_id → consultation_requests
  └─ citizen_id → user_activity_logs

service_providers
  ├─ service_provider_id → esanjeevani_service_providers
  └─ service_provider_id → mkisan_service_providers

esanjeevani_service_providers
  └─ esanjeevani_provider_id → consultation_requests

mkisan_citizens
  └─ mkisan_citizen_id → mkisan_products

mkisan_products
  └─ product_id → mkisan_purchases

mkisan_service_providers
  └─ mkisan_provider_id → mkisan_purchases
```

### Database Initialization Strategy

- **On Startup**: Schema files are checked and tables created if missing
- **Migration Scripts**: Standalone Python scripts for schema updates
- **Seed Data**: Initial data (admins, sample citizens) seeded automatically

---

## Authentication & Authorization Flow

### Authentication Flow

```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. POST /auth/login
     │    { aadhar: "ABC123456789" }
     ▼
┌─────────────────┐
│  Backend        │
│  - Generate OTP │
│  - Store in DB/ │
│    Redis        │
│  - Return OTP ID│
└────┬────────────┘
     │ 2. OTP sent (console/logged)
     │
     │ 3. POST /auth/verify-otp
     │    { otp_id, aadhar, otp_code }
     ▼
┌─────────────────┐
│  Backend        │
│  - Verify OTP   │
│  - Get/Create   │
│    User         │
│  - Generate JWT │
└────┬────────────┘
     │ 4. Return JWT Token
     ▼
┌──────────┐
│ Frontend │
│ - Store  │
│   Token  │
│ - Update │
│   Auth   │
│   Context│
└──────────┘
```

### Authorization Flow

```
Protected API Endpoint
    │
    ▼
get_current_user() dependency
    │
    ├─ Extract JWT from Authorization header
    ├─ Verify token signature
    ├─ Decode payload (user_id, aadhar, role)
    └─ Query database for User
    │
    ▼
Role Check (if required)
    │
    ├─ require_role([RoleType.ADMIN])
    ├─ require_citizen()
    ├─ require_service_provider()
    └─ require_admin()
    │
    ▼
Access Granted / Denied
```

### Token Structure

```json
{
  "sub": "user_id",
  "aadhar": "ABC123456789",
  "role": "CITIZEN",
  "exp": 1234567890,
  "iat": 1234567890
}
```

---

## API Gateway Pattern

The API Gateway acts as a single entry point for all client requests, routing them to appropriate downstream services or platform routers.

### Gateway Flow

```
Client Request → /gateway/{service_id}/{path}
    │
    ▼
Gateway Router (gateway.py)
    │
    ├─ Extract service_id and path
    ├─ Rate Limiting Check
    ├─ Cache Check (for GET requests)
    └─ Service Resolution
    │
    ▼
Service Registry Query
    │
    ├─ Lookup service by service_id
    ├─ Get service.base_url
    └─ Validate service.status == ACTIVE
    │
    ▼
Forward Request to Downstream Service
    │
    ├─ Preserve headers (except host, connection)
    ├─ Forward query parameters
    ├─ Forward request body
    └─ Make HTTP request to service.base_url
    │
    ▼
Response Handling
    │
    ├─ Cache response (if GET and status 200)
    ├─ Log request to request_logs table
    └─ Return response to client
```

### Gateway Features

1. **Service Discovery**: Resolves service IDs to base URLs via `services` table
2. **Request Caching**: Caches GET responses to reduce downstream load
3. **Rate Limiting**: Throttles requests per user (configurable limits)
4. **Request Logging**: Logs all gateway requests for observability
5. **Error Handling**: Graceful error handling and status code propagation

---

## Microservices Communication

### Microservice Structure

Each microservice is an independent FastAPI application:

```
backend/services/{service_name}/
├── main.py              # FastAPI app entry point
├── routers.py           # Service-specific routes
├── models.py            # Service-specific models
├── database.py          # Service database connection
└── requirements.txt     # Service dependencies
```

### Service Registration

On startup, microservices attempt to register with the platform:

```python
# Service startup
service_data = {
    "name": "Healthcare Appointment Booking",
    "service_id": "healthcare",
    "base_url": "http://localhost:8001",
    "category": "HEALTHCARE"
}
# POST /services/onboard
```

### Inter-Service Communication

**Pattern 1: Direct Database Access** (Platform Routers)
- Platform routers (`appointments.py`, `mkisan.py`) directly query platform database
- No HTTP communication needed
- Fast and simple for core platform features

**Pattern 2: Gateway Proxy** (External Services)
- External services accessed via `/gateway/{service_id}/{path}`
- Gateway forwards requests to service's `base_url`
- Enables service discovery and routing

**Pattern 3: Direct HTTP** (Service-to-Service)
- Services can call each other via HTTP
- Example: Agriculture service calls weather service via gateway

---

## Data Flow Diagrams

### 1. User Login Flow

```
┌─────────┐  1. POST /auth/login         ┌──────────┐
│ Frontend│ ────────────────────────────→│ Backend  │
│         │                              │ /auth.py │
└─────────┘                              └─────┬────┘
                                                │
                          ┌─────────────────────┼──────────────────┐
                          │                     │                  │
                    2. Query users     3. Generate OTP     4. Store OTP
                       table                                  (Redis/DB)
                          │                     │                  │
                          ▼                     ▼                  ▼
                    ┌──────────┐         ┌──────────┐      ┌──────────┐
                    │Database  │         │ OTP: 1234│      │Redis/DB  │
                    │(users)   │         └──────────┘      │(otps)    │
                    └──────────┘                           └──────────┘
                          │
┌─────────┐  5. Return OTP ID
│ Frontend│ ←───────────────────────────────────┘
│         │
│  User enters OTP
│         │
└─────────┘  6. POST /auth/verify-otp
      │      ────────────────────────────→
      │                                   ┌──────────┐
      │                                   │ Backend  │
      │                                   │ /auth.py │
      │                                   └─────┬────┘
      │                                         │
      │                     ┌───────────────────┼──────────────────┐
      │                     │                   │                  │
      │              7. Verify OTP        8. Get/Create     9. Generate JWT
      │                 (Redis/DB)            User              Token
      │                     │                   │                  │
      │                     ▼                   ▼                  ▼
      │               ┌──────────┐        ┌──────────┐      ┌──────────┐
      │               │Redis/DB  │        │Database  │      │JWT Token │
      │               │(otps)    │        │(users)   │      │          │
      │               └──────────┘        └──────────┘      └──────────┘
      │
      │  10. Return JWT Token
      └←─────────────────────────────────────┘
```

### 2. Booking Appointment Flow

```
┌─────────┐  1. POST /appointments/book          ┌──────────────┐
│ Frontend│ ────────────────────────────────────→│ Backend      │
│ (Citizen)│                                      │appointments.py│
└─────────┘                                      └──────┬───────┘
                                                         │
                                                         │ 2. get_current_user()
                                                         │    (JWT verification)
                                                         │
                    ┌────────────────────────────────────┼──────────────────┐
                    │                                    │                  │
                    ▼                                    ▼                  ▼
            ┌─────────────┐                      ┌─────────────┐   ┌─────────────┐
            │users table  │                      │citizens     │   │service_providers│
            │(get user_id)│                      │(get citizen_id)│   │(get provider)│
            └─────────────┘                      └─────────────┘   └─────────────┘
                    │                                    │                  │
                    └────────────────────────────────────┼──────────────────┘
                                                         │
                                                         │ 3. Insert appointment
                                                         ▼
                                            ┌────────────────────────┐
                                            │consultation_requests   │
                                            │table                   │
                                            └────────────┬───────────┘
                                                         │
                                                         │ 4. Log activity
                                                         ▼
                                            ┌────────────────────────┐
                                            │user_activity_logs      │
                                            │table                   │
                                            │activity_type:          │
                                            │BOOK_APPOINTMENT        │
                                            └────────────┬───────────┘
                                                         │
┌─────────┐  5. Return appointment ID                   │
│ Frontend│ ←───────────────────────────────────────────┘
│         │
└─────────┘
```

### 3. Listing Product Flow (mKisan)

```
┌─────────┐  1. POST /mkisan/products               ┌──────────────┐
│ Frontend│ ───────────────────────────────────────→│ Backend      │
│ (Farmer)│                                         │mkisan.py     │
└─────────┘                                         └──────┬───────┘
                                                            │
                                                            │ 2. get_current_user()
                                                            │
                                        ┌────────────────────┼──────────────────┐
                                        │                    │                  │
                                        ▼                    ▼                  ▼
                                ┌─────────────┐      ┌─────────────┐   ┌─────────────┐
                                │users        │      │citizens     │   │mkisan_citizens│
                                │table        │      │table        │   │table         │
                                └─────────────┘      └─────────────┘   └─────────────┘
                                        │                    │                  │
                                        └────────────────────┼──────────────────┘
                                                             │
                                                             │ 3. Insert product
                                                             ▼
                                                ┌────────────────────────┐
                                                │mkisan_products table   │
                                                └────────────┬───────────┘
                                                             │
                                                             │ 4. Log activity
                                                             ▼
                                                ┌────────────────────────┐
                                                │user_activity_logs      │
                                                │activity_type:          │
                                                │LIST_PRODUCT            │
                                                └────────────┬───────────┘
                                                             │
┌─────────┐  5. Return product ID                           │
│ Frontend│ ←───────────────────────────────────────────────┘
│         │
└─────────┘
```

### 4. Activity History Retrieval Flow

```
┌─────────┐  1. GET /activity-logs/my-history         ┌──────────────┐
│ Frontend│ ─────────────────────────────────────────→│ Backend      │
│         │                                           │activity_logs.py│
└─────────┘                                           └──────┬───────┘
                                                              │
                                                              │ 2. get_current_user()
                                                              │
                                        ┌─────────────────────┼──────────────────┐
                                        │                     │                  │
                                        ▼                     ▼                  ▼
                                ┌─────────────┐       ┌─────────────┐   ┌─────────────┐
                                │users table  │       │citizens     │   │user_activity_logs│
                                │(get user_id)│       │(get citizen_id)│ │(query by citizen_id)│
                                └─────────────┘       └─────────────┘   └─────────────┘
                                        │                     │                  │
                                        └─────────────────────┼──────────────────┘
                                                              │
                                                              │ 3. Filter by activity_type (optional)
                                                              │ 4. Order by created_at DESC
                                                              │ 5. Parse metadata JSON
                                                              │
┌─────────┐  6. Return activity list                          │
│ Frontend│ ←──────────────────────────────────────────────────┘
│         │
│ Display │
│ History │
└─────────┘
```

---

## Activity Logging System

### Overview

The activity logging system tracks all user interactions across the platform, providing a complete audit trail of user actions.

### Activity Types

- `BOOK_TRANSPORT` - Public transport bookings
- `BOOK_APPOINTMENT` - Medical appointment bookings
- `CALL_AMBULANCE` - Ambulance requests
- `LIST_PRODUCT` - Product listings (mKisan)
- `PURCHASE_PRODUCT` - Product purchases (mKisan)
- `UPDATE_PROFILE` - Profile updates
- `REGISTER_SELLER` - Seller registrations
- `ACCESS_SERVICE` - Service access
- `VIEW_SCHEME` - Scheme views
- `OTHER` - Other activities

### Logging Flow

```
User Action Occurs
    │
    ▼
Route Handler Executes
    │
    ├─ Business Logic
    ├─ Database Operation (INSERT/UPDATE)
    └─ Activity Logging
        │
        ├─ Extract citizen_id from user
        ├─ Generate activity_id (UUID)
        ├─ Build activity_description
        ├─ Prepare metadata (JSON)
        └─ INSERT into user_activity_logs
            │
            ▼
    Log Stored in Database
```

### Activity Log Structure

```sql
user_activity_logs:
  - activity_id (TEXT PRIMARY KEY)
  - citizen_id (TEXT, FK → citizens)
  - activity_type (TEXT, CHECK constraint)
  - activity_description (TEXT)
  - entity_type (TEXT, e.g., 'appointment', 'product')
  - entity_id (TEXT, e.g., appointment_id, product_id)
  - metadata (TEXT, JSON string)
  - created_at (TEXT, default CURRENT_TIMESTAMP)
```

### Integration Points

1. **Appointment Booking**: Logs when citizen books e-Sanjeevani appointment
2. **Transport Booking**: Logs when citizen books public transport
3. **Ambulance Request**: Logs when citizen requests ambulance
4. **Product Listing**: Logs when farmer lists product on mKisan
5. **Product Purchase**: Logs when buyer purchases product

---

## Key Design Patterns

### 1. Dependency Injection (FastAPI)
- Database sessions via `get_db()`
- User authentication via `get_current_user()`
- Role authorization via `require_role()`

### 2. Repository Pattern
- SQLAlchemy models abstract database operations
- Raw SQL used for complex queries where needed

### 3. Service Layer Pattern
- Business logic separated into service classes
- Examples: `GatewayService`, `CacheService`, `ThrottlingService`

### 4. API Gateway Pattern
- Single entry point for all requests
- Service discovery and routing
- Cross-cutting concerns (auth, caching, rate limiting)

### 5. Event-Driven Logging
- Activities logged asynchronously after business operations
- Non-blocking, failures don't affect main operation

---

## Security Considerations

### Authentication
- **OTP-based login**: Prevents password management issues
- **JWT tokens**: Stateless authentication, expires after 30 minutes
- **Aadhar hashing**: Aadhar numbers stored as SHA-256 hashes

### Authorization
- **Role-based access control (RBAC)**: Three roles (CITIZEN, SERVICE_PROVIDER, ADMIN)
- **Route-level protection**: Protected routes check role before access
- **Dependency injection**: Enforces authentication at API level

### Data Protection
- **Foreign key constraints**: Ensure referential integrity
- **CASCADE deletes**: Automatic cleanup of related records
- **Input validation**: Pydantic models validate all request data

---

## Scalability Considerations

### Current Architecture
- **Monolithic backend**: Single FastAPI application
- **SQLite/PostgreSQL**: Relational database
- **Synchronous operations**: Most operations are blocking

### Future Scaling Options

1. **Database Scaling**
   - Read replicas for read-heavy operations
   - Connection pooling (already implemented)
   - Database sharding by service domain

2. **Service Scaling**
   - Split platform routers into separate services
   - Microservices can scale independently
   - Load balancing via API Gateway

3. **Caching**
   - Redis for OTP storage (optional, currently uses DB)
   - Response caching for gateway (memory-based, can move to Redis)
   - Query result caching

4. **Async Operations**
   - Move activity logging to background tasks
   - Use FastAPI background tasks or Celery
   - Async database drivers (asyncpg for PostgreSQL)

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Environment                │
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  Load        │  │  Platform    │  │  Microservices│ │
│  │  Balancer    │→ │  Backend     │→ │  (Docker)     │ │
│  │  (Nginx)     │  │  (FastAPI)   │  │               │ │
│  └──────────────┘  └──────┬───────┘  └──────────────┘ │
│                           │                            │
│                           ▼                            │
│                  ┌─────────────────┐                   │
│                  │  PostgreSQL     │                   │
│                  │  Database       │                   │
│                  └─────────────────┘                   │
│                                                          │
│  ┌──────────────┐                                       │
│  │  React       │  (Static files served by Nginx)      │
│  │  Frontend    │                                       │
│  └──────────────┘                                       │
└─────────────────────────────────────────────────────────┘
```

---

## Conclusion

The JanSetu platform follows a modern, scalable architecture with clear separation of concerns:

- **Frontend**: React-based SPA with role-based routing
- **Backend**: FastAPI-based API Gateway with core platform routers
- **Database**: Relational database with proper schema management
- **Microservices**: Independent services for domain-specific features
- **Authentication**: JWT-based with OTP login
- **Activity Logging**: Comprehensive audit trail of user actions

This architecture enables:
- Easy addition of new services
- Scalable and maintainable codebase
- Clear data flow and separation of concerns
- Comprehensive activity tracking
- Role-based access control

---

**Last Updated**: 2025-01-27
**Version**: 1.0.0
