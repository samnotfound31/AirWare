import { GoogleGenAI } from "@google/genai";
import { DashboardData, UserProfile } from "../types";

const SYSTEM_INSTRUCTION = `
You are the Personal AQI Tracker, an AI-powered assistant dedicated to monitoring, analyzing, predicting, and advising on Air Quality Index (AQI).
Your focus is raising awareness about hazardous levels in India and their links to climate change.
You function as a coordinated multi-agent system (Data, Analysis, Advisory, Simulation, Memory).

**Goals:**
1. Raise awareness of AQI hazards (India focus).
2. Provide tailored preventive recommendations based on user habits and health.
3. Track exposure and predict trends using climate data.
4. Run "what-if" simulations.

**Response Rules:**
- Be scientific but accessible.
- Emphasize climate change links (e.g., heatwaves -> ozone).
- Use metric units.
- Focus on Indian context (seasonal stubble burning, Diwali, monsoon effects).
`;

class GeminiService {
  async getDashboardData(profile: UserProfile): Promise<DashboardData> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    Generate a realistic dashboard status for location: ${profile.city}.
    User Profile: Sensitivity: ${profile.sensitivity}, Health: ${profile.healthConditions.join(", ")}, Commute: ${profile.commuteMode}.
    
    Fetch real-time AQI and weather data for the location using Google Search.
    Then, estimate a 24h forecast curve based on trends.
    Provide actionable advice specific to this user.
    Include a climate insight relevant to the current season in India.

    **IMPORTANT**: You must return a strictly valid JSON object. Do not wrap it in markdown code blocks.
    The JSON must match this structure:
    {
      "current": {
        "aqi": number,
        "pm25": number,
        "pm10": number,
        "temp": number,
        "humidity": number,
        "condition": string, // e.g. "Haze", "Clear"
        "location": string,
        "timestamp": string // ISO format
      },
      "forecast": [
        { "time": string, "aqi": number } // array of forecast points
      ],
      "healthRisk": string,
      "advisory": [string], // array of strings
      "climateInsight": string
    }
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          // Removed responseMimeType and responseSchema to allow tool use
          tools: [{ googleSearch: {} }]
        },
      });

      let jsonString = response.text || "{}";
      
      // Clean up markdown code blocks if present (e.g. ```json ... ```)
      jsonString = jsonString.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
      
      return JSON.parse(jsonString) as DashboardData;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async runSimulationChat(query: string, profile: UserProfile, history: {role: string, parts: {text: string}[]}[]): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const userContext = `User Context: ${profile.city}, ${profile.sensitivity} sensitivity.`;
    
    try {
      // We use a chat session here for continuity if we expanded, but simple generateContent works for single turn simulation
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${userContext}\nUser Query: ${query}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
           // No JSON schema here, we want natural language + potential markdown for the chat
           tools: [{ googleSearch: {} }] 
        }
      });

      return response.text || "I couldn't generate a simulation result at this time.";
    } catch (error) {
      console.error("Simulation Error:", error);
      return "An error occurred while running the simulation. Please try again.";
    }
  }
}

export const geminiService = new GeminiService();