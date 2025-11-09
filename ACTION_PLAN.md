# ⚡ Immediate Action Plan - This Week

**Created:** November 9, 2025  
**Timeline:** Next 5 Days  
**Focus:** Get development infrastructure operational

---

## 🎯 This Week's Mission

**Get the development environment fully operational so any developer can contribute effectively.**

Current blockers:
- ❌ ESLint not installed in root (can't run `npm run lint`)
- ❌ Backend setup is complex (no .env, manual DB setup)
- ⚠️ No backend tests exist yet
- ⚠️ No frontend tests exist yet

**End of week goals:**
- ✅ All linting works everywhere
- ✅ Backend starts with one command
- ✅ At least 20 backend tests written
- ✅ Test foundation ready for frontend

---

## 📅 Day-by-Day Plan

### Day 1 (Monday): Enable Linting

**Morning: Install ESLint**

```bash
cd /home/runner/work/neural-entrainment-system/neural-entrainment-system

# Install ESLint and dependencies
npm install --save-dev \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  eslint-config-prettier

# Verify installation
npx eslint --version
```

**Create .eslintrc.json:**

```json
{
  "root": true,
  "env": {
    "browser": true,
    "es2021": true,
    "node": true,
    "jest": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "no-console": "off"
  },
  "ignorePatterns": [
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    "*.min.js"
  ]
}
```

**Afternoon: Fix Linting Issues**

```bash
# Run lint and see what needs fixing
npm run lint

# Auto-fix what we can
npm run lint -- --fix

# Review remaining issues
npm run lint > lint-report.txt

# Fix remaining issues manually
# Focus on actual errors, defer warnings for later
```

**Success Criteria:**
- [ ] `npm run lint` runs without crashing
- [ ] No ESLint errors (warnings OK for now)
- [ ] Backend linting works: `cd backend && npm run lint`
- [ ] Frontend linting works: `cd frontend && npm run lint`

---

### Day 2 (Tuesday): Backend Quick Setup Script

**Morning: Create Setup Script**

Create `backend/scripts/quick-setup.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Neural Entrainment Backend - Quick Setup"
echo "==========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "   Install from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js $(node --version) detected"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Setup environment file
echo ""
if [ -f .env ]; then
    echo "✅ .env file already exists"
else
    echo "📝 Creating .env file..."
    cp .env.example .env
    
    # Generate secure JWT secret
    if command -v openssl &> /dev/null; then
        JWT_SECRET=$(openssl rand -hex 32)
        # Use portable sed syntax
        if [[ "$OSTYPE" == "darwin"* ]]; then
            sed -i '' "s/your-secret-key-change-this/$JWT_SECRET/" .env
        else
            sed -i "s/your-secret-key-change-this/$JWT_SECRET/" .env
        fi
        echo "✅ Generated secure JWT secret"
    fi
    
    echo "✅ .env file created"
fi

# Database setup
echo ""
echo "Database Setup Options:"
echo "1. Use Docker (recommended - easiest)"
echo "2. Use existing PostgreSQL"
echo "3. Skip database setup"
echo ""
read -p "Choose option (1-3): " db_choice

case $db_choice in
    1)
        if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
            echo "❌ Docker not found. Please install Docker Desktop."
            exit 1
        fi
        
        echo "🐳 Starting Docker containers..."
        docker-compose up -d
        
        echo "⏳ Waiting for PostgreSQL to be ready..."
        sleep 5
        
        echo "✅ Docker containers running!"
        echo ""
        echo "   PostgreSQL: localhost:5432"
        echo "   Redis: localhost:6379"
        ;;
        
    2)
        if ! command -v psql &> /dev/null; then
            echo "⚠️  psql command not found. Make sure PostgreSQL is installed."
        fi
        
        read -p "Database name [neural_entrainment]: " dbname
        dbname=${dbname:-neural_entrainment}
        
        echo "📊 Setting up database: $dbname"
        
        # Create database
        createdb $dbname 2>/dev/null || echo "   Database may already exist"
        
        # Run schema
        if [ -f database/schema.sql ]; then
            psql $dbname < database/schema.sql
            echo "✅ Schema applied"
        fi
        
        # Run seeds
        if [ -f database/seed.sql ]; then
            psql $dbname < database/seed.sql
            echo "✅ Seed data loaded"
        fi
        
        # Update .env with database URL
        echo ""
        echo "⚠️  Update DATABASE_URL in .env if needed:"
        echo "   postgresql://localhost:5432/$dbname"
        ;;
        
    3)
        echo "⏭️  Skipping database setup"
        echo "⚠️  You'll need to configure DATABASE_URL in .env manually"
        ;;
        
    *)
        echo "Invalid option. Skipping database setup."
        ;;
esac

# Final instructions
echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Review and update .env file if needed:"
echo "   nano .env"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. API will be available at:"
echo "   http://localhost:3001"
echo ""
echo "4. Test with:"
echo "   curl http://localhost:3001/health"
echo ""
echo "Need help? See DEVELOPER_GUIDE.md"
echo ""
```

Make it executable:
```bash
chmod +x backend/scripts/quick-setup.sh
```

**Afternoon: Test Setup Script**

```bash
# Test in a clean environment
cd backend
rm -f .env
docker-compose down -v  # Clean slate

# Run setup
./scripts/quick-setup.sh

# Try to start backend
npm run dev
```

**Success Criteria:**
- [ ] Script runs without errors
- [ ] .env file created automatically
- [ ] JWT secret generated
- [ ] Database option works (at least Docker)
- [ ] Backend starts successfully

---

### Day 3 (Wednesday): Backend Test Infrastructure

**Morning: Setup Test Utilities**

Create `backend/src/__tests__/helpers/testSetup.ts`:

```typescript
import { FastifyInstance } from 'fastify'
import { build } from '../../index.js'

let testApp: FastifyInstance | null = null

export async function getTestApp(): Promise<FastifyInstance> {
  if (!testApp) {
    testApp = await build({
      logger: false,
      disableRequestLogging: true
    })
  }
  return testApp
}

export async function closeTestApp() {
  if (testApp) {
    await testApp.close()
    testApp = null
  }
}

export interface TestUser {
  email: string
  password: string
  username: string
  token?: string
  id?: number
}

export async function createTestUser(
  app: FastifyInstance,
  user: Partial<TestUser> = {}
): Promise<TestUser> {
  const testUser: TestUser = {
    email: user.email || `test-${Date.now()}@example.com`,
    password: user.password || 'TestPassword123!',
    username: user.username || `testuser${Date.now()}`
  }

  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/register',
    payload: {
      email: testUser.email,
      password: testUser.password,
      username: testUser.username
    }
  })

  const data = response.json()
  testUser.token = data.token
  testUser.id = data.user?.id

  return testUser
}

export function getAuthHeaders(token: string) {
  return {
    authorization: `Bearer ${token}`
  }
}

export async function login(
  app: FastifyInstance,
  email: string,
  password: string
): Promise<string> {
  const response = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { email, password }
  })

  const data = response.json()
  return data.token
}
```

**Afternoon: Write First Tests**

Create `backend/src/__tests__/routes/health.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getTestApp, closeTestApp } from '../helpers/testSetup.js'
import type { FastifyInstance } from 'fastify'

describe('Health Check', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  it('should return 200 OK on /health', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
    expect(response.json()).toHaveProperty('status', 'ok')
  })

  it('should include timestamp', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    const body = response.json()
    expect(body).toHaveProperty('timestamp')
    expect(new Date(body.timestamp)).toBeInstanceOf(Date)
  })
})
```

Create `backend/src/__tests__/routes/auth.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { getTestApp, closeTestApp, createTestUser } from '../helpers/testSetup.js'
import type { FastifyInstance } from 'fastify'

describe('Auth Routes', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await getTestApp()
  })

  afterAll(async () => {
    await closeTestApp()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: `test-${Date.now()}@example.com`,
          password: 'SecurePassword123!',
          username: `user${Date.now()}`
        }
      })

      expect(response.statusCode).toBe(201)
      const body = response.json()
      expect(body).toHaveProperty('token')
      expect(body).toHaveProperty('user')
      expect(body.user).toHaveProperty('email')
      expect(body.user).not.toHaveProperty('password')
    })

    it('should reject weak password', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: `test-${Date.now()}@example.com`,
          password: 'weak',
          username: `user${Date.now()}`
        }
      })

      expect(response.statusCode).toBe(400)
    })

    it('should reject duplicate email', async () => {
      const email = `test-${Date.now()}@example.com`
      
      // Register first time
      await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email,
          password: 'Password123!',
          username: `user${Date.now()}`
        }
      })

      // Try to register again
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email,
          password: 'Password123!',
          username: `user${Date.now()}-2`
        }
      })

      expect(response.statusCode).toBe(409)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      // Create user
      const user = await createTestUser(app)

      // Login
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: user.email,
          password: user.password
        }
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(body).toHaveProperty('token')
      expect(body).toHaveProperty('user')
    })

    it('should reject invalid password', async () => {
      const user = await createTestUser(app)

      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: user.email,
          password: 'WrongPassword123!'
        }
      })

      expect(response.statusCode).toBe(401)
    })

    it('should reject non-existent user', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: 'nonexistent@example.com',
          password: 'Password123!'
        }
      })

      expect(response.statusCode).toBe(401)
    })
  })
})
```

**Run Tests:**

```bash
cd backend
npm test
```

**Success Criteria:**
- [ ] Test helpers working
- [ ] At least 10 tests written
- [ ] All tests passing
- [ ] Can run `npm test` successfully

---

### Day 4 (Thursday): More Backend Tests

**Goal: Write tests for sessions and protocols**

Create `backend/src/__tests__/routes/sessions.test.ts`:

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { 
  getTestApp, 
  closeTestApp, 
  createTestUser, 
  getAuthHeaders 
} from '../helpers/testSetup.js'
import type { FastifyInstance } from 'fastify'

describe('Session Routes', () => {
  let app: FastifyInstance
  let authToken: string
  let userId: number

  beforeAll(async () => {
    app = await getTestApp()
    const user = await createTestUser(app)
    authToken = user.token!
    userId = user.id!
  })

  afterAll(async () => {
    await closeTestApp()
  })

  describe('POST /api/sessions', () => {
    it('should create a new session', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sessions',
        headers: getAuthHeaders(authToken),
        payload: {
          protocolId: 1,
          duration: 1800
        }
      })

      expect(response.statusCode).toBe(201)
      const body = response.json()
      expect(body).toHaveProperty('id')
      expect(body).toHaveProperty('userId', userId)
    })

    it('should require authentication', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/sessions',
        payload: {
          protocolId: 1,
          duration: 1800
        }
      })

      expect(response.statusCode).toBe(401)
    })
  })

  describe('GET /api/sessions', () => {
    it('should list user sessions', async () => {
      // Create a session first
      await app.inject({
        method: 'POST',
        url: '/api/sessions',
        headers: getAuthHeaders(authToken),
        payload: {
          protocolId: 1,
          duration: 1800
        }
      })

      // List sessions
      const response = await app.inject({
        method: 'GET',
        url: '/api/sessions',
        headers: getAuthHeaders(authToken)
      })

      expect(response.statusCode).toBe(200)
      const body = response.json()
      expect(Array.isArray(body)).toBe(true)
      expect(body.length).toBeGreaterThan(0)
    })
  })
})
```

**Add more test files:**
- `protocols.test.ts` - Protocol CRUD tests
- `users.test.ts` - User profile tests

**Target: 20+ total tests**

**Success Criteria:**
- [ ] 20+ backend tests total
- [ ] Coverage for auth, sessions, users, protocols
- [ ] All tests passing
- [ ] Test report generated

---

### Day 5 (Friday): Documentation & Review

**Morning: Update Documentation**

Update `DEVELOPER_GUIDE.md`:

```markdown
## Quick Start (Updated)

**Get running in 5 minutes:**

### Backend
\`\`\`bash
cd backend
./scripts/quick-setup.sh  # Interactive setup
npm run dev               # Start server
\`\`\`

### Frontend
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

### Running Tests

\`\`\`bash
# Root tests (Jest)
npm test

# Backend tests (Vitest)
cd backend && npm test

# Frontend tests (coming soon)
cd frontend && npm test
\`\`\`
```

**Afternoon: Weekly Review**

Create `WEEK1_SUMMARY.md`:

```markdown
# Week 1 Summary - Development Infrastructure

## Completed ✅

- [x] ESLint installed and configured
- [x] All linting errors fixed
- [x] Backend quick-setup script created
- [x] Backend test infrastructure established
- [x] 20+ backend tests written
- [x] Documentation updated

## Metrics

- **Linting Errors**: 0
- **Backend Tests**: 20+
- **Test Pass Rate**: 100%
- **Setup Time**: <5 minutes (was >2 hours)

## Next Week

- [ ] Add more backend tests (target: 50+)
- [ ] Setup frontend testing
- [ ] Add E2E tests
- [ ] Begin documentation consolidation

## Learnings

- Quick setup script significantly improves onboarding
- Test utilities make writing tests much faster
- Linting catches many common issues early
```

**Success Criteria:**
- [ ] All documentation current
- [ ] Week 1 goals achieved
- [ ] Week 2 plan ready
- [ ] Demo-able progress

---

## 📊 Week 1 Success Metrics

Track daily:

| Day | Linting | Backend Setup | Tests Written | Total Tests |
|-----|---------|---------------|---------------|-------------|
| Mon | ⬜ | ⬜ | 0 | 0 |
| Tue | ⬜ | ⬜ | 0 | 0 |
| Wed | ⬜ | ⬜ | 10 | 10 |
| Thu | ⬜ | ⬜ | 10 | 20 |
| Fri | ⬜ | ⬜ | 5 | 25 |

**Target:** All checkboxes ✅ by Friday

---

## 🚧 Potential Blockers

1. **Docker not available**
   - Solution: Fall back to local PostgreSQL
   - Alternative: Use SQLite for testing

2. **TypeScript compilation errors**
   - Solution: Fix types as we go
   - May need to update tsconfig.json

3. **Database connection issues**
   - Solution: Verify PostgreSQL is running
   - Check DATABASE_URL in .env

4. **Tests failing due to async issues**
   - Solution: Use proper async/await
   - Add timeouts where needed

---

## 💡 Tips for Success

1. **Commit frequently** - After each working feature
2. **Test as you go** - Don't wait until the end
3. **Ask for help** - If blocked > 30 minutes
4. **Take breaks** - Avoid burnout
5. **Celebrate wins** - Acknowledge progress

---

## 📞 Need Help?

- **Setup issues**: Check `backend/scripts/quick-setup.sh` logs
- **Test failures**: Run with `npm test -- --verbose`
- **Linting errors**: Run `npm run lint -- --fix` first
- **General questions**: See DEVELOPER_GUIDE.md

---

**Let's ship it! 🚀**
