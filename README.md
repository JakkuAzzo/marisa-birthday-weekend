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
- contribution selector for the optional gift fund
- Monzo payment link with a post-payment name, amount and reference report
- image/video/voice-note/message uploader and paged memory carousel
- microphone recording plus direct photo/video capture controls where the browser supports them
- first-birthday video replay with a separate lightweight soundtrack player, both lazy-loaded from `assets/media/`

## Connecting the live services

This is deliberately safe to host as a static site. The Monzo link is public; no banking credentials are placed in the browser.

1. Open the Monzo link from the contribution desk and send the selected amount.
2. Complete the payment report with your name, amount and Monzo reference/sender name. Reports are self-reported until matched in Monzo.
3. `PAYMENTS_ENDPOINT` forwards the report for email delivery, while the Firebase `payments` collection stores it for shared reconciliation.
4. Shared RSVP, payment reports, written-message and small media storage is configured through the dedicated Firebase Realtime Database project in `firebase.json` and `database.rules.json`. The client caps captures at 8MB to stay within the free-tier approach.
5. Add the group's shared calendar URL to `SHARED_CALENDAR_URL`, or keep the built-in `.ics` download.

Microphone permission is requested only after pressing “Record voice note”; camera buttons use the mobile browser's capture flow. Firebase Realtime Database is used here instead of Firebase Cloud Storage because new Cloud Storage buckets require a billing plan; the public read / password-gated write rules are intended for this casual birthday site, not sensitive data.

The password curtain is a casual privacy layer only. GitHub Pages serves the JavaScript publicly, so it is not suitable for genuinely confidential material. The shared Firebase feed updates RSVPs and the memory wall across devices; `rsvps.json` remains as the static fallback. The “Who’s in?” strip stays hidden until the feed is backed by confirmed responses.

## Local preview

From this folder, run:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/`.
