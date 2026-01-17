# JanSetu - Unified Digital Public Infrastructure Platform

A comprehensive unified digital public infrastructure platform that demonstrates how multiple government services can be onboarded, managed, accessed, and monitored through a single core platform. Inspired by India's UMANG portal, JanSetu provides a scalable, extensible architecture for digital governance.

## 🎯 Problem Statement

Citizens face challenges accessing government services due to:
- **Fragmented Services**: Services scattered across multiple platforms
- **Complex Onboarding**: Difficult process for service providers to integrate
- **Lack of Transparency**: No unified view of service availability and performance
- **Poor User Experience**: Different interfaces and authentication mechanisms

## 💡 Solution Overview

JanSetu provides a **single unified platform** that:
- Centralizes all government services under one interface
- Enables seamless service provider onboarding with governance workflows
- Provides real-time observability and analytics
- Offers consistent user experience across all services
- Supports role-based access control for citizens, providers, and administrators

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Citizens   │  │   Providers  │  │   Admins     │     │
│  │   Portal     │  │   Portal     │  │   Portal     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Core Platform Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Identity &  │  │   Service    │  │   API        │     │
│  │  Auth (JWT)  │  │   Registry   │  │   Gateway    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │Observability │  │   Caching    │  │  Governance  │     │
│  │  & Metrics   │  │   (Redis)    │  │   Workflow   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Service Layer                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Healthcare   │  │ Agriculture  │  │  Grievance   │     │
│  │   Service    │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Education   │  │  Transport    │  │   [More...]  │     │
│  │   Service    │  │   Service    │  │              │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Core Design Principles

1. **Pluggable Architecture**: Services can be independently developed and integrated
2. **API Gateway Pattern**: All service requests routed through central gateway
3. **Service Registry**: Dynamic service discovery and management
4. **Governance Workflow**: Approval-based service onboarding process
5. **Observability First**: Built-in metrics, logging, and monitoring

## 🔑 Key Features

### 1. Unified Service Catalog
- **30+ Government Services** across 6 categories:
  - Healthcare (Medical stores, Hospitals, Ambulance, Telemedicine)
  - Emergency Services (Police, Helplines, Ambulance)
  - Agriculture (MSP, Market availability, Supply exchange)
  - Education (Marksheets, ABC ID, AICTE, NTA)
  - Transport & Utility (Fuel prices, Petrol stations)
  - My City (Traffic, Weather, Complaints, Public transport)

### 2. Service Onboarding & Governance
- **Provider Self-Service**: Service providers can submit onboarding requests
- **Admin Approval Workflow**: Multi-stage approval process (PENDING → APPROVED → ACTIVE)
- **Service Lifecycle Management**: Activate/deactivate services dynamically
- **Change Request Mechanism**: Admin can request modifications before approval

### 3. Identity & Access Management
- **Aadhar-based Authentication**: Secure OTP-based login system
- **Role-Based Access Control**: Citizens, Service Providers, Administrators
- **JWT Token Management**: Stateless authentication with secure token handling

### 4. API Gateway & Routing
- **Dynamic Request Routing**: Routes requests to appropriate services based on registry
- **Request Caching**: Redis-based caching for improved performance
- **Rate Limiting**: Protection against abuse and overload
- **Request Logging**: Complete audit trail of all API calls

### 5. Observability & Analytics
- **Service-Level Metrics**: Request counts, response times, error rates
- **Platform Health Monitoring**: Real-time system status
- **Request Logs**: Detailed logging for debugging and analysis
- **Performance Analytics**: Track service usage and performance

### 6. Real-Time API Integrations
- **Location Services**: Integration with OpenStreetMap/Overpass API for location-based services
- **Government Data Portals**: Real-time MSP data, fuel prices, market information
- **Third-Party APIs**: Extensible architecture for external service integration

## 🛠️ Technology Stack

### Backend
- **Framework**: FastAPI (High-performance, async Python framework)
- **Database**: SQLite (Development) / PostgreSQL (Production-ready)
- **Cache**: Redis (For OTP storage and request caching)
- **Authentication**: JWT (JSON Web Tokens)
- **ORM**: SQLAlchemy (Database abstraction layer)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (Fast development and build)
- **Styling**: Tailwind CSS (Utility-first CSS framework)
- **Routing**: React Router (Client-side routing)
- **Maps**: Leaflet.js (Interactive maps for location services)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Deployment**: Vercel (Frontend), Docker (Backend)

## 📊 System Design Highlights

### Service Registry Pattern
- Central registry maintains all service metadata
- Services register themselves on startup
- Dynamic routing based on registry lookup
- Supports service versioning and multiple instances

### API Gateway Pattern
- Single entry point for all service requests
- Request/response transformation
- Authentication and authorization
- Rate limiting and throttling
- Request/response logging

### Governance Workflow
```
Service Provider → Submit Request → PENDING
                              ↓
                    Admin Review
                              ↓
        ┌─────────────┬─────────────┬─────────────┐
        ↓             ↓             ↓             ↓
    APPROVED    REJECTED    CHANGES_REQUESTED   [Resubmit]
        ↓
    Service Active → Available in Gateway
```

### Caching Strategy
- **OTP Storage**: Redis for temporary OTP codes (5-minute TTL)
- **Service Registry**: Cache service metadata to reduce database queries
- **API Responses**: Cache frequently accessed data (configurable TTL)

### Security Architecture
- **Authentication**: JWT-based stateless authentication
- **Authorization**: Role-based access control (RBAC)
- **CORS**: Configurable cross-origin resource sharing
- **Input Validation**: Pydantic schemas for request validation
- **SQL Injection Protection**: ORM-based queries prevent SQL injection

## 🚀 Scalability & Extensibility

### Horizontal Scaling
- Stateless API design allows multiple backend instances
- Redis enables shared state across instances
- Database can be scaled independently

### Service Extensibility
- **Pluggable Services**: New services can be added without modifying core platform
- **Standardized Interface**: Services follow consistent API patterns
- **Self-Registration**: Services automatically register on startup

### Performance Optimizations
- **Request Caching**: Reduce load on downstream services
- **Async Operations**: Non-blocking I/O for better concurrency
- **Database Indexing**: Optimized queries for fast lookups
- **CDN Ready**: Frontend assets can be served via CDN

## 📈 Use Cases

### For Citizens
- Access all government services from single platform
- Real-time location-based services (hospitals, petrol stations, police stations)
- Track service requests and complaints
- View service availability and status

### For Service Providers
- Self-service onboarding process
- Track onboarding request status
- Manage service lifecycle
- View service usage metrics

### For Administrators
- Review and approve service onboarding requests
- Monitor platform health and performance
- Manage service lifecycle (activate/deactivate)
- View comprehensive analytics and metrics

## 🎯 Key Differentiators

1. **Unified Platform**: Single entry point for all government services
2. **Governance Built-in**: Approval workflows ensure quality and security
3. **Real-Time Integrations**: Live data from government APIs and third-party services
4. **Observability**: Built-in monitoring and analytics
5. **Extensible Architecture**: Easy to add new services and features
6. **User-Centric Design**: Consistent experience across all services

## 🔐 Security Features

- **Aadhar-based Authentication**: Secure OTP verification
- **JWT Tokens**: Stateless, secure token-based authentication
- **Role-Based Access Control**: Granular permissions per user role
- **Input Validation**: All inputs validated using Pydantic schemas
- **CORS Protection**: Configurable cross-origin policies
- **Rate Limiting**: Protection against abuse

## 📊 Monitoring & Analytics

- **Service Metrics**: Request counts, response times, error rates per service
- **Platform Health**: Real-time system status and health checks
- **Request Logs**: Complete audit trail with timestamps and user information
- **Performance Tracking**: Monitor service performance and identify bottlenecks

## 🌐 API Integration Capabilities

- **Location Services**: OpenStreetMap/Overpass API for real-time location data
- **Government Data**: Integration with Indian government data portals
- **Third-Party Services**: Extensible architecture for external API integration
- **Real-Time Data**: Live updates for fuel prices, MSP, market availability

## 🎓 Learning Outcomes

This project demonstrates:
- **Microservices Architecture**: Service-oriented design with independent services
- **API Gateway Pattern**: Centralized routing and management
- **Service Registry**: Dynamic service discovery
- **Governance Workflows**: Approval-based service management
- **Observability**: Metrics, logging, and monitoring
- **Security Best Practices**: Authentication, authorization, input validation

## 📝 License

This project is created for demonstration purposes as part of Ingenious Hackathon 7.0.

---

**Built with ❤️ for Digital India**
