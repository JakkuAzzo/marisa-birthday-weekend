(() => {
  const config = window.MARISA_CONFIG || {};
  const storageKeys = { rsvps: "marisa-birthday-rsvps", notes: "marisa-birthday-notes", media: "marisa-birthday-media" };
  const photos = [
    { src: "assets/photos/marisa-roses.jpeg", caption: "The birthday girl", alt: "Marisa holding roses beside the water", tilt: "-2deg" },
    { src: "assets/photos/marisa-water.jpeg", caption: "A little sunshine", alt: "Marisa smiling by the water", tilt: "2deg" },
    { src: "assets/photos/family-flowers.jpeg", caption: "Flower wall energy", alt: "Marisa and a friend sitting in front of a flower wall", tilt: "-1deg" },
    { src: "assets/photos/group-bus.jpeg", caption: "The travelling party", alt: "Friends taking a photo on a bus", tilt: "3deg" },
    { src: "assets/photos/marisa-nafe-water.jpeg", caption: "Good company", alt: "Marisa and Nafe together by the water", tilt: "-3deg" },
    { src: "assets/photos/family-shopping.jpeg", caption: "Family outing", alt: "Family and friends smiling together", tilt: "1deg" },
    { src: "assets/photos/marisa-hat-bw.jpeg", caption: "Main character", alt: "Marisa posing in a hat", tilt: "-2deg" },
    { src: "assets/photos/marisa-tree.jpeg", caption: "Outside, always", alt: "Marisa standing beneath a blossom tree", tilt: "2deg" },
    { src: "assets/photos/marisa-flowers-close.jpeg", caption: "Birthday glow", alt: "Close-up portrait of Marisa with roses", tilt: "-1deg" },
    { src: "assets/photos/friends-outdoors.jpeg", caption: "The best people", alt: "Marisa laughing with a friend outdoors", tilt: "2deg" },
    { src: "assets/photos/family-table.jpeg", caption: "Together", alt: "Family and friends gathered at a table", tilt: "-2deg" },
    { src: "assets/photos/couple-close.jpeg", caption: "Always a moment", alt: "A close-up photo of two people smiling", tilt: "1deg" }
  ];
  const archivePhotos = [
    ["marisa-nafe-food.jpeg", "Food and fuss", "Marisa and Nafe sharing a plate"],
    ["marisa-face-flower.jpeg", "Flower wall close-up", "Close-up portrait of Marisa in front of flowers"],
    ["marisa-window.jpeg", "Golden hour", "Marisa sitting by a window"],
    ["marisa-magenta.jpeg", "Purple lights", "Marisa in purple light"],
    ["marisa-profile-magenta.jpeg", "A soft profile", "Marisa in side profile under purple light"],
    ["marisa-hood-magenta.jpeg", "Hood up", "Marisa posing in a hood under pink light"],
    ["marisa-hood.jpeg", "Classic Marisa", "Marisa in a black varsity jacket"],
    ["marisa-portrait.jpeg", "Portrait day", "Portrait of Marisa in a patterned dress"],
    ["marisa-seating.jpeg", "Up high", "Marisa sitting above the room"],
    ["marisa-purple-seating.jpeg", "Electric blue", "Marisa sitting in purple light"],
    ["marisa-profile.jpeg", "Looking out", "Marisa looking into the distance"],
    ["marisa-dinner.jpeg", "Dinner plans", "Marisa at a restaurant"],
    ["group-table-portrait.jpeg", "All together", "Family and friends around a table"],
    ["friends-hotel.jpeg", "Hotel laughs", "Friends laughing together indoors"],
    ["marisa-hat.jpeg", "Hat moment", "Marisa posing in a sun hat"],
    ["marisa-evening-city.jpeg", "City lights", "Marisa by the river at dusk"],
    ["marisa-gold-dress.jpeg", "Golden glow", "Marisa in a gold dress"],
    ["marisa-bus.jpeg", "On the move", "Marisa on a blue-lit bus"],
    ["marisa-bouquet.jpeg", "Bouquet girl", "Marisa with a bouquet beside the water"],
    ["marisa-hair.jpeg", "Hair day", "Marisa showing off her hair"],
    ["marisa-park-friend.jpeg", "Good company", "Marisa and a friend out and about"],
    ["marisa-laughing-field.jpeg", "Big laugh", "Marisa laughing outside"],
    ["marisa-among-us.jpeg", "Game night", "Marisa in an Among Us sweatshirt"],
    ["marisa-coat.jpeg", "Cosy season", "Marisa in a warm coat"],
    ["couple-couch.jpeg", "Couch crew", "Marisa and Nafe relaxing together"],
    ["family-dinner.jpeg", "Dinner together", "Family and friends sharing a meal"],
    ["marisa-browns.jpeg", "Browns night", "Marisa outside Browns"],
    ["marisa-white-dress.jpeg", "White dress", "Marisa smiling in a white dress"]
  ].map(([file, caption, alt], index) => ({ src: `assets/photos/${file}`, caption, alt, tilt: `${index % 2 ? 1 : -1}deg` }));
  const allPhotos = [...photos, ...archivePhotos];
  const defaultAttendees = [
    { name: "Marisa", image: "assets/photos/marisa-roses.jpeg" },
    { name: "Nafe", image: "assets/photos/marisa-nafe-water.jpeg" },
    { name: "Alex", image: "assets/photos/group-bus.jpeg" },
    { name: "Max", image: "assets/photos/boat-night.jpeg" },
    { name: "Rosie", image: "assets/photos/friends-outdoors.jpeg" },
    { name: "+12", more: true }
  ];
  let liveRsvps = defaultAttendees.slice(0, -1).map((person) => ({ name: person.name, days: [], staying: "Unknown" }));
  let memoryPage = 0;
  const contributions = [
    { id: "boat", title: "Boat hire", detail: "2 hours · Sunday before sunset", icon: "ph-sailboat", amount: () => config.contributionAmounts?.boat ?? 31 },
    { id: "cinema", title: "Vue cinema", detail: "Spider-Man: Brand New Day", icon: "ph-film-strip", amount: () => config.contributionAmounts?.cinema ?? 12 },
    { id: "stay", title: "Accommodation", detail: "3 nights · estimated 5 paying guests", icon: "ph-house-line", amount: () => config.contributionAmounts?.stay ?? 82.80 },
    { id: "gift", title: "Gift fund", detail: "Optional group gift for Marisa", icon: "ph-gift", amount: () => config.contributionAmounts?.gift ?? 15 }
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = (value) => `£${Number(value).toFixed(2)}`;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));

  let toastTimer;
  const toast = (message) => {
    const node = $("[data-toast]");
    node.textContent = message;
    node.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => node.classList.remove("is-visible"), 4200);
  };

  const getRsvps = () => {
    const local = read(storageKeys.rsvps, []);
    const merged = [...liveRsvps];
    local.forEach((person) => {
      const index = merged.findIndex((item) => item.name.toLowerCase() === person.name.toLowerCase());
      if (index >= 0) merged[index] = { ...merged[index], ...person, source: "this browser" };
      else merged.push({ ...person, source: "this browser" });
    });
    return merged;
  };

  const renderAttendees = () => {
    const node = $("[data-attendees]");
    const rsvps = getRsvps();
    const dynamic = rsvps.filter((person) => !defaultAttendees.some((item) => item.name.toLowerCase() === person.name.toLowerCase())).slice(-3);
    const list = [...defaultAttendees.slice(0, -1), ...dynamic, defaultAttendees.at(-1)];
    node.innerHTML = list.map((person) => person.more
      ? `<div class="attendee is-more"><span class="attendee-avatar">+12</span><span>more</span></div>`
      : `<div class="attendee"><span class="attendee-avatar">${person.image ? `<img src="${person.image}" alt="" />` : escapeHtml(person.name.slice(0, 1))}</span><span>${escapeHtml(person.name)}</span></div>`).join("");
    $("[data-rsvp-count]").textContent = rsvps.length;
    $("[data-rsvp-label]").textContent = config.LIVE_RSVPS_URL ? "people currently on the live weekend list" : "responses saved in this browser";
  };

  const loadLiveRsvps = async () => {
    if (!config.LIVE_RSVPS_URL) return;
    try {
      const response = await fetch(`${config.LIVE_RSVPS_URL}?updated=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error("Live RSVP feed unavailable");
      const payload = await response.json();
      if (Array.isArray(payload.responses)) { liveRsvps = payload.responses; renderAttendees(); }
    } catch {
      renderAttendees();
    }
  };

  const renderContributions = () => {
    const node = $("[data-contributions]");
    node.innerHTML = contributions.map((item) => `<div class="contribution-row" data-contribution-row="${item.id}">
      <button class="contribution-check" type="button" aria-pressed="false" aria-label="Select ${item.title}" data-contribution-toggle="${item.id}"></button>
      <span class="contribution-icon"><i class="ph ${item.icon}" aria-hidden="true"></i></span>
      <span class="contribution-copy"><strong>${item.title}</strong><span>${item.detail}</span></span>
      <span class="contribution-price">${money(item.amount())}</span>
    </div>`).join("");
    $$('[data-contribution-toggle]').forEach((button) => button.addEventListener("click", () => {
      const row = button.closest("[data-contribution-row]");
      const selected = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(selected));
      row.classList.toggle("is-selected", selected);
      updatePaymentTotals();
    }));
  };

  const selectedContributionIds = () => $$('[data-contribution-toggle][aria-pressed="true"]').map((button) => button.dataset.contributionToggle);
  const updatePaymentTotals = () => {
    const total = selectedContributionIds().reduce((sum, id) => sum + contributions.find((item) => item.id === id).amount(), 0);
    $("[data-selected-total]").textContent = `${money(total)} selected`;
    $("[data-pay-total]").textContent = money(total);
  };

  const renderMemories = () => {
    const node = $("[data-memory-grid]");
    const notes = read(storageKeys.notes, []);
    const media = read(storageKeys.media, []);
    const cards = [
      ...allPhotos.map((photo) => `<figure class="memory-card" style="--tilt:${photo.tilt}"><img src="${photo.src}" alt="${photo.alt}" loading="lazy" /><figcaption><strong>${photo.caption}</strong>from the archive</figcaption></figure>`),
      ...notes.map((note) => `<figure class="memory-card is-note" style="--tilt:${note.tilt || "0deg"}"><blockquote>“${escapeHtml(note.body)}”</blockquote><figcaption><strong>${escapeHtml(note.name)}</strong>${escapeHtml(note.mood)}</figcaption></figure>`),
      ...media.map((item) => {
        if (item.type === "message") return `<figure class="memory-card is-note" style="--tilt:${item.tilt || "0deg"}"><blockquote>“${escapeHtml(item.caption)}”</blockquote><figcaption><strong>${escapeHtml(item.name)}</strong>shared message</figcaption></figure>`;
        const content = item.type === "video" ? `<video controls src="${item.url}" aria-label="Video shared by ${escapeHtml(item.name)}"></video>` : item.type === "audio" ? `<audio controls src="${item.url}" aria-label="Voice note shared by ${escapeHtml(item.name)}"></audio>` : `<img src="${item.url}" alt="${escapeHtml(item.name)}'s uploaded memory" />`;
        return `<figure class="memory-card ${item.type === "video" ? "is-video" : ""} ${item.type === "audio" ? "is-audio" : ""}" style="--tilt:${item.tilt || "1deg"}">${content}<figcaption><strong>${escapeHtml(item.name)}</strong>${escapeHtml(item.caption || (item.type === "audio" ? "voice note" : "shared memory"))}</figcaption></figure>`;
      })
    ];
    const pageCount = Math.max(1, Math.ceil(cards.length / 10));
    memoryPage = Math.min(memoryPage, pageCount - 1);
    const start = memoryPage * 10;
    node.innerHTML = cards.slice(start, start + 10).join("");
    $("[data-memory-meta]").textContent = `Showing ${start + 1}–${Math.min(start + 10, cards.length)} of ${cards.length} memories · page ${memoryPage + 1} of ${pageCount}`;
    $("[data-memory-prev]").disabled = memoryPage === 0;
    $("[data-memory-next]").disabled = memoryPage >= pageCount - 1;
  };

  const calendarEvents = [
    ["20260821T090000", "20260821T120000", "The Breakfast Club", "Marisa's birthday weekend"],
    ["20260821T140000", "20260821T170000", "Park picnic + drinks", "Indoor backup if raining"],
    ["20260821T190000", "20260821T230000", "Cake, food, gifts + games", "At the accommodation"],
    ["20260822T110000", "20260822T150000", "Games + drinks", "At the accommodation"],
    ["20260822T190000", "20260822T235900", "Arcade / club / girls' night", "Final activity based on the group vote"],
    ["20260823T120000", "20260823T140000", "Pub or restaurant meet", "Details to be confirmed"],
    ["20260823T150000", "20260823T170000", "Boat hire", "Two hours before sunset"],
    ["20260823T180000", "20260823T210000", "Vue cinema: Spider-Man: Brand New Day", "Croydon"],
    ["20260824T100000", "20260824T120000", "Slow morning + goodbyes", "Check-out day"]
  ];
  const makeIcs = () => {
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Marisa Birthday Weekend//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH"];
    calendarEvents.forEach(([start, end, title, description], index) => lines.push("BEGIN:VEVENT", `UID:marisa-birthday-${index}@birthday`, `DTSTAMP:20260801T120000Z`, `DTSTART;TZID=Europe/London:${start}`, `DTEND;TZID=Europe/London:${end}`, `SUMMARY:${title}`, `DESCRIPTION:${description}`, "END:VEVENT"));
    lines.push("END:VCALENDAR");
    return lines.join("\r\n");
  };
  const downloadCalendar = () => {
    if (config.SHARED_CALENDAR_URL) { window.open(config.SHARED_CALENDAR_URL, "_blank", "noopener"); return; }
    const blob = new Blob([makeIcs()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = "marisa-birthday-weekend.ics"; link.click(); URL.revokeObjectURL(url);
    toast("Calendar downloaded — add it to your phone or calendar app.");
  };

  const setupCountdown = () => {
    const target = new Date("2026-08-21T09:00:00+01:00").getTime();
    const node = $("[data-countdown]");
    const update = () => {
      const difference = target - Date.now();
      if (difference <= 0) { node.textContent = "It’s birthday weekend!"; return; }
      const days = Math.floor(difference / 86400000);
      const hours = Math.floor((difference % 86400000) / 3600000);
      const minutes = Math.floor((difference % 3600000) / 60000);
      node.textContent = `${days}d ${hours}h ${minutes}m to go`;
    };
    update(); window.setInterval(update, 60000);
  };

  const setupMenu = () => {
    const button = $("[data-menu-button]"); const nav = $("[data-mobile-nav]");
    button.addEventListener("click", () => { const open = !nav.classList.contains("is-open"); nav.classList.toggle("is-open", open); button.setAttribute("aria-expanded", String(open)); button.innerHTML = `<span class="sr-only">${open ? "Close" : "Open"} menu</span><i class="ph ${open ? "ph-x" : "ph-list"}" aria-hidden="true"></i>`; });
    $$('a', nav).forEach((link) => link.addEventListener("click", () => { nav.classList.remove("is-open"); button.setAttribute("aria-expanded", "false"); button.innerHTML = '<span class="sr-only">Open menu</span><i class="ph ph-list" aria-hidden="true"></i>'; }));
  };

  const setupReveals = () => {
    if (!("IntersectionObserver" in window)) { $$(".reveal").forEach((node) => node.classList.add("is-visible")); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: .1 });
    $$(".reveal").forEach((node) => observer.observe(node));
  };

  const isBirthdayToday = () => {
    const londonDate = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    return londonDate === "21/08/2026";
  };

  const unlockWebsite = (mode) => {
    try { sessionStorage.setItem("marisa-birthday-access", mode); } catch { /* private browsing can disable storage */ }
    document.documentElement.classList.remove("is-gated");
    document.body.classList.add("is-unlocked");
    const marisaView = $("[data-marisa-view]");
    if (mode === "marisa") {
      document.body.classList.add("is-marisa-mode");
      marisaView.hidden = false;
    }
  };

  const setupGate = () => {
    let access = "";
    try { access = sessionStorage.getItem("marisa-birthday-access") || ""; } catch { /* continue locked */ }
    if (access === "guest" || access === "marisa") { unlockWebsite(access); return; }
    const form = $("[data-gate-form]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = new FormData(form).get("password").toString().trim().toLowerCase();
      const status = $("[data-gate-status]");
      if (password === "happybirthday") { status.textContent = "Welcome in — keep the link within the group."; unlockWebsite("guest"); return; }
      if (password === "210803") {
        if (isBirthdayToday()) { unlockWebsite("marisa"); return; }
        status.textContent = "nuh uhhhh you gotta wait silly billy";
        form.reset();
        return;
      }
      status.textContent = "Nope. Nothing to see here 🤨";
      form.reset();
    });
    $("[data-marisa-back]").addEventListener("click", () => {
      document.body.classList.remove("is-marisa-mode");
      $("[data-marisa-view]").hidden = true;
      try { sessionStorage.setItem("marisa-birthday-access", "guest"); } catch { /* no-op */ }
    });
  };

  const setupRsvp = () => $("[data-rsvp-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries()); data.days = new FormData(form).getAll("days"); data.createdAt = new Date().toISOString();
    const rsvps = read(storageKeys.rsvps, []); const existing = rsvps.findIndex((item) => item.name.toLowerCase() === data.name.toLowerCase());
    if (existing >= 0) rsvps[existing] = data; else rsvps.push(data); write(storageKeys.rsvps, rsvps); renderAttendees();
    if (config.RSVP_ENDPOINT) { try { await fetch(config.RSVP_ENDPOINT, { method: "POST", body: new FormData(form), mode: "no-cors" }); } catch { /* local save still succeeds */ } }
    $("[data-rsvp-status]").textContent = `Saved — see you ${data.days.length ? data.days.join(", ") : "when you can"}!`;
    toast("RSVP saved — refresh the page and it will still be here."); form.reset();
  });

  const setupNotes = () => $("[data-note-form]").addEventListener("submit", (event) => {
    event.preventDefault(); const data = Object.fromEntries(new FormData(event.currentTarget).entries()); data.createdAt = new Date().toISOString(); data.tilt = `${(Math.random() * 4 - 2).toFixed(1)}deg`;
    const notes = read(storageKeys.notes, []); notes.push(data); write(storageKeys.notes, notes); renderMemories(); event.currentTarget.reset(); $("[data-note-status]").textContent = "Your note is on the memory wall."; toast("Message added to the memory wall.");
  });

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });

  const setupMemoryForm = () => {
    const form = $("[data-memory-form]");
    const kind = $("#memory-kind");
    const input = $("[data-upload-input]");
    const dropzone = $(".upload-dropzone");
    const refreshFileRequirement = () => {
      input.required = kind.value !== "message";
      dropzone.querySelector("strong").textContent = kind.value === "message" ? "No file needed for a message" : `Choose or drop a ${kind.value}`;
    };
    kind.addEventListener("change", refreshFileRequirement);
    refreshFileRequirement();
    ["dragenter", "dragover"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.remove("is-dragging"); }));
    dropzone.addEventListener("drop", (event) => { if (event.dataTransfer.files.length) input.files = event.dataTransfer.files; });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const file = input.files[0];
      const status = $("[data-memory-status]");
      if (data.kind !== "message" && !file) { status.textContent = "Choose a file first, or switch to Written message."; return; }
      if (file && file.size > 25 * 1024 * 1024) { status.textContent = "That file is over 25MB — please choose a smaller one."; return; }
      if (config.UPLOAD_ENDPOINT) {
        const body = new FormData(form);
        try { await fetch(config.UPLOAD_ENDPOINT, { method: "POST", body }); } catch { status.textContent = "Cloud upload failed; saving this memory locally instead."; }
      }
      const existing = read(storageKeys.media, []);
      const item = { name: data.name, caption: data.caption, type: data.kind, createdAt: new Date().toISOString(), tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg` };
      if (file) item.url = await fileToDataUrl(file);
      existing.push(item);
      write(storageKeys.media, existing); memoryPage = Math.ceil((allPhotos.length + read(storageKeys.notes, []).length + existing.length) / 10) - 1; renderMemories(); form.reset(); refreshFileRequirement(); status.textContent = "Added — it is now in the memory carousel on this browser."; toast("Memory added to the carousel.");
    });
  };

  const setupMemoryCarousel = () => {
    $("[data-memory-prev]").addEventListener("click", () => { memoryPage -= 1; renderMemories(); });
    $("[data-memory-next]").addEventListener("click", () => { memoryPage += 1; renderMemories(); });
  };

  const setupPayments = () => $("[data-payment-action]").addEventListener("click", () => {
    const selected = selectedContributionIds(); if (!selected.length) { toast("Choose at least one shared cost first."); return; }
    if (config.STRIPE_COMBINED_CHECKOUT_URL) { window.open(config.STRIPE_COMBINED_CHECKOUT_URL, "_blank", "noopener"); return; }
    const links = selected.map((id) => config.stripePaymentLinks?.[id]).filter(Boolean);
    if (links.length === selected.length) { links.forEach((link) => window.open(link, "_blank", "noopener")); return; }
    toast("The contribution choices are ready. Add the public Stripe Payment Links in birthday/config.js to activate checkout.");
  });

  const setupCalendar = () => $$('[data-calendar-action="download"]').forEach((button) => button.addEventListener("click", downloadCalendar));
  const setupNavHighlight = () => {
    const links = $$(".main-nav a"); const sections = ["top", "plan", "attendees", "notes", "memories", "details"].map((id) => document.getElementById(id));
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) links.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`)); }), { rootMargin: "-40% 0px -55%", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  };

  renderAttendees(); renderContributions(); updatePaymentTotals(); renderMemories(); loadLiveRsvps(); setupGate(); setupCountdown(); setupMenu(); setupReveals(); setupRsvp(); setupNotes(); setupMemoryForm(); setupMemoryCarousel(); setupPayments(); setupCalendar(); setupNavHighlight();
})();
