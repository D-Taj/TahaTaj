# Taha Taj — personal site source

Static site, ready for GitHub Pages. No build step — just push and enable Pages.

## File structure

```
index.html
css/style.css        (all styling)
css/fonts.css         (self-hosted @font-face rules)
js/script.js          (i18n, portfolio data, animations)
js/vendor/             (self-hosted GSAP files)
robots.txt
sitemap.xml
assets/
  profile/            (your avatar photo goes here — see its README.txt)
  work/               (portfolio images go here — see its README.txt)
  fonts/              (self-hosted webfonts, already in place)
```

## Editing content

- **About me / bio** — edit the `hero.about` and `hero.eyebrow` strings in the `I18N` object near the top of `js/script.js` (there's an English and a Persian version of every string).
- **Skills chips** — edit `skills.*` in the same `I18N` object. The chips themselves are listed in `index.html` inside `.skills-block .chip-list`; add or remove a `<li class="chip" data-i18n="skills.x">` there and a matching `"skills.x"` entry in both language dictionaries.
- **Portfolio items** — edit the `WORK` array in `js/script.js`. Each entry has an `en` and `fa` version of its tag/title/description, plus an `image` path and a `link` (left `""` until you have somewhere real to send it). Drop image files into `assets/work/`.
- **Profile photo** — put your photo at `assets/profile/photo.jpg` (see the README.txt in that folder). Until it's there, a neutral placeholder shows instead of a broken image icon.
- **Contact details** — edit directly in the Contact section of `index.html`.

## Language toggle (English default / Persian)

The small round button fixed at the top-right switches the whole page between English and Persian — text, direction (`ltr`/`rtl`), and the portfolio cards all update together. The choice is remembered (via `localStorage`) so a returning visitor sees whatever they picked last time.

To add or change wording in either language, edit the two objects (`en` and `fa`) inside `I18N` at the top of `js/script.js` — every visible string on the page has a matching key there.

## The loading animation

A short spinner (`#loader` in `index.html`, styled in `css/style.css`) covers the page on first load and fades out once everything (fonts, GSAP, images) is ready — with a small minimum delay so it doesn't just flash on fast connections. It respects `prefers-reduced-motion`.

## Libraries — fully self-hosted, no CDN dependency

| Library | Used for | Where it lives locally |
|---|---|---|
| GSAP core 3.15.0 | island menu animation, magnetic buttons | `js/vendor/gsap.min.js` |
| GSAP ScrollTrigger 3.15.0 | scroll-in reveal on sections/cards | `js/vendor/ScrollTrigger.min.js` |
| Space Grotesk (400–700) | heading typeface | `assets/fonts/space-grotesk/*.woff2` |
| Inter (400–700) | body typeface | `assets/fonts/inter/*.woff2` |

Nothing loads from an external CDN — the site keeps working even offline or if a CDN is ever blocked. To update a library later: `npm install gsap --no-save` (or `@fontsource/inter` / `@fontsource/space-grotesk`), then copy the new files from `node_modules/.../dist` or `.../files` over the ones in `js/vendor/` or `assets/fonts/`.

## SEO — what's in place, and the domain question

Since you haven't decided between `.com` and `.ir` yet, **no domain is hardcoded anywhere** — no `canonical` tag, no `og:url`, no `Sitemap:` line in `robots.txt`, and `sitemap.xml` has a `YOUR-DOMAIN-HERE` placeholder. This is intentional: a canonical tag or sitemap pointing at the wrong domain actively confuses Google once you do have a real one, so it's safer to add these once the domain is final than to guess now. The site indexes and works fine without them in the meantime — GitHub Pages gives it a real, crawlable URL either way.

**Once you pick a domain**, add these three things:
1. In `index.html`'s `<head>`: `<link rel="canonical" href="https://YOUR-DOMAIN/" />` and `<meta property="og:url" content="https://YOUR-DOMAIN/" />`.
2. In `sitemap.xml`: replace `YOUR-DOMAIN-HERE` with the real domain.
3. In `robots.txt`: uncomment the `Sitemap:` line and fill in the domain.

Already in place regardless of domain:
- Descriptive, keyword-relevant `<title>` and meta description, Open Graph/Twitter tags, and `Person` structured data (JSON-LD) listing your name and skills in both languages.
- A real, visible Persian paragraph (`#fa-services`, near the footer) describing you and your skills — this is what actually helps the page match Persian searches, since Google mostly ignores the `keywords` meta tag now and ranks on real visible content instead.
- Semantic HTML (`nav`, `main`, `section`, `footer`), one `<h1>`, alt text on images, visible focus states, and `prefers-reduced-motion` support.

One honest note, same as before: this gives the page a clean technical foundation, but ranking #1 on Google also depends on things outside the code — how long the site's been up, backlinks, real project content over time, and page speed on the actual server it ends up on. There's no setting that guarantees a first-page result; it's an ongoing process.
