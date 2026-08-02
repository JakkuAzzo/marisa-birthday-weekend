(() => {
  const config = window.MARISA_CONFIG || {};
  const storageKeys = { rsvps: "marisa-birthday-rsvps", notes: "marisa-birthday-notes", media: "marisa-birthday-media", payments: "marisa-birthday-payments" };
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
  const firstBirthdayMedia = {
    video: "assets/media/marisa-first-birthday.mp4",
    audio: "assets/media/marisa-first-birthday-song.m4a",
    poster: "assets/photos/marisa-bouquet.jpeg"
  };
  const defaultAttendees = [
    { name: "Marisa", image: "assets/photos/marisa-roses.jpeg" },
    { name: "Nafe", image: "assets/photos/marisa-nafe-water.jpeg" },
    { name: "Alex", image: "assets/photos/group-bus.jpeg" },
    { name: "Max", image: "assets/photos/boat-night.jpeg" },
    { name: "Rosie", image: "assets/photos/friends-outdoors.jpeg" },
    { name: "+12", more: true }
  ];
  let liveRsvps = [];
  let sharedNotes = [];
  let sharedMedia = [];
  let memoryPage = 0;
  let marisaWrappedSlide = 0;
  let marisaWrappedMode = false;
  const contributions = [
    { id: "boat", title: "Boat hire", detail: "2 hours · Saturday before sunset", icon: "ph-sailboat", amount: () => config.contributionAmounts?.boat ?? 31 },
    { id: "cinema", title: "Vue cinema", detail: "Spider-Man: Brand New Day", icon: "ph-film-strip", amount: () => config.contributionAmounts?.cinema ?? 12 },
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
    if (item.url && item.type === "video") content = `<video controls preload="metadata" src="${escapeHtml(item.url)}" aria-label="Video shared by ${escapeHtml(item.name || "a friend")}"></video>`;
    if (item.url && item.type === "image") content = `<img loading="lazy" decoding="async" src="${escapeHtml(item.url)}" alt="${escapeHtml(item.name || "A friend")} shared a birthday photo" />`;
    return `<figure class="wrapped-upload-card wrapped-upload-${label}" style="--tilt:${item.tilt || "0deg"}">${content}<figcaption><strong>${escapeHtml(item.name || "A friend")}</strong><span>${escapeHtml(item.caption || label)}</span></figcaption></figure>`;
  };

  const wrappedArchiveCard = (item) => `<figure class="wrapped-upload-card wrapped-archive-card" style="--tilt:${item.tilt || "0deg"}"><img loading="lazy" decoding="async" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" /><figcaption><strong>Marisa archive</strong><span>${escapeHtml(item.caption)}</span></figcaption></figure>`;

  const renderMarisaWrapped = () => {
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
      { date: "FRI · 21 AUG", label: "Main birthday day", items: [["09:00", "The Breakfast Club", "Here East, Queen Elizabeth Olympic Park, Hackney Wick"], ["14:00", "Park picnic + drinks", "Queen Elizabeth Olympic Park · indoor backup if raining"], ["19:00", "Cake, food, gifts + games", "Sutton"]] },
      { date: "SAT · 22 AUG", label: "Kingston activity day", items: [["12:00", "Pub or restaurant meet", "Kingston upon Thames"], ["15:00", "Boat hire", "Kingston upon Thames riverfront · final meeting point to be confirmed"]] },
      { date: "SUN · 23 AUG", label: "Cinema & nightlife day", items: [["11:00", "Sutton meet", "Sutton · games, drinks + getting ready"], ["16:00", "Vue cinema: Spider-Man: Brand New Day", "Vue Croydon Purley Way"], ["20:00", "Night out", "Location to be confirmed"]] }
    ];
    const itineraryCards = itinerary.map((day) => `<article class="wrapped-itinerary-day"><p class="wrapped-itinerary-date">${escapeHtml(day.date)}</p><h3>${escapeHtml(day.label)}</h3><div>${day.items.map(([time, title, location]) => `<div class="wrapped-itinerary-item"><time>${escapeHtml(time)}</time><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(location)}</small></span></div>`).join("")}</div></article>`).join("");
    const wordCards = words.length ? words.map((item) => `<article class="wrapped-quote"><span class="wrapped-quote-mark">“</span><blockquote>${escapeHtml(item.text || "A little birthday love for you.")}</blockquote><footer><strong>${escapeHtml(item.name || "A friend")}</strong><span>${escapeHtml(item.mood || "sent with love")}</span></footer></article>`).join("") : wrappedEmpty("No words yet", "Your people can still leave something for the memory wall.");
    const momentCards = moments.length ? moments.map(wrappedMediaCard).join("") : wrappedEmpty("No uploads yet", "Photos and videos will appear here as people add them.");
    const voiceCards = voiceNotes.length ? voiceNotes.map((item) => `<article class="wrapped-voice-card"><div class="wrapped-voice-icon"><i class="ph ph-waveform" aria-hidden="true"></i></div><div><strong>${escapeHtml(item.name || "A friend")}</strong><span>${escapeHtml(item.caption || "A voice note for Marisa")}</span>${item.url ? `<audio controls preload="metadata" src="${escapeHtml(item.url)}" aria-label="Voice note from ${escapeHtml(item.name || "a friend")}"></audio>` : ""}</div></article>`).join("") : wrappedEmpty("No voice notes yet", "Someone should definitely press record.");
    const slideCount = 10;

    node.innerHTML = `<div class="wrapped-progress" style="--wrapped-count:${slideCount}" aria-label="Wrapped progress">${Array.from({ length: slideCount }, (_, index) => `<span data-wrapped-progress="${index}"></span>`).join("")}</div>
      <div class="wrapped-topbar"><span class="wrapped-brand"><i class="ph ph-sparkle" aria-hidden="true"></i> Marisa Wrapped</span><span>${uploads.length} ${uploads.length === 1 ? "memory" : "memories"} collected</span></div>
      <div class="wrapped-stage">
        <article class="wrapped-slide wrapped-slide-cover" data-wrapped-slide="0">
          <div class="wrapped-cover-copy"><p class="wrapped-kicker">YOUR 2026 BIRTHDAY STORY</p><h1>Marisa<br /><em>Wrapped.</em></h1><p class="wrapped-subtitle">A little replay of the people, words and moments that make you so loved.</p><button class="wrapped-start" type="button" data-wrapped-next>Tap to begin <i class="ph ph-arrow-right" aria-hidden="true"></i></button></div>
          <div class="wrapped-cover-art"><div class="wrapped-orbit wrapped-orbit-one"></div><div class="wrapped-orbit wrapped-orbit-two"></div><figure><img src="assets/photos/marisa-bouquet.jpeg" alt="Marisa holding a bouquet beside the water" /></figure><span class="wrapped-sticker">21<br /><small>AUG</small></span></div>
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
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">THE ORIGINAL SOUNDTRACK</p><h2>Your first<br /><em>birthday replay.</em></h2><p>A little piece of where this story began — saved here for another listen.</p></div><div class="wrapped-soundtrack-grid"><figure class="wrapped-soundtrack-video"><video controls preload="metadata" poster="${firstBirthdayMedia.poster}" playsinline aria-label="Video from Marisa's first birthday"><source src="${firstBirthdayMedia.video}" type="video/mp4" />Your browser does not support video playback.</video><figcaption>First birthday memories</figcaption></figure><div class="wrapped-soundtrack-audio"><div class="wrapped-voice-icon"><i class="ph ph-music-notes" aria-hidden="true"></i></div><strong>Press play for the song</strong><span>The soundtrack from your first birthday replay.</span><audio controls preload="none" src="${firstBirthdayMedia.audio}" aria-label="Marisa's first birthday soundtrack"></audio></div></div>
        </article>
        <article class="wrapped-slide wrapped-slide-itinerary" data-wrapped-slide="8">
          <div class="wrapped-slide-heading"><p class="wrapped-kicker">THE WEEKEND IN THREE ACTS</p><h2>Your<br /><em>itinerary.</em></h2><p>The working plan — enough structure for the good stuff, with room for the moments in between.</p></div><div class="wrapped-itinerary-grid">${itineraryCards}</div>
        </article>
        <article class="wrapped-slide wrapped-slide-finale" data-wrapped-slide="9">
          <div class="wrapped-finale-spark">✦</div><p class="wrapped-kicker">THAT'S A WRAP</p><h2>Happy birthday,<br /><em>Marisa.</em></h2><p>Three days, a hundred little moments, and a whole lot of love still to come.</p><div class="wrapped-finale-counts"><span><strong>${uploads.length}</strong> memories</span><span><strong>${rsvps.length}</strong> real responses</span></div><button class="wrapped-replay" type="button" data-wrapped-replay><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i> Replay your Wrapped</button></article>
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
    renderMarisaWrapped();
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
        const content = item.type === "video" ? `<video controls preload="metadata" src="${item.url}" aria-label="Video shared by ${escapeHtml(item.name)}"></video>` : item.type === "audio" ? `<audio controls preload="metadata" src="${item.url}" aria-label="Voice note shared by ${escapeHtml(item.name)}"></audio>` : `<img loading="lazy" decoding="async" src="${item.url}" alt="${escapeHtml(item.name)}'s uploaded memory" />`;
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
    ["20260821T140000", "20260821T170000", "Park picnic + drinks", "Indoor backup if raining"],
    ["20260821T190000", "20260821T230000", "Cake, food, gifts + games", "Sutton"],
    ["20260822T120000", "20260822T140000", "Pub or restaurant meet", "Kingston upon Thames"],
    ["20260822T150000", "20260822T170000", "Boat hire", "Kingston upon Thames · two hours before sunset"],
    ["20260823T110000", "20260823T150000", "Sutton meet", "Sutton · games, drinks + getting ready"],
    ["20260823T160000", "20260823T190000", "Vue cinema: Spider-Man: Brand New Day", "Vue Purley Way"],
    ["20260823T200000", "20260823T235900", "Night out", "Location to be confirmed"],
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

  const unlockWebsite = (mode) => {
    try { sessionStorage.setItem("marisa-birthday-access", mode); } catch { /* private browsing can disable storage */ }
    document.documentElement.classList.remove("is-gated");
    document.body.classList.add("is-unlocked");
    const marisaView = $("[data-marisa-view]");
    if (mode === "marisa") {
      marisaWrappedMode = true;
      document.body.classList.add("is-marisa-mode");
      marisaView.hidden = false;
      renderMarisaWrapped();
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
        await fetch(config.RSVP_ENDPOINT, { method: "POST", body, mode: "no-cors" });
      } catch { /* local save still succeeds */ }
    }
    const rsvpMessage = config.RSVP_ENDPOINT ? `RSVP submitted — see you ${data.days.length ? data.days.join(", ") : "when you can"}!` : "RSVP saved in this browser. Shared RSVP syncing is not connected yet.";
    $("[data-rsvp-status]").textContent = rsvpMessage;
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
    const kind = $("#memory-kind");
    const input = $("[data-upload-input]");
    const dropzone = $(".upload-dropzone");
    const photoButton = $("[data-capture-photo]");
    const videoButton = $("[data-capture-video]");
    const recordButton = $("[data-record-voice]");
    const timer = $("[data-record-timer]");
    let recordedFile = null;
    let recorder = null;
    let recordingStream = null;
    let recordingStartedAt = 0;
    let timerId = null;
    const status = $("[data-memory-status]");
    const setStatus = (message) => { if (status) status.textContent = message; };
    const formatDuration = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    const refreshFileRequirement = () => {
      const captureMode = kind.value === "image" || kind.value === "video" ? "environment" : "";
      input.required = kind.value !== "message";
      input.accept = kind.value === "message" ? "" : `${kind.value}/*`;
      input.setAttribute("capture", captureMode);
      const uploadLabels = { image: "photo", video: "video", audio: "voice note" };
      dropzone.querySelector("strong").textContent = kind.value === "message" ? "No file needed for a written message" : `Choose or drop a ${uploadLabels[kind.value] ?? "file"}`;
      dropzone.querySelector("span").textContent = kind.value === "message" ? "Written messages are shared instantly" : "Images, videos and voice notes · max 8MB after automatic image compression";
      if (kind.value !== "audio") recordedFile = null;
    };
    kind.addEventListener("change", refreshFileRequirement);
    refreshFileRequirement();
    photoButton?.addEventListener("click", () => { kind.value = "image"; refreshFileRequirement(); input.click(); });
    videoButton?.addEventListener("click", () => { kind.value = "video"; refreshFileRequirement(); input.click(); });
    ["dragenter", "dragover"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach((eventName) => dropzone.addEventListener(eventName, (event) => { event.preventDefault(); dropzone.classList.remove("is-dragging"); }));
    dropzone.addEventListener("drop", (event) => { if (event.dataTransfer.files.length) input.files = event.dataTransfer.files; });
    input.addEventListener("change", () => { if (input.files.length) setStatus(`${input.files[0].name} is ready to add.`); });
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
          recordedFile = new File([blob], "marisa-voice-note.webm", { type: blob.type });
          recordingStream?.getTracks().forEach((track) => track.stop());
          window.clearInterval(timerId); timer.textContent = "00:00"; recordButton.textContent = "Record voice note"; recordButton.setAttribute("aria-pressed", "false");
          kind.value = "audio"; refreshFileRequirement(); setStatus("Voice note ready — add it to the memory wall when you are happy.");
        });
        recorder.start(); recordingStartedAt = Date.now(); timerId = window.setInterval(() => { timer.textContent = formatDuration(Math.floor((Date.now() - recordingStartedAt) / 1000)); }, 1000);
        recordButton.textContent = "Stop recording"; recordButton.setAttribute("aria-pressed", "true"); setStatus("Recording… tap Stop recording when you are finished.");
      } catch { setStatus("Microphone access was not granted. You can still upload a voice note file instead."); }
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const selectedFile = input.files[0] || recordedFile;
      if (data.kind === "message" && !data.caption?.trim()) { status.textContent = "Write a message first, or choose a media type."; return; }
      if (data.kind !== "message" && !selectedFile) { status.textContent = "Choose a file first, or switch to Written message."; return; }
      setStatus(selectedFile?.type.startsWith("image/") ? "Optimising image for the shared wall…" : "Saving your memory…");
      const file = selectedFile ? await compressImage(selectedFile) : null;
      if (file && file.size > 8 * 1024 * 1024) { status.textContent = "That file is over 8MB after compression — please choose a smaller one."; return; }
      if (config.UPLOAD_ENDPOINT) {
        const body = new FormData(form);
        body.delete("file");
        if (file) body.set("file", file, file.name);
        try { await fetch(config.UPLOAD_ENDPOINT, { method: "POST", body }); } catch { status.textContent = "Cloud upload failed; saving this memory locally instead."; }
      }
      const existing = read(storageKeys.media, []);
      const item = { name: data.name, caption: data.caption, type: data.kind, createdAt: new Date().toISOString(), tilt: `${(Math.random() * 4 - 2).toFixed(1)}deg` };
      if (file) item.url = await fileToDataUrl(file);
      let sharedSaved = false;
      if (sharedBase) { try { sharedSaved = await pushShared("media", item); } catch { /* local save still succeeds */ } }
      let forwarded = false;
      if (data.kind === "message" && config.NOTES_ENDPOINT) {
        try {
          const body = new FormData();
          body.set("name", data.name);
          body.set("body", data.caption);
          body.set("_subject", "Marisa birthday weekend memory message");
          body.set("_template", "table");
          await fetch(config.NOTES_ENDPOINT, { method: "POST", body, mode: "no-cors" });
          forwarded = true;
        } catch { /* shared save still succeeds */ }
      }
      existing.push(item);
      try { write(storageKeys.media, existing); } catch { status.textContent = "That capture is too large for browser-only saving. Add an upload endpoint in config.js for larger shared media."; return; }
      recordedFile = null; memoryPage = Math.max(0, Math.ceil((mergeShared(sharedNotes, read(storageKeys.notes, [])).length + mergeShared(sharedMedia, existing).length) / 10) - 1); renderMemories(); form.reset(); refreshFileRequirement(); status.textContent = sharedSaved && forwarded ? "Message shared and forwarded for email delivery." : sharedSaved ? "Added to the shared memory carousel." : config.UPLOAD_ENDPOINT ? "Added to the shared memory carousel." : "Added to this browser's memory carousel only."; toast(sharedSaved || config.UPLOAD_ENDPOINT ? "Memory added to the shared carousel." : "Memory saved locally to the carousel.");
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
        { time: "14:00–17:00", title: "Park picnic + drinks", location: "Queen Elizabeth Olympic Park · indoor backup if raining", directions: "https://www.google.com/maps/search/?api=1&query=Queen+Elizabeth+Olympic+Park" },
        { time: "19:00–23:00", title: "Cake, food, gifts + games", location: "Sutton" }
      ] },
      { day: "Saturday 22 August", label: "Kingston activity day", date: "SAT · 22 AUG", items: [
        { time: "12:00–14:00", title: "Pub or restaurant meet", location: "Kingston upon Thames", directions: "https://www.google.com/maps/search/?api=1&query=Kingston+upon+Thames" },
        { time: "15:00–17:00", title: "Boat hire", location: "Kingston upon Thames riverfront · final meeting point to be confirmed", directions: "https://www.google.com/maps/search/?api=1&query=Kingston+upon+Thames+riverfront" }
      ] },
      { day: "Sunday 23 August", label: "Cinema & nightlife day", date: "SUN · 23 AUG", items: [
        { time: "11:00–15:00", title: "Sutton meet", location: "Sutton · games, drinks + getting ready" },
        { time: "16:00–19:00", title: "Vue cinema: Spider-Man: Brand New Day", location: "Vue Croydon Purley Way", directions: "https://www.google.com/maps/search/?api=1&query=Vue+Croydon+Purley+Way" },
        { time: "20:00–23:59", title: "Night out", location: "Location to be confirmed", directions: "https://www.google.com/maps/search/?api=1&query=Purley+Way+Croydon+restaurants+bars" }
      ] }
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
        schedule.innerHTML = itinerary.items.map((item) => `<div><time>${escapeHtml(item.time.split("–")[0])}</time><span>${escapeHtml(item.title.replace(": Spider-Man: Brand New Day", ""))}</span></div>`).join("");
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
    $$('main > section').forEach((section, sectionIndex) => {
      if (section.querySelector(".section-posters")) return;
      const selected = posterSets[sectionIndex % posterSets.length];
      section.dataset.posterLayout = String(sectionIndex % 3);
      const posters = selected.map((photoIndex, posterIndex) => {
        const photo = allPhotos[(photoIndex + sectionIndex * 2) % allPhotos.length];
        return `<span class="poster-frame poster-frame-${posterIndex + 1}"><img src="${photo.src}" alt="" loading="lazy" decoding="async" /></span>`;
      }).join("");
      section.insertAdjacentHTML("afterbegin", `<div class="section-posters" aria-hidden="true">${posters}</div>`);
    });
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

  renderAttendees(); renderContributions(); updatePaymentTotals(); renderMemories(); loadLiveRsvps(); loadSharedData(); setupMarisaWrapped(); setupGate(); setupCountdown(); setupPhotoRail(); setupMenu(); setupReveals(); setupRsvp(); setupNotes(); setupMemoryForm(); setupMemoryCarousel(); setupPayments(); setupCalendar(); setupItineraryPopups(); setupNavHighlight(); setupSectionPosters(); setupImageLoading();
})();
