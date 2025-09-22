/* MagicMirror² Module: MMM-UCLStandings
 * Fetches and displays the latest UEFA Champions League league standings.
 *
 * By OpenAI's ChatGPT
 * MIT Licensed.
 */

Module.register("MMM-UCLStandings", {
  defaults: {
    updateInterval: 6 * 60 * 60 * 1000, // 6 hours
    animationSpeed: 1000,
    maxTeams: 12,
    showCountry: false,
    dataUrl:
      "https://raw.githubusercontent.com/openfootball/football.json/master/2024-25/uefa.cl.json"
  },

  requiresVersion: "2.1.0",

  start() {
    this.standings = [];
    this.loaded = false;
    this.error = null;
    this.updateTimer = null;

    this.sendSocketNotification("UCL_CONFIG", this.config);
    this.scheduleUpdate(0);
  },

  stop() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
  },

  getTranslations() {
    return {
      en: "translations/en.json"
    };
  },

  getStyles() {
    return ["MMM-UCLStandings.css"];
  },

  scheduleUpdate(delay) {
    const nextLoad = typeof delay === "number" ? delay : this.config.updateInterval;

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(() => {
      this.sendSocketNotification("UCL_GET_STANDINGS");
    }, Math.max(nextLoad, 0));
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "UCL_STANDINGS") {
      this.error = null;
      this.standings = Array.isArray(payload) ? payload : [];
      this.loaded = true;
      this.updateDom(this.config.animationSpeed);
      this.scheduleUpdate();
    } else if (notification === "UCL_ERROR") {
      this.error = payload || { message: "Unknown error" };
      this.standings = [];
      this.loaded = true;
      this.updateDom(this.config.animationSpeed);
      this.scheduleUpdate();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "ucl-standings-wrapper";

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.classList.add("dimmed", "light", "small");
      return wrapper;
    }

    if (this.error) {
      wrapper.innerHTML = `${this.translate("ERROR")}: ${this.error.message || this.error}`;
      wrapper.classList.add("bright", "small", "ucl-error");
      return wrapper;
    }

    if (!this.standings.length) {
      wrapper.innerHTML = this.translate("NO_DATA");
      wrapper.classList.add("dimmed", "light", "small");
      return wrapper;
    }

    const table = document.createElement("table");
    table.className = "small ucl-standings";

    table.appendChild(this.createTableHeader());
    table.appendChild(this.createTableBody());

    wrapper.appendChild(table);
    return wrapper;
  },

  createTableHeader() {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    const headers = [
      "#",
      this.translate("TEAM"),
      this.translate("MP"),
      this.translate("W"),
      this.translate("D"),
      this.translate("L"),
      this.translate("GF"),
      this.translate("GA"),
      this.translate("GD"),
      this.translate("PTS")
    ];

    headers.forEach((label) => {
      const th = document.createElement("th");
      th.innerHTML = label;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
  },

  createTableBody() {
    const tbody = document.createElement("tbody");

    const maxTeams =
      typeof this.config.maxTeams === "number" && this.config.maxTeams > 0
        ? Math.min(this.config.maxTeams, this.standings.length)
        : this.standings.length;

    for (let i = 0; i < maxTeams; i += 1) {
      const team = this.standings[i];
      const row = document.createElement("tr");

      const columns = [
        i + 1,
        this.formatTeamName(team.name),
        team.played,
        team.wins,
        team.draws,
        team.losses,
        team.goalsFor,
        team.goalsAgainst,
        team.goalDifference,
        team.points
      ];

      columns.forEach((value, index) => {
        const cell = document.createElement("td");
        cell.innerHTML = value;
        if (index === 1) {
          cell.classList.add("ucl-team-name");
        } else {
          cell.classList.add("ucl-number");
        }
        row.appendChild(cell);
      });

      tbody.appendChild(row);
    }

    return tbody;
  },

  formatTeamName(name) {
    if (this.config.showCountry || typeof name !== "string") {
      return name;
    }

    const countryIndex = name.lastIndexOf(" (");
    if (countryIndex > 0 && name.endsWith(")")) {
      return name.substring(0, countryIndex);
    }

    return name;
  }
});
