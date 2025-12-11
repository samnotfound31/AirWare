export interface UserProfile {
  name: string;
  city: string;
  sensitivity: 'low' | 'moderate' | 'high';
  commuteMode: 'car' | 'bike' | 'public_transport' | 'walk';
  healthConditions: string[];
}

export interface AQIData {
  aqi: number;
  pm25: number;
  pm10: number;
  temp: number;
  humidity: number;
  condition: string;
  location: string;
  timestamp: string;
}

export interface ForecastPoint {
  time: string;
  aqi: number;
}

export interface DashboardData {
  current: AQIData;
  forecast: ForecastPoint[];
  healthRisk: string;
  advisory: string[];
  climateInsight: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isSimulating?: boolean;
}

export enum AppView {
  LOGIN = 'LOGIN',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  SIMULATION = 'SIMULATION',
  PROFILE = 'PROFILE'
}