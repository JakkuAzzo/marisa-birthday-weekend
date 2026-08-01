/*
 * Public configuration only. Never put a Stripe secret key here.
 *
 * For a live GitHub Pages version, add public Stripe Payment Link URLs to
 * stripePaymentLinks, and connect RSVP_ENDPOINT / UPLOAD_ENDPOINT to a
 * trusted form or storage service (Formspree, Supabase, Cloudinary, etc.).
 */
window.MARISA_CONFIG = {
  RSVP_ENDPOINT: "",
  UPLOAD_ENDPOINT: "",
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
