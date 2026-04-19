import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Lazy load pages for performance
import Login from './pages/Login';
import Register from './pages/Register';
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MealLog = React.lazy(() => import('./pages/MealLog'));
const FoodSearch = React.lazy(() => import('./pages/FoodSearch'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Profile = React.lazy(() => import('./pages/Profile'));

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <React.Suspense fallback={<div className="flex-center h-screen"><div className="loader"></div></div>}>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/meal-log" element={<MealLog />} />
                  <Route path="/food-search" element={<FoodSearch />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </React.Suspense>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
