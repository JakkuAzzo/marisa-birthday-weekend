/*
 * Public configuration only. Never put a Stripe secret key here.
 *
 * For a live GitHub Pages version, add public Stripe Payment Link URLs to
 * stripePaymentLinks, and connect the form endpoints to trusted services.
 */
window.MARISA_CONFIG = {
  RSVP_ENDPOINT: "https://formsubmit.co/nathanbrown-bennett%2Bmarisa-birthday@hotmail.com",
  NOTES_ENDPOINT: "https://formsubmit.co/nathanbrown-bennett%2Bmarisa-birthday@hotmail.com",
  UPLOAD_ENDPOINT: "",
  LIVE_RSVPS_URL: "rsvps.json",
  SHARED_CALENDAR_URL: "",
  STRIPE_COMBINED_CHECKOUT_URL: "",
  stripePaymentLinks: {
    boat: "",
    cinema: "",
    stay: "",
    gift: ""
  },
  contributionAmounts: {
    boat: 31,
    cinema: 12,
    stay: 82.80,
    gift: 15
  }
};
