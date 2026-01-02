# Kazira Backend Tests

This directory contains automated tests for the Kazira backend system.

## Test Files

### Roadmap Generation Tests

1. **`test_single_pipeline.py`**
   - Tests the `/api/roadmap/generate-quick` endpoint
   - Verifies manual skills input flow
   - Checks request/response pipeline
   - **Run**: `python tests/test_single_pipeline.py`

2. **`test_automated_generation.py`**
   - Tests complete AI roadmap generation
   - Monitors real-time generation process
   - Validates AI-generated content
   - Shows backend logs during generation
   - **Run**: `python tests/test_automated_generation.py`

3. **`test_marathon_agent.py`**
   - Tests 72-hour autonomous agent cycle
   - Verifies session deployment and status checks
   - Monitors real-time logs from orchestrator
   - **Run**: `python tests/test_marathon_agent.py`

4. **`test_advanced_modes.py`**
   - Tests Multi-Market Arbitrage, Strategic Trajectory, and Tournament modes
   - Verifies all specialized endpoints
   - Checks request/response validation
   - **Run**: `python tests/test_advanced_modes.py`

## Running Tests

### Run All Tests
```bash
cd c:/Ajira/backend
python run_tests.py
```

### Run Individual Test
```bash
cd c:/Ajira/backend
python tests/test_single_pipeline.py
python tests/test_automated_generation.py
```

### Prerequisites

1. **Backend Server Running**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

2. **Environment Variables**:
   - Create `.env` file with `GEMINI_API_KEY`
   - Or set environment variable: `$env:GEMINI_API_KEY="your_key"`

3. **Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

## Test Results

Tests will output:
- ✅ Success indicators
- ❌ Failure indicators
- 📊 Response times
- 🤖 AI generation logs
- 📝 Detailed results

## CI/CD Integration

These tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run Backend Tests
  run: |
    cd backend
    python run_tests.py
```

## Test Coverage

Current coverage:
- ✅ Single Pipeline endpoint
- ✅ Quick roadmap generation
- ✅ AI integration (Gemini)
- ✅ Request validation
- ✅ Response formatting
- ⏳ CV skill extraction (TODO)
- ⏳ Marathon agent (TODO)
