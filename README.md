# Marisa's Birthday Weekend

A static GitHub Pages event hub for Marisa's birthday weekend, 21–24 August 2026.

## What works now

- responsive aubergine / cream event hub with Marisa's supplied photos
- RSVP form with day-by-day availability and overnight status
- local RSVP and message persistence in the browser
- downloadable weekend calendar (`.ics`)
- contribution selector for boat hire, cinema, accommodation and gift fund
- Stripe Payment Link hooks in `config.js`
- local image/video preview and a memory wall

## Connecting the live services

This is deliberately safe to host as a static site. A Stripe secret key must never be placed in the browser.

1. Create Stripe Payment Links for each shared cost, or one combined checkout link.
2. Paste only those public URLs into `config.js`.
3. Add a form endpoint for `RSVP_ENDPOINT` if RSVPs need to be shared between devices.
4. Add an upload endpoint for `UPLOAD_ENDPOINT` if media needs cloud storage. The endpoint should accept `multipart/form-data` under the `media` field.
5. Add the group's shared calendar URL to `SHARED_CALENDAR_URL`, or keep the built-in `.ics` download.

With blank endpoints, the site remains a fully usable private demo: RSVPs, notes and selected uploads persist locally in the visitor's browser.

## Local preview

From this folder, run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.
