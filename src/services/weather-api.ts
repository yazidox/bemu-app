import axios from "axios";

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
  precipitation: number;
}

class WeatherApiService {
  private apiKey: string;
  private baseUrl: string = "https://api.weatherapi.com/v1";

  constructor() {
    this.apiKey =
      process.env.NEXT_PUBLIC_WEATHER_API_KEY ||
      "1d0031473f8b4d7e9b4120807232207";
    if (!this.apiKey) {
      console.warn(
        "Weather API key not found, using default key which may have limited access",
      );
    }
  }

  async getWeatherByLocation(location: string): Promise<WeatherData | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/current.json`, {
        params: {
          key: this.apiKey,
          q: location,
          aqi: "no",
        },
      });

      const data = response.data;
      return {
        location: `${data.location.name}, ${data.location.country}`,
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        windSpeed: data.current.wind_kph,
        icon: data.current.condition.icon,
        feelsLike: data.current.feelslike_c,
        precipitation: data.current.precip_mm,
      };
    } catch (error) {
      console.error("Error fetching weather data:", error);
      return null;
    }
  }

  async getWeatherForecast(location: string, days: number = 3): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast.json`, {
        params: {
          key: this.apiKey,
          q: location,
          days: days,
          aqi: "no",
          alerts: "no",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      return null;
    }
  }

  // Get mock weather data for development
  getMockWeatherData(location: string = "London"): WeatherData {
    return {
      location: `${location}, United Kingdom`,
      temperature: 18,
      condition: "Partly cloudy",
      humidity: 65,
      windSpeed: 12,
      icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
      feelsLike: 17,
      precipitation: 0.2,
    };
  }
}

export const weatherApi = new WeatherApiService();
