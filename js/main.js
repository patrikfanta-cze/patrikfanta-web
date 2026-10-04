// Navigace — stín po scrollu a mobilní menu
const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav__toggle');

addEventListener('scroll', () => nav.classList.toggle('is-scrolled', scrollY > 10), { passive: true });

toggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  toggle.setAttribute('aria-expanded', open);
});
document.querySelectorAll('.nav__links a').forEach(a =>
  a.addEventListener('click', () => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', false);
  })
);

// „Nahoru“ a logo — úplně na začátek stránky (hlavička je sticky, kotva #top by nefungovala)
document.querySelectorAll('a[href="#top"]').forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    history.replaceState(null, '', location.pathname);
  })
);

// Ceník — přepínání záložek
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.pricing');

function showTab(name) {
  tabs.forEach(t => {
    const active = t.dataset.tab === name;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', active);
  });
  panels.forEach(p => {
    const active = p.dataset.panel === name;
    p.hidden = !active;
    p.classList.toggle('is-active', active);
  });
}
tabs.forEach(t => t.addEventListener('click', () => showTab(t.dataset.tab)));

// Poptávkový formulář
// Zprávy doručuje Web3Forms (web3forms.com) přímo na e-mail. Dokud není vyplněný
// přístupový klíč, formulář jako záloha otevře e-mailový program návštěvníka.
const WEB3FORMS_KEY = '9054769f-a267-47bb-95db-91859e8bbd7a';
const MAIL = 'patrik.fanta@gmail.com';

const form = document.getElementById('poptavka');
if (form) {
  const serviceByPanel = { tvorba: 'Nový web', revitalizace: 'Revitalizace webu', sprava: 'Správa webu' };
  const status = form.querySelector('.form__status');
  const submitBtn = form.querySelector('button[type="submit"]');

  // Tlačítko „Poptat“ v ceníku předvyplní formulář
  document.querySelectorAll('[data-plan]').forEach(btn =>
    btn.addEventListener('click', () => {
      form.sluzba.value = serviceByPanel[btn.closest('.pricing').dataset.panel];
      if (!form.zprava.value) form.zprava.value = `Mám zájem o balíček „${btn.dataset.plan}“.

`;
    })
  );

  const setStatus = (html, type) => {
    status.innerHTML = html;
    status.className = 'form__status' + (type ? ' is-' + type : '');
  };

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (form.botcheck.checked) return; // robot vyplnil skryté pole

    let ok = true;
    ['jmeno', 'kontakt'].forEach(name => {
      const field = form[name];
      const empty = !field.value.trim();
      field.classList.toggle('is-invalid', empty);
      if (empty) ok = false;
    });
    if (!ok) {
      setStatus('Vyplňte prosím jméno a kontakt.', 'error');
      form.querySelector('.is-invalid').focus();
      return;
    }
    const consent = form.consent;
    consent.closest('.consent').classList.toggle('is-invalid', !consent.checked);
    if (!consent.checked) {
      setStatus('Potvrďte prosím, že berete na vědomí zpracování osobních údajů.', 'error');
      consent.focus();
      return;
    }

    const jmeno = form.jmeno.value.trim();
    const kontakt = form.kontakt.value.trim();
    const subject = `Poptávka: ${form.sluzba.value} – ${jmeno}`;
    const body = `Jméno: ${jmeno}
Kontakt: ${kontakt}
Služba: ${form.sluzba.value}

${form.zprava.value.trim()}`;
    const mailto = `mailto:${MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    if (!WEB3FORMS_KEY) {
      location.href = mailto;
      return;
    }

    submitBtn.disabled = true;
    setStatus('Odesílám…');
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject,
          from_name: 'Web Patrik Fanta',
          ...(kontakt.includes('@') ? { replyto: kontakt } : {}),
          Jméno: jmeno,
          Kontakt: kontakt,
          Služba: form.sluzba.value,
          Zpráva: form.zprava.value.trim()
        })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      form.reset();
      setStatus('Děkuji, poptávka dorazila. Ozvu se obvykle do 24 hodin.', 'ok');
    } catch {
      setStatus(`Odeslání se nepovedlo. Napište mi prosím přímo na <a href="${mailto}">${MAIL}</a> nebo zavolejte <a href="tel:+420608041998">608 041 998</a>.`, 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

// Plovoucí tlačítko Zavolat — po odscrollování z úvodu, schované u kontaktu
const fab = document.querySelector('.call-fab');
const contact = document.getElementById('kontakt');
if (fab) {
  const updateFab = () => {
    const contactVisible = contact && contact.getBoundingClientRect().top < innerHeight;
    fab.classList.toggle('is-shown', scrollY > 500 && !contactVisible);
  };
  addEventListener('scroll', updateFab, { passive: true });
  updateFab();
}

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

// Postupné zobrazení sekcí — sourozenci najíždějí s odstupem (--i)
const revealItems = document.querySelectorAll('.section h2, .section .eyebrow, .section__intro, .service, .plan, .ref, .steps li, .faq details, .extras > div, .contact__list li, .about__photo, .about__why li, .about__stats li');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(el => {
    const siblings = [...el.parentElement.children].filter(c => c.tagName === el.tagName);
    el.style.setProperty('--i', Math.min(siblings.indexOf(el), 5));
    el.classList.add('reveal');
    io.observe(el);
  });
} else {
  document.querySelectorAll('.steps li').forEach(li => li.classList.add('is-visible'));
}

// Ukazatel scrollu nahoře
const progress = document.querySelector('.progress');
const updateProgress = () => {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
};
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// Měnící se slovo v nadpisu — psací stroj
const rotator = document.querySelector('.rotator');
if (rotator && !reduceMotion) {
  const words = rotator.dataset.words.split('|');
  // Pevná šířka podle nejdelšího slova, aby se řádek při psaní neposouval
  const fitWidth = () => {
    rotator.style.minWidth = '';
    const current = rotator.textContent;
    rotator.style.minWidth = Math.max(...words.map(word => {
      rotator.textContent = word;
      return rotator.getBoundingClientRect().width;
    })) + 'px';
    rotator.textContent = current;
  };
  document.fonts.ready.then(fitWidth);
  addEventListener('resize', fitWidth);

  let w = 0, c = words[0].length, deleting = true;
  const tick = () => {
    if (deleting) {
      c--;
      if (c === 0) { deleting = false; w = (w + 1) % words.length; }
    } else {
      c++;
    }
    rotator.textContent = words[w].slice(0, c);
    let delay = deleting ? 45 : 85;
    if (!deleting && c === words[w].length) { deleting = true; delay = 2200; }
    if (c === 0) delay = 250;
    setTimeout(tick, delay);
  };
  setTimeout(tick, 2600);
}

// Čísla se „napočítají“, jakmile se objeví na obrazovce
const formatCz = n => n.toLocaleString('cs-CZ').replace(/s/g, ' ');
// Číslo v HTML zůstává, dokud animace opravdu neběží (skrytá karta, roboti, náhledy odkazů)
const countUp = (el, delay = 0) => {
  const target = +el.dataset.count;
  const dur = 1400;
  let start;
  const step = now => {
    if (start === undefined) start = now + delay;
    const t = Math.min(Math.max((now - start) / dur, 0), 1);
    const eased = 1 - Math.pow(1 - t, 3);
    const val = target >= 100 ? Math.round(target * eased / 100) * 100 : Math.round(target * eased);
    el.textContent = formatCz(val);
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};
const counters = document.querySelectorAll('[data-count]');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const countIo = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    countUp(entry.target, entry.target.closest('.hero') ? 500 : 150);
    countIo.unobserve(entry.target);
  }), { threshold: 0.6 });
  counters.forEach(el => countIo.observe(el));
}

// Ukázka v hero: kód se píše po znacích a vedle se skládá hotový web
const codeEl = document.querySelector('.editor__code code');
if (codeEl) {
  const demos = [
    { h1: 'Kadeřnictví', p: 'Střih, barva, péče.', a: 'Objednat se', href: '#rezervace', url: 'vase-kadernictvi.cz', band: 'linear-gradient(135deg, #e86a8a, #ffb08f)' },
    { h1: 'Truhlářství na míru', p: 'Nábytek z masivu přesně podle vás.', a: 'Poptat zakázku', href: '#poptavka', url: 'truhlarstvi-na-miru.cz', band: 'linear-gradient(135deg, #8a5a32, #d9a066)' },
    { h1: 'Autoservis a pneu', p: 'Servis, přezutí, příprava na STK.', a: 'Objednat servis', href: '#termin', url: 'autoservis-pneu.cz', band: 'linear-gradient(135deg, #2f5d8a, #6fb1d9)' }
  ];
  // Každý řádek = seznam [třída, text]
  const linesFor = d => [
    [['cm', '<!-- web na míru -->']],
    [['tg', '<section'], ['', ' '], ['at', 'class'], ['', '='], ['st', '"hero"'], ['tg', '>']],
    [['', '  '], ['tg', '<h1>'], ['', d.h1], ['tg', '</h1>']],
    [['', '  '], ['tg', '<p>'], ['', d.p], ['tg', '</p>']],
    [['', '  '], ['tg', '<a'], ['', ' '], ['at', 'href'], ['', '='], ['st', `"${d.href}"`], ['tg', '>']],
    [['', '    '], ['', d.a]],
    [['', '  '], ['tg', '</a>']],
    [['tg', '</section>']]
  ];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const renderLine = (tokens, chars) => {
    let out = '', left = chars;
    for (const [cls, text] of tokens) {
      if (left <= 0) break;
      const part = esc(text.slice(0, left));
      out += cls ? `<span class="${cls}">${part}</span>` : part;
      left -= text.length;
    }
    return out;
  };
  const lineLen = tokens => tokens.reduce((n, [, t]) => n + t.length, 0);

  const preview = document.querySelector('.preview');
  const parts = {
    3: preview.querySelector('.preview__h1'),
    4: preview.querySelector('.preview__p'),
    7: preview.querySelector('.preview__btn')
  };
  const url = preview.querySelector('.preview__url');
  const band = preview.querySelector('.preview__band');

  const show = (d, upToLine) => {
    parts[3].textContent = d.h1; parts[4].textContent = d.p; parts[7].textContent = d.a;
    url.textContent = d.url; band.style.setProperty('--band', d.band);
    Object.entries(parts).forEach(([n, el]) => el.classList.toggle('is-shown', upToLine >= +n));
  };
  const paint = (lines, lineIdx, chars) => {
    codeEl.innerHTML = lines.map((tokens, i) => {
      if (i > lineIdx) return '';
      const text = i < lineIdx ? renderLine(tokens, Infinity) : renderLine(tokens, chars);
      const caret = i === lineIdx ? '<span class="caret"></span>' : '';
      return `<span class="ln">${i + 1}</span>${text}${caret}`;
    }).filter((_, i) => i <= lineIdx).join('\n');
  };

  if (reduceMotion) {
    const lines = linesFor(demos[0]);
    paint(lines, lines.length - 1, Infinity);
    show(demos[0], 99);
  } else {
    let demo = 0;
    const run = () => {
      const d = demos[demo];
      const lines = linesFor(d);
      let line = 0, chars = 0;
      show(d, 0);
      const tick = () => {
        chars++;
        paint(lines, line, chars);
        if (chars >= lineLen(lines[line])) {
          show(d, line + 1);
          if (line === lines.length - 1) {
            demo = (demo + 1) % demos.length;
            return setTimeout(run, 3200); // hotovo — chvíli nechat a pak další obor
          }
          line++; chars = 0;
          return setTimeout(tick, 260);
        }
        setTimeout(tick, 28 + Math.random() * 45);
      };
      setTimeout(tick, 400);
    };
    setTimeout(run, 900);
  }
}

// Parallax ukázky v hero podle myši
const visual = document.querySelector('.hero__visual');
if (visual && finePointer && !reduceMotion) {
  document.querySelector('.hero').addEventListener('mousemove', e => {
    const r = visual.getBoundingClientRect();
    visual.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
    visual.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
  });
}

// Náklon karet za kurzorem
if (finePointer && !reduceMotion) {
  document.querySelectorAll('.service, .ref, .plan').forEach(card => {
    card.classList.add('tilt');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transition = 'transform .12s ease-out, box-shadow .2s';
      card.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform .4s ease, box-shadow .2s';
      card.style.transform = '';
    });
  });
}

document.getElementById('rok').textContent = new Date().getFullYear();
