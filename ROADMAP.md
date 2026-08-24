# Plan: 37 bodhipakkhiyā hub

Turn NamaRupaExplorer from a single Cytoscape sketch into an installable HTML/JS study hub on GitHub Pages.

## Done in this pass

- [x] PWA shell (manifest, service worker, icons, offline cache)
- [x] Home hub with mnemonic **8 · 7 · 5 · 5 · 4 · 4 · 4**
- [x] Seven group pages and 37 factor pages
- [x] Interlinks: same quality, threads (sati, viriya, samādhi, paññā, saddhā, sīla, calm/insight), phenomena
- [x] Sutta catalog with SuttaCentral URLs and short Pali formulas
- [x] Search across the catalog
- [x] Preserve the original paṭiccasamuppāda prototype under `legacy/`
- [x] Catalog integrity test (`npm test`)

## Next

- [ ] Longer excerpt cards per factor (Pali + original English, still no copyrighted translation dumps)
- [ ] More citations from SN 45–51, SN 46.51 nutriment, AN 5.2 power-fulfilments
- [ ] Deep-link the twelve nidānas in a completed wheel, clicking through to factor pages
- [ ] Faculty ↔ power comparison view (SN 48.43: same dhammas, different strength)

## Later (visuals)

- [ ] Overlap diagram of the ~14 unique qualities inside the 37
- [ ] Bojjhaṅga nutriment / hindrance map
- [ ] Optional graph library, vendored (no CDN) so the PWA stays offline
- [ ] Bookmarks, recitation order, last-read
- [ ] Desktop wrapper only if PWA install is not enough

## Guardrails

- Keep the app static: HTML, CSS, JS modules. No build step required for GitHub Pages.
- Canonical order 4-4-4-5-5-7-8 remains visible beside the mnemonic.
- Cross-check notes against MN 77, DN 16/29, SN 45–51, MN 10 / DN 22, SN 56.11.
