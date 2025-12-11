import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Wind, Droplets, Thermometer, Info } from 'lucide-react';
import { DashboardData, UserProfile } from '../types';
import { AQIGauge } from './AQIGauge';

interface DashboardProps {
  data: DashboardData | null;
  loading: boolean;
  profile: UserProfile;
  onRefresh: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, loading, profile, onRefresh }) => {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-gray-600 text-lg animate-pulse">Analyzing atmospheric data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center p-10">
        <p className="text-gray-500">No data available. Please refresh or check your API key.</p>
        <button onClick={onRefresh} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">Retry</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {data.current.location}
          </h1>
          <p className="text-gray-500 text-sm">
            Last updated: {new Date(data.current.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium border border-blue-100">
          <Info size={16} />
          <span>Monitoring for {profile.sensitivity} sensitivity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Main AQI Gauge */}
        <div className="md:col-span-4 lg:col-span-3">
          <AQIGauge value={data.current.aqi} className="h-full shadow-sm" />
        </div>

        {/* Detailed Stats */}
        <div className="md:col-span-8 lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Thermometer size={18} />
                    <span className="text-sm">Temperature</span>
                </div>
                <span className="text-2xl font-semibold text-gray-800">{data.current.temp}°C</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Droplets size={18} />
                    <span className="text-sm">Humidity</span>
                </div>
                <span className="text-2xl font-semibold text-gray-800">{data.current.humidity}%</span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Wind size={18} />
                    <span className="text-sm">PM2.5</span>
                </div>
                <span className="text-2xl font-semibold text-gray-800">{data.current.pm25} <span className="text-xs text-gray-400">µg/m³</span></span>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                    <Wind size={18} />
                    <span className="text-sm">PM10</span>
                </div>
                <span className="text-2xl font-semibold text-gray-800">{data.current.pm10} <span className="text-xs text-gray-400">µg/m³</span></span>
            </div>
        </div>
        
        {/* Advisory Quick View */}
        <div className="md:col-span-12 lg:col-span-3 bg-gradient-to-br from-slate-800 to-slate-900 text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between">
           <div>
               <h3 className="text-lg font-semibold mb-2">Health Insight</h3>
               <p className="text-slate-300 text-sm leading-relaxed">
                   {data.healthRisk}
               </p>
           </div>
           <div className="mt-4 pt-4 border-t border-slate-700">
               <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-2">Recommendation</p>
               <ul className="text-sm space-y-1">
                   {data.advisory.slice(0, 2).map((adv, i) => (
                       <li key={i} className="flex items-start gap-2">
                           <span className="text-teal-400">•</span> {adv}
                       </li>
                   ))}
               </ul>
           </div>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4">24-Hour Prediction Trend</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.forecast}>
              <defs>
                <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
              <Tooltip 
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Area 
                type="monotone" 
                dataKey="aqi" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorAqi)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

       {/* Climate Context */}
       <div className="bg-teal-50 border border-teal-100 p-6 rounded-2xl">
            <h3 className="text-teal-900 font-bold mb-2 flex items-center gap-2">
                🌍 Climate Context
            </h3>
            <p className="text-teal-800 leading-relaxed">
                {data.climateInsight}
            </p>
       </div>
    </div>
  );
};