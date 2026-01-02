#!/bin/bash
set -e

echo "🚀 Setting up Kazira Hackathon Demo..."

# Backend setup
echo ""
echo "📦 Setting up backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Backend setup complete!"

# Frontend setup
echo ""
echo "📦 Setting up frontend..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
fi

echo "✅ Frontend setup complete!"

# Create .env file from example
echo ""
echo "📝 Configuring environment..."
cd ..

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "⚠️  .env file created from .env.example"
    echo ""
    echo "IMPORTANT: Please edit .env and add your GEMINI_API_KEY"
    echo ""
    echo "You can get your key from: https://aistudio.google.com/app/apikey"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "✅ Setup complete! Ready to start services."
echo ""
echo "📝 To start the application:"
echo ""
echo "Backend (Terminal 1):"
echo "  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "Frontend (Terminal 2):"
echo "  cd frontend && npm run dev"
echo ""
echo "Once started, access:"
echo "  🎯 Frontend: http://localhost:3000"
echo "  🔌 Backend API: http://localhost:8000"
echo "  💚 Health Check: http://localhost:8000/health"
echo ""
