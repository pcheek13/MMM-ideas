/* MagicMirror² Module: MMM-UCLStandings
 * Simple scaffold for displaying UEFA Champions League standings.
 *
 * By OpenAI's ChatGPT
 * MIT Licensed.
 */

const NOTIFICATIONS = {
  CONFIG: "UCL_CONFIG",
  REQUEST: "UCL_REQUEST",
  DATA: "UCL_DATA",
  ERROR: "UCL_ERROR"
};

Module.register("MMM-UCLStandings", {
  defaults: {
    updateInterval: 60 * 60 * 1000, // 1 hour
    animationSpeed: 1000
  },

  requiresVersion: "2.1.0",

  start() {
    this.loaded = false;
    this.error = null;
    this.standings = [];
    this.updateTimer = null;

    this.sendSocketNotification(NOTIFICATIONS.CONFIG, this.config);
    this.scheduleUpdate(0);
  },

  stop() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
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

  getHeader() {
    return this.data.header || "UEFA Champions League";
  },

  scheduleUpdate(delay) {
    const nextLoad = typeof delay === "number" ? delay : this.config.updateInterval;

    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }

    this.updateTimer = setTimeout(() => {
      this.sendSocketNotification(NOTIFICATIONS.REQUEST);
    }, Math.max(nextLoad, 0));
  },

  socketNotificationReceived(notification, payload) {
    if (notification === NOTIFICATIONS.DATA) {
      this.loaded = true;
      this.error = null;
      this.standings = Array.isArray(payload) ? payload : [];
      this.updateDom(this.config.animationSpeed);
      this.scheduleUpdate();
    } else if (notification === NOTIFICATIONS.ERROR) {
      this.loaded = true;
      this.error = payload;
      this.standings = [];
      this.updateDom(this.config.animationSpeed);
      this.scheduleUpdate();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "ucl-standings-wrapper";

    if (!this.loaded) {
      wrapper.classList.add("dimmed", "light", "small");
      wrapper.innerHTML = this.translate("LOADING");
      return wrapper;
    }

    if (this.error) {
      wrapper.classList.add("ucl-error", "small");
      wrapper.innerHTML = `${this.translate("ERROR")}: ${this.formatError(this.error)}`;
      return wrapper;
    }

    if (!this.standings.length) {
      wrapper.classList.add("dimmed", "light", "small");
      wrapper.innerHTML = this.translate("NO_DATA");
      return wrapper;
    }

    const list = document.createElement("ul");
    list.className = "ucl-table";

    this.standings.forEach((team, index) => {
      const row = document.createElement("li");
      row.className = "ucl-row";

      const position = document.createElement("span");
      position.className = "ucl-position";
      position.textContent = typeof team.position === "number" ? team.position : index + 1;

      const name = document.createElement("span");
      name.className = "ucl-team";
      name.textContent = team.name || this.translate("UNKNOWN_TEAM");

      const points = document.createElement("span");
      points.className = "ucl-points";
      points.textContent = this.formatNumber(team.points);

      row.appendChild(position);
      row.appendChild(name);
      row.appendChild(points);
      list.appendChild(row);
    });

    wrapper.appendChild(list);
    return wrapper;
  },

  formatError(error) {
    if (!error) {
      return this.translate("UNKNOWN_ERROR");
    }

    if (typeof error === "string") {
      return error;
    }

    if (typeof error.message === "string") {
      return error.message;
    }

    return JSON.stringify(error);
  },

  formatNumber(value) {
    if (typeof value === "number") {
      return value.toString();
    }

    if (value === null || value === undefined) {
      return "--";
    }

    return value;
  }
});
