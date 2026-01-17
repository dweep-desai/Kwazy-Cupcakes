# References - External APIs, Libraries, and Resources

This document lists all external APIs, third-party libraries, frameworks, and resources used in the JanSetu platform that are not owned by the project.

## 🌐 External APIs

### Location & Mapping Services

#### OpenStreetMap / Overpass API
- **Service**: Overpass API
- **URL**: `https://overpass-api.de/api/interpreter`
- **Purpose**: Fetching nearby petrol stations and location-based POI data
- **Usage**: Petrol Stations Near Me feature
- **License**: Open Database License (ODbL)
- **Documentation**: https://wiki.openstreetmap.org/wiki/Overpass_API
- **Attribution**: Data © OpenStreetMap contributors

#### OpenStreetMap Tile Server
- **Service**: OpenStreetMap Tile Layer
- **URL**: `https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`
- **Purpose**: Map tiles for displaying interactive maps
- **Usage**: All location-based services (hospitals, medical stores, police stations, petrol stations)
- **License**: Open Database License (ODbL)
- **Attribution**: © OpenStreetMap contributors

#### Nominatim (OpenStreetMap Geocoding)
- **Service**: Nominatim Reverse Geocoding API
- **URL**: `https://nominatim.openstreetmap.org/reverse`
- **Purpose**: Reverse geocoding (coordinates to address)
- **Usage**: Weather Info service for location names
- **License**: Open Database License (ODbL)
- **Documentation**: https://nominatim.org/release-docs/develop/api/Reverse/
- **Attribution**: Data © OpenStreetMap contributors

#### Google Maps Directions API
- **Service**: Google Maps Directions
- **URL**: `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
- **Purpose**: Opening directions to locations in Google Maps
- **Usage**: Navigation links in location-based services
- **License**: Google Maps Platform Terms of Service
- **Documentation**: https://developers.google.com/maps/documentation/urls/get-started

### Weather & Air Quality APIs

#### Open-Meteo Weather API
- **Service**: Open-Meteo Weather Forecast API
- **URL**: `https://api.open-meteo.com/v1/forecast`
- **Purpose**: Weather forecasts and current weather conditions
- **Usage**: Weather Info service
- **License**: Attribution required
- **Documentation**: https://open-meteo.com/en/docs
- **Attribution**: Weather data by Open-Meteo.com

#### Open-Meteo Air Quality API
- **Service**: Open-Meteo Air Quality API
- **URL**: `https://air-quality-api.open-meteo.com/v1/air-quality`
- **Purpose**: Air quality index (AQI) data
- **Usage**: Weather Info service for pollution data
- **License**: Attribution required
- **Documentation**: https://open-meteo.com/en/docs/air-quality-api
- **Attribution**: Air quality data by Open-Meteo.com

### Government Data APIs

#### Indian Government Data Portal (data.gov.in)
- **Service**: Indian Government Open Data Portal
- **URL**: `https://api.data.gov.in/resource/...`
- **Purpose**: 
  - MSP (Minimum Support Price) data
  - Agriculture market data
  - Fuel price data (fallback)
- **Usage**: 
  - Check MSP service
  - Market Availability service
  - Fuel Prices service (fallback)
- **License**: Open Government Data License - India
- **Documentation**: https://data.gov.in/
- **API Key**: Public API key used (may require registration for production)
- **Note**: API endpoints may require valid API keys for production use

## 📚 Frontend Libraries & Frameworks

### Core Framework
- **React** (v18.2.0)
  - License: MIT
  - Website: https://react.dev/
  - Purpose: UI framework

- **TypeScript** (v5.2.2)
  - License: Apache-2.0
  - Website: https://www.typescriptlang.org/
  - Purpose: Type-safe JavaScript

### Build Tools
- **Vite** (v5.0.8)
  - License: MIT
  - Website: https://vitejs.dev/
  - Purpose: Build tool and dev server

- **PostCSS** (v8.5.6)
  - License: MIT
  - Website: https://postcss.org/
  - Purpose: CSS processing

- **Autoprefixer** (v10.4.23)
  - License: MIT
  - Website: https://github.com/postcss/autoprefixer
  - Purpose: CSS vendor prefixing

### Styling
- **Tailwind CSS** (v3.4.19)
  - License: MIT
  - Website: https://tailwindcss.com/
  - Purpose: Utility-first CSS framework

- **tailwindcss-animate** (v1.0.7)
  - License: MIT
  - Website: https://github.com/jamiebuilds/tailwindcss-animate
  - Purpose: Animation utilities for Tailwind

- **tailwind-merge** (v3.4.0)
  - License: MIT
  - Website: https://github.com/dcastil/tailwind-merge
  - Purpose: Merge Tailwind CSS classes

- **clsx** (v2.1.1)
  - License: MIT
  - Website: https://github.com/lukeed/clsx
  - Purpose: Conditional class names

- **class-variance-authority** (v0.7.1)
  - License: MIT
  - Website: https://github.com/joe-bell/cva
  - Purpose: Component variant management

### UI Components
- **@radix-ui/react-slot** (v1.2.4)
  - License: MIT
  - Website: https://www.radix-ui.com/
  - Purpose: Slot component primitives

- **@radix-ui/react-toast** (v1.2.15)
  - License: MIT
  - Website: https://www.radix-ui.com/primitives/docs/components/toast
  - Purpose: Toast notification component

- **@radix-ui/react-tooltip** (v1.2.8)
  - License: MIT
  - Website: https://www.radix-ui.com/primitives/docs/components/tooltip
  - Purpose: Tooltip component

- **lucide-react** (v0.562.0)
  - License: ISC
  - Website: https://lucide.dev/
  - Purpose: Icon library

### Routing
- **react-router-dom** (v6.20.0)
  - License: MIT
  - Website: https://reactrouter.com/
  - Purpose: Client-side routing

### HTTP Client
- **axios** (v1.6.2)
  - License: MIT
  - Website: https://axios-http.com/
  - Purpose: HTTP client for API requests

### Maps
- **leaflet** (v1.9.4)
  - License: BSD-2-Clause
  - Website: https://leafletjs.com/
  - Purpose: Interactive maps library

- **react-leaflet** (v4.2.1)
  - License: MIT
  - Website: https://react-leaflet.js.org/
  - Purpose: React bindings for Leaflet

- **@types/leaflet** (v1.9.21)
  - License: MIT
  - Purpose: TypeScript definitions for Leaflet

### Charts & Visualization
- **recharts** (v2.10.3)
  - License: MIT
  - Website: https://recharts.org/
  - Purpose: Chart library for React

### Development Tools
- **ESLint** (v8.55.0)
  - License: MIT
  - Website: https://eslint.org/
  - Purpose: Code linting

- **@typescript-eslint/eslint-plugin** (v6.14.0)
  - License: MIT
  - Purpose: TypeScript ESLint rules

- **@typescript-eslint/parser** (v6.14.0)
  - License: MIT
  - Purpose: ESLint parser for TypeScript

- **@vitejs/plugin-react** (v4.2.1)
  - License: MIT
  - Purpose: Vite plugin for React

- **@types/react** (v18.2.43)
  - License: MIT
  - Purpose: TypeScript definitions for React

- **@types/react-dom** (v18.2.17)
  - License: MIT
  - Purpose: TypeScript definitions for React DOM

## 🔧 Backend Libraries & Frameworks

### Core Framework
- **FastAPI** (>=0.115.0)
  - License: MIT
  - Website: https://fastapi.tiangolo.com/
  - Purpose: Web framework

- **Uvicorn** (>=0.32.0)
  - License: BSD
  - Website: https://www.uvicorn.org/
  - Purpose: ASGI server

### Database & ORM
- **SQLAlchemy** (>=2.0.36)
  - License: MIT
  - Website: https://www.sqlalchemy.org/
  - Purpose: ORM and database toolkit

- **Alembic** (>=1.14.0)
  - License: MIT
  - Website: https://alembic.sqlalchemy.org/
  - Purpose: Database migration tool

- **psycopg2-binary** (>=2.9.10)
  - License: LGPL / PostgreSQL License
  - Website: https://www.psycopg.org/
  - Purpose: PostgreSQL adapter

### Validation & Serialization
- **Pydantic** (>=2.10.0)
  - License: MIT
  - Website: https://docs.pydantic.dev/
  - Purpose: Data validation and settings management

- **Pydantic Settings** (>=2.6.0)
  - License: MIT
  - Purpose: Settings management using Pydantic

### Authentication & Security
- **python-jose[cryptography]** (>=3.3.0)
  - License: MIT
  - Website: https://python-jose.readthedocs.io/
  - Purpose: JWT token handling

### HTTP Client
- **httpx** (>=0.27.0)
  - License: BSD
  - Website: https://www.python-httpx.org/
  - Purpose: HTTP client for inter-service communication

### Caching
- **redis** (>=5.2.0)
  - License: BSD
  - Website: https://redis.io/
  - Purpose: In-memory data store for caching and OTP storage

### Utilities
- **python-multipart** (>=0.0.12)
  - License: Apache-2.0
  - Purpose: Multipart form data parsing

## 🗺️ Map & Location Services

### OpenStreetMap Ecosystem
- **OpenStreetMap Data**
  - License: Open Database License (ODbL)
  - Website: https://www.openstreetmap.org/
  - Attribution: © OpenStreetMap contributors
  - Usage: Base map data, POI data, geocoding

- **Overpass API**
  - License: Open Database License (ODbL)
  - Website: https://overpass-api.de/
  - Usage: Querying OSM data for location-based services

- **OpenStreetMap Tile Server**
  - License: Open Database License (ODbL)
  - Usage: Map tile rendering

- **Nominatim**
  - License: Open Database License (ODbL)
  - Website: https://nominatim.org/
  - Usage: Reverse geocoding

### Google Maps
- **Google Maps Directions**
  - License: Google Maps Platform Terms of Service
  - Website: https://developers.google.com/maps
  - Usage: Opening directions in Google Maps app

## 📊 Data Sources

### Government Data
- **Indian Government Data Portal (data.gov.in)**
  - License: Open Government Data License - India
  - Website: https://data.gov.in/
  - Usage: MSP data, agriculture data, fuel prices
  - Note: May require API key registration for production use

### Weather Data
- **Open-Meteo**
  - License: Attribution required
  - Website: https://open-meteo.com/
  - Usage: Weather forecasts and air quality data
  - Attribution: Weather data by Open-Meteo.com

## 🎨 Fonts & Typography

- **Google Fonts - Inter**
  - License: SIL Open Font License
  - Website: https://fonts.google.com/specimen/Inter
  - Usage: Primary font family
  - CDN: `https://fonts.googleapis.com/css2?family=Inter`

## 🐳 Infrastructure & Deployment

### Containerization
- **Docker**
  - License: Apache-2.0
  - Website: https://www.docker.com/
  - Purpose: Containerization

- **Docker Compose**
  - License: Apache-2.0
  - Website: https://docs.docker.com/compose/
  - Purpose: Multi-container orchestration

### Deployment Platforms
- **Vercel** (Frontend)
  - License: Proprietary (Free tier available)
  - Website: https://vercel.com/
  - Purpose: Frontend hosting and deployment

## 📝 License Summary

### Open Source Licenses Used
- **MIT License**: Most frontend libraries (React, Vite, Tailwind, etc.)
- **Apache-2.0**: TypeScript, some Python packages
- **BSD License**: Uvicorn, httpx, Redis client
- **Open Database License (ODbL)**: OpenStreetMap data
- **SIL Open Font License**: Inter font
- **LGPL / PostgreSQL License**: psycopg2-binary

### Proprietary / Terms of Service
- **Google Maps Platform**: Requires API key and adherence to Terms of Service
- **Vercel**: Proprietary platform with free tier

## ⚠️ Important Notes

1. **API Keys**: Some services (Google Maps, data.gov.in) may require API keys for production use
2. **Rate Limits**: External APIs may have rate limits - implement caching and throttling
3. **Attribution**: OpenStreetMap and Open-Meteo require attribution
4. **Terms of Service**: Review and comply with all third-party Terms of Service
5. **Data Privacy**: Ensure compliance with data privacy regulations when using external APIs

## 🔗 Quick Links

- **OpenStreetMap**: https://www.openstreetmap.org/
- **Overpass API**: https://wiki.openstreetmap.org/wiki/Overpass_API
- **Open-Meteo**: https://open-meteo.com/
- **Indian Government Data Portal**: https://data.gov.in/
- **React**: https://react.dev/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Leaflet**: https://leafletjs.com/

---

**Last Updated**: January 2024

**Note**: This document should be updated whenever new external dependencies or APIs are added to the project.
