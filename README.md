# Marisa's Birthday Weekend

A static GitHub Pages event hub for Marisa's birthday weekend, 21–24 August 2026.

## What works now

- responsive aubergine / cream event hub with Marisa's supplied photos
- separate Home, Plan, RSVP, Memories and Details pages
- RSVP form with day-by-day availability and overnight status
- password curtain (`happybirthday`) with a birthday-only Marisa view (`210803`)
- refreshable confirmed RSVP count from `rsvps.json` (no assumed attendees are seeded)
- local RSVP and message persistence in the browser
- downloadable weekend calendar (`.ics`)
- contribution selector for boat hire, cinema, accommodation and gift fund
- Stripe Payment Link hooks in `config.js`
- image/video/voice-note/message uploader and paged memory carousel
- microphone recording plus direct photo/video capture controls where the browser supports them

## Connecting the live services

This is deliberately safe to host as a static site. A Stripe secret key must never be placed in the browser.

1. Create Stripe Payment Links for each shared cost, or one combined checkout link.
2. Paste only those public URLs into `config.js`.
3. Add a form endpoint for `RSVP_ENDPOINT` if RSVPs need to be shared between devices.
4. Add an upload endpoint for `UPLOAD_ENDPOINT` if media needs cloud storage. The endpoint should accept `multipart/form-data` under the `media` field.
5. Add the group's shared calendar URL to `SHARED_CALENDAR_URL`, or keep the built-in `.ics` download.

With blank endpoints, the site remains a fully usable private demo: RSVPs, notes and selected uploads persist locally in the visitor's browser. Microphone permission is requested only after pressing “Record voice note”; camera buttons use the mobile browser's capture flow. Larger media and cross-device sharing still require an upload endpoint.

The password curtain is a casual privacy layer only. GitHub Pages serves the JavaScript publicly, so it is not suitable for genuinely confidential material. The public confirmed RSVP feed is `rsvps.json`; changing that file and pushing it updates the count on refresh. The “Who’s in?” strip stays hidden until the feed is backed by confirmed responses.

## Local preview

From this folder, run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.
