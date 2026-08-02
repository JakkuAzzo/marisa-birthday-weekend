(() => {
  const config = window.MARISA_CONFIG || {};
  const siteBase = (config.PUBLIC_SITE_URL || `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}`).replace(/\/?$/, "/");
  const storageKeys = { rsvps: "marisa-birthday-rsvps", notes: "marisa-birthday-notes", media: "marisa-birthday-media", payments: "marisa-birthday-payments" };
  const photos = [
    { src: "assets/photos/optimized/marisa-roses.webp", caption: "The birthday girl", alt: "Marisa holding roses beside the water", tilt: "-2deg" },
    { src: "assets/photos/optimized/marisa-water.webp", caption: "A little sunshine", alt: "Marisa smiling by the water", tilt: "2deg" },
    { src: "assets/photos/optimized/family-flowers.webp", caption: "Flower wall energy", alt: "Marisa and a friend sitting in front of a flower wall", tilt: "-1deg" },
    { src: "assets/photos/optimized/group-bus.webp", caption: "The travelling party", alt: "Friends taking a photo on a bus", tilt: "3deg" },
    { src: "assets/photos/optimized/marisa-nafe-water.webp", caption: "Good company", alt: "Marisa and Nafe together by the water", tilt: "-3deg" },
    { src: "assets/photos/optimized/family-shopping.webp", caption: "Family outing", alt: "Family and friends smiling together", tilt: "1deg" },
    { src: "assets/photos/optimized/marisa-hat-bw.webp", caption: "Main character", alt: "Marisa posing in a hat", tilt: "-2deg" },
    { src: "assets/photos/optimized/marisa-tree.webp", caption: "Outside, always", alt: "Marisa standing beneath a blossom tree", tilt: "2deg" },
    { src: "assets/photos/optimized/marisa-flowers-close.webp", caption: "Birthday glow", alt: "Close-up portrait of Marisa with roses", tilt: "-1deg" },
    { src: "assets/photos/optimized/friends-outdoors.webp", caption: "The best people", alt: "Marisa laughing with a friend outdoors", tilt: "2deg" },
    { src: "assets/photos/optimized/family-table.webp", caption: "Together", alt: "Family and friends gathered at a table", tilt: "-2deg" },
    { src: "assets/photos/optimized/couple-close.webp", caption: "Always a moment", alt: "A close-up photo of two people smiling", tilt: "1deg" }
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
  ].map(([file, caption, alt], index) => ({ src: `assets/photos/optimized/${file.replace(/\.jpeg$/, ".webp")}`, caption, alt, tilt: `${index % 2 ? 1 : -1}deg` }));
  const allPhotos = [...photos, ...archivePhotos];
  const partyObstaclePhotos = [
    "assets/photos/optimized/marisa-hat.webp",
    "assets/photos/optimized/marisa-tree.webp",
    "assets/photos/optimized/marisa-magenta.webp",
    "assets/photos/optimized/family-table.webp",
    "assets/photos/optimized/group-bus.webp",
    "assets/photos/optimized/marisa-gold-dress.webp",
    "assets/photos/optimized/marisa-bus.webp",
    "assets/photos/optimized/friends-outdoors.webp"
  ];
  const firstBirthdayMedia = {
    video: "assets/media/marisa-first-birthday.mp4",
    poster: "assets/photos/optimized/marisa-bouquet.webp",
  };
  const defaultAttendees = [
    { name: "Marisa", image: "assets/photos/optimized/marisa-roses.webp" },
    { name: "Nafe", image: "assets/photos/optimized/marisa-nafe-water.webp" },
    { name: "Alex", image: "assets/photos/optimized/group-bus.webp" },
    { name: "Max", image: "assets/photos/optimized/boat-night.webp" },
    { name: "Rosie", image: "assets/photos/optimized/friends-outdoors.webp" },
    { name: "+12", more: true }
  ];
  let liveRsvps = [];
  let sharedNotes = [];
  let sharedMedia = [];
  let memoryPage = 0;
  let marisaWrappedSlide = 0;
  let marisaWrappedMode = false;
  let partyGame = null;
  const contributions = [
    { id: "gift", title: "Gift fund", detail: "Optional group gift for Marisa", icon: "ph-gift", amount: () => config.contributionAmounts?.gift ?? 15 }
  ];

  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } };
  const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const money = (value) => `£${Number(value).toFixed(2)}`;
  const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" }[char]));
  const sharedBase = config.FIREBASE_DATABASE_URL ? `${config.FIREBASE_DATABASE_URL.replace(/\/$/, "")}/birthday` : "";
  const sharedFetch = async (path, options = {}) => {
    if (!sharedBase) return null;
    const response = await fetch(`${sharedBase}/${path}.json`, { cache: "no-store", ...options, headers: { "Content-Type": "application/json", ...(options.headers || {}) } });
    if (!response.ok) throw new Error(`Shared storage returned ${response.status}`);
    return response.status === 204 ? null : response.json();
  };
  const sharedItems = (payload) => payload && typeof payload === "object" ? Object.entries(payload).map(([remoteId, item]) => ({ ...item, remoteId })) : [];
  const pushShared = async (collection, item) => {
    if (!sharedBase) return false;
    const response = await sharedFetch(collection, { method: "POST", body: JSON.stringify({ ...item, access: config.FIREBASE_ACCESS_KEY }) });
    return Boolean(response?.name);
  };
  const mergeShared = (shared, local) => [...shared, ...local.filter((item) => !shared.some((remote) => remote.createdAt && remote.createdAt === item.createdAt && remote.name === item.name))];

  const getWrappedData = () => {
    const localRsvps = read(storageKeys.rsvps, []);
    const rsvps = [...liveRsvps, ...localRsvps].reduce((list, person) => {
      if (!person?.name || list.some((item) => item.name.toLowerCase() === person.name.toLowerCase())) return list;
      list.push(person);
      return list;
    }, []);
    const notes = mergeShared(sharedNotes, read(storageKeys.notes, [])).map((note) => ({ ...note, type: "message", text: note.body || note.caption }));
    const media = mergeShared(sharedMedia, read(storageKeys.media, [])).map((item) => ({ ...item, text: item.caption }));
    const uploads = [...notes, ...media].sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return { rsvps, notes, media, uploads };
  };

  const wrappedEmpty = (message, detail = "The first memory is still waiting to be shared.") => `<div class="wrapped-empty"><i class="ph ph-sparkle" aria-hidden="true"></i><strong>${escapeHtml(message)}</strong><span>${escapeHtml(detail)}</span></div>`;

  const wrappedMediaCard = (item) => {
    const label = item.type === "video" ? "video" : item.type === "audio" ? "voice note" : "photo";
    let content = `<div class="wrapped-media-placeholder"><i class="ph ${item.type === "video" ? "ph-play-circle" : "ph-image"}" aria-hidden="true"></i></div>`;
    if (item.url && item.type === "video") content = `<video controls preload="none" src="${escapeHtml(item.url)}" aria-label="Video shared by ${escapeHtml(item.name || "a friend")}"></video>`;
    if (item.url && item.type === "image") content = `<img loading="lazy" decoding="async" src="${escapeHtml(item.url)}" alt="${escapeHtml(item.name || "A friend")} shared a birthday photo" />`;
    return `<figure class="wrapped-upload-card wrapped-upload-${label}" style="--tilt:${item.tilt || "0deg"}">${content}<figcaption><strong>${escapeHtml(item.name || "A friend")}</strong><span>${escapeHtml(item.caption || label)}</span></figcaption></figure>`;
  };

  const wrappedArchiveCard = (item) => `<figure class="wrapped-upload-card wrapped-archive-card" style="--tilt:${item.tilt || "0deg"}"><img loading="lazy" decoding="async" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" /><figcaption><strong>Marisa archive</strong><span>${escapeHtml(item.caption)}</span></figcaption></figure>`;

  const renderMarisaWrapped = ({ autoplay = false } = {}) => {
    const node = $("[data-marisa-wrapped]");
    if (!node) return;
    const { rsvps, notes, media, uploads } = getWrappedData();
    const names = rsvps.map((person) => person.name).slice(0, 12);
    const words = notes.slice(-6).reverse();
    const moments = media.filter((item) => item.type === "image" || item.type === "video").slice(-6).reverse();
    const voiceNotes = media.filter((item) => item.type === "audio").slice(-4).reverse();
    const archiveChapterOne = archivePhotos.slice(0, 6);
    const archiveChapterTwo = archivePhotos.slice(6, 12);
    const itinerary = [
      { date: "FRI · 21 AUG", label: "Main birthday day", items: [["09:00", "The Breakfast Club", "Here East, Queen Elizabeth Olympic Park, Hackney Wick"], ["12:00–13:30", "Park picnic + drinks", "Queen Elizabeth Olympic Park · indoor backup if raining"], ["14:00", "Travel to Sutton + hotel check-in", "Sutton"], ["19:00", "Cake, food, gifts + games", "Sutton"]] },
      { date: "SAT · 22 AUG", label: "Kingston pub & night out", items: [["16:00", "Pub or restaurant meet", "Kingston upon Thames"], ["20:00", "Night out", "Location to be confirmed"]] }
    ];
    const itineraryCards = itinerary.map((day) => `<article class="wrapped-itinerary-day"><p class="wrapped-itinerary-date">${escapeHtml(day.date)}</p><h3>${escapeHtml(day.label)}</h3><div>${day.items.map(([time, title, location]) => `<div class="wrapped-itinerary-item"><time>${escapeHtml(time)}</time><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(location)}</small></span></div>`).join("")}</div></article>`).join("");
    const wordCards = words.length ? words.map((item) => `<article class="wrapped-quote"><span class="wrapped-quote-mark">“</span><blockquote>${escapeHtml(item.text || "A little birthday love for you.")}</blockquote><footer><strong>${escapeHtml(item.name || "A friend")}</strong><span>${escapeHtml(item.mood || "sent with love")}</span></footer></article>`).join("") : wrappedEmpty("No words yet", "Your people can still leave something for the memory wall.");
    const momentCards = moments.length ? moments.map(wrappedMediaCard).join("") : wrappedEmpty("No uploads yet", "Photos and videos will appear here as people add them.");
    const voiceCards = voiceNotes.length ? voiceNotes.map((item) => `<article class="wrapped-voice-card"><div class="wrapped-voice-icon"><i class="ph ph-waveform" aria-hidden="true"></i></div><div><strong>${escapeHtml(item.name || "A friend")}</strong><span>${escapeHtml(item.caption || "A voice note for Marisa")}</span>${item.url ? `<audio controls preload="none" src="${escapeHtml(item.url)}" aria-label="Voice note from ${escapeHtml(item.name || "a friend")}"></audio>` : ""}</div></article>`).join("") : wrappedEmpty("No voice notes yet", "Someone should definitely press record.");
    const slideCount = 10;

    node.innerHTML = `<div class="wrapped-progress" style="--wrapped-count:${slideCount}" aria-label="Wrapped progress">${Array.from({ length: slideCount }, (_, index) => `<span data-wrapped-progress="${index}"></span>`).join("")}</div>
      <div class="wrapped-topbar"><span class="wrapped-brand"><i class="ph ph-sparkle" aria-hidden="true"></i> Marisa Wrapped</span><span>${uploads.length} ${uploads.length === 1 ? "memory" : "memories"} collected</span></div>
      <div class="wrapped-stage">
        <article class="wrapped-slide wrapped-slide-cover" data-wrapped-slide="0">
          <div class="wrapped-cover-copy"><p class="wrapped-kicker">YOUR 2026 BIRTHDAY STORY</p><h1>Marisa<br /><em>Wrapped.</em></h1><p class="wrapped-subtitle">A little replay of the people, words and moments that make you so loved.</p><button class="wrapped-start" type="button" data-wrapped-next>Tap to begin <i class="ph ph-arrow-right" aria-hidden="true"></i></button></div>
          <div class="wrapped-cover-art"><div class="wrapped-orbit wrapped-orbit-one"></div><div class="wrapped-orbit wrapped-orbit-two"></div><figure><img src="assets/photos/optimized/marisa-bouquet.webp" alt="Marisa holding a bouquet beside the water" /></figure><span class="wrapped-sticker">21<br /><small>AUG</small></span></div>
        </article>
        <article class="wrapped-slide wrapped-slide-people" data-wrapped-slide="1">
          <div><p class="wrapped-kicker">THE PEOPLE EDIT</p><h2>You had<br /><em>your people.</em></h2><p class="wrapped-number">${rsvps.length}</p><p class="wrapped-stat">${rsvps.length === 1 ? "person has" : "people have"} confirmed so far — and the weekend is still being written.</p></div>
          <div class="wrapped-name-cloud">${names.length ? names.map((name, index) => `<span class="wrapped-name-chip wrapped-name-chip-${index % 4}">${escapeHtml(name)}</span>`).join("") : wrappedEmpty("The guest list is still loading", "Only real RSVP responses will appear here.")}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-words" data-wrapped-slide="2">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">MOST REPLAYED FEELING</p><h2>Words<br /><em>for you.</em></h2><p>Every message is a tiny reminder that you are the main character.</p></div><div class="wrapped-quote-grid">${wordCards}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-moments" data-wrapped-slide="3">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">THE CAMERA ROLL</p><h2>Moments<br /><em>with you.</em></h2><p>${moments.length ? `${moments.length} new uploads from your favourite people.` : "The next memory is waiting for its close-up."}</p></div><div class="wrapped-upload-grid">${momentCards}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-archive" data-wrapped-slide="4">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">FROM THE ARCHIVE</p><h2>The original<br /><em>favourites.</em></h2><p>A little selection from the Marisa archive — kept here because these moments deserve another replay.</p></div><div class="wrapped-upload-grid">${archiveChapterOne.map(wrappedArchiveCard).join("")}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-archive wrapped-slide-archive-two" data-wrapped-slide="5">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">STILL ICONIC</p><h2>More of<br /><em>your era.</em></h2><p>The archive continues. Same star, different lighting.</p></div><div class="wrapped-upload-grid">${archiveChapterTwo.map(wrappedArchiveCard).join("")}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-voices" data-wrapped-slide="6">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">YOUR BONUS TRACKS</p><h2>Press<br /><em>play.</em></h2><p>Voice notes sound better when they are meant just for you.</p></div><div class="wrapped-voice-list">${voiceCards}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-soundtrack" data-wrapped-slide="7">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">THE ORIGINAL SOUNDTRACK</p><h2>Your first<br /><em>birthday replay.</em></h2><p>A little piece of where this story began — saved here for another listen.</p></div><div class="wrapped-soundtrack-grid"><figure class="wrapped-soundtrack-video"><video controls autoplay muted preload="metadata" poster="${firstBirthdayMedia.poster}" playsinline aria-label="Video from Marisa's first birthday"><source src="${firstBirthdayMedia.video}" type="video/mp4" />Your browser does not support video playback.</video><figcaption>First birthday memories</figcaption></figure></div>
        </article>
        <article class="wrapped-slide wrapped-slide-itinerary" data-wrapped-slide="8">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">THE WEEKEND IN TWO ACTS</p><h2>Your<br /><em>itinerary.</em></h2><p>The working plan — enough structure for the good stuff, with room for the moments in between.</p></div><div class="wrapped-itinerary-grid">${itineraryCards}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-finale" data-wrapped-slide="9">
          <div class="wrapped-finale-spark">✦</div><p class="wrapped-kicker">THAT'S A WRAP</p><h2>Happy birthday,<br /><em>Marisa.</em></h2><p>Two planned days, a hundred little moments, and a whole lot of love still to come.</p><div class="wrapped-finale-counts"><span><strong>${uploads.length}</strong> memories</span><span><strong>${rsvps.length}</strong> real responses</span></div><button class="wrapped-replay" type="button" data-wrapped-replay><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i> Replay your Wrapped</button></article>
      </div><button class="wrapped-arrow wrapped-arrow-prev" type="button" data-wrapped-prev aria-label="Previous Wrapped slide"><i class="ph ph-arrow-left" aria-hidden="true"></i></button><button class="wrapped-arrow wrapped-arrow-next" type="button" data-wrapped-next aria-label="Next Wrapped slide"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>`;
    node.closest(".wrapped-experience")?.scrollTo(0, 0);
    const slides = $$("[data-wrapped-slide]", node);
    marisaWrappedSlide = Math.max(0, Math.min(marisaWrappedSlide, slides.length - 1));
    slides.forEach((slide, index) => slide.classList.toggle("is-active", index === marisaWrappedSlide));
    $$('[data-wrapped-progress]', node).forEach((bar, index) => bar.classList.toggle("is-active", index <= marisaWrappedSlide));
    const previous = $("[data-wrapped-prev]", node);
    const next = $(".wrapped-arrow-next", node);
    if (previous) previous.disabled = marisaWrappedSlide === 0;
    if (next) next.hidden = marisaWrappedSlide >= slides.length - 1;
  };

  const setupMarisaWrapped = () => {
    const node = $("[data-marisa-wrapped]");
    if (!node || node.dataset.ready) return;
    node.dataset.ready = "true";
    node.addEventListener("click", (event) => {
      if (event.target.closest("[data-wrapped-replay]")) { marisaWrappedSlide = 0; renderMarisaWrapped(); return; }
      if (event.target.closest("[data-wrapped-next]")) { marisaWrappedSlide += 1; renderMarisaWrapped(); return; }
      if (event.target.closest("[data-wrapped-prev]")) { marisaWrappedSlide -= 1; renderMarisaWrapped(); }
    });
    document.addEventListener("keydown", (event) => {
      if (!marisaWrappedMode) return;
      if (event.key === "ArrowRight" || event.key === " ") { event.preventDefault(); marisaWrappedSlide += 1; renderMarisaWrapped(); }
      if (event.key === "ArrowLeft") { event.preventDefault(); marisaWrappedSlide -= 1; renderMarisaWrapped(); }
    });
  };

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
    if (node) node.innerHTML = list.map((person) => person.more
      ? `<div class="attendee is-more"><span class="attendee-avatar">+12</span><span>more</span></div>`
      : `<div class="attendee"><span class="attendee-avatar">${person.image ? `<img src="${person.image}" alt="" />` : escapeHtml(person.name.slice(0, 1))}</span><span>${escapeHtml(person.name)}</span></div>`).join("");
    const count = $("[data-rsvp-count]");
    const label = $("[data-rsvp-label]");
    if (count) count.textContent = rsvps.length;
    if (label) label.textContent = config.LIVE_RSVPS_URL ? (rsvps.length ? "confirmed responses on the live list" : "no confirmed responses yet") : "responses saved in this browser";
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

  const loadSharedData = async () => {
    if (!sharedBase) return;
    try {
      const [rsvps, notes, media] = await Promise.all([sharedFetch("rsvps"), sharedFetch("notes"), sharedFetch("media")]);
      liveRsvps = sharedItems(rsvps);
      sharedNotes = sharedItems(notes);
      sharedMedia = sharedItems(media);
      renderAttendees(); renderMemories();
      if (marisaWrappedMode) renderMarisaWrapped();
    } catch {
      /* The local wall remains usable if shared storage is unavailable. */
    }
  };

  const renderContributions = () => {
    const node = $("[data-contributions]");
    if (!node) return;
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
    const selectedTotal = $("[data-selected-total]");
    const payTotal = $("[data-pay-total]");
    if (selectedTotal) selectedTotal.textContent = `${money(total)} selected`;
    if (payTotal) payTotal.textContent = money(total);
  };

  const renderMemories = () => {
    const node = $("[data-memory-grid]");
    if (!node) return;
    const notes = mergeShared(sharedNotes, read(storageKeys.notes, []));
    const media = mergeShared(sharedMedia, read(storageKeys.media, []));
    const cards = [
      ...notes.map((note) => `<figure class="memory-card is-note" style="--tilt:${note.tilt || "0deg"}"><blockquote>“${escapeHtml(note.body)}”</blockquote><figcaption><strong>${escapeHtml(note.name)}</strong>${escapeHtml(note.mood)}</figcaption></figure>`),
      ...media.map((item) => {
        if (item.type === "message") return `<figure class="memory-card is-note" style="--tilt:${item.tilt || "0deg"}"><blockquote>“${escapeHtml(item.caption)}”</blockquote><figcaption><strong>${escapeHtml(item.name)}</strong>shared message</figcaption></figure>`;
        const content = item.type === "video" ? `<video controls preload="none" src="${item.url}" aria-label="Video shared by ${escapeHtml(item.name)}"></video>` : item.type === "audio" ? `<audio controls preload="none" src="${item.url}" aria-label="Voice note shared by ${escapeHtml(item.name)}"></audio>` : `<img loading="lazy" decoding="async" src="${item.url}" alt="${escapeHtml(item.name)}'s uploaded memory" />`;
        return `<figure class="memory-card ${item.type === "video" ? "is-video" : ""} ${item.type === "audio" ? "is-audio" : ""}" style="--tilt:${item.tilt || "1deg"}">${content}<figcaption><strong>${escapeHtml(item.name)}</strong>${escapeHtml(item.caption || (item.type === "audio" ? "voice note" : "shared memory"))}</figcaption></figure>`;
      })
    ];
    const pageCount = Math.max(1, Math.ceil(cards.length / 10));
    memoryPage = Math.min(memoryPage, pageCount - 1);
    const start = memoryPage * 10;
    node.innerHTML = cards.length ? cards.slice(start, start + 10).join("") : '<p class="memory-empty">No new uploads yet — be the first to add a photo, video, voice note or message.</p>';
    if (typeof setupImageLoading === "function") setupImageLoading();
    $("[data-memory-meta]").textContent = cards.length ? `Showing ${start + 1}–${Math.min(start + 10, cards.length)} of ${cards.length} new uploads · page ${memoryPage + 1} of ${pageCount}` : "No new uploads yet";
    $("[data-memory-prev]").disabled = cards.length === 0 || memoryPage === 0;
    $("[data-memory-next]").disabled = cards.length === 0 || memoryPage >= pageCount - 1;
  };

  const calendarEvents = [
    ["20260821T090000", "20260821T120000", "The Breakfast Club", "Marisa's birthday weekend"],
    ["20260821T120000", "20260821T133000", "Park picnic + drinks", "Queen Elizabeth Olympic Park · indoor backup if raining"],
    ["20260821T140000", "20260821T150000", "Travel to Sutton + hotel check-in", "Allow time to travel from the park and check in"],
    ["20260821T190000", "20260821T230000", "Cake, food, gifts + games", "Sutton"],
    ["20260822T160000", "20260822T180000", "Pub or restaurant meet", "Kingston upon Thames"],
    ["20260822T200000", "20260822T235900", "Night out", "Kingston upon Thames · location to be confirmed"],
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
    if (!node) return;
    const update = () => {
      const difference = target - Date.now();
      if (difference <= 0) { node.textContent = "It’s birthday weekend!"; return; }
      const totalSeconds = Math.floor(difference / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      node.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s to go`;
    };
    update(); window.setInterval(update, 1000);
  };

  const setupPhotoRail = () => {
    const collage = $("[data-hero-collage]");
    if (!collage) return;
    const images = $$(`[data-hero-collage-image]`, collage);
    const layouts = ["0", "1", "2", "3"];
    let offset = 0;
    let layout = 0;
    const update = () => {
      collage.classList.add("is-changing");
      window.setTimeout(() => {
        images.forEach((image, index) => {
          const photo = allPhotos[(offset + index) % allPhotos.length];
          image.src = photo.src;
          image.alt = photo.alt;
          image.style.objectPosition = photo.objectPosition || "50% 28%";
        });
        layout = (layout + 1) % layouts.length;
        collage.dataset.layout = layouts[layout];
        collage.classList.remove("is-changing");
      }, 260);
      offset = (offset + 1) % allPhotos.length;
    };
    window.setInterval(update, 5000);
  };

  const setupMenu = () => {
    const button = $("[data-menu-button]"); const nav = $("[data-mobile-nav]");
    if (!button || !nav) return;
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

  const setupPartyGame = () => {
    if (partyGame) return;
    const overlay = document.createElement("section");
    overlay.className = "party-game";
    overlay.hidden = true;
    overlay.setAttribute("aria-labelledby", "party-game-title");
    overlay.innerHTML = `<div class="party-game-shell"><div class="party-game-header"><div><p class="party-game-eyebrow">PARTY MODE</p><h1 id="party-game-title">Flappy <em>Marisa.</em></h1><p class="party-game-copy">Help Marisa fly between the birthday memories. Tap, click or press Space to flap.</p></div><button class="party-game-close" type="button" data-party-close aria-label="Close party game"><i class="ph ph-x" aria-hidden="true"></i></button></div><div class="party-game-hud"><span>Score <strong data-party-score>0</strong></span><span>Best <strong data-party-best>0</strong></span></div><div class="party-game-board"><canvas width="800" height="500" data-party-canvas aria-label="Flappy Marisa birthday game"></canvas><div class="party-game-board-message" data-party-message>Ready when you are ✦</div></div><div class="party-game-actions"><button class="button button-coral" type="button" data-party-start>Start game</button><button class="button button-outline" type="button" data-party-close>Back to weekend</button></div><p class="party-game-status" data-party-status>Fly through the photo gates without touching them.</p><div class="party-game-panels"><form class="party-game-results" data-party-results hidden><p class="party-game-panel-kicker">NICE FLIGHT</p><h2>Your score: <strong data-party-final-score>0</strong></h2><label for="party-player-name">Enter your name to save it</label><div class="party-game-score-row"><input id="party-player-name" data-party-name type="text" maxlength="24" autocomplete="nickname" placeholder="Your name" required /><button class="button button-coral" type="submit">Save score</button></div><p class="party-game-save-status" data-party-save-status role="status" aria-live="polite"></p></form><section class="party-game-leaderboard" aria-labelledby="party-leaderboard-title"><p class="party-game-panel-kicker">THE HALL OF FAME</p><h2 id="party-leaderboard-title">Leaderboard</h2><ol data-party-leaderboard><li class="party-game-empty">Loading scores…</li></ol></section></div></div>`;
    document.body.appendChild(overlay);
    const canvas = $("[data-party-canvas]", overlay);
    const context = canvas.getContext("2d");
    const startButton = $("[data-party-start]", overlay);
    const scoreNode = $("[data-party-score]", overlay);
    const bestNode = $("[data-party-best]", overlay);
    const messageNode = $("[data-party-message]", overlay);
    const statusNode = $("[data-party-status]", overlay);
    const resultsForm = $("[data-party-results]", overlay);
    const finalScoreNode = $("[data-party-final-score]", overlay);
    const nameInput = $("[data-party-name]", overlay);
    const saveStatusNode = $("[data-party-save-status]", overlay);
    const leaderboardNode = $("[data-party-leaderboard]", overlay);
    const sprite = new Image();
    sprite.src = "assets/game/marisa-sprite.jpg";
    const obstacleImages = partyObstaclePhotos.map((src) => { const image = new Image(); image.src = src; return image; });
    const width = canvas.width;
    const height = canvas.height;
    const bird = { x: 174, y: 240, radius: 28, velocity: 0 };
    const gates = [];
    let state = "ready";
    let score = 0;
    let best = Number(read("marisa-party-best", 0)) || 0;
    let frameId = 0;
    let lastFrame = 0;
    let photoIndex = 0;
    let leaderboard = [];
    let leaderboardRequest = null;
    const leaderboardKey = "marisa-party-leaderboard";
    bestNode.textContent = best;
    const sortLeaderboard = (entries) => {
      const unique = [...new Map(entries.filter((entry) => entry && String(entry.name || "").trim() && Number.isFinite(Number(entry.score))).map((entry) => [entry.id || `${entry.name}-${entry.score}-${entry.createdAt}`, entry])).values()];
      return unique.sort((a, b) => Number(b.score) - Number(a.score) || new Date(a.createdAt || 0) - new Date(b.createdAt || 0)).slice(0, 10);
    };
    const renderLeaderboard = () => {
      leaderboardNode.innerHTML = leaderboard.length ? leaderboard.map((entry, index) => `<li><span class="leaderboard-rank">${String(index + 1).padStart(2, "0")}</span><span class="leaderboard-name">${escapeHtml(entry.name)}</span><strong>${Number(entry.score)}</strong></li>`).join("") : `<li class="party-game-empty">No scores yet — be the first.</li>`;
    };
    const loadLeaderboard = async () => {
      if (leaderboardRequest) return leaderboardRequest;
      const localEntries = read(leaderboardKey, []);
      leaderboard = sortLeaderboard(localEntries);
      renderLeaderboard();
      if (!sharedBase) return;
      leaderboardRequest = sharedFetch("leaderboard").then((payload) => {
        leaderboard = sortLeaderboard([...sharedItems(payload), ...localEntries]);
        renderLeaderboard();
      }).catch(() => {}).finally(() => { leaderboardRequest = null; });
      return leaderboardRequest;
    };
    const roundedRect = (x, y, rectWidth, rectHeight, radius) => {
      context.beginPath();
      context.roundRect(x, y, rectWidth, rectHeight, radius);
    };
    const coverImage = (image, x, y, rectWidth, rectHeight) => {
      if (!image.complete || !image.naturalWidth) { context.fillStyle = "#5e2d64"; context.fillRect(x, y, rectWidth, rectHeight); return; }
      const scale = Math.max(rectWidth / image.naturalWidth, rectHeight / image.naturalHeight);
      const drawWidth = image.naturalWidth * scale;
      const drawHeight = image.naturalHeight * scale;
      context.drawImage(image, x + (rectWidth - drawWidth) / 2, y + (rectHeight - drawHeight) / 2, drawWidth, drawHeight);
    };
    const drawGate = (gateX, gateY, gateHeight, image, upsideDown = false) => {
      context.save();
      roundedRect(gateX, gateY, 92, gateHeight, 18);
      context.clip();
      if (upsideDown) { context.translate(gateX + 46, gateY + gateHeight / 2); context.rotate(Math.PI); coverImage(image, -46, -gateHeight / 2, 92, gateHeight); }
      else coverImage(image, gateX, gateY, 92, gateHeight);
      context.restore();
      context.save();
      roundedRect(gateX, gateY, 92, gateHeight, 18);
      context.strokeStyle = "rgba(244, 234, 217, .88)";
      context.lineWidth = 7;
      context.stroke();
      context.restore();
      context.fillStyle = "rgba(237, 121, 93, .9)";
      context.fillRect(gateX - 7, upsideDown ? gateY + gateHeight - 12 : gateY, 106, 12);
    };
    const draw = () => {
      const background = context.createLinearGradient(0, 0, 0, height);
      background.addColorStop(0, "#31142d"); background.addColorStop(1, "#8c4168");
      context.fillStyle = background; context.fillRect(0, 0, width, height);
      context.fillStyle = "rgba(244, 234, 217, .08)";
      for (let index = 0; index < 12; index += 1) { context.beginPath(); context.arc((index * 93 + 38) % width, 65 + (index % 4) * 92, 2 + index % 3, 0, Math.PI * 2); context.fill(); }
      gates.forEach((gate) => { const image = obstacleImages[gate.photo]; drawGate(gate.x, 0, gate.topHeight, image, true); drawGate(gate.x, gate.topHeight + gate.gap, height - gate.topHeight - gate.gap, image); });
      context.fillStyle = "rgba(33, 13, 40, .24)"; context.fillRect(0, height - 26, width, 26);
      context.save();
      context.beginPath(); context.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2); context.clip();
      context.translate(bird.x, bird.y); context.rotate(Math.max(-.28, Math.min(.34, bird.velocity * .035))); if (sprite.complete && sprite.naturalWidth) context.drawImage(sprite, -bird.radius, -bird.radius, bird.radius * 2, bird.radius * 2); else { context.fillStyle = "#ed795d"; context.fillRect(-bird.radius, -bird.radius, bird.radius * 2, bird.radius * 2); } context.restore();
      context.beginPath(); context.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2); context.strokeStyle = "#f4ead9"; context.lineWidth = 4; context.stroke();
    };
    const setState = (nextState) => {
      state = nextState;
      messageNode.hidden = nextState === "playing";
      startButton.hidden = nextState === "playing";
      startButton.textContent = nextState === "over" ? "Try again" : "Start game";
      if (nextState !== "over") resultsForm.hidden = true;
      if (nextState === "ready") statusNode.textContent = "Fly through the photo gates without touching them.";
      if (nextState === "playing") statusNode.textContent = "Tap, click or press Space to flap.";
      if (nextState === "over") statusNode.textContent = `You scored ${score}. Give it another go for Marisa ✦`;
    };
    const reset = () => {
      gates.length = 0; score = 0; scoreNode.textContent = "0"; bird.y = 240; bird.velocity = 0; photoIndex = 0;
      const saveButton = $("button[type=submit]", resultsForm);
      nameInput.value = ""; saveButton.textContent = "Save score"; saveButton.disabled = false; saveStatusNode.textContent = "";
      for (let index = 0; index < 4; index += 1) gates.push({ x: 560 + index * 250, topHeight: 80 + Math.random() * 150, gap: 170, photo: index % obstacleImages.length, counted: false });
      setState("ready"); draw();
    };
    const endGame = () => {
      setState("over");
      finalScoreNode.textContent = score;
      saveStatusNode.textContent = "";
      resultsForm.hidden = false;
      if (score > best) { best = score; bestNode.textContent = best; write("marisa-party-best", best); }
    };
    const flap = () => {
      if (state === "ready") setState("playing");
      if (state === "over") { reset(); setState("playing"); }
      bird.velocity = -7.4;
    };
    const update = (scale) => {
      bird.velocity += .42 * scale; bird.y += bird.velocity * scale;
      gates.forEach((gate) => {
        gate.x -= 2.55 * scale;
        if (!gate.counted && gate.x + 92 < bird.x) { gate.counted = true; score += 1; scoreNode.textContent = score; }
      });
      while (gates.length && gates[0].x < -110) { gates.shift(); const lastGate = gates[gates.length - 1]; gates.push({ x: lastGate.x + 250, topHeight: 80 + Math.random() * 150, gap: 170, photo: photoIndex++ % obstacleImages.length, counted: false }); }
      const hitWall = bird.y - bird.radius < 0 || bird.y + bird.radius > height - 26;
      const hitGate = gates.some((gate) => bird.x + bird.radius > gate.x && bird.x - bird.radius < gate.x + 92 && (bird.y - bird.radius < gate.topHeight || bird.y + bird.radius > gate.topHeight + gate.gap));
      if (hitWall || hitGate) endGame();
    };
    const loop = (timestamp) => {
      if (overlay.hidden) return;
      const elapsed = Math.min(36, timestamp - lastFrame || 16.67); lastFrame = timestamp;
      if (state === "playing") update(elapsed / 16.67);
      draw(); frameId = window.requestAnimationFrame(loop);
    };
    const show = () => { overlay.hidden = false; document.body.classList.add("is-party-game-open"); reset(); loadLeaderboard(); lastFrame = performance.now(); window.cancelAnimationFrame(frameId); frameId = window.requestAnimationFrame(loop); };
    const hide = () => { overlay.hidden = true; document.body.classList.remove("is-party-game-open"); window.cancelAnimationFrame(frameId); try { sessionStorage.setItem("marisa-birthday-access", "guest"); } catch { /* no-op */ } };
    overlay.addEventListener("dblclick", (event) => event.preventDefault(), { passive: false });
    resultsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const name = nameInput.value.trim().slice(0, 24);
      if (!name) { saveStatusNode.textContent = "Add your name first."; nameInput.focus(); return; }
      const entry = { id: `score-${Date.now()}-${Math.random().toString(16).slice(2)}`, name, score, createdAt: new Date().toISOString() };
      const localEntries = read(leaderboardKey, []);
      write(leaderboardKey, sortLeaderboard([...localEntries, entry]));
      leaderboard = sortLeaderboard([...leaderboard, entry]);
      renderLeaderboard();
      const saveButton = $("button[type=submit]", resultsForm);
      saveButton.disabled = true;
      saveStatusNode.textContent = "Saving your score…";
      let synced = false;
      if (sharedBase) { try { synced = await pushShared("leaderboard", entry); } catch { /* local score remains saved */ } }
      resultsForm.hidden = false;
      saveStatusNode.textContent = synced ? "Score saved to the shared leaderboard." : "Score saved on this device.";
      saveButton.textContent = "Saved";
    });
    startButton.addEventListener("click", () => { if (state === "over") reset(); setState("playing"); flap(); });
    canvas.addEventListener("pointerdown", (event) => { event.preventDefault(); flap(); });
    document.addEventListener("keydown", (event) => { if (overlay.hidden) return; if (event.key === " " || event.key === "ArrowUp") { event.preventDefault(); flap(); } });
    $$('[data-party-close]', overlay).forEach((button) => button.addEventListener("click", hide));
    partyGame = { show, hide };
  };

  const unlockWebsite = (mode) => {
    try { sessionStorage.setItem("marisa-birthday-access", mode); } catch { /* private browsing can disable storage */ }
    document.documentElement.classList.remove("is-gated");
    document.body.classList.add("is-unlocked");
    const marisaView = $("[data-marisa-view]");
    if (mode === "party") {
      document.body.classList.add("is-party-mode");
      partyGame?.show();
      return;
    }
    if (mode === "marisa") {
      marisaWrappedMode = true;
      document.body.classList.add("is-marisa-mode");
      marisaView.hidden = false;
      renderMarisaWrapped({ autoplay: true });
    }
  };

  const setupGate = () => {
    let access = "";
    try { access = sessionStorage.getItem("marisa-birthday-access") || ""; } catch { /* continue locked */ }
    if (access === "guest" || access === "marisa" || access === "party") { unlockWebsite(access); return; }
    const form = $("[data-gate-form]");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const password = new FormData(form).get("password").toString().trim().toLowerCase();
      const status = $("[data-gate-status]");
      if (password === "happybirthday") { status.textContent = "Welcome in — keep the link within the group."; unlockWebsite("guest"); return; }
      if (password === "party") { status.textContent = "Party mode unlocked ✦"; unlockWebsite("party"); return; }
      if (password === "210803") {
        if (isBirthdayToday()) { unlockWebsite("marisa"); return; }
        status.textContent = "nuh uhhhh you gotta wait silly billy";
        form.reset();
        return;
      }
      status.textContent = "Nope. Nothing to see here 🤨";
      form.reset();
    });
    $("[data-marisa-back]")?.addEventListener("click", () => {
      document.body.classList.remove("is-marisa-mode");
      $("[data-marisa-view]").hidden = true;
      marisaWrappedMode = false;
      try { sessionStorage.setItem("marisa-birthday-access", "guest"); } catch { /* no-op */ }
    });
  };

  const setupRsvp = () => {
    const form = $("[data-rsvp-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget; const data = Object.fromEntries(new FormData(form).entries()); data.days = new FormData(form).getAll("days"); data.createdAt = new Date().toISOString();
    const rsvps = read(storageKeys.rsvps, []); const existing = rsvps.findIndex((item) => item.name.toLowerCase() === data.name.toLowerCase());
    if (existing >= 0) rsvps[existing] = data; else rsvps.push(data); write(storageKeys.rsvps, rsvps); renderAttendees();
    if (sharedBase) { try { await pushShared("rsvps", data); } catch { /* local save still succeeds */ } }
    if (config.RSVP_ENDPOINT) {
      try {
        const body = new FormData(form);
        body.set("_subject", "Marisa birthday weekend RSVP");
        body.set("_template", "table");
        body.set("_replyto", data.email);
        body.set("_autoresponse", `Thanks for your RSVP, ${data.name}!\n\nYour weekend pack:\nItinerary: ${siteBase}plan.html\nCalendar: ${siteBase}marisa-birthday-weekend.ics\nUpload a memory: ${siteBase}memories.html#memories\n\nSee you at Marisa's birthday weekend.`);
        await fetch(config.RSVP_ENDPOINT, { method: "POST", body, mode: "no-cors" });
      } catch { /* local save still succeeds */ }
    }
    const rsvpMessage = config.RSVP_ENDPOINT ? `RSVP submitted — see you ${data.days.length ? data.days.join(", ") : "when you can"}!` : "RSVP saved in this browser. Shared RSVP syncing is not connected yet.";
    $("[data-rsvp-status]").textContent = rsvpMessage;
    const pack = $("[data-rsvp-pack]", form);
    if (pack) pack.hidden = false;
    toast(config.RSVP_ENDPOINT ? "RSVP submitted." : "RSVP saved locally — shared syncing is not connected yet."); form.reset();
    });
  };

  const setupNotes = () => {
    const form = $("[data-note-form]");
    if (!form) return;
    form.addEventListener("submit", async (event) => {
    event.preventDefault(); const noteForm = event.currentTarget; const data = Object.fromEntries(new FormData(noteForm).entries()); data.createdAt = new Date().toISOString(); data.tilt = `${(Math.random() * 4 - 2).toFixed(1)}deg`;
    const notes = read(storageKeys.notes, []); notes.push(data); write(storageKeys.notes, notes); renderMemories();
    let sharedSaved = false;
    if (sharedBase) { try { sharedSaved = await pushShared("notes", data); } catch { /* local save still succeeds */ } }
    let forwarded = false;
    if (config.NOTES_ENDPOINT) {
      try {
        const body = new FormData(noteForm);
        body.set("_subject", "Marisa birthday weekend memory message");
        body.set("_template", "table");
        await fetch(config.NOTES_ENDPOINT, { method: "POST", body, mode: "no-cors" });
        forwarded = true;
      } catch { /* local save still succeeds */ }
    }
    noteForm.reset(); $("[data-note-status]").textContent = sharedSaved ? "Your note is on the shared memory wall and has been forwarded for email delivery." : forwarded ? "Your note was forwarded for email delivery and saved on this browser's memory wall." : "Your note is saved on this browser's memory wall."; toast(sharedSaved ? "Message shared and forwarded." : forwarded ? "Message forwarded and saved locally." : "Message saved locally to the memory wall.");
    });
  };

  const fileToDataUrl = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", reject);
    reader.readAsDataURL(file);
  });

  const compressImage = (file) => new Promise((resolve) => {
    if (!file.type.startsWith("image/") || file.size < 450 * 1024) { resolve(file); return; }
    const image = new Image();
    const sourceUrl = URL.createObjectURL(file);
    image.addEventListener("load", () => {
      const maxDimension = 1600;
      const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(sourceUrl);
        resolve(blob ? new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, { type: "image/jpeg" }) : file);
      }, "image/jpeg", .82);
    }, { once: true });
    image.addEventListener("error", () => { URL.revokeObjectURL(sourceUrl); resolve(file); }, { once: true });
    image.src = sourceUrl;
  });

  const setupMemoryForm = () => {
    const form = $("[data-memory-form]");
    if (!form) return;
    const input = $("[data-upload-input]");
    const preview = $("[data-memory-preview]");
    const dropzone = $(".upload-dropzone");
    const photoButton = $("[data-capture-photo]");
    const videoButton = $("[data-capture-video]");
    const recordButton = $("[data-record-voice]");
    const attachments = [];
    let recorder = null;
    let recordingStream = null;
    let recordingStartedAt = 0;
    let timerId = null;
    const status = $("[data-memory-status]");
    const maxVideoSeconds = 30;
    const setStatus = (message) => { if (status) status.textContent = message; };
    const formatDuration = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    const fileKind = (file) => {
      const name = file.name.toLowerCase();
      if (file.type.startsWith("image/") || /\.(jpe?g|png|gif|webp|heic|heif)$/i.test(name)) return "image";
      if (file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm|avi)$/i.test(name)) return "video";
      if (file.type.startsWith("audio/") || /\.(mp3|m4a|wav|ogg|webm)$/i.test(name)) return "audio";
      return "";
    };
    const getVideoDuration = (file) => new Promise((resolve) => {
      const sourceUrl = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      const finish = (duration) => { URL.revokeObjectURL(sourceUrl); resolve(duration); };
      video.addEventListener("loadedmetadata", () => finish(video.duration), { once: true });
      video.addEventListener("error", () => finish(null), { once: true });
      video.src = sourceUrl;
    });
    const renderPreview = () => {
      if (!preview) return;
      preview.hidden = !attachments.length;
      preview.innerHTML = attachments.map((attachment) => {
        const media = attachment.kind === "image"
          ? `<img src="${attachment.previewUrl}" alt="Preview of ${escapeHtml(attachment.file.name)}" />`
          : attachment.kind === "video"
            ? `<video controls playsinline preload="metadata" src="${attachment.previewUrl}" aria-label="Preview of ${escapeHtml(attachment.file.name)}"></video>`
            : `<audio controls preload="metadata" src="${attachment.previewUrl}" aria-label="Preview of ${escapeHtml(attachment.file.name)}"></audio>`;
        return `<article class="memory-preview-card" data-preview-id="${attachment.id}"><div class="memory-preview-media">${media}</div><div class="memory-preview-footer"><span>${attachment.kind} · ${escapeHtml(attachment.file.name)}</span><button class="memory-preview-remove" type="button" data-remove-attachment="${attachment.id}" aria-label="Remove ${escapeHtml(attachment.file.name)}"><i class="ph ph-x" aria-hidden="true"></i></button></div></article>`;
      }).join("");
    };
    const addFiles = async (files) => {
      const candidates = Array.from(files);
      const accepted = [];
      let rejectedVideo = false;
      for (const file of candidates) {
        const kind = fileKind(file);
        if (!kind) continue;
        if (kind === "video") {
          setStatus("Checking video length…");
          const duration = await getVideoDuration(file);
          if (Number.isFinite(duration) && duration > maxVideoSeconds) { rejectedVideo = true; continue; }
        }
        accepted.push({ file, kind });
      }
      accepted.forEach(({ file, kind }) => attachments.push({ id: `attachment-${Date.now()}-${Math.random().toString(16).slice(2)}`, file, kind, previewUrl: URL.createObjectURL(file) }));
      input.value = "";
      renderPreview();
      if (rejectedVideo) setStatus(`Videos must be ${maxVideoSeconds} seconds or shorter. The longer video was not added.`);
      else if (accepted.length) setStatus(`${attachments.length} item${attachments.length === 1 ? "" : "s"} ready to submit.`);
      else if (candidates.length) setStatus("Only photos, videos and audio files can be added.");
    };
    const pickFiles = (accept, capture) => {
      input.accept = accept;
      input.multiple = false;
      if (capture) input.setAttribute("capture", capture); else input.removeAttribute("capture");
      input.click();
    };
    photoButton?.addEventListener("click", () => pickFiles("image/*", "environment"));
    videoButton?.addEventListener("click", () => pickFiles("video/*", "environment"));
    ["dragenter", "dragover"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.remove("is-dragging"); }));
    dropzone.addEventListener("drop", (event) => { if (event.dataTransfer.files.length) addFiles(event.dataTransfer.files); });
    input.addEventListener("change", () => { if (input.files.length) addFiles(input.files); input.accept = "image/*,video/*,audio/*"; input.multiple = true; input.removeAttribute("capture"); });
    preview?.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove-attachment]");
      if (!button) return;
      const index = attachments.findIndex((attachment) => attachment.id === button.dataset.removeAttachment);
      if (index < 0) return;
      URL.revokeObjectURL(attachments[index].previewUrl);
      attachments.splice(index, 1);
      renderPreview();
      setStatus(attachments.length ? `${attachments.length} item${attachments.length === 1 ? "" : "s"} ready to submit.` : "Attachment removed.");
    });
    recordButton?.addEventListener("click", async () => {
      if (recorder?.state === "recording") { recorder.stop(); return; }
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) { setStatus("Voice recording is not supported in this browser. You can upload an audio file instead."); return; }
      try {
        recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const chunks = [];
        recorder = new MediaRecorder(recordingStream);
        recorder.addEventListener("dataavailable", (event) => { if (event.data.size) chunks.push(event.data); });
        recorder.addEventListener("stop", () => {
          const blob = new Blob(chunks, { type: recorder.mimeType || "audio/webm" });
          addFiles([new File([blob], `marisa-voice-note-${Date.now()}.webm`, { type: blob.type })]);
          recordingStream?.getTracks().forEach((track) => track.stop());
          window.clearInterval(timerId); recordButton.innerHTML = '<i class="ph ph-microphone" aria-hidden="true"></i> Record voice note <span data-record-timer="">00:00</span>'; recordButton.setAttribute("aria-pressed", "false");
          setStatus("Voice note ready — preview it below, remove it if needed, then submit.");
        });
        recorder.start(); recordingStartedAt = Date.now(); recordButton.innerHTML = '<i class="ph ph-stop-circle" aria-hidden="true"></i> Stop recording <span data-record-timer="">00:00</span>'; timerId = window.setInterval(() => { const activeTimer = recordButton.querySelector("[data-record-timer]"); if (activeTimer) activeTimer.textContent = formatDuration(Math.floor((Date.now() - recordingStartedAt) / 1000)); }, 1000);
        recordButton.setAttribute("aria-pressed", "true"); setStatus("Recording… tap Stop recording when you are finished.");
      } catch { setStatus("Microphone access was not granted. You can still upload a voice note file instead."); }
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const caption = data.caption?.trim() || "";
      if (!attachments.length && !caption) { setStatus("Add a message or attach a photo, video or voice note first."); return; }
      setStatus("Preparing your memory wall submission…");
      const createdAt = new Date().toISOString();
      const postId = `post-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const files = [];
      for (const attachment of attachments) {
        setStatus(`Preparing ${attachment.kind} ${files.length + 1} of ${attachments.length}…`);
        const file = await compressImage(attachment.file);
        if (file.size > 8 * 1024 * 1024) { setStatus(`${attachment.file.name} is over the 8MB storage limit — please choose ${attachment.kind === "video" ? "a shorter or lower-resolution clip" : "a smaller file"}.`); return; }
        files.push({ ...attachment, file });
      }
      const existing = read(storageKeys.media, []);
      const notes = read(storageKeys.notes, []);
      let sharedSaved = false;
      if (caption) {
        const note = { name: data.name.trim(), body: caption, mood: data.mood || "shared memory", createdAt, postId, tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg` };
        notes.push(note);
        if (sharedBase) { try { sharedSaved = (await pushShared("notes", note)) || sharedSaved; } catch { /* local save still succeeds */ } }
      }
      for (const attachment of files) {
        if (config.UPLOAD_ENDPOINT) {
          const body = new FormData();
          body.set("name", data.name.trim()); body.set("caption", caption); body.set("type", attachment.kind); body.set("file", attachment.file, attachment.file.name);
          try { await fetch(config.UPLOAD_ENDPOINT, { method: "POST", body }); } catch { setStatus("Cloud upload failed; saving this memory locally instead."); }
        }
        const item = { name: data.name.trim(), caption: "", type: attachment.kind, createdAt, postId, tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg`, url: await fileToDataUrl(attachment.file) };
        existing.push(item);
        if (sharedBase) { try { sharedSaved = (await pushShared("media", item)) || sharedSaved; } catch { /* local save still succeeds */ } }
      }
      let forwarded = false;
      if (caption && config.NOTES_ENDPOINT) {
        try {
          const body = new FormData();
          body.set("name", data.name.trim());
          body.set("body", caption);
          body.set("_subject", "Marisa birthday weekend memory message");
          body.set("_template", "table");
          await fetch(config.NOTES_ENDPOINT, { method: "POST", body, mode: "no-cors" });
          forwarded = true;
        } catch { /* shared save still succeeds */ }
      }
      try { write(storageKeys.notes, notes); write(storageKeys.media, existing); } catch { status.textContent = "That capture is too large for browser-only saving. Add an upload endpoint in config.js for larger shared media."; return; }
      attachments.forEach((attachment) => URL.revokeObjectURL(attachment.previewUrl));
      attachments.length = 0; memoryPage = Math.max(0, Math.ceil((mergeShared(sharedNotes, notes).length + mergeShared(sharedMedia, existing).length) / 10) - 1); renderMemories(); form.reset(); renderPreview(); input.accept = "image/*,video/*,audio/*"; input.multiple = true; input.removeAttribute("capture"); status.textContent = sharedSaved && forwarded ? "Message and media shared and forwarded for email delivery." : sharedSaved ? "Submitted to the shared memory wall." : config.UPLOAD_ENDPOINT ? "Submitted to the shared memory wall." : "Submitted to this browser's memory wall only."; toast(sharedSaved || config.UPLOAD_ENDPOINT ? "Memory submitted to the shared wall." : "Memory saved locally to the wall.");
    });
  };

  const setupMemoryCarousel = () => {
    const previous = $("[data-memory-prev]");
    const next = $("[data-memory-next]");
    if (!previous || !next) return;
    previous.addEventListener("click", () => { memoryPage -= 1; renderMemories(); });
    next.addEventListener("click", () => { memoryPage += 1; renderMemories(); });
  };

  const setupPayments = () => {
    const action = $("[data-payment-action]");
    if (!action) return;
    const summary = action.closest(".contributions-panel");
    const summaryNote = summary?.querySelector(".tiny-note");
    action.innerHTML = '<i class="ph ph-arrow-square-out" aria-hidden="true"></i> Pay with Monzo';
    if (summaryNote) summaryNote.textContent = "Payments use the Monzo link. Reports here are self-reported and will be checked against Monzo before anything is marked fully confirmed.";
    action.insertAdjacentHTML("afterend", '<div class="payment-confirmation" data-payment-confirmation hidden><div class="payment-confirmation-heading"><div><p class="eyebrow coral">AFTER YOU PAY</p><h3>Tell us what you sent</h3></div><span class="payment-selected" data-payment-selected></span></div><p>Monzo does not send this website a payment receipt, so add the name/reference you used. This lets Nafe match your report against the bank transfer.</p><form class="payment-confirmation-form" data-payment-confirmation-form><label for="payment-name">Your name</label><input id="payment-name" name="name" type="text" autocomplete="name" placeholder="e.g. Alex" required /><label for="payment-amount">Amount sent</label><input id="payment-amount" name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" required /><label for="payment-reference">Monzo reference or sender name</label><input id="payment-reference" name="reference" type="text" maxlength="120" placeholder="e.g. AlexM" required /><div class="payment-confirmation-actions"><a class="text-link" data-monzo-link href="https://monzo.me/nathanbrownbennett?h=sWJ2zY&amp;account_type=personal" target="_blank" rel="noopener noreferrer">Open Monzo again <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a><button class="button button-coral" type="submit"><i class="ph ph-check" aria-hidden="true"></i> Save payment report</button></div><p class="form-status" data-payment-confirmation-status role="status"></p></form></div>');
    const confirmation = $("[data-payment-confirmation]");
    const form = $("[data-payment-confirmation-form]");
    const selectedLabel = $("[data-payment-selected]");
    const amountInput = $("[data-payment-amount]");
    const status = $("[data-payment-confirmation-status]");
    const monzoLink = $("[data-monzo-link]");
    if (monzoLink && config.MONZO_PAYMENT_URL) monzoLink.href = config.MONZO_PAYMENT_URL;

    action.addEventListener("click", () => {
      const selected = selectedContributionIds();
      if (!selected.length) { toast("Choose at least one shared cost first."); return; }
      const total = selected.reduce((sum, id) => sum + contributions.find((item) => item.id === id).amount(), 0);
      const names = selected.map((id) => contributions.find((item) => item.id === id).title);
      if (selectedLabel) selectedLabel.textContent = `${names.join(", ")} · ${money(total)}`;
      if (amountInput) amountInput.value = total.toFixed(2);
      if (status) status.textContent = "";
      if (confirmation) confirmation.hidden = false;
      window.open(config.MONZO_PAYMENT_URL || "https://monzo.me/", "_blank", "noopener,noreferrer");
      confirmation?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    form?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const selected = selectedContributionIds();
      const amount = Number(data.amount);
      if (!selected.length) { if (status) status.textContent = "Select at least one cost first."; return; }
      if (!data.name?.trim() || !data.reference?.trim() || !Number.isFinite(amount) || amount <= 0) {
        if (status) status.textContent = "Please enter your name, the amount sent and your Monzo reference.";
        return;
      }
      const item = {
        name: data.name.trim(), amount: Math.round(amount * 100) / 100,
        reference: data.reference.trim(),
        costs: selected.map((id) => contributions.find((entry) => entry.id === id).title).join(", "),
        createdAt: new Date().toISOString(), status: "self-reported"
      };
      const payments = read(storageKeys.payments, []);
      payments.push(item);
      try { write(storageKeys.payments, payments); } catch { /* shared/email delivery may still succeed */ }
      let sharedSaved = false;
      if (sharedBase) { try { sharedSaved = await pushShared("payments", item); } catch { /* email/local save still succeeds */ } }
      let forwarded = false;
      if (config.PAYMENTS_ENDPOINT) {
        try {
          const body = new FormData();
          Object.entries(item).forEach(([key, value]) => body.set(key, String(value)));
          body.set("_subject", "Marisa birthday weekend payment report");
          body.set("_template", "table");
          await fetch(config.PAYMENTS_ENDPOINT, { method: "POST", body, mode: "no-cors" });
          forwarded = true;
        } catch { /* local/shared save still succeeds */ }
      }
      if (status) status.textContent = sharedSaved || forwarded
        ? "Payment report saved — I’ll match the reference against Monzo."
        : "Payment report saved on this browser; please also send the reference to Nafe.";
      toast(sharedSaved || forwarded ? "Payment report saved." : "Payment report saved locally.");
      form.reset();
    });
  };

  const setupCalendar = () => $$('[data-calendar-action="download"]').forEach((button) => button.addEventListener("click", downloadCalendar));

  const setupItineraryPopups = () => {
    const cards = $$(".day-card");
    if (!cards.length || $("[data-itinerary-modal]")) return;
    const itineraries = [
      { day: "Friday 21 August", label: "Main birthday day", date: "FRI · 21 AUG", items: [
        { time: "09:00–12:00", title: "The Breakfast Club", location: "Here East, Queen Elizabeth Olympic Park, Hackney Wick", directions: "https://www.google.com/maps/search/?api=1&query=The+Breakfast+Club+Here+East+Hackney+Wick" },
        { time: "12:00–13:30", title: "Park picnic + drinks", location: "Queen Elizabeth Olympic Park · indoor backup if raining", directions: "https://www.google.com/maps/search/?api=1&query=Queen+Elizabeth+Olympic+Park" },
        { time: "14:00–15:00", title: "Travel to Sutton + hotel check-in", location: "Sutton", directions: "https://www.google.com/maps/search/?api=1&query=Sutton+London" },
        { time: "19:00–23:00", title: "Cake, food, gifts + games", location: "Sutton" }
      ] },
      { day: "Saturday 22 August", label: "Kingston pub & night out", date: "SAT · 22 AUG", items: [
        { time: "16:00–18:00", title: "Pub or restaurant meet", location: "Kingston upon Thames", directions: "https://www.google.com/maps/search/?api=1&query=Kingston+upon+Thames" },
        { time: "20:00–23:59", title: "Night out", location: "Kingston upon Thames · location to be confirmed", directions: "https://www.google.com/maps/search/?api=1&query=Kingston+upon+Thames+restaurants+bars" }
      ] },
    ];
    const modal = document.createElement("div");
    modal.className = "itinerary-modal";
    modal.dataset.itineraryModal = "true";
    modal.hidden = true;
    modal.innerHTML = '<div class="itinerary-backdrop" data-itinerary-close></div><section class="itinerary-dialog" role="dialog" aria-modal="true" aria-labelledby="itinerary-title"><button class="itinerary-close" type="button" data-itinerary-close aria-label="Close itinerary"><i class="ph ph-x" aria-hidden="true"></i></button><p class="eyebrow coral" data-itinerary-date></p><h2 id="itinerary-title" data-itinerary-title></h2><p class="itinerary-lede" data-itinerary-lede></p><div class="itinerary-list" data-itinerary-list></div><p class="itinerary-note">Times are the working plan and may shift slightly with travel or final bookings.</p></section>';
    document.body.append(modal);
    const title = $("[data-itinerary-title]", modal);
    const date = $("[data-itinerary-date]", modal);
    const lede = $("[data-itinerary-lede]", modal);
    const list = $("[data-itinerary-list]", modal);
    const close = () => { modal.hidden = true; document.body.classList.remove("is-itinerary-open"); };
    $$('[data-itinerary-close]', modal).forEach((node) => node.addEventListener("click", close));
    document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.hidden) close(); });
    cards.forEach((card, index) => {
      const itinerary = itineraries[index];
      if (!itinerary) return;
      const cardBody = card.querySelector(".day-card-body");
      if (cardBody && !cardBody.querySelector(".day-schedule")) {
        const schedule = document.createElement("div");
        schedule.className = "day-schedule";
        schedule.setAttribute("aria-label", `${itinerary.day} schedule`);
        schedule.innerHTML = itinerary.items.map((item) => `<div><time>${escapeHtml(item.time.split("–")[0])}</time><span>${escapeHtml(item.title)}</span></div>`).join("");
        const dressCode = cardBody.querySelector(".dress-code");
        if (dressCode) dressCode.before(schedule);
        else cardBody.append(schedule);
      }
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", `Open itinerary for ${itinerary.day}`);
      const open = () => {
        date.textContent = itinerary.date;
        title.textContent = itinerary.day;
        lede.textContent = itinerary.label;
        list.innerHTML = itinerary.items.map((item) => `<article class="itinerary-item"><time>${escapeHtml(item.time)}</time><div><h3>${escapeHtml(item.title)}</h3><p><i class="ph ph-map-pin" aria-hidden="true"></i>${escapeHtml(item.location)}</p>${item.directions ? `<a class="text-link" href="${item.directions}" target="_blank" rel="noopener noreferrer">Get directions <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>` : ""}</div></article>`).join("");
        modal.hidden = false;
        document.body.classList.add("is-itinerary-open");
        modal.querySelector(".itinerary-close")?.focus();
      };
      card.addEventListener("click", (event) => { if (!event.target.closest("a,button")) open(); });
      card.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); open(); } });
    });
  };
  const setupNavHighlight = () => {
    const normalizePath = (value) => { const path = new URL(value, window.location.href).pathname; return path.endsWith("/") ? `${path}index.html` : path; };
    const path = normalizePath(window.location.href);
    $$(".main-nav a, .mobile-nav a").forEach((link) => {
      link.classList.toggle("is-active", normalizePath(link.href) === path);
    });
  };

  const setupSectionPosters = () => {
    const posterSets = [[1, 6, 10], [3, 8, 14], [5, 11, 18], [7, 13, 22]];
    if (!$("main")) return;
    const sections = $$('main > section');
    const addPosters = (section, sectionIndex) => {
      if (section.querySelector(".section-posters")) return;
      const selected = posterSets[sectionIndex % posterSets.length];
      section.dataset.posterLayout = String(sectionIndex % 3);
      const posters = selected.map((photoIndex, posterIndex) => {
        const photo = allPhotos[(photoIndex + sectionIndex * 2) % allPhotos.length];
        return `<span class="poster-frame poster-frame-${posterIndex + 1}"><img src="${photo.src}" alt="" loading="lazy" decoding="async" /></span>`;
      }).join("");
      section.insertAdjacentHTML("afterbegin", `<div class="section-posters" aria-hidden="true">${posters}</div>`);
      if (typeof setupImageLoading === "function") setupImageLoading();
    };
    if (!("IntersectionObserver" in window)) { sections.forEach(addPosters); return; }
    const observer = new IntersectionObserver((entries, currentObserver) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      addPosters(entry.target, Number(entry.target.dataset.posterIndex));
      currentObserver.unobserve(entry.target);
    }), { rootMargin: "1200px 0px" });
    sections.forEach((section, index) => { section.dataset.posterIndex = String(index); observer.observe(section); });
  };

  const setupImageLoading = () => {
    $$('img:not(.hero-collage img)').forEach((image) => {
      if (image.dataset.loadingBound) return;
      image.dataset.loadingBound = "true";
      image.loading = "lazy";
      image.decoding = "async";
      image.classList.add("media-skeleton");
      const markLoaded = () => image.classList.add("is-loaded");
      if (image.complete) markLoaded(); else image.addEventListener("load", markLoaded, { once: true });
    });
  };

  renderAttendees(); renderContributions(); updatePaymentTotals(); renderMemories(); loadLiveRsvps(); loadSharedData(); setupMarisaWrapped(); setupPartyGame(); setupGate(); setupCountdown(); setupPhotoRail(); setupMenu(); setupReveals(); setupRsvp(); setupNotes(); setupMemoryForm(); setupMemoryCarousel(); setupPayments(); setupCalendar(); setupItineraryPopups(); setupNavHighlight(); setupSectionPosters(); setupImageLoading();
})();
