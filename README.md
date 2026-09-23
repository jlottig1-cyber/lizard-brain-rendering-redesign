# Lizard Brain Wiring website source

Recovered from the live production website on September 23, 2026 so the site has a maintainable source-of-truth.

## SEO Step 1
- `robots.txt`
- `sitemap.xml` containing all 9 canonical HTTPS URLs

## Quote form
The frontend posts to `/api/quote`.
The Vercel proxy at `api/quote.js` requires `LBW_FORM_SECRET` as a Vercel environment variable.
No authentication secret is stored in this repository.

## Production safety
Do not point the production domain to a deployment from this repository until a preview has been verified and the quote-form environment variable has been configured.
