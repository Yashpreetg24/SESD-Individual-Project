# NutriTrack — Personal Diet Planner

A premium full-stack application designed to help users track their daily nutrition, calculate goals based on scientific formulas (Mifflin-St Jeor), and receive smart food suggestions.

## 🚀 Features

- **Personalized Goal Calculation**: Automatically calculates BMR and TDEE based on age, weight, height, and activity level.
- **Smart Diet Strategies**: Choose between Weight Loss, Maintenance, or Muscle Gain (Strategy Pattern).
- **Food Diary**: Log meals (Breakfast, Lunch, Dinner, Snacks) with a massive pre-seeded database.
- **Progress Analytics**: Visual trends and weekly progress reports using Recharts.
- **Smart Suggestions**: AI-driven food suggestions based on your remaining nutritional targets for the day.
- **Clean Architecture**: Built with a layered repository/service pattern for high maintainability.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Axios, React Router, Recharts, CSS3 (Glassmorphism).
- **Backend**: Node.js, Express, SQLite3 (Promisified), JWT Authentication.
- **Patterns**: Singleton, Strategy, Repository, Factory.

## 📂 Project Structure

```text
├── backend
│   ├── config          # Database singleton configuration
│   ├── controllers     # API request handlers
│   ├── middleware      # JWT Authentication & Guardrails
│   ├── models          # Domain entities (User, Food, MealLog)
│   ├── repositories    # Data access layer (CRUD logic)
│   ├── routes          # API endpoints definition
│   ├── services        # Business logic & Calculations
│   ├── src             # App structure
│   └── server.js       # Entry point
└── frontend
    ├── src
    │   ├── api         # Axios instance
    │   ├── components  # Reusable UI components
    │   ├── context     # Global Auth state
    │   ├── pages       # Main view components
    │   └── App.jsx     # Routing & Provider setup
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
*Note: Backend runs on http://localhost:7178 to avoid macOS port conflicts.*

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Note: Frontend runs on http://localhost:5173.*

## 🧪 Documentation

The following UML diagrams and design documents are included in the repository root:
- `idea.md`: Project scope and feature set.
- `useCaseDiagram.md`: User interaction map.
- `classDiagram.md`: Object-oriented structure.
- `sequenceDiagram.md`: End-to-end data flow.
- `ErDiagram.md`: Database schema relationship.

---
**Developed for the SESD Individual Project — April 2024**
