# Kazira | AI Career Stylist for Kenya 🇰🇪

**Kazira** (Swahili for "Little Job" or a play on "Kazi" - Work) is an AI-powered career stylist designed specifically for the Kenyan technology ecosystem ("Silicon Savannah"). It helps developers stop guessing and start building precision-engineered career roadmaps aligned with local market demand.

## 🚀 Key Features

### 1. AI Roadmap Builder 🗺️
*   **Context-Aware**: Generates month-by-month learning paths tailored to specific roles (e.g., "AI Engineer", "DevOps") and the user's current skill level.
*   **Local Context**: Prioritizes tools and frameworks in high demand within Nairobi (e.g., M-PESA Daraja API, Ushahidi, Safaricom stack).
*   **Interactive Chat**: Refine your roadmap with an embedded AI mentor that answers specific questions about resources or strategies.

### 2. Smart Job Board (Inventory) 💼
*   **Live Match Analysis**: Click "Analyze Match" on any job listing to get an instant AI gap analysis comparing your generated roadmap against the job description.
*   **Actionable Feedback**: Receive a specific score (e.g., "85% Match") and advice on how to bridge skill gaps (e.g., "Build a project with Kubernetes").
*   **Domain Filtering**: Quickly filter roles by Engineering, Data & AI, Product, or Contract work.

### 3. Engagement & Virality 📈
*   **Market Pulse**: A "Live" ticker popup that surfaces real-time ecosystem stats (e.g., "Python demand up 40%").
*   **Smart Save & Share**: Download your Technical Blueprint as a JSON file or copy a viral-ready summary for LinkedIn/Twitter to share your career goals. 
*   **Zero-Friction**: No login required to generate, save, or share.

### 4. Professional Aesthetic 🎨
*   **"Pure Black" Theme**: A premium, high-contrast dark mode design inspired by top-tier SaaS platforms.
*   **Dynamic Animations**: 
    *   Particle/Nebula background effects.
    *   Smooth page transitions.
    *   Glassmorphism cards and modals.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router), Tailwind CSS v4, Framer Motion.
*   **Backend**: FastAPI (Python), Google Gemini 1.5 Pro (Generative AI).
*   **Integration**: LocalStorage for persistence, Custom Hooks for state management.

## 🏃‍♂️ Getting Started

### Prerequisites
*   Node.js 18+
*   Python 3.9+
*   Google Gemini API Key

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/yourusername/kazira.git
    cd kazira
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    python -m venv venv
    source venv/bin/activate  # or venv\Scripts\activate on Windows
    pip install -r requirements.txt
    
    # Create .env file with your API key
    echo "GEMINI_API_KEY=your_key_here" > .env
    
    # Run Server
    uvicorn app.main:app --reload
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Launch**: Visit `http://localhost:3000`

---
*Built with ❤️ for the Nairobi Tech Community.*
