# Patrik Fanta — web pro tvorbu, revitalizaci a správu webů

Statický web (HTML + CSS + JS), bez build kroku. Otevřete `index.html` v prohlížeči.

## Nastavení

### Poptávkový formulář (Web3Forms)
1. Na https://web3forms.com zadejte e-mail, na který mají chodit poptávky — přijde vám přístupový klíč.
2. Vložte ho do `js/main.js` do `const WEB3FORMS_KEY = '…';`.

Bez klíče formulář jako záloha otevře e-mailový program návštěvníka.

### Adresa webu
Web teď počítá s adresou `https://patrikfanta-cze.github.io/patrikfanta-web/`. Při přechodu na vlastní doménu ji nahraďte v:
`index.html` (canonical, og:url, og:image, JSON-LD), `ochrana-osobnich-udaju.html` a `obchodni-podminky.html` (canonical), `robots.txt`, `sitemap.xml`.

### Počítadlo návštěv (GoatCounter)
Měření bez cookies, skript `js/count.js` je uložený přímo na webu. Statistiky: https://patrikfanta.goatcounter.com (web musí být založený v účtu GoatCounter s kódem `patrikfanta`).

### Cache
Po každé úpravě CSS nebo JS zvyšte `?v=` v odkazech na `css/` a `js/` ve všech HTML souborech (teď `?v=7`).

### Obrázky
- `img/og.jpg` — náhled při sdílení odkazu (1200 × 630)
- `img/ref-*.jpg` — screenshoty referencí (1280 × 800)
- `img/patrik.jpg` — fotka do sekce O mně (zatím chybí, místo ní je logo fénix s P.F.; návod v komentáři v `index.html`)
- `apple-touch-icon.png`, `favicon.png` — ikony
- `img/fenix.png` — fénix z loga (432 × 432 px; pro tisk bude potřeba vektorová verze)
- `fonts/` — Fraunces a Manrope hostované lokálně (SIL Open Font License), bez Google Fonts
