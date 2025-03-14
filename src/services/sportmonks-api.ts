import axios from "axios";

export interface SportmonksMatch {
  id: number;
  name: string;
  starting_at: string;
  result_info?: string;
  league_id: number;
  sport_id: number;
  has_odds: boolean;
}

export interface LeagueStats {
  leagueId: number;
  name: string;
  country: string;
  season: number;
  standings?: any[];
  sport: "football" | "basketball" | "ufl";
}

export interface MatchPrediction {
  id: number;
  fixture_id: number;
  predictions: any; // We'll keep this as any since predictions vary by type_id
  type_id: number;
}

export interface PredictionResponse {
  data: MatchPrediction[];
  pagination: {
    count: number;
    per_page: number;
    current_page: number;
    next_page: string;
    has_more: boolean;
  };
}

class SportmonksApiService {
  private apiToken: string;
  private footballApiKey: string;
  private basketballApiKey: string;
  private baseUrl: string = "https://api.sportmonks.com/v3";
  private basketballBaseUrl: string = "https://v1.basketball.api-sports.io";
  private uflBaseUrl: string = "https://v1.american-football.api-sports.io";

  constructor() {
    this.apiToken =
      "bszKEZ80NEuUd5p99TG74i5PmFqujz24bw02nxRw4dIFNOxUncKFN8QPxDGi";
    this.footballApiKey =
      process.env.NEXT_PUBLIC_API_FOOTBALL_KEY ||
      "7f5fb1cc88a4a4072ea3fba2af75411b";
    this.basketballApiKey =
      process.env.NEXT_PUBLIC_API_BASKETBALL_KEY ||
      "7f5fb1cc88a4a4072ea3fba2af75411b";
    if (!this.apiToken || !this.footballApiKey || !this.basketballApiKey) {
      console.warn(
        "API keys not found, using default keys which may have limited access",
      );
    }
  }

  // Public method to make API requests
  public async makeRequest(
    endpoint: string,
    sport: "football" | "basketball" | "ufl",
  ) {
    const baseUrl =
      sport === "basketball"
        ? this.basketballBaseUrl
        : sport === "ufl"
          ? this.uflBaseUrl
          : this.baseUrl;
    const apiKey =
      sport === "basketball" ? this.basketballApiKey : this.apiToken;

    try {
      const headers =
        sport === "football"
          ? { params: { api_token: apiKey } }
          : { headers: { "x-apisports-key": apiKey } };
      const response = await axios.get(`${baseUrl}${endpoint}`, headers);
      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Get today's matches
  async getTodayMatches(): Promise<SportmonksMatch[]> {
    const today = new Date();
    let matches;

    // Try to get today's matches first
    try {
      const todayStr = today.toISOString().split("T")[0];
      const endpoint = `/football/fixtures/date/${todayStr}`;
      const data = await this.makeRequest(endpoint, "football");

      // Filter out matches that have results
      matches = data.data.filter((match: any) => match.result_info === null);

      // If there's only 1 match today or no matches, check tomorrow's matches
      if (matches.length <= 1) {
        console.log(
          "Only one or no matches available for today, checking tomorrow's matches...",
        );
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split("T")[0];
        const tomorrowEndpoint = `/football/fixtures/date/${tomorrowStr}`;

        const tomorrowData = await this.makeRequest(
          tomorrowEndpoint,
          "football",
        );
        const tomorrowMatches = tomorrowData.data.filter(
          (match: any) => match.result_info === null,
        );

        // If we have matches tomorrow, use those instead
        if (tomorrowMatches.length > 0) {
          matches = tomorrowMatches;
        }
      }
    } catch (error) {
      console.error("Error fetching today's matches:", error);
      matches = [];
    }

    // If still no matches available, try tomorrow's matches as a fallback
    if (matches.length === 0) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split("T")[0];
      const endpoint = `/football/fixtures/date/${tomorrowStr}`;

      try {
        const data = await this.makeRequest(endpoint, "football");
        matches = data.data.filter((match: any) => match.result_info === null);
      } catch (error) {
        console.error("Error fetching tomorrow's matches:", error);
        return this.getMockMatches(); // Return mock data if API fails
      }

      if (matches.length === 0) {
        return this.getMockMatches(); // Return mock data if no matches found
      }
    }

    return matches.map((match: any) => ({
      id: match.id,
      name: match.name,
      starting_at: match.starting_at,
      result_info: match.result_info,
      league_id: match.league_id,
      sport_id: match.sport_id,
      has_odds: match.has_odds,
    }));
  }

  // Get match odds
  async getMatchOdds(fixtureId: number) {
    const endpoint = `/football/odds/fixture/${fixtureId}`;
    return await this.makeRequest(endpoint, "football");
  }

  // Get league statistics for any sport
  async getLeagueStats(
    leagueId: number,
    sport: "football" | "basketball" | "ufl" = "football",
  ): Promise<LeagueStats> {
    const endpoint =
      sport === "basketball"
        ? `/standings?league=${leagueId}`
        : sport === "ufl"
          ? `/standings?league=${leagueId}`
          : `/leagues/${leagueId}`;

    const data = await this.makeRequest(endpoint, sport);
    return {
      leagueId: data.response[0].league.id,
      name: data.response[0].league.name,
      country: data.response[0].country?.name || "USA",
      season: data.response[0].season || data.response[0].seasons[0].year,
      standings: data.response[0].standings || data.response[0].standings,
      sport,
    };
  }

  // Get team statistics
  async getTeamStats(
    teamId: number,
    sport: "football" | "basketball" | "ufl" = "football",
  ) {
    const endpoint = `/teams/statistics?team=${teamId}`;
    return await this.makeRequest(endpoint, sport);
  }

  // Get head-to-head statistics
  async getH2H(
    team1Id: number,
    team2Id: number,
    sport: "football" | "basketball" | "ufl" = "football",
  ) {
    const endpoint =
      sport === "basketball"
        ? `/games/h2h?h2h=${team1Id}-${team2Id}`
        : sport === "ufl"
          ? `/games/h2h?h2h=${team1Id}-${team2Id}`
          : `/fixtures/headtohead?h2h=${team1Id}-${team2Id}`;

    return await this.makeRequest(endpoint, sport);
  }

  // Get match predictions
  async getMatchPredictions(fixtureId: number): Promise<PredictionResponse> {
    const endpoint = `/football/predictions/probabilities/fixtures/${fixtureId}`;
    return await this.makeRequest(endpoint, "football");
  }

  // Get NBA match data including weather and analysis
  async getNBAMatchData(date: string) {
    const endpoint = `/games?date=${date}`;
    try {
      const data = await this.makeRequest(endpoint, "basketball");
      // Assuming the API provides weather and other analysis data
      return data.response.map((match: any) => ({
        id: match.id,
        name: `${match.teams.home.name} vs ${match.teams.away.name}`,
        starting_at: match.date,
        weather: match.weather || null, // Example field
        analysis: match.analysis || null, // Example field
      }));
    } catch (error) {
      console.error("Error fetching NBA match data:", error);
      return [];
    }
  }

  // Get mock data for development when API is not available
  getMockMatches(): SportmonksMatch[] {
    return [
      {
        id: 1001,
        name: "Manchester United vs Liverpool",
        starting_at: new Date().toISOString(),
        league_id: 8,
        sport_id: 1,
        has_odds: true,
      },
      {
        id: 1002,
        name: "Real Madrid vs Barcelona",
        starting_at: new Date().toISOString(),
        league_id: 564,
        sport_id: 1,
        has_odds: true,
      },
      {
        id: 1003,
        name: "Bayern Munich vs Borussia Dortmund",
        starting_at: new Date().toISOString(),
        league_id: 82,
        sport_id: 1,
        has_odds: true,
      },
    ];
  }
}

export const sportmonksApi = new SportmonksApiService();
