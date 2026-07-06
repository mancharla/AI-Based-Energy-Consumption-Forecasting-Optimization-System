# AI-Based Energy Consumption Forecasting & Optimization System

## Project Overview

AI-Based Energy Consumption Forecasting & Optimization System is a full-stack machine learning application that predicts future energy consumption, detects peak usage periods, identifies anomalies, and generates AI-based optimization recommendations.

The system helps organizations reduce energy waste, improve operational efficiency, and make data-driven energy management decisions.

---

## Objective

The main objective of this project is to build an AI-powered platform that can:

- Forecast future energy consumption
- Predict peak energy usage periods
- Detect abnormal energy consumption patterns
- Generate optimization recommendations
- Simulate energy-saving scenarios
- Visualize analytics through an interactive dashboard

---

## Tech Stack

### Backend

- Python
- FastAPI
- SQLite
- SQLAlchemy
- Pandas
- Scikit-learn
- Joblib
- ReportLab
- JWT Authentication

### Frontend

- React
- Vite
- React Router DOM
- Axios
- Recharts
- CSS

### Machine Learning

- Random Forest Regressor
- Linear Regression
- Isolation Forest
- Statistical thresholding
- Rule-based recommendation engine

---

## System Features

### 1. User Authentication

The system includes user registration and login functionality.

Features:

- User registration
- User login
- Password hashing
- JWT token generation
- Protected dashboard routes
- Logout functionality

Authentication APIs:

```text
POST /auth/register
POST /auth/login
2. Dataset Upload

Users can upload energy consumption datasets in CSV or Excel format.

Supported formats:

.csv
.xlsx

Required columns:

timestamp
building_id
device_id
energy_usage

Optional columns:

temperature
occupancy

Upload API:

POST /upload/
Dataset Explanation

The dataset contains historical energy usage data.

Example:

timestamp,building_id,device_id,energy_usage,temperature,occupancy
2026-01-01 00:00:00,B1,HVAC_1,35.5,28,45
2026-01-01 01:00:00,B1,HVAC_1,32.1,27,38
Dataset Features
Feature	Description
timestamp	Date and time of energy reading
building_id	Building identifier
device_id	Device or equipment identifier
energy_usage	Electricity consumption in kWh
temperature	Temperature value
occupancy	Number of people or occupancy level
Feature Engineering

From the timestamp column, the system creates additional time-based features:

hour
day
month
day_of_week

These features help the ML model learn:

Hourly patterns
Daily consumption trends
Weekend behavior
Peak-hour patterns
3. Model Training

The system trains multiple ML models and selects the best one based on RMSE.

Models used:

Linear Regression
Random Forest Regressor

Training API:

POST /train/{file_name}

The trained model is saved using joblib.

Saved model location:

backend/app/trained_models/
4. Energy Consumption Forecasting

The system forecasts future energy usage for:

Next 24 hours
Next 7 days
Next 30 days

Forecast API:

GET /forecast/{file_name}?period=24h
GET /forecast/{file_name}?period=7d
GET /forecast/{file_name}?period=30d

The forecast output includes:

Historical usage
Predicted usage
Timestamp-wise forecast values
5. Peak Usage Prediction

The system predicts high-load periods using forecasted energy values.

It calculates:

threshold = average predicted usage × 1.20

If predicted usage exceeds the threshold, it is marked as a peak period.

Peak Prediction API:

GET /peaks/{file_name}?period=24h

Example alert:

Expected peak consumption between 6 PM – 9 PM
6. Anomaly Detection

The system detects abnormal energy consumption patterns using Isolation Forest.

It can detect:

Sudden energy spikes
Unexpected night-time usage
Faulty device behavior
Sensor anomalies

Anomaly Detection API:

GET /anomalies/{file_name}
7. AI-Based Optimization Recommendations

The system generates intelligent energy-saving recommendations based on usage patterns.

Recommendation examples:

Shift heavy processing tasks to off-peak hours.
Reduce HVAC usage during low occupancy periods.
Unexpected night-time energy usage detected.
Inspect device behavior due to abnormal spikes.

Recommendation API:

GET /recommendations/{file_name}
8. Scenario Simulation

Users can simulate energy-saving scenarios such as:

Increased occupancy
Temperature change
Device shutdown
Peak-hour load reduction

Simulation API:

POST /simulation/{file_name}

Example request:

{
  "occupancy_change": 10,
  "temperature_change": 2,
  "device_shutdown": false,
  "peak_reduction_percent": 15
}

Example output:

{
  "original_consumption": 165000.5,
  "simulated_consumption": 158430.2,
  "energy_savings": 6570.3,
  "savings_percent": 3.98
}
9. Dashboard Analytics

The dashboard displays:

Total energy consumption
Average usage
Maximum usage
Minimum usage
Total records
Building count
Device count
Peak hour

Dashboard Summary API:

GET /dashboard/summary/{file_name}

Chart APIs:

GET /dashboard/hourly/{file_name}
GET /dashboard/daily/{file_name}
GET /dashboard/device-wise/{file_name}
GET /dashboard/building-wise/{file_name}
10. Model Metrics

The system evaluates model performance using:

MAE
RMSE
MAPE
R² Score

Metrics API:

GET /metrics/{file_name}
11. Report Export

The system supports report downloads.

Available reports:

Forecast CSV report
Analytics PDF report

Report APIs:

GET /reports/forecast-csv/{file_name}
GET /reports/analytics-pdf/{file_name}
Frontend Pages

The frontend contains the following pages:

Page	Description
Login	User login page
Register	User registration page
Dashboard	Energy analytics overview
Upload Dataset	Upload CSV/XLSX dataset
Forecast	Train model and generate forecast
Peak Usage	Predict high-load periods
Anomalies	Detect abnormal energy usage
Recommendations	AI optimization suggestions
Simulation	Scenario simulation system
Reports	Download reports and view metrics
System Architecture
User
 |
React Frontend
 |
Axios API Calls
 |
FastAPI Backend
 |
ML Pipeline
 |
SQLite Database / Uploaded Files / Trained Models
Backend Project Structure
backend/
│
├── app/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   │
│   ├── routers/
│   │   ├── auth.py
│   │   ├── upload.py
│   │   ├── train.py
│   │   ├── forecast.py
│   │   ├── peaks.py
│   │   ├── anomalies.py
│   │   ├── recommendations.py
│   │   ├── simulation.py
│   │   ├── dashboard.py
│   │   ├── metrics.py
│   │   └── reports.py
│   │
│   ├── ml/
│   │   ├── training.py
│   │   ├── forecasting.py
│   │   ├── anomaly_detection.py
│   │   ├── peak_prediction.py
│   │   ├── optimization.py
│   │   └── simulation_engine.py
│   │
│   ├── uploads/
│   ├── trained_models/
│   └── reports/
│
├── requirements.txt
└── energy.db
Frontend Project Structure
frontend/
│
├── src/
│   ├── api/
│   │   └── api.js
│   │
│   ├── components/
│   │   ├── Sidebar.jsx
│   │   ├── Topbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── PageHeader.jsx
│   │   ├── EmptyState.jsx
│   │   ├── SummaryCards.jsx
│   │   ├── ForecastChart.jsx
│   │   ├── HourlyChart.jsx
│   │   ├── DailyChart.jsx
│   │   ├── DeviceChart.jsx
│   │   ├── BuildingChart.jsx
│   │   ├── PeakAlerts.jsx
│   │   ├── RecommendationPanel.jsx
│   │   └── AnomalyPanel.jsx
│   │
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx
│   │   ├── Forecast.jsx
│   │   ├── Peaks.jsx
│   │   ├── Anomalies.jsx
│   │   ├── Recommendations.jsx
│   │   ├── Simulation.jsx
│   │   └── Reports.jsx
│   │
│   ├── layouts/
│   │   └── MainLayout.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
API Documentation

FastAPI automatically provides Swagger documentation.

After running backend, open:

http://127.0.0.1:8000/docs
How to Run the Project
Backend Setup

Go to backend folder:

cd backend

Create virtual environment:

python -m venv venv

Activate virtual environment:

Windows
venv\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Run backend server:

python -m uvicorn app.main:app --reload

Backend runs on:

http://127.0.0.1:8000

Swagger API docs:

http://127.0.0.1:8000/docs
Frontend Setup

Go to frontend folder:

cd frontend

Install dependencies:

npm install

Run frontend:

npm run dev

Frontend runs on:

http://localhost:5173
Usage Flow
Register a new user.
Login using registered credentials.
Upload energy dataset.
Train the ML model.
Generate energy forecast.
View dashboard analytics.
Detect anomalies.
Predict peak usage periods.
Generate optimization recommendations.
Run scenario simulations.
Download reports.
Machine Learning Methodology
Forecasting

The system uses regression-based forecasting.

Steps:

Read uploaded dataset.
Convert timestamp to datetime format.
Extract time-based features.
Train Linear Regression and Random Forest models.
Compare model metrics.
Save the best model.
Generate future timestamps.
Predict future energy consumption.
Anomaly Detection

The system uses Isolation Forest.

Steps:

Read energy usage values.
Train Isolation Forest.
Mark unusual readings as anomalies.
Return abnormal timestamps and usage values.
Peak Prediction

Peak periods are detected from forecasted values.

Steps:

Generate forecast.
Calculate average predicted usage.
Set threshold as 120% of average usage.
Mark values above threshold as peak periods.
Generate alert messages.
Optimization Strategy

The recommendation engine is rule-based.

Rules include:

High usage during peak hours → suggest load shifting.
High usage during low occupancy → reduce HVAC/lighting.
High night-time usage → check unnecessary device operation.
Large spikes → inspect device or sensor behavior.
Scenario Simulation Strategy

The simulation system estimates consumption changes based on:

Occupancy percentage change
Temperature change
Device shutdown
Peak-hour load reduction

It calculates:

energy_savings = original_consumption - simulated_consumption
Edge Cases Handled

The system handles:

Invalid file type
Missing required columns
Invalid timestamp format
Invalid energy usage values
Missing trained model
Empty or unavailable dataset
Incorrect login credentials
Duplicate email registration
No uploaded dataset in frontend
API failure handling
Evaluation Criteria Mapping
Requirement	Implemented
Energy consumption forecasting	Yes
24h, 7d, 30d forecast	Yes
Peak usage prediction	Yes
AI optimization recommendations	Yes
Anomaly detection	Yes
Scenario simulation	Yes
Backend ML APIs	Yes
Modular ML architecture	Yes
Dashboard analytics	Yes
Forecast accuracy metrics	Yes
Report export	Yes
Authentication	Yes
React frontend	Yes
Future Improvements

This project demonstrates a complete AI-powered energy forecasting and optimization platform. It combines machine learning, anomaly detection, scenario simulation, analytics dashboards, authentication, and report generation into a full-stack application.

The system can help organizations forecast energy demand, detect abnormal usage, reduce peak-hour load, and improve energy efficiency through intelligent recommendations.
