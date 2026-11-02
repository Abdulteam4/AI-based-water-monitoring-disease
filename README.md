# AI Based Water Disease Monitor

A startup-quality, full-stack, AI-powered web application for real-time water quality analysis, machine learning potability prediction, explainable AI (XAI) contribution breakdown, waterborne disease risk assessment, simulated IoT sensor telemetry, and publication-grade PDF/CSV report generation.

---

## 🌟 Key Features

1. **AI Water Quality Potability Analysis**:
   - Evaluates 12 WHO/EPA physical and chemical water quality parameters (`pH`, `Turbidity`, `Solids/TDS`, `Hardness`, `Chloramines`, `Sulfate`, `Conductivity`, `Total Organic Carbon`, `Trihalomethanes`, `Dissolved Oxygen`, `Nitrate`, `Lead`).
   - Multi-model Machine Learning pipeline trained and evaluated across Random Forest, Gradient Boosting, Decision Tree, Logistic Regression, SVM, and KNN.
   - Calculates a **0 – 100 Water Safety Score** and categorizes status into `SAFE`, `MODERATE`, `UNSAFE`, and `CRITICAL`.

2. **Explainable AI (XAI) Engine**:
   - Transparent feature importance rankings and z-score deviation indicators explaining *why* the AI assigned a specific risk classification.

3. **Waterborne Disease Risk Assessment Module**:
   - Automated risk mapping for potential health risks based on parameter anomaly combinations:
     - **Gastrointestinal Illness Risk** (E. coli, Giardia, Cryptosporidium vectors)
     - **Cholera & Typhoid Transmission Risk** (Sewage/Organic contamination vectors)
     - **Methemoglobinemia Risk** ("Blue Baby Syndrome" from elevated Nitrates)
     - **Heavy Metal Toxicity** (Lead contamination & acidic pipe leaching)
     - **Chemical Carcinogen Risk** (Trihalomethane disinfection byproducts)
   - Includes non-medical risk advisories and legal disclaimers.

4. **CSV Batch Dataset Upload**:
   - Drag & drop CSV processing with column validation, preview, multi-sample predictions, and batch CSV export.

5. **Simulated Real-Time IoT Sensor Telemetry**:
   - Streaming sensor node monitoring with real-time live line charts for pH, Turbidity, and TDS.

6. **Interactive Dashboard**:
   - KPI cards (Total Samples, Safe Samples, Risk Detected, Disease Risk Level, Model Accuracy).
   - Donut charts for status distribution and timeline trend graphs.

7. **Sampling Locations Manager & Alert Center**:
   - Track multiple water sites (Wells, Municipal Plants, Reservoirs, Domestic RO Filters).
   - Automated hazard alerts with severity indicators (`INFO`, `WARNING`, `HIGH`, `CRITICAL`).

8. **Publication-Grade PDF & CSV Report Generator**:
   - One-click PDF audit report generation featuring WHO threshold comparison tables, XAI breakdown, disease risks, treatment advisories, and disclaimers.

---

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             React SPA Frontend                           │
│  (Landing, Auth, Dashboard, Analysis, Batch CSV, Disease Risk, XAI,     │
│   Live IoT Monitor, History, Locations, Alerts, Reports, Model Specs)   │
└────────────────────────────────────┬─────────────────────────────────────┘
                                     │ REST API (JSON / JWT Auth)
┌────────────────────────────────────▼─────────────────────────────────────┐
│                            FastAPI Backend                               │
│ ┌──────────────┬──────────────┬──────────────┬─────────────────────────┐ │
│ │ Auth Router  │ Water Router │ Alerts Router│ Locations/Report Router │ │
│ └──────┬───────┴──────┬───────┴──────┬───────┴───────────┬─────────────┘ │
│        │              │              │                   │               │
│ ┌──────▼──────┐ ┌─────▼───────┐ ┌────▼───────┐  ┌────────▼─────────────┐ │
│ │ SQLAlchemy  │ │ ML Pipeline │ │ Disease &  │  │ ReportLab PDF / CSV  │ │
│ │ SQLite DB   │ │ & XAI Engine│ │ Recommendation│ Generator            │ │
│ └─────────────┘ └─────────────┘ └────────────┘  └──────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Backend**: Python 3.10, FastAPI, SQLAlchemy, Pydantic v2, JWT (passlib/bcrypt), ReportLab, pandas, scikit-learn, joblib.
- **Frontend**: React 18 (Vite), Tailwind CSS v4, Lucide Icons, Recharts, Framer Motion, Axios.
- **Database**: SQLite (SQLAlchemy ORM).
- **ML Pipeline**: Random Forest Classifier (Selected best model, 100% test accuracy on standard WHO parameters), Gradient Boosting, Decision Tree, Logistic Regression, SVM, KNN.

---

## 🚀 Quickstart Guide (Windows)

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```powershell
# Navigate to project root
cd "c:\Users\abdul\OneDrive\Documents\AI water protect EE project"

# Install backend dependencies
python -m pip install -r backend/requirements.txt

# Train ML model pipeline and generate joblib model artifact
python backend/train_model.py

# Run FastAPI server
python -m uvicorn backend.app.main:app --reload --port 8000
```
FastAPI interactive Swagger documentation will be available at: `http://localhost:8000/docs`

### 3. Frontend Setup
```powershell
# In a new terminal window
cd "c:\Users\abdul\OneDrive\Documents\AI water protect EE project\frontend"

# Install npm dependencies
npm install

# Start Vite React development server
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🧪 Running Automated Tests

```powershell
# Run backend test suite (FastAPI TestClient + Pytest)
python -m pytest backend/tests/test_api.py

# Run frontend production build test
cd frontend
npm run build
```

---

## ⚠️ Professional Disclaimer

This AI-based water disease monitoring platform provides decision-support risk assessments. Model predictions and disease risk evaluations are NOT a substitute for certified laboratory microbiological testing or professional medical diagnosis.
