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
  const defaultAttendees = [
    { name: "Marisa", image: "assets/photos/marisa-roses.jpeg" },
    { name: "Nafe", image: "assets/photos/marisa-nafe-water.jpeg" },
    { name: "Alex", image: "assets/photos/group-bus.jpeg" },
    { name: "Max", image: "assets/photos/boat-night.jpeg" },
    { name: "Rosie", image: "assets/photos/friends-outdoors.jpeg" },
    { name: "+12", more: true }
  ];
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

  const renderAttendees = () => {
    const node = $("[data-attendees]");
    const rsvps = read(storageKeys.rsvps, []);
    const dynamic = rsvps.filter((person) => !defaultAttendees.some((item) => item.name.toLowerCase() === person.name.toLowerCase())).slice(-3);
    const list = [...defaultAttendees.slice(0, -1), ...dynamic, defaultAttendees.at(-1)];
    node.innerHTML = list.map((person) => person.more
      ? `<div class="attendee is-more"><span class="attendee-avatar">+12</span><span>more</span></div>`
      : `<div class="attendee"><span class="attendee-avatar">${person.image ? `<img src="${person.image}" alt="" />` : escapeHtml(person.name.slice(0, 1))}</span><span>${escapeHtml(person.name)}</span></div>`).join("");
    $("[data-rsvp-count]").textContent = rsvps.length;
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
      ...photos.map((photo) => `<figure class="memory-card" style="--tilt:${photo.tilt}"><img src="${photo.src}" alt="${photo.alt}" loading="lazy" /><figcaption><strong>${photo.caption}</strong>from the archive</figcaption></figure>`),
      ...notes.map((note) => `<figure class="memory-card is-note" style="--tilt:${note.tilt || "0deg"}"><blockquote>“${escapeHtml(note.body)}”</blockquote><figcaption><strong>${escapeHtml(note.name)}</strong>${escapeHtml(note.mood)}</figcaption></figure>`),
      ...media.map((item) => `<figure class="memory-card ${item.type === "video" ? "is-video" : ""}" style="--tilt:${item.tilt || "1deg"}">${item.type === "video" ? `<video controls src="${item.url}" aria-label="Video shared by ${escapeHtml(item.name)}"></video>` : `<img src="${item.url}" alt="${escapeHtml(item.name)}'s uploaded memory" />`}<figcaption><strong>${escapeHtml(item.name)}</strong>shared memory</figcaption></figure>`)
    ];
    node.innerHTML = cards.slice(-16).join("");
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

  const setupRsvp = () => $("[data-rsvp-form]").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries()); data.days = new FormData(form).getAll("days"); data.createdAt = new Date().toISOString();
    const rsvps = read(storageKeys.rsvps, []); const existing = rsvps.findIndex((item) => item.name.toLowerCase() === data.name.toLowerCase());
    if (existing >= 0) rsvps[existing] = data; else rsvps.push(data); write(storageKeys.rsvps, rsvps); renderAttendees();
    if (config.RSVP_ENDPOINT) { try { await fetch(config.RSVP_ENDPOINT, { method: "POST", body: new FormData(form), mode: "no-cors" }); } catch { /* local save still succeeds */ } }
    $("[data-rsvp-status]").textContent = `Saved — see you ${data.days.length ? data.days.join(", ") : "when you can"}!`;
    toast("RSVP saved on this device."); form.reset();
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

  const setupUploads = () => {
    const input = $("[data-upload-input]"); $("[data-upload-trigger]").addEventListener("click", () => input.click());
    input.addEventListener("change", async () => {
      const files = [...input.files]; if (!files.length) return;
      if (config.UPLOAD_ENDPOINT) { const body = new FormData(); files.forEach((file) => body.append("media", file)); try { await fetch(config.UPLOAD_ENDPOINT, { method: "POST", body }); toast("Upload sent — it may take a moment to appear."); } catch { toast("Upload could not be sent, so it was kept locally instead."); } }
      const existing = read(storageKeys.media, []);
      const uploads = await Promise.all(files.map(async (file) => ({ name: "Your upload", url: await fileToDataUrl(file), type: file.type.startsWith("video") ? "video" : "image", createdAt: new Date().toISOString(), tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg` })));
      existing.push(...uploads);
      write(storageKeys.media, existing); renderMemories(); input.value = ""; toast("Your media is on the wall for this browser.");
    });
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

  renderAttendees(); renderContributions(); updatePaymentTotals(); renderMemories(); setupCountdown(); setupMenu(); setupReveals(); setupRsvp(); setupNotes(); setupUploads(); setupPayments(); setupCalendar(); setupNavHighlight();
})();
