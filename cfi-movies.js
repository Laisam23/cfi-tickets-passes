document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  const FESTIVAL_DAYS = ["2026-09-25", "2026-09-26", "2026-09-27"];

  const el = {
    toggleSearchBtn: document.getElementById("toggleSearchBtn"),
    searchRow: document.getElementById("searchRow"),
    searchInput: document.getElementById("searchInput"),
    dayPills: document.getElementById("dayPills"),
    genreSelect: document.getElementById("genreSelect"),
    durationSelect: document.getElementById("durationSelect"),
    resetBtn: document.getElementById("resetBtn"),
    filmGrid: document.getElementById("filmGrid"),
    resultCount: document.getElementById("resultCount"),
    emptyState: document.getElementById("emptyState"),
    modal: document.getElementById("filmModal"),
    modalClose: document.getElementById("modalClose"),
    modalTitle: document.getElementById("modalTitle"),
    modalMeta: document.getElementById("modalMeta"),
    modalSynopsis: document.getElementById("modalSynopsis"),
    modalDirector: document.getElementById("modalDirector"),
    modalWriters: document.getElementById("modalWriters"),
    modalCast: document.getElementById("modalCast"),
    modalGenre: document.getElementById("modalGenre"),
    modalScreening: document.getElementById("modalScreening"),
    modalTicket: document.getElementById("modalTicket"),
    modalPoster: document.getElementById("modalPoster")
  };

  const required = [
    "toggleSearchBtn",
    "searchRow",
    "searchInput",
    "dayPills",
    "genreSelect",
    "durationSelect",
    "resetBtn",
    "filmGrid",
    "resultCount",
    "emptyState"
  ];

  for (const key of required) {
    if (!el[key]) {
      console.error(`Missing HTML element: #${key}`);
      return;
    }
  }

  if (!Array.isArray(films) || films.length === 0) {
    console.error("films array missing or empty");
    return;
  }

  const state = {
    query: "",
    day: "",
    genre: "",
    duration: ""
  };

  function clearNode(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function makeEl(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function getScreening(film) {
    return film.screening || { datetime: "", venue: "", ticketUrl: "" };
  }

  function toDayKey(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function getDurationBand(mins) {
    if (mins < 90) return "lt90";
    if (mins <= 120) return "90to120";
    return "gt120";
  }

  function formatDayPill(dayKey) {
    const d = new Date(`${dayKey}T00:00:00`);
    return {
      weekday: new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d).toUpperCase(),
      day: new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d),
      month: new Intl.DateTimeFormat("en-GB", { month: "short" }).format(d).toUpperCase()
    };
  }

  function formatBadgeDateTime(iso) {
    const d = new Date(iso);
    const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(d).toUpperCase();
    const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d);
    const time = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(d);

    return `${weekday} ${day}, ${time}`;
  }

  function hashHue(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = (h * 31 + str.charCodeAt(i)) >>> 0;
    }
    return h % 360;
  }

  function getPosterUrl(film) {
    return film.poster || film.posterUrl || "";
  }

  function matchesFilters(film) {
    const s = getScreening(film);

    const blob = [
      film.title,
      film.director,
      (film.writers || []).join(" "),
      (film.cast || []).join(" "),
      film.country,
      film.language,
      s.venue
    ].join(" ").toLowerCase();

    if (state.query && !blob.includes(state.query.toLowerCase())) return false;
    if (state.day && toDayKey(s.datetime) !== state.day) return false;
    if (state.genre && !(film.genres || []).includes(state.genre)) return false;
    if (state.duration && getDurationBand(film.durationMin) !== state.duration) return false;

    return true;
  }

  function sortFilms(list) {
    return [...list].sort((a, b) => {
      const aTime = new Date(getScreening(a).datetime).getTime();
      const bTime = new Date(getScreening(b).datetime).getTime();
      return aTime - bTime || a.title.localeCompare(b.title);
    });
  }

  function buildGenreOptions() {
    const genres = new Set();

    for (const film of films) {
      for (const genre of (film.genres || [])) {
        genres.add(genre);
      }
    }

    [...genres]
      .sort((a, b) => a.localeCompare(b))
      .forEach((genre) => {
        const opt = document.createElement("option");
        opt.value = genre;
        opt.textContent = genre;
        el.genreSelect.appendChild(opt);
      });
  }

  function buildDayPills() {
    clearNode(el.dayPills);

    for (const dayKey of FESTIVAL_DAYS) {
      const parts = formatDayPill(dayKey);
      const btn = makeEl("button", "day-pill");
      btn.type = "button";
      btn.dataset.day = dayKey;

      btn.appendChild(makeEl("span", "day-pill__top", parts.weekday));
      btn.appendChild(makeEl("span", "day-pill__mid", parts.day));
      btn.appendChild(makeEl("span", "day-pill__bot", parts.month));

      btn.addEventListener("click", () => {
        state.day = state.day === dayKey ? "" : dayKey;
        syncDayPills();
        render();
      });

      el.dayPills.appendChild(btn);
    }
  }

  function syncDayPills() {
    const buttons = el.dayPills.querySelectorAll(".day-pill");
    buttons.forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.day === state.day);
    });
  }

  function createCard(film) {
    const screening = getScreening(film);
    const hue = hashHue(film.id + film.title);
    const posterUrl = getPosterUrl(film);

    const card = makeEl("button", "film-card");
    card.type = "button";

    const inner = makeEl("div", "film-card__inner");
    const content = makeEl("div", "film-card__content");

    const venue = makeEl("div", "film-card__venue");
    venue.appendChild(makeEl("span", "film-card__pin"));
    venue.appendChild(makeEl("span", "", screening.venue || "Venue"));

    const title = makeEl("h3", "film-card__title", film.title);
    const time = makeEl("div", "film-card__time", formatBadgeDateTime(screening.datetime));
    const synopsis = makeEl("p", "film-card__synopsis", film.synopsisShort || "—");

    const footer = makeEl("div", "film-card__footer");
    footer.appendChild(makeEl("span", "", film.country || "—"));
    footer.appendChild(makeEl("span", "film-card__dot", "•"));
    footer.appendChild(makeEl("span", "", `${film.durationMin} min`));
    footer.appendChild(makeEl("span", "film-card__dot", "•"));
    footer.appendChild(makeEl("span", "", (film.genres || []).join(", ")));

    content.appendChild(venue);
    content.appendChild(title);
    content.appendChild(time);
    content.appendChild(synopsis);
    content.appendChild(footer);

    const media = makeEl("div", "film-card__media");
    media.style.setProperty("--hue", String(hue));

    if (posterUrl) {
      media.classList.add("has-poster");
      media.style.backgroundImage = `url("${posterUrl}")`;
    } else {
      const fallback = makeEl("div", "film-card__posterFallback");
      fallback.appendChild(makeEl("span", "film-card__posterText", film.title));
      media.appendChild(fallback);
    }

    inner.appendChild(content);
    inner.appendChild(media);
    card.appendChild(inner);

    return card;
  }

  function render() {
    const filtered = films.filter(matchesFilters);
    const sorted = sortFilms(filtered);

    el.resultCount.textContent = String(sorted.length);
    clearNode(el.filmGrid);
    el.emptyState.hidden = sorted.length !== 0;

    for (const film of sorted) {
      el.filmGrid.appendChild(createCard(film));
    }
  }

  el.toggleSearchBtn.addEventListener("click", () => {
    const willShow = el.searchRow.hidden;
    el.searchRow.hidden = !willShow;
    el.toggleSearchBtn.setAttribute("aria-expanded", willShow ? "true" : "false");

    if (willShow) {
      el.searchInput.focus();
    } else {
      state.query = "";
      el.searchInput.value = "";
      render();
    }
  });

  el.searchInput.addEventListener("input", (e) => {
    state.query = e.target.value;
    render();
  });

  el.genreSelect.addEventListener("change", (e) => {
    state.genre = e.target.value;
    render();
  });

  el.durationSelect.addEventListener("change", (e) => {
    state.duration = e.target.value;
    render();
  });

  el.resetBtn.addEventListener("click", () => {
    state.query = "";
    state.day = "";
    state.genre = "";
    state.duration = "";

    el.searchInput.value = "";
    el.genreSelect.value = "";
    el.durationSelect.value = "";
    syncDayPills();
    render();
  });

  buildGenreOptions();
  buildDayPills();
  syncDayPills();
  render();
});
