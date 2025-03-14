"use client";

import { Cloud, Thermometer, Wind, Droplets } from "lucide-react";

interface MatchWeatherProps {
  location: string;
  matchTime: string;
}

export default function MatchWeather({
  location,
  matchTime,
}: MatchWeatherProps) {
  // Static weather data for all matches
  const staticWeather = {
    location: "Match Location",
    temperature: 22,
    condition: "Partly Cloudy",
    humidity: 65,
    windSpeed: 8,
    icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
    feelsLike: 21,
    precipitation: 0.1,
  };

  return (
    <div className="p-3 bg-gray-800/30 rounded-md border border-cyan-900/30 hover:border-cyan-700/50 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Cloud className="h-4 w-4 text-cyan-400 mr-2" />
        </div>
        <img
          src={`https:${staticWeather.icon}`}
          alt={staticWeather.condition}
          className="h-8 w-8"
        />
      </div>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center">
          <Thermometer className="h-3 w-3 text-cyan-400 mb-1" />
          <span className="text-xs font-mono">
            {staticWeather.temperature}°C
          </span>
          <span className="text-[10px] text-gray-400">
            Feels {staticWeather.feelsLike}°C
          </span>
        </div>

        <div className="flex flex-col items-center">
          <Wind className="h-3 w-3 text-cyan-400 mb-1" />
          <span className="text-xs font-mono">
            {staticWeather.windSpeed} km/h
          </span>
          <span className="text-[10px] text-gray-400">Wind</span>
        </div>

        <div className="flex flex-col items-center">
          <Droplets className="h-3 w-3 text-cyan-400 mb-1" />
          <span className="text-xs font-mono">{staticWeather.humidity}%</span>
          <span className="text-[10px] text-gray-400">Humidity</span>
        </div>
      </div>

      <div className="mt-2 text-center">
        <span className="text-xs font-mono text-cyan-300">
          {staticWeather.condition}
        </span>
      </div>

      <div className="mt-1 text-center">
        <span className="text-[10px] text-gray-400">
          Match time:{" "}
          {new Date(matchTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
