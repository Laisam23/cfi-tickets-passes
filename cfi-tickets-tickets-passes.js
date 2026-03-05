/**
 * CFI Unified Tickets + Passes (Single Page) — US-friendly UX
 * - Single page, Tabs: Tickets | Passes
 * - Mobile-first: simple primary filters (Day + Search + Reset)
 * - Progressive disclosure: "More filters" reveals mode-specific facets
 * - Pricing transparency hooks: show "From $X" + fees note early (if provided)
 * - One modal shell, content adapts (Tickets: tags | Passes: inclusions)
 *
 * REQUIRED DOM IDS (minimal):
 *   Tabs:
 *     - cfiModeTicketsBtn, cfiModePassesBtn   (buttons)
 *   Filter bar:
 *     - cfiFilterDay        (select, includes option value="all")
 *     - cfiFilterQuery      (input)
 *     - cfiFilterReset      (button)
 *     - cfiFilterMoreBtn    (button)  // toggles advanced panel
 *     - cfiFilterMorePanel  (container div) // advanced panel area (show/hide)
 *     - cfiFilterVenueWrap  (wrapper div for venue filter)
 *     - cfiFilterVenue      (select, includes option value="all")
 *     - cfiFilterKindWrap   (wrapper div for kind/type/category filter)
 *     - cfiFilterKindLabel  (span/label text node container)
 *     - cfiFilterKind       (select, includes option value="all")
 *   Results:
 *     - cfiResultsCount     (span/p)
 *     - cfiResultsList      (div)
 *
 *   Modal (single):
 *     - cfiModal
 *     - cfiMTitle, cfiMMeta, cfiMDesc
 *     - cfiMPrice, cfiMFees
 *     - cfiMSectionTags      (wrapper)
 *     - cfiMTags             (container)
 *     - cfiMSectionIncl      (wrapper)
 *     - cfiMIncl             (ul)
 *     - cfiMBuy              (a)
 *     - cfiMSave             (button)
 *   Modal close elements must have data-close="1"
 *
 * NOTES:
 * - Works even if you later replace datasets with real data (keep fields).
 * - If some optional elements are missing, script fails gracefully.
 */

(function () {
  const $ = (id) => document.getElementById(id);

  // Bail if this page doesn’t contain the unified app containers
  if (!$("cfiResultsList") || !$("cfiModeTicketsBtn") || !$("cfiModePassesBtn")) return;

  // -------------------------
  // Data
  // -------------------------
  // Tickets dataset (from your existing script). You can replace with real data.
  const TICKETS = [
    // Friday
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

    // Saturday
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

    // Sunday
    { id: "t23", day: "Sunday", time: "7:00 AM", title: "Sunday Cinema - Film Block", venue: "—", type: "Film Block", tags: ["Cinema"] },
    { id: "t24", day: "Sunday", time: "1:00 PM", title: "Panel: Festival, Markets & Distribution (Sun 9.28)", venue: "Avalon City Hall", type: "Panel", tags: ["Panel", "Industry"] },
    { id: "t25", day: "Sunday", time: "2:30 PM", title: "CATALINA SPOTLIGHT", venue: "Avalon City Hall", type: "Spotlight", tags: ["Documentary", "Spotlight"] },
  ].map((x) => ({
    ...x,
    url: "#",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    // Pricing transparency hooks (optional; replace with real values)
    priceFrom: x.type === "Party" ? "From $25" : "From $15",
    feesNote: "Fees & taxes may apply at checkout.",
    thumb: "", // optional: poster URL
  }));

  // Passes dataset (from your passes script). You can replace with real data.
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
        "Lorem ipsum dolor sit amet",
      ],
      url: "#",
      // Pricing transparency hooks (optional)
      priceFrom: "From $79",
      feesNote: "Fees & taxes may apply at checkout.",
      category: "Day Pass",
      thumb: "",
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
        "Lorem ipsum dolor sit amet",
      ],
      url: "#",
      priceFrom: "From $79",
      feesNote: "Fees & taxes may apply at checkout.",
      category: "Day Pass",
      thumb: "",
    },
  ];

  const DATASETS = {
    tickets: TICKETS,
    passes: PASSES,
  };

  // -------------------------
  // State
  // -------------------------
  const state = {
    mode: "tickets", // "tickets" | "passes"
    filters: {
      day: "all",
      venue: "all", // tickets only
      kind: "all",  // tickets: type | passes: category
      q: "",
    },
    moreOpen: false,
  };

  // Saved (simple in-memory; swap to localStorage if you want persistence)
  const saved = new Set();

  // -------------------------
  // Elements
  // -------------------------
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

  // Modal (single)
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

  // -------------------------
  // Utils
  // -------------------------
  function uniq(arr) {
    return Array.from(new Set(arr)).filter(Boolean).sort((a, b) => a.localeCompare(b));
  }

  function buildOptions(selectEl, values) {
    if (!selectEl) return;
    while (selectEl.options.length > 1) selectEl.remove(1);
    values.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      selectEl.appendChild(opt);
    });
  }

  // "h:mm AM/PM" -> minutes for sorting
  function timeToMinutes(s) {
    if (!s) return 99999;
    const m = String(s).trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return 99999;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const ap = m[3].toUpperCase();
    if (h === 12) h = 0;
    if (ap === "PM") h += 12;
    return h * 60 + min;
  }

  function setActiveTab() {
    if (elModeTickets) elModeTickets.setAttribute("aria-selected", state.mode === "tickets" ? "true" : "false");
    if (elModePasses) elModePasses.setAttribute("aria-selected", state.mode === "passes" ? "true" : "false");
    if (elModeTickets) elModeTickets.classList.toggle("is-active", state.mode === "tickets");
    if (elModePasses) elModePasses.classList.toggle("is-active", state.mode === "passes");
  }

  function setMoreOpen(open) {
    state.moreOpen = !!open;
    if (elMorePanel) elMorePanel.style.display = state.moreOpen ? "" : "none";
    if (elMoreBtn) elMoreBtn.setAttribute("aria-expanded", state.moreOpen ? "true" : "false");
  }

  function normalizeFiltersForMode() {
    // For US-friendly predictability: keep Day + Search across modes; reset irrelevant facets.
    if (state.mode === "passes") {
      state.filters.venue = "all"; // hide/disable
      // kind becomes category for passes (keep value if it exists; else reset)
      const categories = uniq(DATASETS.passes.map((p) => p.category || p.note).filter(Boolean));
      if (state.filters.kind !== "all" && !categories.includes(state.filters.kind)) state.filters.kind = "all";
    } else {
      // tickets mode
      // kind becomes type for tickets (keep if valid)
      const types = uniq(DATASETS.tickets.map((t) => t.type).filter(Boolean));
      if (state.filters.kind !== "all" && !types.includes(state.filters.kind)) state.filters.kind = "all";
    }
  }

  function hydrateFilters() {
    // day is shared
    const days = uniq(
      DATASETS[state.mode].map((x) => x.day).filter(Boolean)
    );
    buildOptions(elDay, days);

    if (state.mode === "tickets") {
      // Venue
      if (elVenueWrap) elVenueWrap.style.display = "";
      const venues = uniq(
        DATASETS.tickets.map((x) => x.venue).filter((v) => v && v !== "—")
      );
      buildOptions(elVenue, venues);

      // Kind = Type
      if (elKindWrap) elKindWrap.style.display = "";
      if (elKindLabel) elKindLabel.textContent = "Type";
      const types = uniq(DATASETS.tickets.map((x) => x.type).filter(Boolean));
      buildOptions(elKind, types);
    } else {
      // Passes: hide Venue, Kind=Category (or note)
      if (elVenueWrap) elVenueWrap.style.display = "none";
      if (elKindWrap) elKindWrap.style.display = "";
      if (elKindLabel) elKindLabel.textContent = "Category";
      const categories = uniq(DATASETS.passes.map((p) => p.category || p.note).filter(Boolean));
      buildOptions(elKind, categories);
    }

    // Keep UI in sync with state
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
      const cat = item.category || item.note || "";
      if (f.kind !== "all" && cat !== f.kind) return false;
    }

    const q = (f.q || "").trim().toLowerCase();
    if (!q) return true;

    const hay = [
      item.title,
      item.day,
      item.time,
      item.venue,
      item.type,
      item.note,
      item.category,
      item.desc,
      ...(item.tags || []),
      ...(item.inclusions || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return hay.includes(q);
  }

  function groupByDay(items) {
    const map = new Map();
    items.forEach((it) => {
      if (!map.has(it.day)) map.set(it.day, []);
      map.get(it.day).push(it);
    });
    const order = ["Friday", "Saturday", "Sunday"];
    const keys = Array.from(map.keys()).sort((a, b) => {
      const ia = order.indexOf(a),
        ib = order.indexOf(b);
      if (ia !== -1 || ib !== -1) return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
      return a.localeCompare(b);
    });
    return keys.map((k) => [k, map.get(k)]);
  }

  // Editorial chips: show a few + “+N”
  function buildChips(item) {
    let chips = [];
    if (state.mode === "tickets") {
      chips.push(item.type || "");
      chips.push(item.venue && item.venue !== "—" ? item.venue : "");
      chips = chips.concat(item.tags || []);
    } else {
      chips.push("Pass");
      chips.push(item.category || item.note || "");
      // optionally add a couple of inclusions as chips (too noisy otherwise)
    }
    chips = chips.filter(Boolean);

    const max = 4;
    const visible = chips.slice(0, max);
    const extra = chips.length - visible.length;

    return { visible, extra };
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function renderEmpty() {
    while (elList.firstChild) elList.removeChild(elList.firstChild);
    const card = el("div", "cfi-card");
    const t = el("p", "cfi-cardTitle", "No results");
    const d = el("p", "cfi-cardDesc", "Try changing filters.");
    card.appendChild(t);
    card.appendChild(d);
    elList.appendChild(card);
  }

  function toMetaLine(item) {
    if (state.mode === "tickets") {
      const bits = [];
      if (item.venue && item.venue !== "—") bits.push(item.venue);
      if (item.time) bits.push(item.time);
      return bits.join(" · ") || item.day || "—";
    }
    // passes
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

    // Pricing transparency (early + consistent)
    if (mPrice) mPrice.textContent = item.priceFrom || "";
    if (mFees) mFees.textContent = item.feesNote || "";

    if (mBuy) {
      mBuy.href = item.url || "#";
      mBuy.textContent = state.mode === "tickets" ? "Buy ticket" : "Get pass";
    }

    // Saved
    if (mSave) {
      mSave.textContent = saved.has(item.id) ? "Saved" : "Save";
      mSave.disabled = saved.has(item.id);
    }

    // Sections
    if (state.mode === "tickets") {
      if (mSectionTags) mSectionTags.style.display = "";
      if (mSectionIncl) mSectionIncl.style.display = "none";

      if (mTags) {
        while (mTags.firstChild) mTags.removeChild(mTags.firstChild);
        (item.tags || []).forEach((t) => {
          const span = el("span", "cfi-tag", t);
          mTags.appendChild(span);
        });
      }
    } else {
      if (mSectionTags) mSectionTags.style.display = "none";
      if (mSectionIncl) mSectionIncl.style.display = "";

      if (mIncl) {
        while (mIncl.firstChild) mIncl.removeChild(mIncl.firstChild);
        (item.inclusions || []).forEach((line) => {
          mIncl.appendChild(el("li", "", line));
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
    const block = el("div", "cfi-dayBlock");

    // Day header
    const header = el("div", "cfi-dayHeader");
    header.appendChild(el("p", "cfi-dayTitle", day));
    header.appendChild(el("span", "cfi-dayMeta", `${items.length} item${items.length === 1 ? "" : "s"}`));
    block.appendChild(header);

    // Sort
    const sorted =
      state.mode === "tickets"
        ? items.slice().sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time))
        : items.slice(); // passes: keep provided order (or sort by price tier later)

    // Cards
    sorted.forEach((item) => {
      const card = el("div", "cfi-card");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open details for ${item.title}`);

      // Top: thumb + text
      const top = el("div", "cfi-cardTop");

      // Thumb (optional)
      const thumbWrap = el("div", "cfi-cardThumb");
      if (item.thumb) {
        const img = document.createElement("img");
        img.src = item.thumb;
        img.alt = item.title || "";
        img.loading = "lazy";
        thumbWrap.appendChild(img);
      } else {
        // Keep element for consistent layout; CSS can show placeholder background.
        thumbWrap.setAttribute("aria-hidden", "true");
      }

      const info = el("div", "cfi-cardInfo");
      const title = el("p", "cfi-cardTitle", item.title || "—");
      const meta = el("div", "cfi-cardMeta", toMetaLine(item));

      // Pricing shown early (US trust pattern)
      const priceRow = el("div", "cfi-cardPriceRow");
      if (item.priceFrom) priceRow.appendChild(el("span", "cfi-cardPrice", item.priceFrom));
      if (item.feesNote) priceRow.appendChild(el("span", "cfi-cardFees", item.feesNote));

      info.appendChild(title);
      info.appendChild(meta);
      if (item.priceFrom || item.feesNote) info.appendChild(priceRow);

      // Chips
      const { visible, extra } = buildChips(item);
      const chips = el("div", "cfi-pills");
      visible.forEach((c, idx) => {
        const isSoft = idx > 0;
        const span = el("span", isSoft ? "cfi-pill cfi-pillSoft" : "cfi-pill", c);
        chips.appendChild(span);
      });
      if (extra > 0) {
        chips.appendChild(el("span", "cfi-pill cfi-pillSoft", `+${extra}`));
      }
      info.appendChild(chips);

      top.appendChild(thumbWrap);
      top.appendChild(info);

      // Description preview (short)
      const desc = el("p", "cfi-cardDesc", item.desc || "");

      // Actions
      const actions = el("div", "cfi-cardActions");

      const btnDetails = el("button", "cfi-btn cfi-btnPrimary", "Details");
      btnDetails.type = "button";
      btnDetails.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(item);
      });

      const btnBuy = document.createElement("a");
      btnBuy.className = "cfi-btn cfi-btnGhost";
      btnBuy.href = item.url || "#";
      btnBuy.target = "_blank";
      btnBuy.rel = "noopener";
      btnBuy.textContent = state.mode === "tickets" ? "Buy ticket" : "Get pass";
      btnBuy.addEventListener("click", (e) => e.stopPropagation());

      actions.appendChild(btnDetails);
      actions.appendChild(btnBuy);

      card.appendChild(top);
      card.appendChild(desc);
      card.appendChild(actions);

      // Card interactions
      card.addEventListener("click", () => openModal(item));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
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

    if (elCount) elCount.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;

    while (elList.firstChild) elList.removeChild(elList.firstChild);

    if (items.length === 0) {
      renderEmpty();
      return;
    }

    // Group by day for scanability (US-friendly for schedules)
    const groups = groupByDay(items);
    groups.forEach(([day, arr]) => renderCardsForDay(day, arr));
  }

  // -------------------------
  // Event wiring
  // -------------------------
  function bind() {
    // Tabs
    elModeTickets.addEventListener("click", () => {
      if (state.mode === "tickets") return;
      state.mode = "tickets";
      // Keep Day + Search; reset mode-specific facets for predictability
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

    // Primary filters
    if (elDay) {
      elDay.addEventListener("change", () => {
        state.filters.day = elDay.value;
        render();
      });
    }

    if (elQuery) {
      elQuery.addEventListener("input", () => {
        state.filters.q = elQuery.value || "";
        render();
      });
    }

    if (elReset) {
      elReset.addEventListener("click", () => {
        state.filters.day = "all";
        state.filters.q = "";
        state.filters.venue = "all";
        state.filters.kind = "all";
        if (elDay) elDay.value = "all";
        if (elQuery) elQuery.value = "";
        if (elVenue) elVenue.value = "all";
        if (elKind) elKind.value = "all";
        render();
      });
    }

    // Progressive disclosure (More filters)
    if (elMoreBtn) {
      elMoreBtn.addEventListener("click", () => setMoreOpen(!state.moreOpen));
    }

    // Advanced filters (mode-specific)
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

    // Modal close
    if (modal) {
      modal.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.dataset && t.dataset.close === "1") closeModal();
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && modal.getAttribute("aria-hidden") === "false") closeModal();
    });

    // Save
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

  // -------------------------
  // Init
  // -------------------------
  setMoreOpen(false);      // progressive disclosure default closed
  hydrateFilters();        // populate select options for default mode
  bind();
  render();
})();
