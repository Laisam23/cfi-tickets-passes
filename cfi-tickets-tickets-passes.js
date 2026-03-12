"use strict";

/*
  Tieni il tuo array `films = [...]` sopra questo blocco.
  Opzionale: se vuoi immagini reali, aggiungi `poster: "path/file.jpg"` a ogni film.
*/

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
  modalPoster: document.getElementById("modalPoster"),
  modalPosterText: document.getElementById("modalPosterText"),
};

const state = {
  query: "",
  day: "",
  genre: "",
  duration: "",
};

function norm(value) {
  return String(value || "").trim().toLowerCase();
}

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

function getPosterUrl(film) {
  return film.poster || film.posterUrl || "";
}

function hashHue(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h % 360;
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
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d);
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(d).toUpperCase();
  return { weekday, day, month };
}

function formatBadgeDateTime(iso) {
  const d = new Date(iso);
  const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "long" }).format(d).toUpperCase();
  const day = new Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${weekday} ${day}, ${time}`;
}

function formatModalDateTime(iso) {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function includesText(haystack, needle) {
  return norm(haystack).includes(norm(needle));
}

function buildGenreOptions() {
  const genres = new Set();
  for (const film of films) {
    for (const genre of film.genres || []) genres.add(genre);
  }

  const sorted = [...genres].sort((a, b) => a.localeCompare(b));
  for (const genre of sorted) {
    const opt = document.createElement("option");
    opt.value = genre;
    opt.textContent = genre;
    el.genreSelect.appendChild(opt);
  }
}

function buildDayPills() {
  clearNode(el.dayPills);

  for (const dayKey of FESTIVAL_DAYS) {
    const parts = formatDayPill(dayKey);
    const btn = makeEl("button", "day-pill");
    btn.type = "button";
    btn.dataset.day = dayKey;
    btn.setAttribute("aria-pressed", "false");

    btn.appendChild(makeEl("span", "day-pill__top", parts.weekday));
    btn.appendChild(makeEl("span", "day-pill__mid", parts.day));
    btn.appendChild(makeEl("span", "day-pill__bot", parts.month));

    btn.addEventListener("click", () => {
      if (state.day === dayKey) {
        state.day = "";
      } else {
        state.day = dayKey;
      }
      syncDayPills();
      render();
    });

    el.dayPills.appendChild(btn);
  }
}

function syncDayPills() {
  const buttons = el.dayPills.querySelectorAll(".day-pill");
  for (const btn of buttons) {
    const active = btn.dataset.day === state.day;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  }
}

function matchesFilters(film) {
  const screening = getScreening(film);

  if (state.query) {
    const blob = [
      film.title,
      film.director,
      (film.writers || []).join(" "),
      (film.cast || []).join(" "),
      film.country,
      film.language,
      screening.venue,
    ].join(" ");

    if (!includesText(blob, state.query)) return false;
  }

  if (state.day && toDayKey(screening.datetime) !== state.day) return false;
  if (state.genre && !(film.genres || []).includes(state.genre)) return false;
  if (state.duration && getDurationBand(film.durationMin) !== state.duration) return false;

  return true;
}

function sortFilms(list) {
  const copy = [...list];
  copy.sort((a, b) => {
    const aTime = new Date(getScreening(a).datetime).getTime();
    const bTime = new Date(getScreening(b).datetime).getTime();
    return aTime - bTime || a.title.localeCompare(b.title);
  });
  return copy;
}

function createPosterNode(film, classPrefix) {
  const posterUrl = getPosterUrl(film);
  const hue = hashHue(film.id + film.title);

  const poster = makeEl("div", `${classPrefix}`);
  poster.style.setProperty("--hue", String(hue));

  if (posterUrl) {
    poster.classList.add("has-poster");
    poster.style.backgroundImage = `url("${posterUrl}")`;
  } else {
    const fallback = makeEl("div", `${classPrefix === "film-card__media" ? "film-card__posterFallback" : ""}`);
    const textClass = classPrefix === "film-card__media" ? "film-card__posterText" : "film-modal__posterText";
    const text = makeEl("span", textClass, film.title);
    if (classPrefix === "film-card__media") {
      fallback.appendChild(text);
      poster.appendChild(fallback);
    } else {
      poster.appendChild(text);
    }
  }

  return poster;
}

function createCard(film) {
  const screening = getScreening(film);

  const card = makeEl("button", "film-card");
  card.type = "button";
  card.addEventListener("click", () => openFilmModal(film));

  const inner = makeEl("div", "film-card__inner");

  const content = makeEl("div", "film-card__content");

  const venue = makeEl("div", "film-card__venue");
  venue.appendChild(makeEl("span", "film-card__pin"));
  venue.appendChild(makeEl("span", "", screening.venue || "Venue"));

  const title = makeEl("h3", "film-card__title", film.title);
  const time = makeEl("div", "film-card__time", formatBadgeDateTime(screening.datetime));
  const synopsis = makeEl("p", "film-card__synopsis", film.synopsisShort || "—");

  const footer = makeEl("div", "film-card__footer");
  footer.appendChild(makeEl("span", "", `${film.country}`));
  footer.appendChild(makeEl("span", "film-card__dot", "•"));
  footer.appendChild(makeEl("span", "", `${film.durationMin} min`));
  footer.appendChild(makeEl("span", "film-card__dot", "•"));
  footer.appendChild(makeEl("span", "", (film.genres || []).join(", ")));

  content.appendChild(venue);
  content.appendChild(title);
  content.appendChild(time);
  content.appendChild(synopsis);
  content.appendChild(footer);

  const media = createPosterNode(film, "film-card__media");

  inner.appendChild(content);
  inner.appendChild(media);
  card.appendChild(inner);

  return card;
}

function render() {
  const filtered = films.filter(matchesFilters);
  const sorted = sortFilms(filtered);

  el.resultCount.textContent = String(sorted.length);
  el.emptyState.hidden = sorted.length !== 0;
  clearNode(el.filmGrid);

  for (const film of sorted) {
    el.filmGrid.appendChild(createCard(film));
  }
}

function openFilmModal(film) {
  const screening = getScreening(film);
  const posterUrl = getPosterUrl(film);
  const hue = hashHue(film.id + film.title);

  el.modalTitle.textContent = film.title;
  el.modalMeta.textContent = `${film.year} • ${film.durationMin} min • ${film.country} • ${film.language}`;
  el.modalSynopsis.textContent = film.synopsisLong || "—";
  el.modalDirector.textContent = film.director || "—";
  el.modalWriters.textContent = (film.writers || []).length ? film.writers.join(", ") : "—";
  el.modalCast.textContent = (film.cast || []).length ? film.cast.join(", ") : "—";
  el.modalGenre.textContent = (film.genres || []).length ? film.genres.join(", ") : "—";
  el.modalScreening.textContent = `${formatModalDateTime(screening.datetime)} • ${screening.venue || "Venue"}`;

  el.modalPoster.className = "film-modal__poster";
  el.modalPoster.style.setProperty("--hue", String(hue));
  el.modalPoster.style.backgroundImage = "";

  clearNode(el.modalPoster);

  if (posterUrl) {
    el.modalPoster.classList.add("has-poster");
    el.modalPoster.style.backgroundImage = `url("${posterUrl}")`;
    el.modalPoster.appendChild(makeEl("span", "film-modal__posterText", film.title));
  } else {
    el.modalPoster.appendChild(makeEl("span", "film-modal__posterText", film.title));
  }

  if (screening.ticketUrl && screening.ticketUrl !== "#") {
    el.modalTicket.hidden = false;
    el.modalTicket.href = screening.ticketUrl;
  } else {
    el.modalTicket.hidden = true;
    el.modalTicket.href = "#";
  }

  if (typeof el.modal.showModal === "function") {
    el.modal.showModal();
  } else {
    el.modal.setAttribute("open", "open");
  }
}

function closeModal() {
  if (typeof el.modal.close === "function") {
    el.modal.close();
  } else {
    el.modal.removeAttribute("open");
  }
}

function resetFilters() {
  state.query = "";
  state.day = "";
  state.genre = "";
  state.duration = "";

  el.searchInput.value = "";
  el.genreSelect.value = "";
  el.durationSelect.value = "";
  syncDayPills();
  render();
}

function bindEvents() {
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

  el.resetBtn.addEventListener("click", resetFilters);

  el.modalClose.addEventListener("click", closeModal);

  el.modal.addEventListener("click", (e) => {
    const rect = el.modal.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;

    if (!inside) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && el.modal.hasAttribute("open")) {
      closeModal();
    }
  });
}

function init() {
  buildGenreOptions();
  buildDayPills();
  syncDayPills();
  bindEvents();
  render();
}

init();
