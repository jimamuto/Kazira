# Kazira - Autonomous Career Agent Architecture

## System Overview

```
User (No Auth Required)
        ↓
┌─────────────────────────────────────────┐
│     CAREER ORCHESTRATOR          │
│   (Marathon Session Manager)        │
└──────────────┬──────────────────────┘
               │
               ├──────────────────────────────────────┐
               │                                     │
    ┌──────────┴──────────┐              ┌───┴──────────┐
    │  AGENT MESSAGE BUS  │              │   DATABASE     │
    │  (Async Queue)     │              │  PostgreSQL   │
    └──────────┬───────────┘              └───────┬───────┘
               │                                   │
    ┌──────────┼──────────┬──────────┐            │
    │          │          │          │            │
┌───┴───┐  ┌───┴───┐  ┌───┴───┐    │
│RESEARCH  │  │PLANNING│  │EXECUTION│    │
│AGENT    │  │AGENT   │  │AGENT   │    │
└────┬────┘  └────┬────┘  └────┬────┘    │
     │              │              │            │
     │              │              │            │
┌────┴──────────────┬────┴──────┬────────┴────┐
│                   │              │             │
│EXTERNAL APIS      │  GEMINI 3     │
│                   │  (Core AI)     │
└─────────┬─────────┴─────┬─────────────┘
          │                  │
┌─────────┴──────────┬──────────┐
│  JOB BOARDS       │  CODE     │
│  (Scrapers)       │  SANDBOX  │
│                   │           │
└────────────────────┴───────────┘
```

## Detailed Component Diagram

```mermaid
graph TB
    User[User<br/>(No Auth)]
    
    subgraph Frontend
        Frontend[Next.js + React]
        NewOrchestrator[Orchestrator UI]
        AgentProgress[Agent Progress<br/>Real-time Display]
        ExecutionView[Execution View<br/>Daily Tasks]
    end
    
    subgraph Backend
        Main[FastAPI Server]
        
        subgraph Orchestrator
            Orchestrator[Career Orchestrator<br/>Marathon Agent]
            
            subgraph Agents
                Research[Research Agent<br/>Job Scraping]
                Planning[Planning Agent<br/>Roadmap Generation]
                Execution[Execution Agent<br/>Resource Verification]
                Verification[Verification Agent<br/>Quizzes & Assessment]
            end
            
            MessageBus[Agent Message Bus<br/>Dynamic Negotiation]
            SessionManager[Marathon Session<br/>72h Continuous]
        end
        
        Database[(PostgreSQL)<br/>State Persistence]
    end
    
    subgraph External
        LinkedIn[LinkedIn Jobs<br/>Selenium Scraping]
        Indeed[Indeed Jobs<br/>Selenium Scraping]
        Gemini3[Gemini 3<br/>Flash Preview]
        Sandbox[Code Sandbox<br/>Python Testing]
    end
    
    User -->|Submit Goal| Frontend
    Frontend -->|API Calls| Main
    Main -->|Orchestrates| Orchestrator
    Orchestrator -->|Message Bus| MessageBus
    MessageBus -->|Dynamic Routing| Research
    MessageBus -->|Dynamic Routing| Planning
    MessageBus -->|Dynamic Routing| Execution
    MessageBus -->|Dynamic Routing| Verification
    
    Research -->|Scrapes Real-time| LinkedIn
    Research -->|Scrapes Real-time| Indeed
    Research -->|Semantic Analysis| Gemini3
    Planning -->|Generates| Gemini3
    Execution -->|Finds Resources| Gemini3
    Execution -->|Tests Code| Sandbox
    Verification -->|Generates Quizzes| Gemini3
    
    Orchestrator -->|Persists State| Database
    Research -->|Saves Job Listings| Database
    Planning -->|Saves Roadmap| Database
    Execution -->|Saves Verified Resources| Database
    Verification -->|Saves Progress| Database
    MessageBus -->|Logs Messages| Database
    
    Frontend -->|Displays Progress| AgentProgress
    Frontend -->|Shows Tasks| ExecutionView
    
    style User fill:#e1f5fe
    style Frontend fill:#42a5f5
    style Backend fill:#06b6d4
    style Orchestrator fill:#0891b2
    style Database fill:#0284c7
    style External fill:#f59e0b
    style LinkedIn fill:#0077b5
    style Indeed fill:#ffffff
    style Gemini3 fill:#4285f4
    style Sandbox fill:#3776ab
```

## Marathon Agent Flow (72-Hour Session)

```mermaid
sequenceDiagram
    participant User
    participant Orchestrator as Career Orchestrator
    participant Database as PostgreSQL
    participant Research as Research Agent
    participant Planning as Planning Agent
    participant Execution as Execution Agent
    participant Verification as Verification Agent
    participant External as External APIs
    
    User->>Orchestrator: Start Marathon Session<br/>(72 hours, no auth)
    Orchestrator->>Database: Create Session Record<br/>(RUNNING status)
    Orchestrator->>Orchestrator: Start Message Bus Router
    
    Note over Orchestrator,Database: Initial Pipeline Run
    
    Orchestrator->>Research: Execute Research Phase
    Research->>External: Scrape LinkedIn Jobs<br/>(Parallel execution)
    Research->>External: Scrape Indeed Jobs<br/>(Parallel execution)
    External-->>Research: Job Listings
    Research->>External: Semantic Analysis<br/>(Gemini 3 - Top skills)
    Research->>Orchestrator: Research Complete<br/>(Send URGENT if market shift)
    
    Orchestrator->>Planning: Generate Roadmap<br/>(Based on market data)
    Planning->>External: Plan 6-month curriculum<br/>(Gemini 3 reasoning)
    External-->>Planning: Structured Roadmap
    
    Orchestrator->>Execution: Find & Verify Resources<br/>(Vibe Engineering)
    
    par Verification Loop
        Execution->>External: Search Resources<br/>(SERP/YouTube)
        External-->>Execution: Resource URLs
        Execution->>External: Scrape Content<br/>(httpx with retry)
        External-->>Execution: HTML Content
        Execution->>Execution: Extract Code Blocks<br/>(Regex patterns)
        Execution->>Sandbox: Test Code<br/>(Python py_compile)
        Sandbox-->>Execution: Test Results<br/>(Pass/Fail rates)
        Execution->>Execution: Calculate Quality Score<br/>(60% test weight)
    end
    
    Note over Execution,Sandbox: Only resources >80% quality<br/>returned to user
    
    Execution->>Orchestrator: Verified Resources<br/>(with scores)
    
    Orchestrator->>Verification: Generate Assessments<br/>(Quizzes + Mock Interviews)
    Verification->>External: Generate Quiz Questions<br/>(Gemini 3)
    Verification->>External: Generate Interview Questions<br/>(Gemini 3)
    External-->>Verification: Technical Questions
    
    Verification->>Orchestrator: Verification Suite Ready
    
    Orchestrator->>Database: Save All Agent States<br/>(Thought Signatures)
    
    Note over Orchestrator,Database: Cycle 1 Complete<br/>(Every 30 minutes)
    
    loop Marathon Loop
        Orchestrator->>Orchestrator: Wait 30 minutes
        Orchestrator->>Research: Check for New Jobs<br/>(Compare with previous)
        
        alt Market Shift Detected
            Research->>MessageBus: Send URGENT Message<br/>("AI demand up 40%")
            MessageBus->>Planning: Route URGENT<br/>Reprioritize roadmap
            Planning->>Orchestrator: Update Roadmap<br/>(Accelerate AI skills)
        end
        
        alt Market Stable
            Research->>Database: Save Job Listings<br/>(Avoid re-scraping)
        end
        
        Orchestrator->>Database: Check User Progress<br/>(Quiz scores, milestones)
    end
    
    Note over Orchestrator,Database: Marathon Session Ends<br/>(After 72 hours or user stop)
    Orchestrator->>Database: Update Session Status<br/>(COMPLETED)
    Orchestrator->>User: Session Complete<br/>(Results + Analysis)
```

## Data Flow: Vibe Engineering (Autonomous Verification)

```mermaid
graph LR
    A[Resource URL] -->|1. Scrape| B[HTML Content]
    B -->|2. Extract| C[Code Blocks<br/><code>, <pre>, ```]
    C -->|3. Filter| D[Valid Python<br/>>10 chars]
    D -->|4. Test| E[Code Sandbox<br/>py_compile]
    E -->|5. Score| F{Quality Score<br/>Content 20%<br/>Code 20%<br/>Tests 60%}
    F -->|6. Filter| G[Threshold >80%?]
    G -->|Yes| H[Return VERIFIED<br/>With metadata]
    G -->|No| I[Return REJECTED<br/>Log reason]
    
    style A fill:#42a5f5
    style B fill:#f59e0b
    style C fill:#06b6d4
    style D fill:#4285f4
    style E fill:#3776ab
    style F fill:#10b981
    style G fill:#10b981
    style H fill:#22c55e
    style I fill:#ef4444
```

## Database Schema

```mermaid
erDiagram
    MARATHON_SESSION ||--o{ AGENT_STATE : tracks
    MARATHON_SESSION ||--o{ THOUGHT_SIGNATURE : logs
    MARATHON_SESSION ||--o{ JOB_LISTING : aggregates
    MARATHON_SESSION ||--o{ USER_PROGRESS : monitors
    
    AGENT_STATE {
        int id PK
        str user_id FK
        str agent_name
        str state
        json checkpoint_data
        datetime timestamp
    }
    
    THOUGHT_SIGNATURE {
        int id PK
        str user_id FK
        str step
        str global_state
        json metadata
        datetime timestamp
    }
    
    JOB_LISTING {
        int id PK
        str title
        str company
        str location
        str link
        str description
        str source
        json skills_extracted
        datetime scraped_at
    }
    
    USER_PROGRESS {
        int id PK
        str user_id FK
        int roadmap_id FK
        json milestone_completed
        json quiz_scores
        int verification_attempts
        datetime last_updated
    }
```

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (React 19)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion 12
- **Icons**: Lucide React
- **State Management**: React Hooks (LocalStorage for demo)

### Backend
- **Framework**: FastAPI (Python 3.11)
- **ORM**: SQLModel + SQLAlchemy
- **Database**: PostgreSQL (for production demo)
- **Async Runtime**: asyncio

### Agents
- **Orchestrator**: Custom marathon scheduler
- **Research**: Selenium scrapers + BeautifulSoup
- **Planning**: Gemini 3 Flash Preview
- **Execution**: httpx scraping + Python sandbox
- **Verification**: Gemini 3 Flash Preview

### External Integrations
- **Job Boards**: LinkedIn, Indeed (Selenium)
- **AI Engine**: Google Gemini 3 Flash Preview
- **Database**: PostgreSQL (asyncpg driver)

### Key Features Implemented

1. **Marathon Agent Mode** ✅
   - 72-hour continuous operation
   - 30-minute check intervals
   - Auto-restart on failure
   - Thought signature persistence

2. **Autonomous Verification (Vibe Engineering)** ✅
   - Code extraction from HTML
   - Sandbox testing (py_compile)
   - Quality scoring (content + code + tests)
   - 80% threshold filtering

3. **Agent Negotiation** ✅
   - Message bus architecture
   - URGENT/CRITICAL priorities
   - Dynamic routing
   - Market shift detection

4. **Database Persistence** ✅
   - PostgreSQL models
   - Agent state tracking
   - Marathon session management
   - Job listing caching
   - User progress monitoring

5. **Real Data (No Mocks)** ✅
   - Actual LinkedIn/Indeed scraping
   - Real Gemini 3 API calls
   - Retry logic with exponential backoff
   - Graceful failure handling

6. **No Authentication Required** ✅
   - Anonymous user sessions
   - Session-based IDs
   - LocalStorage for frontend
   - Perfect for hackathon demo
