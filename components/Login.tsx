import React from 'react';
import { Wind } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden animate-fade-in">
        <div className="p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-blue-600/30">
            <Wind size={40} />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Personal AQI Tracker</h1>
          <p className="text-gray-600 mb-8">
            Your AI-powered companion for monitoring air quality, predicting health risks, and navigating climate impact.
          </p>

          <div className="space-y-4">
             <button 
               onClick={onLogin}
               className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] shadow-md"
             >
               Get Started
             </button>
             
             <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                   <span className="px-2 bg-white text-gray-500">Already have an account?</span>
                </div>
             </div>

             <button 
               onClick={onLogin}
               className="w-full py-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
             >
               Log In
             </button>
          </div>
        </div>
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Powered by Gemini AI • Real-time India Focus
          </p>
        </div>
      </div>
    </div>
  );
};