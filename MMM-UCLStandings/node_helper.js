const NodeHelper = require("node_helper");

const SAMPLE_STANDINGS = [
  { position: 1, name: "Real Madrid CF", points: 15 },
  { position: 2, name: "FC Bayern München", points: 12 },
  { position: 3, name: "Manchester City FC", points: 10 },
  { position: 4, name: "Paris Saint-Germain", points: 8 }
];

module.exports = NodeHelper.create({
  start() {
    this.config = {};
    this.pendingTimer = null;
  },

  stop() {
    this.clearPendingTimer();
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "UCL_CONFIG") {
      this.config = payload || {};
      this.sendSampleData();
    } else if (notification === "UCL_REQUEST") {
      this.sendSampleData();
    }
  },

  sendSampleData() {
    this.clearPendingTimer();

    this.pendingTimer = setTimeout(() => {
      const response = SAMPLE_STANDINGS.map((team) => ({
        ...team
      }));

      this.sendSocketNotification("UCL_DATA", response);
      this.pendingTimer = null;
    }, 500);
  },

  clearPendingTimer() {
    if (this.pendingTimer) {
      clearTimeout(this.pendingTimer);
      this.pendingTimer = null;
    }
  }
});
