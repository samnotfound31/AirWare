import React, { useMemo } from 'react';

interface AQIGaugeProps {
  value: number;
  className?: string;
}

const getAQIInfo = (value: number) => {
  if (value <= 50) return { color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-500', label: 'Good' };
  if (value <= 100) return { color: 'text-yellow-500', bg: 'bg-yellow-100', border: 'border-yellow-500', label: 'Moderate' };
  if (value <= 150) return { color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-500', label: 'Unhealthy for Sensitive' };
  if (value <= 200) return { color: 'text-red-500', bg: 'bg-red-100', border: 'border-red-500', label: 'Unhealthy' };
  if (value <= 300) return { color: 'text-purple-500', bg: 'bg-purple-100', border: 'border-purple-500', label: 'Very Unhealthy' };
  return { color: 'text-red-900', bg: 'bg-red-200', border: 'border-red-900', label: 'Hazardous' };
};

const Particles = ({ count, colorClass }: { count: number, colorClass: string }) => {
  const particles = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      // Increased speed: Reduced duration from (10-20s) to (3-8s)
      duration: Math.random() * 5 + 3, 
      delay: Math.random() * -10, // Start at random times
      tx: (Math.random() - 0.5) * 80, // More drift X
      ty: Math.random() * -120 // More drift Up
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none z-0">
      <style>
        {`
          @keyframes particleFloat {
            0% { transform: translate(0, 0); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translate(var(--tx), var(--ty)); opacity: 0; }
          }
        `}
      </style>
      {particles.map((p, i) => (
        <div
          key={i}
          className={`absolute rounded-full ${colorClass}`}
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            // @ts-ignore
            '--tx': `${p.tx}px`,
            // @ts-ignore
            '--ty': `${p.ty}px`,
            animation: `particleFloat ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export const AQIGauge: React.FC<AQIGaugeProps> = ({ value, className }) => {
  const info = getAQIInfo(value);
  
  // Calculate stroke dash for SVG circle (simple gauge)
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / 500, 1); // Cap at 500 for visual
  const dashoffset = circumference * (1 - progress);

  // Density of particles: base 5, max 80 based on AQI
  const particleCount = Math.min(80, Math.max(8, Math.floor(value / 3)));
  // Extract just the color name for background use (e.g. text-red-500 -> bg-red-500)
  const particleColor = info.color.replace('text-', 'bg-');

  return (
    <div className={`relative flex flex-col items-center justify-center p-6 rounded-2xl border-2 ${info.border} ${info.bg} ${className} overflow-hidden`}>
      {/* Background Particles */}
      <Particles count={particleCount} colorClass={particleColor} />

      <div className="relative z-10 w-40 h-40 flex items-center justify-center">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            className="text-gray-900 opacity-10"
          />
          {/* Progress Circle */}
          <circle
            cx="50%"
            cy="50%"
            r={radius}
            stroke="currentColor"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            className={`${info.color} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={`text-4xl font-bold ${info.color}`}>{value}</span>
          <span className="text-xs font-semibold text-gray-600 uppercase mt-1">AQI</span>
        </div>
      </div>
      <div className={`relative z-10 mt-4 text-xl font-bold ${info.color} text-center`}>
        {info.label}
      </div>
    </div>
  );
};