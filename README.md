# Nama-Rūpa Explorer

Theravāda study hub for the **37 bodhipakkhiyā dhammā** (wings to awakening), published as a static HTML/JS **PWA** on GitHub Pages.

Live: [azzabazza11.github.io/NamaRupaExplorer](https://azzabazza11.github.io/NamaRupaExplorer/)

## The seven sets (8 · 7 · 5 · 5 · 4 · 4 · 4)

| n | Set | Pali |
|---|-----|------|
| 8 | Noble eightfold path | ariyo aṭṭhaṅgiko maggo |
| 7 | Factors of awakening | satta bojjhaṅgā |
| 5 | Spiritual faculties | pañcindriyāni |
| 5 | Powers | pañca balāni |
| 4 | Establishments of mindfulness | cattāro satipaṭṭhānā |
| 4 | Right strivings | cattāro sammappadhānā |
| 4 | Bases of spiritual power | cattāro iddhipādā |

Suttas usually list them **4-4-4-5-5-7-8**. The hub uses the **8-7-5-5-4-4-4** mnemonic on the home screen; both orders are the same Dhamma.

## Use

- Browse a group, open a factor, follow **same quality** links (for example sati as satipaṭṭhāna, faculty, power, bojjhaṅga, and path factor).
- Cross into **phenomena**: nāma-rūpa, twelve nidānas, aggregates, truths, hindrances.
- Open **sutta pointers** (MN 10, SN 45.8, DN 16, and others) with Pali formulas and SuttaCentral links.
- Install as an app on phone or desktop. After the first load it works offline.

## Local

```bash
python3 -m http.server 8080
# or: npm start
```

Open `http://127.0.0.1:8080/`. `npm test` checks that the catalog still contains 37 factors in the seven groups.

## Scope

Essential notes are original study text. Pali stock formulas are canonical. Full translations stay on SuttaCentral so the app does not copy copyrighted editions.

The early Cytoscape paṭiccasamuppāda sketch is kept at [`legacy/paticca.html`](legacy/paticca.html). Visual maps are a later phase — see [ROADMAP.md](ROADMAP.md).

## License

GNU GPL v3. Educational use.
