import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  weathercode: number;
  is_day: number;
}

function getGradient(hour: number, weather?: WeatherData): [string, string] {
  const code = weather?.weathercode ?? -1;
  const isDay = weather?.is_day ?? (hour >= 6 && hour < 18 ? 1 : 0);

  // Night 22h-5h
  if (hour >= 22 || hour < 5) {
    if (code >= 51 && code <= 67) return ["#0A0A0A", "#1A1A2E"];
    if (code >= 2 && code <= 3) return ["#1C1C1C", "#2C3E50"];
    return ["#1A1A2E", "#16213E"];
  }

  // Morning 5h-12h
  if (hour >= 5 && hour < 12) {
    if (code >= 51 && code <= 67) return ["#555555", "#1A1A2E"];
    if (code >= 2 && code <= 3) return ["#FF6B00", "#8B9DC3"];
    if (code >= 0 && code <= 1) return ["#FF8C00", "#FFB347"];
    return ["#FF8C00", "#FFB347"];
  }

  // Afternoon 12h-18h
  if (hour >= 12 && hour < 18) {
    if (code >= 95 && code <= 99) return ["#333333", "#1A1A1A"];
    if (code >= 51 && code <= 67) return ["#555555", "#1A1A2E"];
    if (code >= 2 && code <= 3) return ["#FF6B00", "#708090"];
    if (code >= 0 && code <= 1) return ["#FF6B00", "#E65C00"];
    return ["#FF6B00", "#E65C00"];
  }

  // Evening 18h-22h
  return ["#E65C00", "#C0392B"];
}

function isDarkGradient(colors: [string, string]): boolean {
  const dark = ["#0A0A0A", "#1A1A2E", "#1C1C1C", "#2C3E50", "#16213E", "#333333", "#1A1A1A", "#555555"];
  return dark.includes(colors[0]) || dark.includes(colors[1]);
}

export function useWeatherGradient() {
  const [gradient, setGradient] = useState<[string, string]>(() => getGradient(new Date().getHours()));
  const [isDark, setIsDark] = useState(() => isDarkGradient(getGradient(new Date().getHours())));

  useEffect(() => {
    let mounted = true;

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=6.3654&longitude=2.4183&current=temperature_2m,weathercode,is_day&timezone=Africa%2FPorto-Novo"
        );
        const data = await res.json();
        if (!mounted) return;
        const weather: WeatherData = {
          temperature: data.current.temperature_2m,
          weathercode: data.current.weathercode,
          is_day: data.current.is_day,
        };
        const hour = new Date().getHours();
        const g = getGradient(hour, weather);
        setGradient(g);
        setIsDark(isDarkGradient(g));
      } catch {
        // Fallback: use hour only
        const hour = new Date().getHours();
        const g = getGradient(hour);
        if (mounted) {
          setGradient(g);
          setIsDark(isDarkGradient(g));
        }
      }
    };

    fetchWeather();
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return { gradient, isDark, cssGradient: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` };
}
