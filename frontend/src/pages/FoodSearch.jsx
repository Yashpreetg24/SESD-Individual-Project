import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const FoodSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [mealType, setMealType] = useState(searchParams.get('mealType') || 'breakfast');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [quantity, setQuantity] = useState(100);

  const searchFoods = async (q) => {
    setLoading(true);
    try {
      const res = await api.get(`/foods?q=${q}`);
      setFoods(res.data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchFoods(query);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    searchFoods(query);
  };

  const handleLogMeal = async () => {
    if (!selectedFood) return;
    try {
      await api.post('/meals', {
        foodId: selectedFood.id,
        mealType,
        quantity,
        date: new Date().toISOString().split('T')[0]
      });
      navigate('/meal-log');
    } catch (err) {
      alert('Failed to log meal');
    }
  };

  return (
    <div className="container py-8 animate-fade-in">
      <h1 className="text-4xl font-extrabold tracking-tight mb-8">Search Foods</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <form onSubmit={handleSearch} className="flex gap-4 mb-8">
            <input 
              className="form-input" 
              placeholder="Search chicken, rice, eggs..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary px-8">Search</button>
          </form>

          {loading ? (
            <div className="flex-center py-12"><div className="loader"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {foods.map(food => (
                <div 
                  key={food.id} 
                  onClick={() => { setSelectedFood(food); setQuantity(food.servingSize); }}
                  className={`glass-card cursor-pointer border-2 transition-all ${selectedFood?.id === food.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border'}`}
                >
                  <h4 className="font-bold">{food.name}</h4>
                  <p className="text-xs text-text-muted mt-1">
                    {food.calories} kcal • {food.protein}g protein • {food.carbs}g carbs • {food.fat}g fat
                  </p>
                  <p className="text-[10px] text-text-muted italic mt-1">per {food.servingSize}{food.servingUnit}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedFood ? (
            <div className="glass-card sticky top-24">
              <h3 className="text-xl font-bold mb-6">Log {selectedFood.name}</h3>
              
              <div className="form-group">
                <label className="form-label">Meal Category</label>
                <select className="form-input" value={mealType} onChange={(e) => setMealType(e.target.value)}>
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Quantity ({selectedFood.servingUnit})</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={quantity} 
                  onChange={(e) => setQuantity(e.target.value)} 
                />
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                <div className="flex justify-between text-xs text-text-muted uppercase font-bold tracking-wider mb-2">
                  <span>Calculated Nutrition</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-lg font-bold">{Math.round(selectedFood.calories * (quantity / selectedFood.servingSize))}</span>
                    <p className="text-[10px] text-text-muted">kcal</p>
                  </div>
                  <div>
                    <span className="text-lg font-bold">{Math.round(selectedFood.protein * (quantity / selectedFood.servingSize) * 10) / 10}g</span>
                    <p className="text-[10px] text-text-muted">protein</p>
                  </div>
                </div>
              </div>

              <button onClick={handleLogMeal} className="btn btn-primary w-full">Log to Diary</button>
              <button onClick={() => setSelectedFood(null)} className="btn btn-outline w-full mt-3">Cancel</button>
            </div>
          ) : (
            <div className="glass-card flex-center flex-col text-center py-12 opacity-50 grayscale">
              <p className="text-text-muted italic">Select a food from the list to see nutrition details and log it.</p>
            </div>
          )}
          
          <div className="mt-8 text-center">
             <p className="text-sm text-text-muted mb-4">Don't find what you're looking for?</p>
             <button className="btn btn-outline text-xs" onClick={() => alert('Custom food feature coming soon!')}>+ Add Custom Food</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodSearch;
