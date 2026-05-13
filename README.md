# galapagogtm-website

Source for [galapago.io](https://galapago.io) — GalapagoGTM by Bernardo Valenzuela.

Single static page (`index.html`) deployed via GitHub Pages. EN/ES i18n is built in and auto-detects from the browser; the choice is remembered in `localStorage`.

## Deploy

1. In repo Settings → Pages, set **Source** to `Deploy from a branch`, branch `main` (or whichever is live), folder `/ (root)`.
2. Under **Custom domain**, enter `galapago.io`. The `CNAME` file in this repo will pin it.
3. Configure DNS for `galapago.io`:
   - Apex `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `www` `CNAME` → `valenzuela-gtm.github.io`
4. Enable **Enforce HTTPS** once the cert provisions.

## Edit

Everything lives in `index.html` — CSS, JS, and copy. EN/ES strings are in the `i18n` object near the bottom of the file.
