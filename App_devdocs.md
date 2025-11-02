# CrisisCore Neural Interface v3.0 - Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [API Specifications](#api-specifications)
3. [Database Schema](#database-schema)
4. [Development Setup](#development-setup)
5. [Coding Standards](#coding-standards)
6. [Deployment Guidelines](#deployment-guidelines)

---

## Architecture Overview

### System Architecture

The CrisisCore Neural Interface follows a modern microservices architecture with clear separation between frontend, backend, and data layers.

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
├─────────────────────────────────────────────────────────────┤
│  React App  │  WebGL Engine  │  Web Audio API  │  PWA Shell │
│  (UI/UX)    │  (Visual)      │  (Binaural)     │  (Offline) │
└─────────────────────────────────────────────────────────────┘
                               │
                         HTTPS/WSS
                               │
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                         │
├─────────────────────────────────────────────────────────────┤
│  API Gateway  │  Auth Service  │  Session Engine  │  ML Core │
│  (Express.js) │  (JWT/OAuth)   │  (Entrainment)   │  (AI/ML) │
└─────────────────────────────────────────────────────────────┘
                               │
                         TCP/HTTP
                               │
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                              │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL   │  Redis Cache   │  File Storage    │  Metrics │
│  (Primary)    │  (Sessions)    │  (Assets)        │  (Analytics)│
└─────────────────────────────────────────────────────────────┘
```

### Core Components

#### Frontend Architecture
- **React 18+** with hooks and concurrent features
- **Zustand** for state management (lightweight Redux alternative)
- **Three.js** for WebGL-based visual entrainment
- **Web Audio API** for binaural beat generation
- **Workbox** for service worker and PWA capabilities

#### Backend Architecture
- **Node.js** runtime with Express.js framework
- **Microservices** pattern with domain-driven design
- **JWT authentication** with refresh token rotation
- **WebSocket** connections for real-time session updates
- **Bull Queue** for background job processing

#### Core Services

##### Neural Entrainment Engine
```typescript
interface EntrainmentEngine {
  generateBinauralBeat(leftFreq: number, rightFreq: number): AudioBuffer;
  createVisualPattern(frequency: number, intensity: number): WebGLProgram;
  synchronizeAudioVisual(audioContext: AudioContext, renderer: WebGLRenderer): void;
  transitionFrequency(fromHz: number, toHz: number, durationMs: number): Promise<void>;
}
```

##### Session Management
```typescript
interface SessionManager {
  initializeSession(userId: string, protocol: ProtocolConfig): Session;
  executePhase(session: Session, phase: PhaseType): Promise<PhaseResult>;
  monitorSafety(session: Session): SafetyStatus;
  emergencyStop(sessionId: string): Promise<void>;
}
```

---

## API Specifications

### Base Configuration

- **Base URL**: `https://api.crisiscore-neural.com/v1`
- **Authentication**: Bearer JWT tokens
- **Content-Type**: `application/json`
- **Rate Limiting**: 100 requests/minute per user

### Authentication Endpoints

#### POST /auth/register
Register a new user account.

```typescript
interface RegisterRequest {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    medicalConditions?: string[];
  };
  healthScreening: HealthScreeningData;
}

interface RegisterResponse {
  user: UserProfile;
  tokens: {
    access: string;
    refresh: string;
  };
}
```

#### POST /auth/login
Authenticate existing user.

```typescript
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: UserProfile;
  tokens: {
    access: string;
    refresh: string;
  };
}
```

#### POST /auth/refresh
Refresh access token.

```typescript
interface RefreshRequest {
  refreshToken: string;
}

interface RefreshResponse {
  accessToken: string;
}
```

### Session Management Endpoints

#### GET /sessions/protocols
Retrieve available training protocols.

```typescript
interface Protocol {
  id: string;
  name: string;
  description: string;
  phases: PhaseConfig[];
  duration: number;
  targetBrainwaves: BrainwaveType[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  safetyRating: number;
}

interface GetProtocolsResponse {
  protocols: Protocol[];
}
```

#### POST /sessions/start
Initiate a new training session.

```typescript
interface StartSessionRequest {
  protocolId: string;
  customizations?: {
    audioVolume?: number;
    visualIntensity?: number;
    duration?: number;
  };
}

interface StartSessionResponse {
  session: {
    id: string;
    protocol: Protocol;
    startTime: string;
    estimatedEndTime: string;
    webSocketUrl: string;
  };
}
```

#### WebSocket /sessions/{sessionId}/live
Real-time session communication.

```typescript
interface SessionMessage {
  type: 'phase_transition' | 'biometric_update' | 'safety_alert' | 'emergency_stop';
  timestamp: string;
  data: any;
}

// Client to Server
interface PhaseCompleteMessage {
  type: 'phase_complete';
  phaseId: string;
  metrics: {
    coherence: number;
    focus: number;
    arousal: number;
  };
}

// Server to Client
interface PhaseTransitionMessage {
  type: 'phase_transition';
  fromPhase: string;
  toPhase: string;
  transitionConfig: {
    duration: number;
    audioSettings: AudioConfig;
    visualSettings: VisualConfig;
  };
}
```

### Analytics Endpoints

#### GET /analytics/progress
Retrieve user progress data.

```typescript
interface ProgressRequest {
  timeRange: 'week' | 'month' | 'quarter' | 'year';
  metrics: ('coherence' | 'focus' | 'sessions' | 'duration')[];
}

interface ProgressResponse {
  timeRange: string;
  data: {
    timestamp: string;
    metrics: Record<string, number>;
  }[];
  trends: {
    metric: string;
    direction: 'improving' | 'stable' | 'declining';
    confidence: number;
  }[];
}
```

---

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  email_verified BOOLEAN DEFAULT false
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(is_active);
```

#### User Profiles Table
```sql
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE,
  timezone VARCHAR(50) DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  medical_conditions TEXT[],
  health_screening_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Protocols Table
```sql
CREATE TABLE protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  difficulty VARCHAR(20) CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  duration_minutes INTEGER NOT NULL,
  phases JSONB NOT NULL,
  target_brainwaves VARCHAR(50)[],
  safety_rating INTEGER CHECK (safety_rating >= 1 AND safety_rating <= 5),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_protocols_category ON protocols(category);
CREATE INDEX idx_protocols_difficulty ON protocols(difficulty);
```

#### Sessions Table
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  protocol_id UUID NOT NULL REFERENCES protocols(id),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'interrupted', 'error')),
  customizations JSONB DEFAULT '{}',
  metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_started_at ON sessions(started_at);
```

#### Session Phases Table
```sql
CREATE TABLE session_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  phase_name VARCHAR(100) NOT NULL,
  phase_order INTEGER NOT NULL,
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  target_frequency DECIMAL(5,2),
  actual_metrics JSONB DEFAULT '{}',
  user_feedback JSONB DEFAULT '{}'
);

CREATE INDEX idx_session_phases_session_id ON session_phases(session_id);
CREATE INDEX idx_session_phases_order ON session_phases(phase_order);
```

### Analytics Tables

#### Daily Metrics Table
```sql
CREATE TABLE daily_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_sessions INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 0,
  avg_coherence DECIMAL(5,3),
  avg_focus DECIMAL(5,3),
  avg_arousal DECIMAL(5,3),
  protocols_used VARCHAR(255)[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_daily_metrics_user_date ON daily_metrics(user_id, date);
```

### Redis Schema

#### Session Cache
```typescript
interface SessionCache {
  sessionId: string;
  userId: string;
  protocol: Protocol;
  currentPhase: number;
  startTime: number;
  lastHeartbeat: number;
  realTimeMetrics: {
    coherence: number;
    focus: number;
    arousal: number;
  };
}

// Key pattern: session:{sessionId}
// TTL: 2 hours
```

#### User Preferences Cache
```typescript
interface UserPreferencesCache {
  userId: string;
  audioSettings: AudioConfig;
  visualSettings: VisualConfig;
  safetyLimits: SafetyConfig;
  timezone: string;
}

// Key pattern: user_prefs:{userId}
// TTL: 24 hours
```

---

## Development Setup

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **PostgreSQL** 14.x or higher
- **Redis** 6.x or higher
- **Docker** (optional, for containerized development)

### Local Development Environment

#### 1. Clone Repository
```bash
git clone https://github.com/crisiscore-systems/neural-interface.git
cd neural-interface
```

#### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

#### 3. Environment Configuration
Create `.env` files for each service:

**Backend (.env)**
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/crisiscore_neural
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

# External Services
SENDGRID_API_KEY=your-sendgrid-key
SENTRY_DSN=your-sentry-dsn

# Development
NODE_ENV=development
PORT=3001
LOG_LEVEL=debug
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_WS_URL=ws://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_SENTRY_DSN=your-frontend-sentry-dsn
```

#### 4. Database Setup
```bash
# Create database
createdb crisiscore_neural

# Run migrations
cd backend
npm run migrate

# Seed initial data
npm run seed
```

#### 5. Start Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm start

# Terminal 3: Redis (if not using Docker)
redis-server
```

### Docker Development (Alternative)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

**docker-compose.yml**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: crisiscore_neural
      POSTGRES_USER: dev
      POSTGRES_PASSWORD: dev123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://dev:dev123@postgres:5432/crisiscore_neural
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app
      - /app/node_modules

volumes:
  postgres_data:
```

### Testing Setup

#### Unit Tests
```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

#### Integration Tests
```bash
# Run full test suite
npm run test:integration

# Run specific test file
npm run test -- --testPathPattern=auth
```

#### E2E Tests
```bash
# Install Playwright
npm install -g @playwright/test

# Run E2E tests
npm run test:e2e
```

---

## Coding Standards

### TypeScript Configuration

**tsconfig.json** (Shared configuration)
```json
{
  "compilerOptions": {
    "target": "es2020",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": "src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/services/*": ["services/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    }
  }
}
```

### ESLint Configuration

**.eslintrc.js**
```javascript
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'react-app',
    'react-app/jest',
    'prettier'
  ],
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    // TypeScript specific
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/explicit-function-return-type': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    
    // React specific
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // General
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

### Code Organization

#### Frontend Structure
```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components
│   ├── session/        # Session-specific components
│   └── analytics/      # Analytics components
├── pages/              # Page-level components
├── services/           # API and external service calls
├── hooks/              # Custom React hooks
├── store/              # State management (Zustand)
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── constants/          # Application constants
└── assets/             # Static assets
```

#### Backend Structure
```
backend/src/
├── controllers/        # Route handlers
├── services/           # Business logic
├── models/             # Database models
├── middleware/         # Express middleware
├── routes/             # Route definitions
├── utils/              # Utility functions
├── types/              # TypeScript types
├── config/             # Configuration files
└── tests/              # Test files
```

### Naming Conventions

#### Variables and Functions
```typescript
// Use camelCase for variables and functions
const userId = 'user-123';
const calculateCoherence = (data: MetricData) => { ... };

// Use PascalCase for classes and components
class SessionManager { ... }
const UserProfile: React.FC = () => { ... };

// Use UPPER_SNAKE_CASE for constants
const MAX_SESSION_DURATION = 3600;
const API_ENDPOINTS = {
  SESSIONS: '/sessions',
  ANALYTICS: '/analytics'
};
```

#### File Naming
```
// Use PascalCase for React components
UserProfile.tsx
SessionDashboard.tsx

// Use camelCase for utilities and services
audioService.ts
mathUtils.ts

// Use kebab-case for pages and routes
user-profile.tsx
session-history.tsx
```

### Component Structure

#### React Component Template
```typescript
import React, { useState, useEffect, useCallback } from 'react';
import { useStore } from '@/store';
import { SessionService } from '@/services';
import { Button, Card } from '@/components/common';
import type { Session, Protocol } from '@/types';

interface SessionDashboardProps {
  userId: string;
  onSessionStart?: (session: Session) => void;
}

export const SessionDashboard: React.FC<SessionDashboardProps> = ({
  userId,
  onSessionStart
}) => {
  // State hooks
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Store hooks
  const { protocols, fetchProtocols } = useStore();
  
  // Effects
  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);
  
  // Event handlers
  const handleStartSession = useCallback(async (protocolId: string) => {
    try {
      setLoading(true);
      const session = await SessionService.startSession(userId, protocolId);
      onSessionStart?.(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId, onSessionStart]);
  
  // Early returns for loading/error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};

export default SessionDashboard;
```

### API Service Pattern

```typescript
// services/sessionService.ts
class SessionService {
  private static baseUrl = process.env.REACT_APP_API_URL;
  
  static async startSession(
    userId: string, 
    protocolId: string
  ): Promise<Session> {
    const response = await fetch(`${this.baseUrl}/sessions/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({ userId, protocolId })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  static async getSessionHistory(userId: string): Promise<Session[]> {
    // Implementation...
  }
}
```

### Error Handling

#### Frontend Error Boundaries
```typescript
class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  { hasError: boolean; error?: Error }
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    
    return this.props.children;
  }
}
```

#### Backend Error Handling
```typescript
// middleware/errorHandler.ts
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Unhandled error:', err);
  
  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: 'Validation Error',
      details: err.details
    });
  }
  
  if (err instanceof AuthenticationError) {
    return res.status(401).json({
      error: 'Authentication Required'
    });
  }
  
  // Default server error
  res.status(500).json({
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
```

---

## Deployment Guidelines

### Environment Configuration

#### Production Environment Variables
```env
# Database
DATABASE_URL=postgresql://user:pass@prod-db-host:5432/crisiscore_neural
REDIS_URL=redis://prod-redis-host:6379

# Security
JWT_SECRET=very-secure-production-secret
ENCRYPTION_KEY=production-encryption-key

# External Services
SENDGRID_API_KEY=prod-sendgrid-key
SENTRY_DSN=production-sentry-dsn

# Performance
NODE_ENV=production
MAX_CONNECTIONS=100
CACHE_TTL=3600

# Monitoring
LOG_LEVEL=info
METRICS_ENDPOINT=https://metrics.crisiscore.com
```

### Docker Production Build

#### Multi-stage Dockerfile (Backend)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine AS production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=nextjs:nodejs . .

USER nextjs
EXPOSE 3001

CMD ["npm", "start"]
```

#### Multi-stage Dockerfile (Frontend)
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Kubernetes Deployment

#### Backend Deployment
```yaml
# k8s/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neural-interface-backend
  labels:
    app: neural-interface-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: neural-interface-backend
  template:
    metadata:
      labels:
        app: neural-interface-backend
    spec:
      containers:
      - name: backend
        image: crisiscore/neural-interface-backend:latest
        ports:
        - containerPort: 3001
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: database-secret
              key: url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: auth-secret
              key: jwt-secret
        livenessProbe:
          httpGet:
            path: /health
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: neural-interface-backend-service
spec:
  selector:
    app: neural-interface-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 3001
  type: ClusterIP
```

#### Frontend Deployment
```yaml
# k8s/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: neural-interface-frontend
  labels:
    app: neural-interface-frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: neural-interface-frontend
  template:
    metadata:
      labels:
        app: neural-interface-frontend
    spec:
      containers:
      - name: frontend
        image: crisiscore/neural-interface-frontend:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: neural-interface-frontend-service
spec:
  selector:
    app: neural-interface-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

### CI/CD Pipeline

#### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Run security audit
        run: npm audit --audit-level high

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-west-2
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push backend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: neural-interface-backend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Build and push frontend image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: neural-interface-frontend
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG ./frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --region us-west-2 --name production-cluster
          kubectl set image deployment/neural-interface-backend backend=$ECR_REGISTRY/neural-interface-backend:$IMAGE_TAG
          kubectl set image deployment/neural-interface-frontend frontend=$ECR_REGISTRY/neural-interface-frontend:$IMAGE_TAG
          kubectl rollout status deployment/neural-interface-backend
          kubectl rollout status deployment/neural-interface-frontend
```

### Database Migration Strategy

#### Migration Scripts
```typescript
// migrations/001_initial_schema.ts
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('email').unique().notNullable();
    table.string('password_hash').notNullable();
    table.timestamps(true, true);
  });
  
  // Additional table creation...
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
  // Additional table drops...
}
```

#### Production Migration Process
```bash
# 1. Create database backup
kubectl exec -it postgres-pod -- pg_dump -U postgres crisiscore_neural > backup.sql

# 2. Run migrations in staging
kubectl exec -it backend-pod -- npm run migrate

# 3. Test application functionality
npm run test:integration

# 4. Deploy to production
kubectl apply -f k8s/

# 5. Run production migrations
kubectl exec -it backend-pod -- npm run migrate:prod
```

### Monitoring and Observability

#### Health Check Endpoints
```typescript
// Backend health checks
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

app.get('/ready', async (req, res) => {
  try {
    // Check database connection
    await db.raw('SELECT 1');
    
    // Check Redis connection
    await redis.ping();
    
    res.json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ 
      status: 'not ready',
      error: error.message 
    });
  }
});
```

#### Logging Configuration
```typescript
// utils/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

export default logger;
```

### Security Checklist

#### Pre-deployment Security Verification
- [ ] All secrets stored in environment variables or secret management
- [ ] HTTPS enforced with proper TLS certificates
- [ ] CORS properly configured for production domains
- [ ] Rate limiting implemented on all endpoints
- [ ] Input validation on all user inputs
- [ ] SQL injection protection (parameterized queries)
- [ ] XSS protection headers configured
- [ ] CSRF tokens implemented for state-changing operations
- [ ] Authentication tokens properly secured (httpOnly, secure flags)
- [ ] Database credentials rotated and secured
- [ ] Container images scanned for vulnerabilities
- [ ] Dependencies audited for security issues

This documentation provides a comprehensive foundation for developing, deploying, and maintaining the CrisisCore Neural Interface application. Regular updates to this documentation should be made as the system evolves.