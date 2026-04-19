# Personal Diet Planner Web App

A modern, full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users establish and track their personal nutritional goals using smart algorithms.

## Features

- **User Authentication:** Secure JWT-based Login and Registration.
- **Nutrition Algorithm:** Dynamically calculates daily resting Basal Metabolic Rates (BMR) and protein targets based on age, weight, height, and personal goals.
- **Smart Suggestions Engine:** Analyzes remaining daily macros and automatically searches the database for food items that strictly fit within the user's remaining limits.
- **Meal Logging:** Search capabilities and specific logging modules for tracking daily Breakfast, Lunch, Dinner, and Snacks.
- **Visual Dashboard:** Real-time tracking of calories and protein goals using clean, interactive status bars.

## Tech Stack
- **Backend:** Node.js, Express.js, Mongoose (Clean Architecture implementation with Controllers, Services, and Repositories).
- **Frontend:** React (Vite), React Router, Axios, and visually rich custom CSS.
- **Database:** MongoDB.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Local MongoDB installation or a MongoDB Atlas connection URI string.

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables. Copy `.env.example` to a new `.env` file and verify connections:
   ```bash
   cp .env.example .env
   ```
4. Seed your local Database with initial foods (Run only once):
   ```bash
   node src/seed.js
   ```
5. Run the dev server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the frontend dev server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:3000/`.

## Architecture Highlights
- Clean Architecture enforces `Controllers -> Services -> Repositories -> Models`.
- No third-party generalized AI dependencies – reliant entirely on controlled programmatic constraints and dataset fetching.

## License
MIT License
