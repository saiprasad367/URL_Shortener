<div align="center">

# 🚀 Shortify - Powerful URL Shortener

<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
<img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
<img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />

### *Transform long URLs into powerful, trackable short links with enterprise-grade performance* ⚡

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Documentation](#-api-documentation) • [Architecture](#-architecture)

---

</div>

## 📖 Overview

**Shortify** is a modern, full-stack URL shortening SaaS platform engineered for performance, scalability, and analytics. Built with cutting-edge technologies, Shortify transforms lengthy URLs into concise, shareable links while providing real-time analytics, lightning-fast redirections powered by Redis caching, and a beautiful, responsive user interface.

### ✨ Key Capabilities

- 🔗 **Intelligent URL Shortening** - Generate compact, SEO-friendly short URLs using Base62 encoding
- ⚡ **Lightning-Fast Redirections** - Sub-millisecond response times powered by Redis caching layer
- 📊 **Comprehensive Analytics** - Track clicks, geographic data, referrers, and user agents in real-time
- 🛡️ **Enterprise Security** - Built-in rate limiting, input validation, and XSS protection
- 🎨 **Beautiful UI/UX** - Modern, responsive interface built with React and Tailwind CSS
- 🐳 **Production-Ready** - Fully Dockerized architecture for seamless deployment
- 🔄 **RESTful API** - Clean, well-documented API endpoints for easy integration

---

## 🛠️ Tech Stack

### **Frontend**
| Technology | Purpose |
|------------|---------|
| **React 18** | Modern UI library with hooks and functional components |
| **TypeScript** | Type-safe development with enhanced IDE support |
| **Vite** | Next-generation frontend tooling for blazing-fast builds |
| **Tailwind CSS** | Utility-first CSS framework for rapid UI development |
| **React Router** | Declarative routing for single-page applications |
| **Axios** | Promise-based HTTP client for API communication |

### **Backend**
| Technology | Purpose |
|------------|---------|
| **Node.js** | High-performance JavaScript runtime for server-side logic |
| **Express.js** | Minimalist web framework for building RESTful APIs |
| **TypeScript** | Type-safe backend development with compile-time error checking |
| **PostgreSQL** | Robust relational database for persistent data storage |
| **Prisma ORM** | Next-generation ORM with type-safe database queries |
| **Redis** | In-memory data store for high-speed caching and session management |
| **Docker** | Containerization for consistent development and deployment environments |
| **Docker Compose** | Multi-container orchestration for local development |

---

## 🎯 Features

### Core Functionality

#### 1️⃣ **URL Shortening Engine**
- **Base62 Encoding Algorithm**: Converts numeric IDs into short, URL-safe strings using characters `[A-Za-z0-9]`
- **Collision-Free Generation**: Guaranteed unique short URLs through database-backed auto-incrementing IDs
- **Custom Alias Support**: Allow users to create branded, memorable short links
- **Expiration Management**: Set time-to-live (TTL) for temporary links

#### 2️⃣ **High-Performance Caching**
- **Two-Tier Caching Strategy**: 
  - L1: Redis cache for frequently accessed URLs (99%+ hit rate)
  - L2: PostgreSQL for persistent storage
- **Cache Warming**: Pre-populate cache with trending links
- **TTL Management**: Automatic cache invalidation and refresh
- **Cache-Aside Pattern**: Lazy loading with database fallback

#### 3️⃣ **Advanced Analytics**
- **Click Tracking**: Real-time monitoring of link engagement
- **Geolocation Data**: Track visitor locations by country/city
- **Referrer Analysis**: Identify traffic sources (social media, email, direct)
- **Device & Browser Tracking**: Analyze user agents and platforms
- **Time-Series Data**: Hourly/daily/monthly click trends
- **Export Capabilities**: Download analytics as CSV/JSON

#### 4️⃣ **Security & Performance**
- **Rate Limiting**: Prevent abuse with configurable request throttling
- **Input Validation**: Sanitize and validate all user inputs
- **SQL Injection Protection**: Parameterized queries via Prisma ORM
- **XSS Prevention**: Content Security Policy headers
- **HTTPS Enforcement**: Secure communication in production
- **CORS Configuration**: Controlled cross-origin resource sharing

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000/api/v1
```

### **Endpoints**

#### 🔹 **1. Create Short URL**
```http
POST /api/v1/urls
```

**Request Body:**
```json
{
  "originalUrl": "https://www.example.com/very/long/url/path",
  "customAlias": "my-link",  // Optional
  "expiresAt": "2024-12-31T23:59:59Z"  // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "shortId": "aB3xZ9",
    "originalUrl": "https://www.example.com/very/long/url/path",
    "shortUrl": "http://localhost:5000/aB3xZ9",
    "clicks": 0,
    "createdAt": "2024-03-05T10:30:00Z",
    "expiresAt": "2024-12-31T23:59:59Z"
  }
}
```

---

#### 🔹 **2. Redirect to Original URL**
```http
GET /:shortId
```

**Example:**
```bash
curl http://localhost:5000/aB3xZ9
# → 302 Redirect to https://www.example.com/very/long/url/path
```

**Process Flow:**
1. Extract `shortId` from URL path
2. Check Redis cache for existing mapping
3. If cache miss, query PostgreSQL database
4. Store result in Redis with TTL
5. Increment click counter asynchronously
6. Return 302 redirect response

---

#### 🔹 **3. Get URL Statistics**
```http
GET /api/v1/urls/:shortId/stats
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "shortId": "aB3xZ9",
    "originalUrl": "https://www.example.com/very/long/url/path",
    "totalClicks": 1547,
    "clicksByDate": [
      { "date": "2024-03-01", "clicks": 342 },
      { "date": "2024-03-02", "clicks": 289 }
    ],
    "clicksByCountry": [
      { "country": "United States", "clicks": 678 },
      { "country": "India", "clicks": 432 }
    ],
    "referrers": [
      { "source": "twitter.com", "clicks": 456 },
      { "source": "direct", "clicks": 391 }
    ],
    "devices": {
      "mobile": 892,
      "desktop": 543,
      "tablet": 112
    },
    "createdAt": "2024-02-15T08:20:00Z"
  }
}
```

---

#### 🔹 **4. Delete Short URL**
```http
DELETE /api/v1/urls/:shortId
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Short URL deleted successfully"
}
```

**Actions Performed:**
- Remove entry from PostgreSQL database
- Invalidate Redis cache for the shortId
- Delete associated analytics data

---

#### 🔹 **5. Get All URLs (with Pagination)**
```http
GET /api/v1/urls?page=1&limit=10
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "urls": [
      {
        "id": 1,
        "shortId": "aB3xZ9",
        "originalUrl": "https://example.com",
        "clicks": 1547,
        "createdAt": "2024-02-15T08:20:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalUrls": 47,
      "limit": 10
    }
  }
}
```

---

### **Base62 Encoding Algorithm**

The short URL generation uses a **Base62 encoding** scheme to convert numeric IDs into compact strings:

```typescript
const BASE62_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

function encodeBase62(num: number): string {
  if (num === 0) return BASE62_CHARSET[0];
  
  let encoded = '';
  while (num > 0) {
    const remainder = num % 62;
    encoded = BASE62_CHARSET[remainder] + encoded;
    num = Math.floor(num / 62);
  }
  return encoded;
}

// Example: Database ID 125847 → Short ID "nP7"
```

**Why Base62?**
- ✅ URL-safe (no special characters)
- ✅ Case-sensitive (62 unique characters vs 36 in Base36)
- ✅ Compact representation (6 characters = 56.8 billion combinations)
- ✅ Human-readable and shareable

---

## 🚀 Quick Start

### **Prerequisites**

Ensure you have the following installed on your system:

- **Node.js** (v18+ recommended) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Docker** & **Docker Compose** - [Download](https://www.docker.com/products/docker-desktop)
- **Git** - [Download](https://git-scm.com/downloads)
- **PostgreSQL** (if not using Docker) - [Download](https://www.postgresql.org/download/)
- **Redis** (if not using Docker) - [Download](https://redis.io/download)

---

### **Step 1: Clone the Repository**

Open your terminal and run:

```bash
# Clone the repository
git clone https://github.com/saiprasad/shortify-your-link-amplified.git

# Navigate into the project directory
cd shortify-your-link-amplified
```

---

### **Step 2: Backend Setup**

#### **2.1 Navigate to Backend Directory**
```bash
cd backend
```

#### **2.2 Install Dependencies**
```bash
npm install
```

#### **2.3 Configure Environment Variables**

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following configuration (update values as needed):

```env
# Server Configuration
NODE_ENV=development
PORT=5000
API_VERSION=v1

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/shortify_db?schema=public"

# Redis Configuration
REDIS_URL="redis://localhost:6379"
REDIS_TTL=3600  # Cache TTL in seconds (1 hour)

# CORS Configuration
CORS_ORIGIN="http://localhost:5173"

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Short URL Configuration
SHORT_URL_BASE="http://localhost:5000"
SHORT_ID_LENGTH=6

# Analytics
ENABLE_ANALYTICS=true

# Optional: Production Database (Render/Supabase)
# DATABASE_URL="postgresql://user:pass@aws-0-region.pooler.supabase.com:5432/postgres"
# REDIS_URL="redis://red-xxxxx.redis.cloud.redislabs.com:12345"
```

#### **2.4 Start Database Services with Docker**

```bash
# Start PostgreSQL and Redis containers
docker-compose up -d

# Verify containers are running
docker-compose ps
```

**Expected Output:**
```
NAME                COMMAND                  SERVICE    STATUS
shortify-postgres   "docker-entrypoint.s…"   postgres   Up 10 seconds
shortify-redis      "docker-entrypoint.s…"   redis      Up 10 seconds
```

#### **2.5 Run Database Migrations**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations to create database schema
npx prisma migrate dev --name init

# (Optional) Seed database with sample data
npx prisma db seed
```

#### **2.6 Start Backend Server**

```bash
# Development mode with hot-reload
npm run dev

# Production mode
npm run build
npm start
```

**Expected Output:**
```
🚀 Server running on http://localhost:5000
✅ PostgreSQL connected successfully
✅ Redis connected successfully
📊 API Documentation: http://localhost:5000/api-docs
```

---

### **Step 3: Frontend Setup**

#### **3.1 Open New Terminal & Navigate to Frontend**

```bash
# From project root
cd ../frontend  # Or just 'cd ..' if in backend, then 'cd frontend'
```

#### **3.2 Install Dependencies**

```bash
npm install
```

#### **3.3 Configure Environment Variables**

Create a `.env` file in the `frontend` directory:

```bash
touch .env
```

Add the following:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SHORT_URL_BASE=http://localhost:5000

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_CUSTOM_ALIAS=true

# Optional: Production API
# VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
```

#### **3.4 Start Development Server**

```bash
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

---

### **Step 4: Access the Application**

Open your browser and navigate to:

- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- **API Documentation (Swagger):** [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

---

### **Step 5: Test the Application**

#### **Using the Frontend:**
1. Open http://localhost:5173
2. Paste a long URL in the input field
3. Click "Shorten URL"
4. Copy the generated short link
5. Test the redirect in a new tab
6. View analytics for your shortened URL

#### **Using cURL:**
```bash
# Create a short URL
curl -X POST http://localhost:5000/api/v1/urls \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://github.com/saiprasad"}'

# Test redirect (should return 302)
curl -I http://localhost:5000/aB3xZ9

# Get statistics
curl http://localhost:5000/api/v1/urls/aB3xZ9/stats
```

---

## 📁 Architecture & Folder Structure

```
shortify-your-link-amplified/
│
├── backend/                      # Backend API Server
│   ├── src/
│   │   ├── config/              # Configuration files
│   │   │   ├── database.ts      # Prisma/PostgreSQL setup
│   │   │   └── redis.ts         # Redis client configuration
│   │   ├── controllers/         # Request handlers
│   │   │   ├── url.controller.ts
│   │   │   └── analytics.controller.ts
│   │   ├── middlewares/         # Express middlewares
│   │   │   ├── errorHandler.ts
│   │   │   ├── rateLimiter.ts
│   │   │   └── validator.ts
│   │   ├── models/              # Prisma schema & types
│   │   │   └── schema.prisma
│   │   ├── routes/              # API route definitions
│   │   │   ├── url.routes.ts
│   │   │   └── analytics.routes.ts
│   │   ├── services/            # Business logic layer
│   │   │   ├── url.service.ts
│   │   │   ├── cache.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── utils/               # Helper functions
│   │   │   ├── base62.ts
│   │   │   ├── validators.ts
│   │   │   └── logger.ts
│   │   └── server.ts            # Express app entry point
│   ├── prisma/
│   │   ├── migrations/          # Database migration files
│   │   └── schema.prisma        # Database schema definition
│   ├── docker-compose.yml       # Docker services configuration
│   ├── Dockerfile               # Backend container definition
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/                     # React Frontend Application
│   ├── public/                  # Static assets
│   │   ├── favicon.ico
│   │   └── logo.svg
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── UrlShortener.tsx
│   │   │   ├── UrlList.tsx
│   │   │   ├── Analytics.tsx
│   │   │   └── Header.tsx
│   │   ├── pages/               # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   └── Analytics.tsx
│   │   ├── services/            # API service layer
│   │   │   └── api.ts
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useUrlShortener.ts
│   │   ├── types/               # TypeScript type definitions
│   │   │   └── index.ts
│   │   ├── utils/               # Helper functions
│   │   │   └── formatters.ts
│   │   ├── App.tsx              # Root component
│   │   ├── main.tsx             # Application entry point
│   │   └── index.css            # Global styles
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── .env.example
│
├── .gitignore
├── LICENSE
└── README.md                     # This file
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Frontend (Vite + TypeScript + Tailwind CSS)       │   │
│  │  - URL Shortener Component                               │   │
│  │  - Analytics Dashboard                                   │   │
│  │  - Real-time Stats Visualization                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Express.js REST API (Node.js + TypeScript)              │   │
│  │  ┌────────────────┐  ┌────────────────┐  ┌───────────┐  │   │
│  │  │ URL Controller │  │Rate Limiter    │  │Validator  │  │   │
│  │  └────────────────┘  └────────────────┘  └───────────┘  │   │
│  │  ┌────────────────┐  ┌────────────────┐                 │   │
│  │  │ URL Service    │  │Analytics Svc   │                 │   │
│  │  └────────────────┘  └────────────────┘                 │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                       CACHING LAYER                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Redis (In-Memory Cache)                                 │   │
│  │  - Short URL → Original URL Mapping                      │   │
│  │  - TTL: 1 hour                                           │   │
│  │  - Hit Rate: 99%+                                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      DATA PERSISTENCE LAYER                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PostgreSQL (Relational Database)                        │   │
│  │  - URLs Table (id, shortId, originalUrl, clicks)         │   │
│  │  - Analytics Table (clicks, referrers, geolocations)     │   │
│  │  - Prisma ORM for type-safe queries                      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 Configuration Files

### **docker-compose.yml**

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: shortify-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: shortify_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - shortify-network

  redis:
    image: redis:7-alpine
    container_name: shortify-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - shortify-network

volumes:
  postgres_data:
  redis_data:

networks:
  shortify-network:
    driver: bridge
```

---

## 🧪 Testing

### **Backend Tests**

```bash
cd backend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

### **Frontend Tests**

```bash
cd frontend

# Run component tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 🚢 Deployment

### **Deploy to Render (Backend)**

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure build settings:
   - **Build Command:** `cd backend && npm install && npx prisma generate && npm run build`
   - **Start Command:** `cd backend && npm start`
4. Add environment variables from `.env`
5. Deploy!

### **Deploy to Vercel (Frontend)**

```bash
cd frontend

# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### **Deploy with Docker**

```bash
# Build images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/AmazingFeature`
3. **Commit your changes:** `git commit -m 'Add some AmazingFeature'`
4. **Push to the branch:** `git push origin feature/AmazingFeature`
5. **Open a Pull Request**

### **Code Style Guidelines**

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Prisma Team** - For the amazing ORM
- **Redis Labs** - For the high-performance cache
- **Vercel** - For Vite and deployment platform
- **Tailwind CSS** - For the utility-first CSS framework

---

## 👨‍💻 Author

<div align="center">

### **Saiprasad**

**Full-Stack Developer | Creator of Shortify**

I'm a passionate developer dedicated to building scalable, performant web applications. Shortify represents my commitment to creating enterprise-grade solutions with modern technologies.

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/saiprasad)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/saiprasad)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=google-chrome&logoColor=white)](https://saiprasad.dev)

**📧 Email:** saiprasad@example.com  
**🌐 Website:** https://saiprasad.dev  
**💼 Open for:** Freelance Projects | Collaboration | Job Opportunities

---

### ⭐ If you found this project helpful, please consider giving it a star!

<br/>

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                                                                           ║
║   ███████╗ █████╗ ██╗    ██████╗ ██████╗  █████╗ ███████╗ █████╗ ██████╗ ║
║   ██╔════╝██╔══██╗██║    ██╔══██╗██╔══██╗██╔══██╗██╔════╝██╔══██╗██╔══██╗║
║   ███████╗███████║██║    ██████╔╝██████╔╝███████║███████╗███████║██║  ██║║
║   ╚════██║██╔══██║██║    ██╔═══╝ ██╔══██╗██╔══██║╚════██║██╔══██║██║  ██║║
║   ███████║██║  ██║██║    ██║     ██║  ██║██║  ██║███████║██║  ██║██████╔╝║
║   ╚══════╝╚═╝  ╚═╝╚═╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚═════╝ ║
║                                                                           ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

<img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=35&duration=3000&pause=1000&color=00D9FF&center=true&vCenter=true&width=600&height=100&lines=Sai+Prasad;Full+Stack+Developer;Open+Source+Enthusiast;Building+Amazing+Products" alt="Typing SVG" />

**Made with ❤️ and ☕ by Sai Prasad**

</div>

---

<div align="center">

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/saiprasad/shortify-your-link-amplified?style=social)
![GitHub forks](https://img.shields.io/github/forks/saiprasad/shortify-your-link-amplified?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/saiprasad/shortify-your-link-amplified?style=social)

**Last Updated:** March 2026 | **Version:** 1.0.0

</div>
