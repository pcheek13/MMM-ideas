/* global Module */

Module.register("MMM-ideas", {
  defaults: {
    header: "Idea Spark",
    animationSpeed: 1000,
    updateInterval: 5 * 60 * 1000,
    randomize: false,
    showSource: true,
    ideas: [
      { text: "Take a 10 minute walk to reset your focus.", source: "Wellness" },
      { text: "Sketch the high-level flow of a project you're planning.", source: "Planning" },
      { text: "Write down three things you learned today.", source: "Reflection" },
      { text: "Reach out to a teammate to discuss a new collaboration idea.", source: "Teamwork" }
    ]
  },

  start() {
    this.currentIndex = 0;
    this.currentIdea = this.config.ideas.length ? this.normalizeIdea(this.config.ideas[0]) : null;
    this.updateTimer = null;
    this.scheduleUpdates();
  },

  getStyles() {
    return [this.file("MMM-ideas.css")];
  },

  getTranslations() {
    return {
      en: "translations/en.json"
    };
  },

  normalizeIdea(idea) {
    if (typeof idea === "string") {
      return { text: idea };
    }

    if (idea && typeof idea === "object" && Object.prototype.hasOwnProperty.call(idea, "text")) {
      return {
        text: String(idea.text),
        source: idea.source ? String(idea.source) : null
      };
    }

    return null;
  },

  scheduleUpdates() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
    }

    if (this.config.ideas.length <= 1) {
      return;
    }

    this.updateTimer = setInterval(() => {
      this.currentIndex = this.getNextIndex();
      this.currentIdea = this.normalizeIdea(this.config.ideas[this.currentIndex]);
      this.updateDom(this.config.animationSpeed);
    }, Math.max(this.config.updateInterval, 10 * 1000));
  },

  getNextIndex() {
    if (!this.config.randomize) {
      return (this.currentIndex + 1) % this.config.ideas.length;
    }

    if (this.config.ideas.length === 1) {
      return 0;
    }

    let next = this.currentIndex;
    while (next === this.currentIndex) {
      next = Math.floor(Math.random() * this.config.ideas.length);
    }

    return next;
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "mmm-ideas";

    if (!this.currentIdea) {
      wrapper.classList.add("empty");
      wrapper.textContent = this.translate("NO_IDEAS");
      return wrapper;
    }

    const ideaText = document.createElement("div");
    ideaText.className = "idea";
    ideaText.textContent = this.currentIdea.text;
    wrapper.appendChild(ideaText);

    if (this.config.showSource && this.currentIdea.source) {
      const ideaSource = document.createElement("div");
      ideaSource.className = "source";
      ideaSource.textContent = this.currentIdea.source;
      wrapper.appendChild(ideaSource);
    }

    return wrapper;
  },

  suspend() {
    if (this.updateTimer) {
      clearInterval(this.updateTimer);
      this.updateTimer = null;
    }
  },

  resume() {
    if (!this.updateTimer && this.config.ideas.length > 1) {
      this.scheduleUpdates();
    }
  }
});
