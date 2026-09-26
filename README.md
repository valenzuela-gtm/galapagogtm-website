# galapagogtm-website

Source for [galapago.io](https://galapago.io): Bernardo Valenzuela, GTM strategy and execution across the US and LATAM.

Static site deployed via GitHub Pages: `index.html` (home), `vc-pe.html` (for VC and PE teams), `privacy/` and `terms/`. Styles in `site.css` plus `palette-mono.css`; scripts in `site.js`, `dots.js` (the moving dots) and `consent.js` (cookie consent and the OpenAI Ads pixel, which loads only on galapago.io).

## Deploy

1. In repo Settings → Pages, set **Source** to `Deploy from a branch`, branch `main` (or whichever is live), folder `/ (root)`.
2. Under **Custom domain**, enter `galapago.io`. The `CNAME` file in this repo will pin it.
3. Configure DNS for `galapago.io`:
   - Apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` `CNAME` → `valenzuela-gtm.github.io`
4. Enable **Enforce HTTPS** once the cert provisions.

## Edit

The pages are built from the private `bvgtm-website` repo; edit there and copy the result here. Every push to `main` is live in about a minute.
