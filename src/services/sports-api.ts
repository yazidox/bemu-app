import axios from "axios";

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  sport: "football" | "basketball" | "ufl";
  odds?: {
    home: number;
    draw?: number; // Optional as basketball doesn't have draws
    away: number;
  };
  scores?: {
    home: number;
    away: number;
    quarter?: number; // For basketball
    period?: number; // For UFL
  };
  status?: string;
  venue?: string;
}

export interface LeagueStats {
  leagueId: number;
  name: string;
  country: string;
  season: number;
  standings?: any[];
  sport: "football" | "basketball" | "ufl";
}

class SportsApiService {
  private footballApiKey: string;
  private basketballApiKey: string;
  private footballBaseUrl: string = "https://v3.football.api-sports.io";
  private basketballBaseUrl: string = "https://v1.basketball.api-sports.io";
  private uflBaseUrl: string = "https://v1.american-football.api-sports.io";

  constructor() {
    this.footballApiKey =
      process.env.NEXT_PUBLIC_API_FOOTBALL_KEY ||
      "7f5fb1cc88a4a4072ea3fba2af75411b";
    this.basketballApiKey =
      process.env.NEXT_PUBLIC_API_BASKETBALL_KEY ||
      "7f5fb1cc88a4a4072ea3fba2af75411b";
    if (!this.footballApiKey || !this.basketballApiKey) {
      console.warn(
        "API keys not found, using default keys which may have limited access",
      );
    }
  }

  private async makeRequest(
    endpoint: string,
    sport: "football" | "basketball" | "ufl",
  ) {
    const baseUrl =
      sport === "football"
        ? this.footballBaseUrl
        : sport === "basketball"
          ? this.basketballBaseUrl
          : this.uflBaseUrl;

    const apiKey =
      sport === "basketball" ? this.basketballApiKey : this.footballApiKey;

    try {
      const response = await axios.get(`${baseUrl}${endpoint}`, {
        headers: {
          "x-rapidapi-host": `${sport}.api-sports.io`,
          "x-rapidapi-key": apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error(`${sport.toUpperCase()} API Error:`, error);
      throw error;
    }
  }

  // Get matches for any sport
  async getTodayMatches(
    sport: "football" | "basketball" | "ufl" = "football",
  ): Promise<Match[]> {
    const today = new Date().toISOString().split("T")[0];
    const endpoint =
      sport === "basketball"
        ? `/games?date=${today}`
        : sport === "ufl"
          ? `/games?date=${today}&league=1` // UFL league ID
          : `/fixtures?date=${today}`;

    try {
      const data = await this.makeRequest(endpoint, sport);

      if (!data.response || data.response.length === 0) {
        console.warn(`No ${sport} matches found for today`);
        return [];
      }

      return data.response.map((match: any) => {
        if (sport === "basketball") {
          return {
            id: match.id,
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            league: match.league.name,
            startTime: match.date,
            sport: "basketball",
            status: match.status?.long || "Not Started",
            venue: match.arena?.name,
            scores: match.scores
              ? {
                  home: match.scores.home?.total,
                  away: match.scores.away?.total,
                  quarter: match.periods?.current,
                }
              : undefined,
            odds: match.odds?.bookmakers?.[0]?.bets?.[0]?.values,
          };
        } else if (sport === "ufl") {
          return {
            id: match.id,
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            league: "UFL",
            startTime: match.date,
            sport: "ufl",
            status: match.status?.long || "Not Started",
            venue: match.stadium,
            scores: match.scores
              ? {
                  home: match.scores?.home,
                  away: match.scores?.away,
                  period: match.periods?.current,
                }
              : undefined,
            odds: match.odds?.bookmakers?.[0]?.bets?.[0]?.values,
          };
        } else {
          return {
            id: match.fixture.id,
            homeTeam: match.teams.home.name,
            awayTeam: match.teams.away.name,
            league: match.league.name,
            startTime: match.fixture.date,
            sport: "football",
            status: match.fixture.status?.long || "Not Started",
            venue: match.fixture.venue?.name,
            scores: match.score
              ? {
                  home: match.score.fulltime?.home,
                  away: match.score.fulltime?.away,
                }
              : undefined,
            odds: match.odds?.[0]?.bookmakers?.[0]?.bets?.[0]?.values,
          };
        }
      });
    } catch (error) {
      console.error(`Error fetching ${sport} matches:`, error);
      return [];
    }
  }

  // Get odds for any sport
  async getMatchOdds(
    fixtureId: number,
    sport: "football" | "basketball" | "ufl" = "football",
  ) {
    const endpoint =
      sport === "basketball"
        ? `/odds/game/${fixtureId}`
        : sport === "ufl"
          ? `/odds/game/${fixtureId}`
          : `/odds/fixture/${fixtureId}`;

    try {
      const data = await this.makeRequest(endpoint, sport);
      return data.response[0]?.bookmakers?.[0]?.bets || [];
    } catch (error) {
      console.error(`Error fetching ${sport} odds:`, error);
      return [];
    }
  }

  // Get league statistics for any sport
  async getLeagueStats(
    leagueId: number,
    sport: "football" | "basketball" | "ufl" = "football",
  ): Promise<LeagueStats | null> {
    const endpoint =
      sport === "basketball"
        ? `/standings?league=${leagueId}`
        : sport === "ufl"
          ? `/standings?league=${leagueId}`
          : `/leagues/${leagueId}`;

    try {
      const data = await this.makeRequest(endpoint, sport);

      if (!data.response || data.response.length === 0) {
        console.warn(`No league stats found for ${sport} league ${leagueId}`);
        return null;
      }

      return {
        leagueId: data.response[0].league.id,
        name: data.response[0].league.name,
        country: data.response[0].country?.name || "USA",
        season: data.response[0].season || data.response[0].seasons[0].year,
        standings: data.response[0].standings || data.response[0].standings,
        sport,
      };
    } catch (error) {
      console.error(`Error fetching ${sport} league stats:`, error);
      return null;
    }
  }

  // Get team statistics
  async getTeamStats(
    teamId: number,
    leagueId: number,
    season: number,
    sport: "football" | "basketball" | "ufl" = "football",
  ) {
    const endpoint =
      sport === "basketball"
        ? `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`
        : sport === "ufl"
          ? `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`
          : `/teams/statistics?team=${teamId}&league=${leagueId}&season=${season}`;

    try {
      const data = await this.makeRequest(endpoint, sport);
      return data.response;
    } catch (error) {
      console.error(`Error fetching ${sport} team stats:`, error);
      return null;
    }
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

    try {
      const data = await this.makeRequest(endpoint, sport);
      return data.response;
    } catch (error) {
      console.error(`Error fetching ${sport} H2H stats:`, error);
      return [];
    }
  }

  // Get mock data for development when API is not available
  getMockMatches(
    sport: "football" | "basketball" | "ufl" = "football",
  ): Match[] {
    const mockFootballMatches: Match[] = [
      {
        id: 1001,
        homeTeam: "Manchester United",
        awayTeam: "Liverpool",
        league: "Premier League",
        startTime: new Date().toISOString(),
        sport: "football",
        status: "Not Started",
        venue: "Old Trafford",
        odds: { home: 2.5, draw: 3.2, away: 2.8 },
      },
      {
        id: 1002,
        homeTeam: "Real Madrid",
        awayTeam: "Barcelona",
        league: "La Liga",
        startTime: new Date().toISOString(),
        sport: "football",
        status: "Not Started",
        venue: "Santiago Bernabeu",
        odds: { home: 1.9, draw: 3.5, away: 3.8 },
      },
      {
        id: 1003,
        homeTeam: "Bayern Munich",
        awayTeam: "Borussia Dortmund",
        league: "Bundesliga",
        startTime: new Date().toISOString(),
        sport: "football",
        status: "Not Started",
        venue: "Allianz Arena",
        odds: { home: 1.7, draw: 3.8, away: 4.2 },
      },
    ];

    const mockBasketballMatches: Match[] = [
      {
        id: 2001,
        homeTeam: "LA Lakers",
        awayTeam: "Golden State Warriors",
        league: "NBA",
        startTime: new Date().toISOString(),
        sport: "basketball",
        status: "Not Started",
        venue: "Crypto.com Arena",
        odds: { home: 1.85, away: 1.95 },
      },
      {
        id: 2002,
        homeTeam: "Boston Celtics",
        awayTeam: "Miami Heat",
        league: "NBA",
        startTime: new Date().toISOString(),
        sport: "basketball",
        status: "Not Started",
        venue: "TD Garden",
        odds: { home: 1.65, away: 2.25 },
      },
      {
        id: 2003,
        homeTeam: "Brooklyn Nets",
        awayTeam: "Chicago Bulls",
        league: "NBA",
        startTime: new Date().toISOString(),
        sport: "basketball",
        status: "Not Started",
        venue: "Barclays Center",
        odds: { home: 1.9, away: 1.9 },
      },
    ];

    const mockUflMatches: Match[] = [
      {
        id: 3001,
        homeTeam: "Birmingham Stallions",
        awayTeam: "Michigan Panthers",
        league: "UFL",
        startTime: new Date().toISOString(),
        sport: "ufl",
        status: "Not Started",
        venue: "Protective Stadium",
        odds: { home: 1.75, away: 2.1 },
      },
      {
        id: 3002,
        homeTeam: "St. Louis Battlehawks",
        awayTeam: "D.C. Defenders",
        league: "UFL",
        startTime: new Date().toISOString(),
        sport: "ufl",
        status: "Not Started",
        venue: "The Dome",
        odds: { home: 1.95, away: 1.85 },
      },
    ];

    if (sport === "football") return mockFootballMatches;
    if (sport === "basketball") return mockBasketballMatches;
    return mockUflMatches;
  }
}

export const sportsApi = new SportsApiService();
