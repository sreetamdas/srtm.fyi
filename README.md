# srtm.fyi

My URL shortener: one [`_redirects`](./_redirects) file, served by Cloudflare
Pages with `srtm.fyi` as a custom domain. Pushing to `main` deploys it.

The front door `/` is the one exception: [`functions/index.js`](./functions/index.js)
redirects browsers to sreetamdas.com and prints a text card for `curl` and
other terminal clients. Pages does not apply `_redirects` to a path a Function
serves, so the `/*` fallback no longer covers `/`.

## Adding a short link

Append a line to [`_redirects`](./_redirects) and push:

```
/short            https://example.com
/short/*          https://example.com/:splat
```

Order matters — rules are matched top to bottom, so the catch-all
`/*  https://sreetamdas.com` has to stay last.
