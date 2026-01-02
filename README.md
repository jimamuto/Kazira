# Kazira | EXTRAORDINARY Autonomous Career Agent 🚀

[![Docker](https://img.shields.io/badge/Docker-ready-blue)](https://img.shields.io/badge/Docker-ready-blue)
[![Demo Ready](https://img.shields.io/badge/demo-ready-success-green)](https://img.shields.io/badge/demo-ready-success-green)
[![1-Command Setup](https://img.shields.io/badge/setup-1%20command-orange)](https://img.shields.io/badge/setup-1%20command-orange)

> **An extraordinary autonomous career platform with predictive analytics, evolutionary algorithms, and global market arbitrage capabilities. Powered by Google Gemini 3.0 Flash Preview. Features 72-hour marathon agents, competitive tournaments, and strategic 5-year career trajectories.**

---

## 🚀 **Quick Start - Just 1 Command!**

### ⚡ Windows Users (Easiest)

**Option 1: Double-Click PowerShell Script**
```powershell
start.ps1
```

**What it does:**
- ✅ Checks if .env exists (creates if not)
- ✅ Opens Notepad for you to add GEMINI_API_KEY
- ✅ Starts Docker containers automatically
- ✅ Shows access URLs

### Option 2: One Command**

```powershell
# Run this single command
.\start.ps1
```

**Docker Required:** Make sure Docker Desktop is installed and running.

### 🍎 Mac/Linux: Clone + One Command

```bash
git clone https://github.com/YOUR_USERNAME/kazira.git
cd kazira
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here
docker-compose up --build
```

### Mac/Linux Users

```bash
git clone https://github.com/YOUR_USERNAME/kazira.git
cd kazira
cp .env.example .env
# Edit .env and add: GEMINI_API_KEY=your_key_here
docker-compose up --build
```

**Access at:**
- 🎯 **Frontend**: http://localhost:3000
- 🔌 **Backend API**: http://localhost:8000
- 💚 **Health Check**: http://localhost:8000/health

---

## 🚀 Quick Start for Judges (1 Command - Docker)

### ⚡ Recommended: Docker Compose (Fastest - 1 Command)

**Most seamless option - just clone and run:**

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/kazira.git
cd kazira

# 2. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (get it from: https://aistudio.google.com/app/apikey)

# 3. Start everything with ONE command
docker-compose up --build
```

**That's it!** 🎉

Access at:
- 🎯 Frontend: http://localhost:3000
- 🔌 Backend API: http://localhost:8000
- 💚 Health Check: http://localhost:8000/health

**Why Docker is seamless:**
- ✅ One command starts everything
- ✅ Works on any machine with Docker
- ✅ Same environment locally AND in cloud (Railway, Render, AWS)
- ✅ No need for Python/Node.js installation
- ✅ Full control over environment
- ✅ Production-ready deployment

---

### Option 2: GitHub Codespaces (Fastest Browser-Based - 2 min)

1. Click the **"Open in GitHub Codespaces"** badge above
2. Wait 30-60 seconds for the container to spin up
3. VS Code opens in your browser
4. The setup script runs automatically
5. Add your `GEMINI_API_KEY` to `.env` (get it from [AI Studio](https://aistudio.google.com/app/apikey))
6. In Terminal 1: `cd backend && source venv/bin/activate && uvicorn app.main:app --reload`
7. In Terminal 2: `cd frontend && npm run dev`
8. Access the app at the provided localhost URL

### Option 2: Manual Setup (3-5 min)

```bash
# 1. Clone repository
git clone https://github.com/YOUR_USERNAME/kazira.git
cd kazira

# 2. Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY (get it from: https://aistudio.google.com/app/apikey)

# 3. Start backend (Terminal 1)
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

# 4. Start frontend (Terminal 2)
cd frontend
npm install
npm run dev

# 5. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# Health Check: http://localhost:8000/health
```

**Note**: Manual setup takes 3-5 minutes. Use Docker Compose above for 1-command startup.

---

## 🎯 The Pivot Plan: "The Winning Path" (8-12 Hours)

To win this hackathon, we are pivoting within 2-3 hours. We are moving away from being a "Prompt Wrapper" and becoming a **Multi-Agent System** that scrapes real-world data, plans complex curricula, and verifies skill acquisition through closed-loop feedback.

---

## 🏗️ EXTRAORDINARY Architecture: Advanced Multi-Agent Orchestration

We implement a 7-agent system with extraordinary capabilities located in `backend/app/agents/`:

| Agent/Service | Responsibility | Extraordinary Features |
| :--- | :--- | :--- |
| **Research Agent** | Scrapes job data + market predictions | Future demand forecasting, 4-timeframe predictions |
| **Planning Agent** | Creates strategic roadmaps | Velocity-adjusted timelines, market alignment |
| **Execution Agent** | Finds & verifies resources | Vibe Engineering (80% quality threshold) |
| **Verification Agent** | Generates assessments | Technical quizzes + mock interviews |
| **Tournament Orchestrator** | Evolutionary algorithms | 5 agents compete, winner selected |
| **Career Velocity Engine** | Personal analytics | Learning speed vs market evolution |
| **Strategic Career Pathing** | 5-year trajectories | Junior→CTO paths with success probabilities |
| **Orchestrator** | Marathon management | 72-hour autonomous operation |

---

## 🛠️ Implementation Checklist (Phase 1: Next 2-3 Hours)

### 1. Multi-step Agent System (Estimated: 3 Hours)
**Target Directory:** `backend/app/agents/`
- [x] Create `orchestrator.py` to manage agent handoffs and global state.
- [x] Implement `research_agent.py` to perform semantic analysis on job listings.
- [x] Implement `planning_agent.py` to map skill dependencies and timelines.
- [x] Implement `execution_agent.py` to link roadmap items to live resources.
- [x] Implement `verification_agent.py` for automated technical assessments.

### 2. Real-World Data Integration (Estimated: 2 Hours)
- [x] **LinkedIn Integration**: Set up a Selenium scraper for recent job postings.
- [x] **Search Aggregator**: Implement connectors for Bright Data or SimplyHired to gather Kenyan market insights.

### 3. Verification Loop (Estimated: 2 Hours)
- [x] **Quiz Engine**: Leverage Gemini to generate technical assessments tailored to the user's progress.
- [x] **Code Review**: Implement LLM-based code review for mini-projects in the roadmap.
- [x] **Dynamic Adjustment**: Enable the Roadmap to auto-adjust based on assessment scores.

### 4. Thought Signatures & Persistence (Estimated: 1 Hour)
- [x] **Checkpoints**: Save agent state to a `ThoughtSignatures` table (JSON file implementation).
- [x] **Resume Capability**: Ensure the agent can resume long-running tasks after failures or interruptions.
- [x] **Self-Correction Logs**: Track and display how agents fix their own logic errors.

---

## 🏆 EXTRAORDINARY Differences for Judging

| Feature | Other Projects | Kazira Extraordinary |
| :--- | :--- | :--- |
| **Operation** | Single prompt-response | 72-hour marathon + tournament modes |
| **Intelligence** | Current market analysis | **Predictive analytics** (future demands) |
| **Competition** | Single agent approach | **Evolutionary tournaments** (agents compete) |
| **Analytics** | Generic recommendations | **Personal velocity tracking** + market alignment |
| **Scope** | Single market focus | **Global arbitrage** (4 markets simultaneously) |
| **Planning** | 6-month roadmaps | **5-year CTO trajectories** with success probabilities |
| **Verification** | Basic quizzes | Vibe Engineering (code sandbox testing) |
| **Innovation** | Prompt wrappers | **6 extraordinary features** beyond requirements |

---

## 📝 EXTRAORDINARY Hackathon Submission: Gemini Integration

**Submission Blurb (Gemini Focus):**
> "Kazira is an extraordinary autonomous career platform powered by Google Gemini 3.0 Flash Preview. Beyond basic orchestration, we implement 6 groundbreaking features: **Market Prediction Engine** forecasts future skill demands across 4 timeframes; **Competitive Agent Tournament** uses evolutionary algorithms where 5 agents compete for optimal strategies; **Career Velocity Metrics** track personal learning speed vs market evolution; **Multi-Market Intelligence** analyzes global arbitrage opportunities across Kenya, US, and EU; **Strategic Career Pathing** generates complete 5-year trajectories to CTO with success probabilities; **Vibe Engineering** verifies resources through autonomous code testing. Our **Marathon Agent** runs 72+ hours autonomously with agent negotiation via message bus. This demonstrates Gemini 3's advanced reasoning capabilities for predictive analytics, evolutionary computation, and strategic career orchestration - creating $100B+ commercial value while showcasing extraordinary AI orchestration."

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11 or higher
- Node.js 18 or higher
- Google Gemini API Key (get from [AI Studio](https://aistudio.google.com/app/apikey))

### 1. Environment Setup

Copy `.env.example` to `.env` and update with your values:

```bash
# Root directory
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local

# Edit .env files and add your GEMINI_API_KEY
```

### 2. Backend Setup (FastAPI)

The backend manages the autonomous agent pipeline and Gemini integrations.

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```
*The API will be available at `http://localhost:8000`*

### 3. Frontend Setup (Next.js)

The frontend provides the visual interface for the agent's work.

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will be available at `http://localhost:3000`*
*The UI will be available at `http://localhost:3000/roadmap`*

---

### 4. Docker Setup (Alternative - One-Command Start)

If you prefer Docker for containerized deployment:

```bash
# Start both backend and frontend with one command
docker-compose up --build

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
# Health Check: http://localhost:8000/health
```

**Note**: Docker will auto-install all dependencies and configure the environment.

---

## 🎥 Demonstration Requvicornuirements
- **Live Scraping**: Visual proof of the Research Agent gathering market data in real-time from global job boards.
- **Dynamic Logic**: Planning Agent explaining *why* it chose specific skills for the user based on location-specific market trends.
- **Verification**: User failing a quiz and seeing the Roadmap adjust its intensity or resources.
- **Self-Correction**: Showing the agent log an error and re-trying with a different strategy.
- **Global Adaptability**: Demonstrate how the system adapts recommendations based on different locations (e.g., San Francisco vs. London vs. Nairobi).
