import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Cell, PieChart, Pie 
} from 'recharts';
import api from '../api/axios';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/trends');
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="flex-center h-[80vh]"><div className="loader"></div></div>;

  const { trends, goals } = data || {};
  const weekly = trends?.weekly || [];

  return (
    <div className="container py-8 animate-fade-in">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Nutrition Analytics</h1>
        <p className="text-text-muted mt-1">Trends and patterns in your diet over the last 7 days</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Calorie Trend Chart */}
        <div className="glass-card h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6">Calorie Intake</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weekly}>
                <defs>
                  <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#4ade80' }}
                />
                <Area type="monotone" dataKey="calories" stroke="#4ade80" strokeWidth={3} fillOpacity={1} fill="url(#colorCal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protein Trend Chart */}
        <div className="glass-card h-[400px] flex flex-col">
          <h3 className="text-lg font-bold mb-6">Protein Trend (g)</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="protein" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard label="Avg Calories" value={trends?.avgCalories || 0} unit="kcal" />
        <StatsCard label="Avg Protein" value={trends?.avgProtein || 0} unit="g" />
        <StatsCard label="Target Calories" value={goals?.calorieGoal || 0} unit="kcal" />
        <StatsCard label="Active Days" value={trends?.activeDays || 0} unit="of 7" />
      </div>
    </div>
  );
};

const StatsCard = ({ label, value, unit }) => (
  <div className="glass-card text-center">
    <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-2">{label}</p>
    <div className="flex items-baseline justify-center gap-1">
      <span className="text-3xl font-extrabold">{value}</span>
      <span className="text-sm text-text-muted">{unit}</span>
    </div>
  </div>
);

export default Analytics;
