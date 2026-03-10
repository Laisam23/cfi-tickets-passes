/**
 * CFI Browser — new UI logic
 * Versione coerente con il nuovo HTML layout
 */

(function () {
  const $ = (id) => document.getElementById(id);

  const elBrowser = $("cfiBrowser");
  const elOpenFiltersBtn = $("cfiOpenFiltersBtn");
  const elAdvancedFilters = $("cfiAdvancedFilters");

  const elDayChips = Array.from(document.querySelectorAll(".cfi-dayChip"));
  const elViewSelect = $("cfiViewSelect");
  const elTypeSelect = $("cfiTypeSelect");
  const elVenueSelect = $("cfiVenueSelect");
  const elPriceSelect = $("cfiPriceSelect");
  const elSearchInput = $("cfiSearchInput");
  const elResetFiltersBtn = $("cfiResetFiltersBtn");

  const elSubnavLinks = Array.from(document.querySelectorAll(".cfi-subnavLink"));

  const elResultsCount = $("cfiResultsCount");
  const elResultsList = $("cfiResultsList");
  const elEmptyState = $("cfiEmptyState");

  const elModal = $("cfiModal");
  const elModalEyebrow = $("cfiModalEyebrow");
  const elModalTitle = $("cfiModalTitle");
  const elModalMeta = $("cfiModalMeta");
  const elModalDesc = $("cfiModalDesc");
  const elModalTags = $("cfiModalTags");
  const elModalInclusionsWrap = $("cfiModalInclusionsWrap");
  const elModalInclusions = $("cfiModalInclusions");
  const elModalSaveBtn = $("cfiModalSaveBtn");
  const elModalBuyBtn = $("cfiModalBuyBtn");

  if (!elBrowser || !elResultsList || !elViewSelect) return;

  const DATA = [
    {
      id: "t1",
      kind: "ticket",
      day: "Friday",
      title: 'INTERNATIONAL FEATURE "ESPINA"',
      venue: "ACC Theatre",
      time: "10:00 AM",
      type: "Feature",
      price: 15,
      priceLabel: "From $15",
      description:
        "A featured screening within the festival programme, presented with premium venue access and standard ticket availability.",
      tags: ["Feature", "Drama", "Comedy"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t2",
      kind: "ticket",
      day: "Friday",
      title: "WAIT... WHAT?! (SHORTS)",
      venue: "Avalon City Hall",
      time: "10:30 AM",
      type: "Shorts",
      price: 15,
      priceLabel: "From $15",
      description:
        "A shorts block blending comedy, suspense and drama across a compact curated session.",
      tags: ["Shorts", "Drama", "Comedy", "Student"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t3",
      kind: "ticket",
      day: "Friday",
      title: "The Lion's Den: A Live Pitch Panel",
      venue: "Hotel Atwater",
      time: "11:00 AM",
      type: "Panel",
      price: 20,
      priceLabel: "From $20",
      description:
        "A live industry panel focused on pitching, festival strategy and project positioning.",
      tags: ["Panel", "Pitch", "Industry"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t4",
      kind: "ticket",
      day: "Friday",
      title: "Friday Evening Party",
      venue: "Catalina Casino",
      time: "9:30 PM",
      type: "Party",
      price: 25,
      priceLabel: "From $25",
      description:
        "Festival social event with evening access, networking atmosphere and celebration programming.",
      tags: ["Party", "Networking", "Evening"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t5",
      kind: "ticket",
      day: "Saturday",
      title: "HIGH SCHOOL (SHORTS)",
      venue: "ACC Theatre",
      time: "9:30 AM",
      type: "Shorts",
      price: 15,
      priceLabel: "From $15",
      description:
        "A student-focused shorts selection spanning suspense, romance, sci-fi and drama.",
      tags: ["Shorts", "Student", "Sci-Fi", "Drama"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t6",
      kind: "ticket",
      day: "Saturday",
      title: "DOCUMENTARIES (SHORTS)",
      venue: "Avalon City Hall",
      time: "10:00 AM",
      type: "Documentary",
      price: 15,
      priceLabel: "From $15",
      description:
        "A curated documentary shorts programme focused on art, politics, music and social themes.",
      tags: ["Documentary", "Art", "Social Impact"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t7",
      kind: "ticket",
      day: "Saturday",
      title: 'US FEATURE "GO ON"',
      venue: "ACC Theatre",
      time: "1:30 PM",
      type: "Feature",
      price: 18,
      priceLabel: "From $18",
      description:
        "A featured U.S. screening within the Saturday programme, presented in the main festival venue.",
      tags: ["Feature", "Drama"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t8",
      kind: "ticket",
      day: "Saturday",
      title: "Saturday Closing Party",
      venue: "Catalina Casino",
      time: "9:30 PM",
      type: "Party",
      price: 25,
      priceLabel: "From $25",
      description:
        "End-of-day gathering for festival guests, attendees and industry participants.",
      tags: ["Party", "Closing", "Networking"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t9",
      kind: "ticket",
      day: "Sunday",
      title: "Festival, Markets & Distribution",
      venue: "Avalon City Hall",
      time: "1:00 PM",
      type: "Panel",
      price: 20,
      priceLabel: "From $20",
      description:
        "Industry discussion on circulation, festival markets and distribution pathways for projects.",
      tags: ["Panel", "Distribution", "Industry"],
      inclusions: [],
      url: "#"
    },
    {
      id: "t10",
      kind: "ticket",
      day: "Sunday",
      title: "CATALINA SPOTLIGHT",
      venue: "Avalon City Hall",
      time: "2:30 PM",
      type: "Spotlight",
      price: 18,
      priceLabel: "From $18",
      description:
        "A spotlight session dedicated to selected work highlighted in the festival programme.",
      tags: ["Spotlight", "Documentary"],
      inclusions: [],
      url: "#"
    },
    {
      id: "p1",
      kind: "pass",
      day: "Friday",
      title: "Friday Cinema Pass",
      venue: "Festival-wide",
      time: "",
      type: "Day Pass",
      price: 79,
      priceLabel: "From $79",
      description:
        "Day pass covering Friday screenings and selected festival access, subject to capacity and programme availability.",
      tags: ["Day Pass", "Friday", "Priority Check-in"],
      inclusions: [
        "Access to Friday festival programming",
        "Priority check-in where available",
        "General seating subject to capacity"
      ],
      url: "#"
    },
    {
      id: "p2",
      kind: "pass",
      day: "Saturday",
      title: "Saturday Cinema Pass",
      venue: "Festival-wide",
      time: "",
      type: "Day Pass",
      price: 79,
      priceLabel: "From $79",
      description:
        "Day pass for Saturday screenings and selected events included in the official programme.",
      tags: ["Day Pass", "Saturday", "Priority Check-in"],
      inclusions: [
        "Access to Saturday festival programming",
        "Priority check-in where available",
        "General seating subject to capacity"
      ],
      url: "#"
    },
    {
      id: "p3",
      kind: "pass",
      day: "Sunday",
      title: "Sunday Cinema Pass",
      venue: "Festival-wide",
      time: "",
      type: "Day Pass",
      price: 69,
      priceLabel: "From $69",
      description:
        "Sunday pass for closing-day access and selected festival programming.",
      tags: ["Day Pass", "Sunday", "Closing Day"],
      inclusions: [
        "Access to Sunday festival programming",
        "Selected closing-day access",
        "General seating subject to capacity"
      ],
      url: "#"
    },
    {
      id: "p4",
      kind: "pass",
      day: "Friday",
      title: "Festival Premium Pass",
      venue: "Festival-wide",
      time: "",
      type: "Premium Pass",
      price: 149,
      priceLabel: "From $149",
      description:
        "Premium access pass with broader festival coverage and priority-oriented entry benefits.",
      tags: ["Premium Pass", "Priority", "Multi-access"],
      inclusions: [
        "Priority check-in",
        "Expanded access across festival experiences",
        "Selected premium entry benefits"
      ],
      url: "#"
    }
  ];

  const state = {
    day: "Friday",
    view: "all",
    type: "all",
    venue: "all",
    price: "all",
    search: "",
    advancedOpen: false,
    modalId: null,
    saved: new Set()
  };

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function timeToMinutes(value) {
    if (!value) return 99999;
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 99999;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3].toUpperCase();

    if (hours === 12) hours = 0;
    if (period === "PM") hours += 12;

    return hours * 60 + minutes;
  }

  function uniq(values) {
    return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  function buildSelectOptions(selectEl, items, firstLabel) {
    if (!selectEl) return;

    selectEl.innerHTML = "";
    const first = document.createElement("option");
    first.value = "all";
    first.textContent = firstLabel;
    selectEl.appendChild(first);

    items.forEach((item) => {
      const option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      selectEl.appendChild(option);
    });
  }

  function getVisibleDataset() {
    return DATA.filter((item) => item.day === state.day);
  }

  function populateDynamicFilters() {
    const dayItems = getVisibleDataset();

    const allowedByView =
      state.view === "all"
        ? dayItems
        : dayItems.filter((item) => item.kind === state.view.slice(0, -1));

    const types = uniq(allowedByView.map((item) => item.type));
    const venues = uniq(
      allowedByView
        .map((item) => item.venue)
        .filter((venue) => venue && venue !== "Festival-wide")
    );

    buildSelectOptions(elTypeSelect, types, "Any type");
    buildSelectOptions(elVenueSelect, venues, "All venues");

    if (![...elTypeSelect.options].some((opt) => opt.value === state.type)) {
      state.type = "all";
    }
    if (![...elVenueSelect.options].some((opt) => opt.value === state.venue)) {
      state.venue = "all";
    }

    elTypeSelect.value = state.type;
    elVenueSelect.value = state.venue;
  }

  function matchesView(item) {
    if (state.view === "all") return true;
    if (state.view === "tickets") return item.kind === "ticket";
    if (state.view === "passes") return item.kind === "pass";
    return true;
  }

  function matchesType(item) {
    return state.type === "all" || item.type === state.type;
  }

  function matchesVenue(item) {
    return state.venue === "all" || item.venue === state.venue;
  }

  function matchesPrice(item) {
    if (state.price === "all") return true;
    if (state.price === "low") return item.price < 25;
    if (state.price === "mid") return item.price < 50;
    if (state.price === "high") return item.price >= 50;
    return true;
  }

  function matchesSearch(item) {
    const q = state.search.trim().toLowerCase();
    if (!q) return true;

    const haystack = [
      item.title,
      item.venue,
      item.time,
      item.type,
      item.kind,
      item.description,
      ...(item.tags || []),
      ...(item.inclusions || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  }

  function getFilteredItems() {
    return DATA
      .filter((item) => item.day === state.day)
      .filter(matchesView)
      .filter(matchesType)
      .filter(matchesVenue)
      .filter(matchesPrice)
      .filter(matchesSearch)
      .sort((a, b) => {
        if (a.kind !== b.kind) return a.kind.localeCompare(b.kind);
        return timeToMinutes(a.time) - timeToMinutes(b.time);
      });
  }

  function getEyebrow(kind) {
    return kind === "pass" ? "Pass" : "Ticket";
  }

  function getMetaLine(item) {
    if (item.kind === "pass") {
      return item.venue === "Festival-wide"
        ? `Valid for ${item.day} festival programming`
        : `${item.venue} · ${item.day}`;
    }

    const bits = [item.venue, item.day, item.time].filter(Boolean);
    return bits.join(" · ");
  }

  function getActionLabel(item) {
    return item.kind === "pass" ? "Get pass" : "Buy ticket";
  }

  function createCard(item) {
    const tagsHtml = (item.tags || [])
      .map((tag) => `<span class="cfi-tag">${escapeHtml(tag)}</span>`)
      .join("");

    return `
      <article class="cfi-resultCard" data-id="${escapeHtml(item.id)}" data-kind="${escapeHtml(item.kind)}" data-day="${escapeHtml(item.day)}">
        <div class="cfi-resultCardTop">
          <div class="cfi-resultCardHeading">
            <p class="cfi-resultEyebrow">${escapeHtml(getEyebrow(item.kind))}</p>
            <h3 class="cfi-resultTitle">${escapeHtml(item.title)}</h3>
            <p class="cfi-resultLocation">${escapeHtml(getMetaLine(item))}</p>
          </div>

          <div class="cfi-resultMeta">
            <span class="cfi-resultPrice">${escapeHtml(item.priceLabel)}</span>
          </div>
        </div>

        <div class="cfi-resultCardBody">
          <p class="cfi-resultDescription">${escapeHtml(item.description)}</p>

          <div class="cfi-resultTags">
            ${tagsHtml}
          </div>
        </div>

        <div class="cfi-resultCardFooter">
          <button class="cfi-actionBtn cfi-actionBtnGhost" type="button" data-action="details" data-id="${escapeHtml(item.id)}">
            Details
          </button>
          <a class="cfi-actionBtn cfi-actionBtnPrimary" href="${escapeHtml(item.url)}" data-action="buy" data-id="${escapeHtml(item.id)}">
            ${escapeHtml(getActionLabel(item))}
          </a>
        </div>
      </article>
    `;
  }

  function renderResults() {
    populateDynamicFilters();

    const items = getFilteredItems();

    elResultsCount.textContent = `${items.length} result${items.length === 1 ? "" : "s"}`;

    if (!items.length) {
      elResultsList.innerHTML = "";
      if (elEmptyState) elEmptyState.hidden = false;
      return;
    }

    if (elEmptyState) elEmptyState.hidden = true;
    elResultsList.innerHTML = items.map(createCard).join("");
  }

  function syncDayUI() {
    elDayChips.forEach((chip) => {
      const isActive = chip.dataset.day === state.day;
      chip.classList.toggle("is-active", isActive);
      chip.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  function syncViewUI() {
    if (elViewSelect) {
      elViewSelect.value = state.view;
    }

    elSubnavLinks.forEach((btn) => {
      const isActive = btn.dataset.view === state.view;
      btn.classList.toggle("is-active", isActive);
    });
  }

  function syncAdvancedUI() {
    if (elAdvancedFilters) {
      elAdvancedFilters.hidden = !state.advancedOpen;
    }

    if (elOpenFiltersBtn) {
      elOpenFiltersBtn.setAttribute("aria-expanded", state.advancedOpen ? "true" : "false");
    }
  }

  function resetFilters() {
    state.view = "all";
    state.type = "all";
    state.venue = "all";
    state.price = "all";
    state.search = "";
    state.advancedOpen = false;

    if (elViewSelect) elViewSelect.value = "all";
    if (elTypeSelect) elTypeSelect.value = "all";
    if (elVenueSelect) elVenueSelect.value = "all";
    if (elPriceSelect) elPriceSelect.value = "all";
    if (elSearchInput) elSearchInput.value = "";

    syncViewUI();
    syncAdvancedUI();
    renderResults();
  }

  function openModal(itemId) {
    const item = DATA.find((entry) => entry.id === itemId);
    if (!item || !elModal) return;

    state.modalId = item.id;

    elModalEyebrow.textContent = getEyebrow(item.kind);
    elModalTitle.textContent = item.title;
    elModalMeta.textContent = getMetaLine(item);
    elModalDesc.textContent = item.description;

    elModalTags.innerHTML = (item.tags || [])
      .map((tag) => `<span class="cfi-tag">${escapeHtml(tag)}</span>`)
      .join("");

    if (item.kind === "pass" && item.inclusions && item.inclusions.length) {
      elModalInclusionsWrap.hidden = false;
      elModalInclusions.innerHTML = item.inclusions
        .map((entry) => `<li>${escapeHtml(entry)}</li>`)
        .join("");
    } else {
      elModalInclusionsWrap.hidden = true;
      elModalInclusions.innerHTML = "";
    }

    elModalBuyBtn.textContent = getActionLabel(item);
    elModalBuyBtn.href = item.url || "#";

    const isSaved = state.saved.has(item.id);
    elModalSaveBtn.textContent = isSaved ? "Saved" : "Save";
    elModalSaveBtn.disabled = isSaved;

    elModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("cfi-lock");
  }

  function closeModal() {
    if (!elModal) return;
    elModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("cfi-lock");
    state.modalId = null;
  }

  function bindEvents() {
    elDayChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        state.day = chip.dataset.day || "Friday";
        syncDayUI();
        renderResults();
      });
    });

    if (elViewSelect) {
      elViewSelect.addEventListener("change", () => {
        state.view = elViewSelect.value;
        syncViewUI();
        renderResults();
      });
    }

    elSubnavLinks.forEach((btn) => {
      btn.addEventListener("click", () => {
        state.view = btn.dataset.view || "all";
        syncViewUI();
        renderResults();
      });
    });

    if (elTypeSelect) {
      elTypeSelect.addEventListener("change", () => {
        state.type = elTypeSelect.value;
        renderResults();
      });
    }

    if (elVenueSelect) {
      elVenueSelect.addEventListener("change", () => {
        state.venue = elVenueSelect.value;
        renderResults();
      });
    }

    if (elPriceSelect) {
      elPriceSelect.addEventListener("change", () => {
        state.price = elPriceSelect.value;
        renderResults();
      });
    }

    if (elSearchInput) {
      elSearchInput.addEventListener("input", () => {
        state.search = elSearchInput.value || "";
        renderResults();
      });
    }

    if (elOpenFiltersBtn) {
      elOpenFiltersBtn.addEventListener("click", () => {
        state.advancedOpen = !state.advancedOpen;
        syncAdvancedUI();
      });
    }

    if (elResetFiltersBtn) {
      elResetFiltersBtn.addEventListener("click", resetFilters);
    }

    if (elResultsList) {
      elResultsList.addEventListener("click", (event) => {
        const detailsBtn = event.target.closest('[data-action="details"]');
        if (detailsBtn) {
          openModal(detailsBtn.dataset.id);
        }
      });
    }

    if (elModal) {
      elModal.addEventListener("click", (event) => {
        const closeBtn = event.target.closest("[data-close='1']");
        if (closeBtn || event.target === elModal) {
          closeModal();
        }
      });
    }

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elModal && elModal.getAttribute("aria-hidden") === "false") {
        closeModal();
      }
    });

    if (elModalSaveBtn) {
      elModalSaveBtn.addEventListener("click", () => {
        if (!state.modalId) return;
        state.saved.add(state.modalId);
        elModalSaveBtn.textContent = "Saved";
        elModalSaveBtn.disabled = true;
      });
    }
  }

  function init() {
    syncDayUI();
    syncViewUI();
    syncAdvancedUI();
    renderResults();
    bindEvents();
  }

  init();
})();
