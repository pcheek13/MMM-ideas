const NodeHelper = require("node_helper");
const fetch = require("node-fetch");
const { HttpsProxyAgent } = require("https-proxy-agent");

const DEFAULT_URL =
  "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/uefa.cl.json";

module.exports = NodeHelper.create({
  start() {
    this.config = {};
    this.proxyAgent = null;
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "UCL_CONFIG") {
      this.config = payload || {};
      this.configureProxy();
      this.getStandings();
    } else if (notification === "UCL_GET_STANDINGS") {
      this.getStandings();
    }
  },

  configureProxy() {
    const proxyUrl =
      this.config.proxy ||
      process.env.HTTPS_PROXY ||
      process.env.https_proxy ||
      process.env.HTTP_PROXY ||
      process.env.http_proxy;

    if (proxyUrl) {
      try {
        this.proxyAgent = new HttpsProxyAgent(proxyUrl);
      } catch (error) {
        console.error(`MMM-UCLStandings: proxy configuration failed - ${error.message}`);
        this.proxyAgent = null;
      }
    } else {
      this.proxyAgent = null;
    }
  },

  async getStandings() {
    const url = this.config.dataUrl || DEFAULT_URL;

    try {
      const options = {
        headers: {
          "User-Agent": "MMM-UCLStandings/1.0 (+https://github.com/)",
          Accept: "application/json"
        },
        timeout: (this.config.fetchTimeout || 10) * 1000
      };

      if (this.proxyAgent) {
        options.agent = this.proxyAgent;
      }

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      const standings = this.computeStandings(data);

      this.sendSocketNotification("UCL_STANDINGS", standings);
    } catch (error) {
      console.error(`MMM-UCLStandings: ${error.message}`);
      this.sendSocketNotification("UCL_ERROR", { message: error.message });
    }
  },

  computeStandings(data) {
    if (!data || !Array.isArray(data.matches)) {
      return [];
    }

    const table = new Map();

    const ensureTeam = (name) => {
      if (!table.has(name)) {
        table.set(name, {
          name,
          played: 0,
          wins: 0,
          draws: 0,
          losses: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0
        });
      }
      return table.get(name);
    };

    data.matches.forEach((match) => {
      const score = match && match.score && match.score.ft;
      if (!score || score.length !== 2) {
        return;
      }

      const homeGoals = Number(score[0]);
      const awayGoals = Number(score[1]);

      if (!Number.isFinite(homeGoals) || !Number.isFinite(awayGoals)) {
        return;
      }

      const homeTeam = ensureTeam(match.team1);
      const awayTeam = ensureTeam(match.team2);

      homeTeam.played += 1;
      awayTeam.played += 1;

      homeTeam.goalsFor += homeGoals;
      homeTeam.goalsAgainst += awayGoals;
      awayTeam.goalsFor += awayGoals;
      awayTeam.goalsAgainst += homeGoals;

      if (homeGoals > awayGoals) {
        homeTeam.wins += 1;
        homeTeam.points += 3;
        awayTeam.losses += 1;
      } else if (homeGoals < awayGoals) {
        awayTeam.wins += 1;
        awayTeam.points += 3;
        homeTeam.losses += 1;
      } else {
        homeTeam.draws += 1;
        awayTeam.draws += 1;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }
    });

    return Array.from(table.values())
      .map((team) => ({
        ...team,
        goalDifference: team.goalsFor - team.goalsAgainst
      }))
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }
        if (b.goalDifference !== a.goalDifference) {
          return b.goalDifference - a.goalDifference;
        }
        if (b.goalsFor !== a.goalsFor) {
          return b.goalsFor - a.goalsFor;
        }
        return a.name.localeCompare(b.name);
      });
  }
});
