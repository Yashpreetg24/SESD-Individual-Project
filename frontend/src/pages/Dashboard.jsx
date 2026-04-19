import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [meals, setMeals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
    fetchDailyLog();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      if(err.response?.status === 401) handleLogout();
    }
  };

  const fetchDailyLog = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/meals/daily', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.macros);
      setMeals(res.data.mealLogs);
    } catch (err) {
      console.error(err);
    }
  };

  const getSuggestions = async () => {
    if(!stats) return;
    try {
      const res = await axios.post('http://localhost:5001/api/meals/suggest', {
        remainingCalories: stats.remainingCalories,
        remainingProtein: stats.remainingProtein
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuggestions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if(!searchQuery) return;
    try {
      const res = await axios.get(`http://localhost:5001/api/foods/search?query=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const logMeal = async (foodId, mealType) => {
    try {
      await axios.post('http://localhost:5001/api/meals', {
        food_id: foodId,
        meal_type: mealType,
        quantity: 1
      }, { headers: { Authorization: `Bearer ${token}` } });
      fetchDailyLog(); // refresh stats
      setSearchQuery('');
      setSearchResults([]);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMeal = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/meals/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDailyLog(); // refresh stats
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if(!stats || !profile) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="flex" style={{justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1>Hi, {profile.name}!</h1>
        <button className="btn btn-secondary" style={{width: 'auto'}} onClick={handleLogout}>Logout</button>
      </div>

      <div className="stats-grid mb-4">
        <div className="card stat-card">
          <h3>Calories</h3>
          <div className="stat-value">{Math.round(stats.consumedCalories)} / {Math.round(stats.targetCalories)}</div>
          <p>kcals (Remaining: {Math.round(stats.remainingCalories)})</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${Math.min(100, (stats.consumedCalories/stats.targetCalories)*100)}%`}}></div>
          </div>
        </div>
        <div className="card stat-card">
          <h3>Protein</h3>
          <div className="stat-value">{Math.round(stats.consumedProtein)} / {Math.round(stats.targetProtein)}</div>
          <p>grams (Remaining: {Math.round(stats.remainingProtein)})</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{width: `${Math.min(100, (stats.consumedProtein/stats.targetProtein)*100)}%`}}></div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Left Col */}
        <div style={{flex: 1}}>
          <div className="card">
            <h3>Add a Meal</h3>
            <form onSubmit={handleSearch} className="flex gap-4 mt-4">
              <input value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} placeholder="Search foods..." />
              <button type="submit" className="btn" style={{width: 'auto'}}>+Add</button>
            </form>
            {searchResults.length > 0 && (
              <div className="mt-4">
                {searchResults.map(food => (
                  <div key={food._id} className="flex" style={{justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)'}}>
                    <div>
                      <strong>{food.name}</strong> - {food.calories}kcal, {food.protein}g protein
                    </div>
                    <div className="flex gap-4">
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', width: 'auto'}} onClick={() => logMeal(food._id, 'breakfast')}>Brkfst</button>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', width: 'auto'}} onClick={() => logMeal(food._id, 'lunch')}>Lunch</button>
                      <button className="btn btn-secondary" style={{padding: '0.2rem 0.5rem', width: 'auto'}} onClick={() => logMeal(food._id, 'dinner')}>Dinner</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <h3>Today's Meals</h3>
            {meals.map(log => (
              <div key={log._id} className="flex" style={{justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)'}}>
                <div>
                  <strong>{log.food_id?.name || 'Unknown food'}</strong> - {log.meal_type}
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{padding: '0.2rem 0.6rem', width: 'auto', color: '#ef4444', borderColor: '#ef4444'}} 
                  onClick={() => deleteMeal(log._id)}
                >
                  -
                </button>
              </div>
            ))}
            {meals.length === 0 && <p className="text-muted mt-4">No meals logged yet.</p>}
          </div>
        </div>

        {/* Right Col */}
        <div style={{flex: 1}}>
          <div className="card">
            <div className="flex" style={{justifyContent: 'space-between'}}>
              <h3>Smart Suggestions</h3>
              <button className="btn btn-secondary" style={{width: 'auto', padding: '0.3rem 0.6rem'}} onClick={getSuggestions}>Get Suggestions</button>
            </div>
            {suggestions.length > 0 ? (
              <div className="mt-4">
                {suggestions.map((food) => (
                  <div key={food._id} className="flex" style={{justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--border)'}}>
                    <div>
                      <strong>{food.name}</strong> ({food.calories}kcal | {food.protein}g protein)
                    </div>
                    <button 
                      className="btn btn-secondary" 
                      style={{padding: '0.2rem 0.6rem', width: 'auto', color: 'var(--primary)', borderColor: 'var(--primary)'}} 
                      onClick={() => logMeal(food._id, 'snack')}
                      title="Add as snack"
                    >
                      +
                    </button>
                  </div>
                ))}
              </div>
            ) : (
                <p className="text-muted mt-4">Click to find foods that fit your remaining macros!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
