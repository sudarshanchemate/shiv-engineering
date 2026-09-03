# Shiv Engineering — DG Set Solutions Website

A fast, responsive, SEO-ready single-page business website for **Shiv Engineering** —
DG set AMC, repair & maintenance, sales & purchase, rental and 24×7 emergency service.

No build step, no dependencies. Plain HTML, CSS and JavaScript — open `index.html` and it runs.

```
shiv_engineering/
├── index.html        # all page content + JSON-LD structured data
├── css/styles.css    # design tokens, components, responsive rules
├── js/main.js        # SITE config, nav, reveal animations, quote form
├── assets/
│   ├── favicon.svg   # browser tab icon
│   └── og-cover.svg  # social share image
├── robots.txt
└── sitemap.xml
```

---

## 1. Before going live — fill in the real details

### a) Contact details (one place, updates the whole site)

Open [js/main.js](js/main.js) and edit the `SITE` object at the top. Every phone link,
WhatsApp button, email link, address and service-area line on the page is generated from it.

```js
const SITE = {
  phoneDial:       '+919876543210',        // full international format, no spaces
  phoneDisplay:    '+91 98765 43210',      // how it is shown on screen
  whatsappNumber:  '919876543210',         // country code + number, NO '+' and NO spaces
  whatsappDisplay: '+91 98765 43210',
  whatsappMessage: 'Hello Shiv Engineering, I need assistance regarding my DG set. Please contact me.',
  email:           'info@shivengineering.in',
  emailSubject:    'DG Set Enquiry — Shiv Engineering',
  address:         'Shop 12, MIDC Road, Pune, Maharashtra 411019',
  serviceArea:     'Pune, Pimpri-Chinchwad, Chakan & nearby districts'
};
```

> The WhatsApp number **must not** contain `+`, spaces or dashes — `wa.me` links break otherwise.

### b) Details that also live in the HTML (for search engines)

JavaScript fills the visible text, but crawlers also read the raw HTML. In
[index.html](index.html) update:

| What | Where |
| --- | --- |
| Fallback phone / email in links | search for `+910000000000` and `info@shivengineering.in` |
| Website domain | `<link rel="canonical">`, `og:url`, and the JSON-LD `url` / `@id` |
| Business address, city, state, PIN | the `PostalAddress` block in the JSON-LD script at the bottom |
| `areaServed` | same JSON-LD block |
| Domain in `robots.txt` and `sitemap.xml` | both files |

Everything still needing input is written as `[Your business address]`-style placeholders,
so a search for `[Your` finds them all.

---

## 2. How the enquiry form works

The site is fully static, so **Get a Free Quote** composes the enquiry (name, company,
mobile, location, DG brand, capacity, required service, message) and opens WhatsApp
with it pre-filled — no server or hosting backend required. Required fields are
validated in the browser first.

To send enquiries to an inbox or CRM instead, replace the `form.addEventListener('submit', …)`
handler in [js/main.js](js/main.js) with a `fetch()` POST to your backend or to a form
service such as Formspree or Web3Forms.

---

## 3. Running and deploying

**Locally** — double-click `index.html`, or serve the folder:

```powershell
python -m http.server 8000     # then open http://localhost:8000
```

**Deploying** — upload the whole folder to any static host: Netlify, Vercel,
GitHub Pages, Cloudflare Pages, or ordinary cPanel/shared hosting via FTP.
Nothing needs to be compiled.

After deploying, submit the site to
[Google Search Console](https://search.google.com/search-console) and create a
**Google Business Profile** — for a local DG service business that is the single
biggest driver of "DG service near me" enquiries.

---

## 4. What is built in

- **Sections** — hero, key figures, about (mission & vision), five services, brands,
  why choose us, four-step process, industries served, CTA band, quote form + contact card, footer.
- **Conversion paths** — sticky header CTA, floating Call and WhatsApp buttons on every
  screen, per-service call-to-action links, and the full enquiry form.
- **SEO** — the supplied title and meta description, keyword meta, canonical URL,
  Open Graph / Twitter cards, `LocalBusiness` + `OfferCatalog` JSON-LD structured data,
  `robots.txt` and `sitemap.xml`, one `<h1>` with a clean heading hierarchy.
- **Accessibility** — skip link, keyboard-operable mobile menu (Escape closes it),
  visible focus rings, labelled form fields with inline errors, `aria-live` status message,
  and full `prefers-reduced-motion` support.
- **Performance** — no frameworks, no images to download (logo, icons and social card are
  inline or SVG), fonts preconnected; the entire site is a few hundred KB.
- **Responsive** — tested layouts down to 360 px, with print styles included.

---

## 5. Customising the look

All colours, spacing and radii are CSS custom properties at the top of
[css/styles.css](css/styles.css):

```css
--ink:#0B1626;      /* deep navy — headers, dark sections */
--amber:#F5A50B;    /* primary accent — buttons, highlights */
--wa:#25D366;       /* WhatsApp green */
```

Change `--amber` alone and the entire accent colour of the site follows.

To add real photographs later (site work, DG installations, team), drop them in `assets/`
and place them in the hero card or a new gallery section — genuine site photos measurably
increase enquiries for service businesses.
