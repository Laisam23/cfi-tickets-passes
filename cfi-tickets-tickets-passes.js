/**
 * CFI Unified Tickets + Passes (Single Page)
 * Versione corretta:
 * - nessuna immagine nelle card
 * - layout solo testuale
 * - gestione filtri più pulita
 * - pronto per GitHub / WordPress
 */

(function () {
  const $ = (id) => document.getElementById(id);

  if (!$("cfiResultsList") || !$("cfiModeTicketsBtn") || !$("cfiModePassesBtn")) return;

  const TICKETS = [
    { id: "t1", day: "Friday", time: "7:00 AM", title: "Friday Cinema - Film Block", venue: "—", type: "Film Block", tags: ["Cinema"] },
    { id: "t2", day: "Friday", time: "10:00 AM", title: 'INTERNATIONAL FEATURE "ESPINA"', venue: "ACC Theatre", type: "Feature", tags: ["Feature", "Comedy", "Drama"] },
    { id: "t3", day: "Friday", time: "10:30 AM", title: "WAIT... WHAT?! (SHORTS)", venue: "Avalon City Hall", type: "Shorts", tags: ["Short Film", "Drama", "Family", "Fantasy", "Comedy", "Action", "Suspense", "Student"] },
    { id: "t4", day: "Friday", time: "11:00 AM", title: "The Lion's Den: A Live Pitch Panel (Fri 9.26)", venue: "Hotel Atwater", type: "Panel", tags: ["Panel", "Pitch"] },
    { id: "t5", day: "Friday", time: "12:00 PM", title: "TRAUMA HURTS, TRUTH HEALS (U.S. SHORTS)", venue: "ACC Theatre", type: "Shorts", tags: ["Short Film", "Drama", "LGBTQ+", "Thriller", "Trauma"] },
    { id: "t6", day: "Friday", time: "12:30 PM", title: "SCHITTZ & GIGGLEZ (SHORTS)", venue: "Avalon City Hall", type: "Shorts", tags: ["Short Film", "Comedy", "Drama", "Student", "Family", "Romance", "Horror", "Mental health"] },
    { id: "t7", day: "Friday", time: "2:00 PM", title: "DRAWN TO LIFE (ANIMATION)", venue: "ACC Theatre", type: "Shorts", tags: ["Short Film", "Animation", "Sci-Fi", "Drama", "Romance", "Horror", "Comedy"] },
    { id: "t8", day: "Friday", time: "2:30 PM", title: "THIS MIGHT GET MESSY (SHORTS)", venue: "Avalon City Hall", type: "Shorts", tags: ["Short Film", "Drama", "Family", "Comedy", "Suspense", "Thriller", "Romance"] },
    { id: "t9", day: "Friday", time: "7:00 PM", title: "TRIBUTE AWARDS & EVENING SHORTS", venue: "Avalon Theatre", type: "Shorts", tags: ["Short Film", "Horror", "Thriller", "Fantasy", "Mental health", "Suspense", "Drama", "Adventure"] },
    { id: "t10", day: "Friday", time: "9:30 PM", title: "Friday Evening Party", venue: "—", type: "Party", tags: ["Party"] },

    { id: "t11", day: "Saturday", time: "7:00 AM", title: "Saturday Cinema - Film Block", venue: "—", type: "Film Block", tags: ["Cinema"] },
    { id: "t12", day: "Saturday", time: "9:30 AM", title: "HIGH SCHOOL (SHORTS)", venue: "ACC Theatre", type: "Shorts", tags: ["Short Film", "Thriller", "Drama", "Sci-Fi", "Horror", "Romance", "Student"] },
    { id: "t13", day: "Saturday", time: "10:00 AM", title: "DOCUMENTARIES (SHORTS)", venue: "Avalon City Hall", type: "Shorts", tags: ["Documentary", "Social Impact", "Art", "Political", "Music", "Adventure"] },
    { id: "t14", day: "Saturday", time: "10:30 AM", title: "DISTURBANCE OF THE PEACE (SHORTS)", venue: "Lancer Auditorium", type: "Shorts", tags: ["Short Film", "Thriller", "Suspense", "Comedy", "Horror", "Experimental", "Drama", "Trauma"] },
    { id: "t15", day: "Saturday", time: "11:30 AM", title: "THE FUNNY SIDE OF LIFE (SHORTS)", venue: "ACC Theatre", type: "Shorts", tags: ["Short Film", "Comedy", "Dark Comedy", "Drama", "Romance", "Student"] },
    { id: "t16", day: "Saturday", time: "12:00 PM", title: "CRINGE BINGE (U.S. SHORTS)", venue: "Avalon City Hall", type: "Shorts", tags: ["Short Film", "Comedy", "Horror", "Psychological Thriller", "Drama", "Family", "Experimental"] },
    { id: "t17", day: "Saturday", time: "12:30 PM", title: "SOMETHING AIN'T RIGHT (SHORTS)", venue: "Lancer Auditorium", type: "Shorts", tags: ["Short Film", "Drama", "Action", "Crime", "Family", "Thriller", "Trauma", "Suspense"] },
    { id: "t18", day: "Saturday", time: "1:30 PM", title: 'US FEATURE "GO ON"', venue: "ACC Theatre", type: "Feature", tags: ["Feature", "Drama"] },
    { id: "t19", day: "Saturday", time: "2:00 PM", title: "AROUND THE WORLD IN 90 MINUTES (INT. SHORTS)", venue: "Avalon City Hall", type: "Shorts", tags: ["Short Film", "Drama", "Suspense", "Comedy", "Fantasy", "Sci-Fi", "Family"] },
    { id: "t20", day: "Saturday", time: "2:30 PM", title: "GLITCHES & GLOOM (U.S. SHORTS)", venue: "Lancer Auditorium", type: "Shorts", tags: ["Short Film", "Sci-Fi", "Thriller", "Drama", "Comedy", "Horror"] },
    { id: "t21", day: "Saturday", time: "7:00 PM", title: "CLOSING FILMS", venue: "Avalon Theatre", type: "Closing", tags: ["Closing"] },
    { id: "t22", day: "Saturday", time: "9:30 PM", title: "Saturday Closing Party", venue: "—", type: "Party", tags: ["Party"] },

    { id: "t23", day: "Sunday", time: "7:00 AM", title: "Sunday Cinema - Film Block", venue: "—", type: "Film Block", tags: ["Cinema"] },
    { id: "t24", day: "Sunday", time: "1:00 PM", title: "Panel: Festival, Markets & Distribution (Sun 9.28)", venue: "Avalon City Hall", type: "Panel", tags: ["Panel", "Industry"] },
    { id: "t25", day: "Sunday", time: "2:30 PM", title: "CATALINA SPOTLIGHT", venue: "Avalon City Hall", type: "Spotlight", tags: ["Documentary", "Spotlight"] }
  ].map((x) => ({
    ...x,
    url: "#",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    priceFrom: x.type === "Party" ? "From $25" : "From $15",
    feesNote: "Fees & taxes may apply at checkout."
  }));

  const PASSES = [
    {
      id: "p1",
      day: "Friday",
      title: "Friday Cinema Pass",
      note: "Day pass",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      inclusions: [
        "Cinema access for Friday programming",
        "Priority check-in (where available)",
        "General seating subject to capacity",
        "Lorem ipsum dolor sit amet"
      ],
      url: "#",
      priceFrom: "From $79",
      feesNote: "Fees & taxes may apply at checkout.",
      category: "Day Pass"
    },
    {
      id: "p2",
      day: "Saturday",
      title: "Saturday Cinema Pass",
      note: "Day pass",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      inclusions: [
        "Cinema access for Saturday programming",
        "Priority check-in (where available)",
        "General seating subject to capacity",
        "Lorem ipsum dolor sit amet"
      ],
      url: "#",
      priceFrom: "From $79",
      feesNote: "Fees & taxes may apply at checkout.",
      category: "Day Pass"
    }
  ];

  const DATASETS = {
    tickets: TICKETS,
    passes: PASSES
  };

  const state = {
    mode: "tickets",
    filters: {
      day: "all",
      venue: "all",
      kind: "all",
      q: ""
    },
    moreOpen: false
  };

  const saved = new Set();

  const elModeTickets = $("cfiModeTicketsBtn");
  const elModePasses = $("cfiModePassesBtn");

  const elDay = $("cfiFilterDay");
  const elQuery = $("cfiFilterQuery");
  const elReset = $("cfiFilterReset");
  const elMoreBtn = $("cfiFilterMoreBtn");
  const elMorePanel = $("cfiFilterMorePanel");

  const elVenueWrap = $("cfiFilterVenueWrap");
  const elVenue = $("cfiFilterVenue");
  const elKindWrap = $("cfiFilterKindWrap");
  const elKindLabel = $("cfiFilterKindLabel");
  const elKind = $("cfiFilterKind");

  const elCount = $("cfiResultsCount");
  const elList = $("cfiResultsList");

  const modal = $("cfiModal");
  const mTitle = $("cfiMTitle");
  const mMeta = $("cfiMMeta");
  const mDesc = $("cfiMDesc");
  const mPrice = $("cfiMPrice");
  const mFees = $("cfiMFees");
  const mSectionTags = $("cfiMSectionTags");
  const mTags = $("cfiMTags");
  const mSectionIncl = $("cfiMSectionIncl");
  const mIncl = $("cfiMIncl");
  const mBuy = $("cfiMBuy");
  const mSave = $("cfiMSave");

  function uniq(arr) {
    return Array.from(new Set(arr)).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }

  function buildOptions(selectEl, values) {
    if (!selectEl) return;
    while (selectEl.options.length > 1) {
      selectEl.remove(1);
    }
    values.forEach((value) => {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = value;
      selectEl.appendChild(opt);
    });
  }

  function timeToMinutes(value) {
    if (!value) return 99999;
    const match = String(value).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 99999;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();

    if (hours === 12) hours = 0;
    if (ampm === "PM") hours += 12;

    return hours * 60 + minutes;
  }

  function setActiveTab() {
    if (elModeTickets) {
      elModeTickets.setAttribute("aria-selected", state.mode === "tickets" ? "true" : "false");
      elModeTickets.classList.toggle("is-active", state.mode === "tickets");
    }

    if (elModePasses) {
      elModePasses.setAttribute("aria-selected", state.mode === "passes" ? "true" : "false");
      elModePasses.classList.toggle("is-active", state.mode === "passes");
    }
  }

  function setMoreOpen(open) {
    state.moreOpen = Boolean(open);

    if (elMorePanel) {
      elMorePanel.hidden = !state.moreOpen;
    }

    if (elMoreBtn) {
      elMoreBtn.setAttribute("aria-expanded", state.moreOpen ? "true" : "false");
    }
  }

  function normalizeFiltersForMode() {
    if (state.mode === "passes") {
      state.filters.venue = "all";
      const categories = uniq(DATASETS.passes.map((item) => item.category || item.note).filter(Boolean));
      if (state.filters.kind !== "all" && !categories.includes(state.filters.kind)) {
        state.filters.kind = "all";
      }
    } else {
      const types = uniq(DATASETS.tickets.map((item) => item.type).filter(Boolean));
      if (state.filters.kind !== "all" && !types.includes(state.filters.kind)) {
        state.filters.kind = "all";
      }
    }
  }

  function hydrateFilters() {
    const days = uniq(DATASETS[state.mode].map((item) => item.day).filter(Boolean));
    buildOptions(elDay, days);

    if (state.mode === "tickets") {
      if (elVenueWrap) elVenueWrap.hidden = false;
      if (elKindWrap) elKindWrap.hidden = false;
      if (elKindLabel) elKindLabel.textContent = "Type";

      const venues = uniq(DATASETS.tickets.map((item) => item.venue).filter((venue) => venue && venue !== "—"));
      const types = uniq(DATASETS.tickets.map((item) => item.type).filter(Boolean));

      buildOptions(elVenue, venues);
      buildOptions(elKind, types);
    } else {
      if (elVenueWrap) elVenueWrap.hidden = true;
      if (elKindWrap) elKindWrap.hidden = false;
      if (elKindLabel) elKindLabel.textContent = "Category";

      const categories = uniq(DATASETS.passes.map((item) => item.category || item.note).filter(Boolean));
      buildOptions(elKind, categories);
    }

    if (elDay) elDay.value = state.filters.day;
    if (elVenue) elVenue.value = state.filters.venue;
    if (elKind) elKind.value = state.filters.kind;
    if (elQuery) elQuery.value = state.filters.q || "";
  }

  function matches(item) {
    const f = state.filters;

    if (f.day !== "all" && item.day !== f.day) return false;

    if (state.mode === "tickets") {
      if (f.venue !== "all" && item.venue !== f.venue) return false;
      if (f.kind !== "all" && item.type !== f.kind) return false;
    } else {
      const category = item.category || item.note || "";
      if (f.kind !== "all" && category !== f.kind) return false;
    }

    const q = (f.q || "").trim().toLowerCase();
    if (!q) return true;

    const haystack = [
      item.title,
      item.day,
      item.time,
      item.venue,
      item.type,
      item.note,
      item.category,
      item.desc,
      ...(item.tags || []),
      ...(item.inclusions || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  }

  function groupByDay(items) {
    const map = new Map();

    items.forEach((item) => {
      if (!map.has(item.day)) map.set(item.day, []);
      map.get(item.day).push(item);
    });

    const order = ["Friday", "Saturday", "Sunday"];
    const keys = Array.from(map.keys()).sort((a, b) => {
      const indexA = order.indexOf(a);
      const indexB = order.indexOf(b);

      if (indexA !== -1 || indexB !== -1) {
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
      }

      return a.localeCompare(b);
    });

    return keys.map((key) => [key, map.get(key)]);
  }

  function buildChips(item) {
    let chips = [];

    if (state.mode === "tickets") {
      chips.push(item.type || "");
      chips.push(item.venue && item.venue !== "—" ? item.venue : "");
      chips = chips.concat(item.tags || []);
    } else {
      chips.push("Pass");
      chips.push(item.category || item.note || "");
    }

    chips = chips.filter(Boolean);

    const maxVisible = 4;
    const visible = chips.slice(0, maxVisible);
    const extra = chips.length - visible.length;

    return { visible, extra };
  }

  function createEl(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function renderEmpty() {
    elList.innerHTML = "";

    const card = createEl("div", "cfi-card");
    const title = createEl("p", "cfi-cardTitle", "No results");
    const desc = createEl("p", "cfi-cardDesc", "Try changing filters.");

    card.appendChild(title);
    card.appendChild(desc);
    elList.appendChild(card);
  }

  function toMetaLine(item) {
    if (state.mode === "tickets") {
      const bits = [];
      if (item.venue && item.venue !== "—") bits.push(item.venue);
      if (item.time) bits.push(item.time);
      return bits.join(" · ") || item.day || "—";
    }

    const bits = [];
    if (item.day) bits.push(item.day);
    if (item.category || item.note) bits.push(item.category || item.note);
    return bits.join(" · ") || "—";
  }

  function openModal(item) {
    if (!modal) return;

    if (mTitle) mTitle.textContent = item.title || "—";
    if (mMeta) mMeta.textContent = toMetaLine(item);
    if (mDesc) mDesc.textContent = item.desc || "";
    if (mPrice) mPrice.textContent = item.priceFrom || "";
    if (mFees) mFees.textContent = item.feesNote || "";

    if (mBuy) {
      mBuy.href = item.url || "#";
      mBuy.textContent = state.mode === "tickets" ? "Buy ticket" : "Get pass";
    }

    if (mSave) {
      mSave.textContent = saved.has(item.id) ? "Saved" : "Save";
      mSave.disabled = saved.has(item.id);
    }

    if (state.mode === "tickets") {
      if (mSectionTags) mSectionTags.hidden = false;
      if (mSectionIncl) mSectionIncl.hidden = true;

      if (mTags) {
        mTags.innerHTML = "";
        (item.tags || []).forEach((tag) => {
          mTags.appendChild(createEl("span", "cfi-tag", tag));
        });
      }
    } else {
      if (mSectionTags) mSectionTags.hidden = true;
      if (mSectionIncl) mSectionIncl.hidden = false;

      if (mIncl) {
        mIncl.innerHTML = "";
        (item.inclusions || []).forEach((line) => {
          mIncl.appendChild(createEl("li", "", line));
        });
      }
    }

    modal.dataset.current = item.id;
    modal.dataset.mode = state.mode;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cfi-lock");
  }

  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cfi-lock");
    modal.dataset.current = "";
    modal.dataset.mode = "";
  }

  function renderCardsForDay(day, items) {
    const block = createEl("div", "cfi-dayBlock");

    const header = createEl("div", "cfi-dayHeader");
    header.appendChild(createEl("p", "cfi-dayTitle", day));
    header.appendChild(createEl("span", "cfi-dayMeta", `${items.length} item${items.length === 1 ? "" : "s"}`));
    block.appendChild(header);

    const sorted = state.mode === "tickets"
      ? items.slice().sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
      : items.slice();

    sorted.forEach((item) => {
      const card = createEl("div", "cfi-card");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open details for ${item.title}`);

      const info = createEl("div", "cfi-cardInfo");
      const title = createEl("p", "cfi-cardTitle", item.title || "—");
      const meta = createEl("div", "cfi-cardMeta", toMetaLine(item));

      info.appendChild(title);
      info.appendChild(meta);

      if (item.priceFrom || item.feesNote) {
        const priceRow = createEl("div", "cfi-cardPriceRow");
        if (item.priceFrom) priceRow.appendChild(createEl("span", "cfi-cardPrice", item.priceFrom));
        if (item.feesNote) priceRow.appendChild(createEl("span", "cfi-cardFees", item.feesNote));
        info.appendChild(priceRow);
      }

      const { visible, extra } = buildChips(item);
      const chips = createEl("div", "cfi-pills");

      visible.forEach((chip, index) => {
        const className = index > 0 ? "cfi-pill cfi-pillSoft" : "cfi-pill";
        chips.appendChild(createEl("span", className, chip));
      });

      if (extra > 0) {
        chips.appendChild(createEl("span", "cfi-pill cfi-pillSoft", `+${extra}`));
      }

      info.appendChild(chips);

      const desc = createEl("p", "cfi-cardDesc", item.desc || "");

      const actions = createEl("div", "cfi-cardActions");

      const btnDetails = createEl("button", "cfi-btn cfi-btnPrimary", "Details");
      btnDetails.type = "button";
      btnDetails.addEventListener("click", (event) => {
        event.stopPropagation();
        openModal(item);
      });

      const btnBuy = document.createElement("a");
      btnBuy.className = "cfi-btn cfi-btnGhost";
      btnBuy.href = item.url || "#";
      btnBuy.target = "_blank";
      btnBuy.rel = "noopener";
      btnBuy.textContent = state.mode === "tickets" ? "Buy ticket" : "Get pass";
      btnBuy.addEventListener("click", (event) => event.stopPropagation());

      actions.appendChild(btnDetails);
      actions.appendChild(btnBuy);

      card.appendChild(info);
      card.appendChild(desc);
      card.appendChild(actions);

      card.addEventListener("click", () => openModal(item));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openModal(item);
        }
      });

      block.appendChild(card);
    });

    elList.appendChild(block);
  }

  function render() {
    setActiveTab();
    normalizeFiltersForMode();

    const items = DATASETS[state.mode].filter(matches);

    if (elCount) {
      elCount.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;
    }

    elList.innerHTML = "";

    if (items.length === 0) {
      renderEmpty();
      return;
    }

    const groups = groupByDay(items);
    groups.forEach(([day, arr]) => renderCardsForDay(day, arr));
  }

  function bind() {
    elModeTickets.addEventListener("click", () => {
      if (state.mode === "tickets") return;

      state.mode = "tickets";
      state.filters.venue = "all";
      state.filters.kind = "all";

      hydrateFilters();
      render();
    });

    elModePasses.addEventListener("click", () => {
      if (state.mode === "passes") return;

      state.mode = "passes";
      state.filters.venue = "all";
      state.filters.kind = "all";

      hydrateFilters();
      render();
    });

    if (elDay) {
      elDay.addEventListener("change", () => {
        state.filters.day = elDay.value;
        render();
      });
    }

    if (elQuery) {
      elQuery.addEventListener("click", () => {
        state.filters.q = elQuery.value || "";
        render();
      });
    }

    if (elReset) {
      elReset.addEventListener("click", () => {
        state.filters.day = "all";
        state.filters.q = "all";
        state.filters.venue = "all";
        state.filters.kind = "all";

        if (elDay) elDay.value = "all";
        if (elQuery) elQuery.value = "";
        if (elVenue) elVenue.value = "all";
        if (elKind) elKind.value = "all";

        render();
      });
    }

    if (elMoreBtn) {
      elMoreBtn.addEventListener("click", () => {
        setMoreOpen(!state.moreOpen);
      });
    }

    if (elVenue) {
      elVenue.addEventListener("change", () => {
        state.filters.venue = elVenue.value;
        render();
      });
    }

    if (elKind) {
      elKind.addEventListener("change", () => {
        state.filters.kind = elKind.value;
        render();
      });
    }

    if (modal) {
      modal.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.dataset && target.dataset.close === "1") {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });

    if (mSave) {
      mSave.addEventListener("click", () => {
        const id = modal?.dataset?.current;
        if (!id) return;

        saved.add(id);
        mSave.textContent = "Saved";
        mSave.disabled = true;
      });
    }
  }

  setMoreOpen(false);
  hydrateFilters();
  bind();
  render();
})();
