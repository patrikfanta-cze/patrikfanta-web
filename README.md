# Patrik Fanta — web pro tvorbu a správu webů, školení a IT audit

Statický web (HTML + CSS + JS), bez build kroku. Otevřete `index.html` v prohlížeči.

## Stránky
- `index.html` – rozcestník: dlaždice oblastí, O mně, kontakt (staré odkazy `#cenik`, `#skoleni`… přesměruje `js/main.js`)
- `weby.html` – tvorba a správa webů (služby, ceník, reference, postup, otázky), tlačítko na demo rezervací https://demo.patrikfanta.cz/
- `skoleni.html` – školení pro školy a firmy (tyrkysové ladění `body.theme-skoleni`, témata s osnovami, PDF nabídky v `nabidky/`)
- `audit.html` – IT audit a konzultace
- `404.html` – chybová stránka (má `<base href="/">`, protože se zobrazuje i v podsložkách)
- Nová oblast = nová stránka + dlaždice v `index.html` (`.tiles` se přizpůsobí počtu)

## Nastavení

### Poptávkový formulář
Formuláře na `index`, `weby`, `skoleni` a `audit` posílají zprávy na vlastní server Formuláře (`https://formulare.patrikfanta.cz/f/patrikfanta`, nastavení v `js/main.js`), ten je pošle e-mailem na servis@patrikfanta.cz. Když server neodpovídá, formulář ukáže e-mail a telefon.

### Adresa webu
Web běží na vlastní doméně `https://patrikfanta.cz/` (soubor CNAME). Při změně domény ji nahraďte v:
`index.html` (canonical, og:url, og:image, JSON-LD), ostatních stránkách (canonical), `robots.txt`, `sitemap.xml`.

### Počítadlo návštěv (GoatCounter)
Měření bez cookies, skript `js/count.js` je uložený přímo na webu a posílá na vlastní server `https://patrikfanta.stat.patrikfanta.cz/count`.

### Cache
Po každé úpravě CSS nebo JS zvyšte `?v=` v odkazech na `css/` a `js/` ve všech HTML souborech.

### Obrázky
- `img/og.jpg` — náhled při sdílení odkazu (1200 × 630)
- `img/ref-*.jpg` — screenshoty referencí (1280 × 800)
- `img/patrik.jpg` — fotka do sekce O mně (zatím chybí, místo ní je logo fénix s P.F.; návod v komentáři v `index.html`)
- `apple-touch-icon.png`, `favicon.png` — ikony
- `img/fenix.png` — fénix z loga (432 × 432 px; pro tisk bude potřeba vektorová verze)
- `fonts/` — Fraunces a Manrope hostované lokálně (SIL Open Font License), bez Google Fonts
