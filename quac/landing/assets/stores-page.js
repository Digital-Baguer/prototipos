/*
 * Galería de imágenes de tienda.
 * Todos los textos viven en COPY: al confirmarlos se cambian aquí y se
 * actualizan a la vez las imágenes y la tabla de copys.
 */
const { screens: S, phone, level, SVG, ring } = Quac;

/* estado: 'ok' = verificado contra la fuente; 'check' = necesita confirmación. */
const COPY = [
  { eyebrow: '', title: ['Lo quiero y con Quac', '¡Lo tengo!'], support: ['Sin historial crediticio', 'Sin cuota inicial', 'Sin cuota de manejo'], src: 'Frase de marca y beneficios del brand book. Confirmado.', status: 'ok' },
  { eyebrow: 'Quac+', title: ['Estrenar tiene', 'niveles'], key: 'gold', support: ['Primera cuota a 60 días', '5% de descuento', '8% de descuento', '10% de descuento'], src: 'Lema de Quac+ y data/quacplus.ts. Gold 8% confirmado.', status: 'ok' },
  { eyebrow: 'Quac+ · Quacs', title: ['Pagar a tiempo', 'paga'], support: ['Gana Quacs por tus abonos a tiempo', 'Acumula Quacs en cada compra'], src: 'Lema de Quac+, sin coma entre sujeto y verbo. Sin cantidades, para que la imagen no dependa de la regla vigente.', status: 'ok' },
  { eyebrow: 'Pagos', title: ['Paga con PSE,', 'tarjeta o Efecty'], support: ['PSE', 'Tarjeta', 'Efecty'], src: 'SCR-039 «Selecciona método de pago». Nombres y descripciones del catálogo payment_methods, en su orden; logos del CDN de Quac. Sin Bancolombia.', status: 'ok' },
  { eyebrow: 'Seguridad', title: ['Compra seguro con tu', 'clave dinámica'], html: 'Compra seguro con<br>tu <b>clave dinámica</b>', support: ['Cambia cada 30 segundos'], src: 'Texto del home del sitio. 30 s: totp_generator.dart.', status: 'ok' },
  { eyebrow: 'Seguridad', title: ['Administra tus', 'dispositivos'], support: ['Quitamos Android · Galaxy A54', 'Ya no puede entrar a tu cuenta'], src: 'SCR-060 «Mis dispositivos» y hoja «Quitar este teléfono» (AQ-012). Textos de la app; teléfonos y fechas de demo.', note: 'El API ya tiene AQ-012 en master; la app aún no (está en las ramas AQ-012 y AQ-013, no en develop ni master). Publicar esta imagen cuando la versión de la app con la función esté en las tiendas.', status: 'check' },
];

/* Panorámica: un solo fondo de N × 1242 que cada imagen recorta por su posición. */
const W = 1242, N = 6;
const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".82"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const pano = () => {
  const blobs = [
    [620, 1500, 1050, 'v'], [1240, 2300, 760, 'm'], [40, 500, 640, 's'],
    [1900, 1400, 980, 'g'], [2500, 2500, 760, 'v'],
    [3150, 900, 820, 'v'], [3700, 2200, 760, 's'],
    [4350, 1000, 960, 'v'], [4950, 2300, 760, 's'],
    [5600, 1250, 940, 'p'], [5250, 2450, 700, 'm'],
    [6842, 1500, 900, 's'], [7200, 500, 640, 'm'],
  ].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#h${c})"/>`).join('');
  const rings = [[1242, 1500], [3726, 1250], [6210, 1600]].flatMap(([x, y]) =>
    [520, 860, 1200, 1540].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".055" stroke-width="3"/>`)).join('');
  return `<div class="pano" style="width:${W * N}px"><svg viewBox="0 0 ${W * N} 2688" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><defs>${halo('hv', '#7633FF')}${halo('hm', '#CB1CE7')}${halo('hs', '#4197ED')}${halo('hg', '#B08A2E')}${halo('hp', '#E5147E')}</defs>${blobs}${rings}</svg></div><div class="grain"></div>`;
};

const titleHtml = (c) => c.html || `${c.title[0]}<br><b class="${c.key === 'gold' ? 'gold' : ''}">${c.title[1]}</b>`;
const head = (c) => `<div class="head">${c.eyebrow ? `<p class="eyebrow">${c.eyebrow.replace('Quac+', 'Quac<span class="pl">+</span>')}</p>` : ''}<h2 class="h">${titleHtml(c)}</h2></div>`;
const levelCard = (id, top, rot, right) => {
  const lv = level(id);
  return `<article class="lvl-card" style="--m:linear-gradient(135deg,${lv.g});--t:${lv.tx};top:${top}px;transform:translateX(-50%) rotate(${rot}deg)">
    <small>QUAC · MEMBRESÍA</small><strong>${lv.short.toUpperCase()}</strong>
    <i class="ic lvl-duck" style="--i:var(--ic-duck);--s:84px"></i>
    <div class="lvl-b"><em>${lv.range}</em><b>${right}</b></div>
    <span class="lvl-n">NIT ••• 8980</span></article>`;
};

const PH = 900;
const SLIDES = [
  /* 1 */ (c) => `<div class="head" style="top:104px"><img class="brand" src="assets/brand/quac-horizontal-white.svg" alt=""><h2 class="h">${titleHtml(c)}</h2></div>
    <div class="pays pays--top" style="top:596px">${c.support.map((t) => `<span>${t}</span>`).join('')}</div>
    <div class="stage" style="top:calc(734px + var(--ph-top))"><div class="ph">${phone(S.home('plus'), 880)}</div>
      <i class="orb" style="width:92px;height:92px;right:26px;top:430px"></i>
      <i class="cube" style="width:70px;height:70px;left:34px;top:980px;rotate:16deg"></i>
    </div>`,
  /* 2 */ (c) => `${head(c)}
    <div class="stage" style="top:calc(580px + var(--ph-top))"><div class="deck">
      ${levelCard('plus', 0, -2.4, c.support[0])}
      ${levelCard('silver', 400, 1.8, c.support[1])}
      ${levelCard('gold', 800, -1.8, c.support[2])}
      ${levelCard('black', 1200, 1.6, c.support[3])}
      </div>
      <i class="orb go" style="width:96px;height:96px;left:40px;top:-10px"></i>
      <i class="plus" style="--s:110px;right:60px;top:-30px;color:var(--gold-2)">+</i>
    </div>`,
  /* 3 */ (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.quacplus('gold', { offset: 66 }), PH)}</div>
      <div class="mathbar">${c.support.map((t) => { const w = t.split(' '); return `<div><i><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></i><span><b>${w.slice(0, 2).join(' ')}</b>${w.slice(2).join(' ')}</span></div>`; }).join('')}</div>
      <i class="orb cy" style="width:88px;height:88px;right:44px;top:120px"></i>
    </div>`,
  /* 4 · Pagos: solo PSE, tarjeta y Efecty, con el toque sobre PSE. */ (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.metodoPago(['pse', 'efecty', 'tarjeta']), PH)}</div>
      <i class="tap" style="left:775px;top:663px"></i>
      <div class="tag" style="left:50%;translate:-50% 0;top:1250px"><i class="ok"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i><div>Transacción exitosa<small>Se ha validado tu pago.</small></div></div>
      <i class="cube" style="width:84px;height:84px;right:44px;top:300px;rotate:-14deg"></i>
      <i class="orb cy" style="width:84px;height:84px;left:44px;top:1180px"></i>
    </div>`,
  /* 5 */ (c) => `${head(c)}
    <div class="stage" style="top:calc(640px + var(--ph-top))"><div class="ph">${phone(S.home('plus'), PH)}</div>
      <div class="zoom"><p>Tu clave dinámica es:</p><div class="zoom__row"><span class="zoom__code">4938</span>${ring(0.68)}</div><small>${c.support[0]}</small></div>
      <i class="orb" style="width:96px;height:96px;left:28px;top:1250px"></i>
    </div>`,
  /* 6 · Mis dispositivos: la lista y el aviso de la hoja al quitar un teléfono. */
  (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.dispositivos(), PH)}</div>
      <i class="tap" style="left:796px;top:1307px"></i>
      <div class="tag" style="left:50%;translate:-50% 0;top:1716px"><i class="ok"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i><div>${c.support[0]}<small>${c.support[1]}</small></div></div>
      <i class="orb cy" style="width:88px;height:88px;left:40px;top:300px"></i>
      <i class="cube" style="width:76px;height:76px;right:46px;top:1050px;rotate:14deg"></i>
    </div>`,
];

/* ── iPad 13" e iPhone Duo: pantallas más anchas, cada imagen con su propia composición. ──
   Por decisión del usuario, se mantiene el teléfono de las imágenes de iPhone. */
const WIDE = {
  ipad: { H: 1656, lw: 768, lh: 1024, bz: 0.034, r: 0.07, sr: 0.042, cam: null },
  duo: { H: 1766, lw: 600, lh: 852, bz: 0.026, r: 0.085, sr: 0.065, cam: null },
};
const device = (fmt, screen, pw, top) => `<div class="ph" style="z-index:3;top:${top}px">${phone(screen, pw)}</div>`;
/* Toque en la misma posición relativa que en las imágenes de iPhone (teléfono de 900 px). */
const tapAt = (pw, top, x, y) => `<i class="tap" style="left:${621 - pw / 2 + (x * pw) / 900}px;top:${top + (y * pw) / 900}px"></i>`;
const OK = '<i class="ok"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i>';
const WSLIDES = [
  /* 1 */ (c, f, H) => `<div class="head" style="top:84px"><img class="brand" src="assets/brand/quac-horizontal-white.svg" alt="" style="width:270px;margin-bottom:30px"><h2 class="h" style="font-size:112px">${titleHtml(c)}</h2></div>
    <div class="pays pays--top" style="top:500px">${c.support.map((t) => `<span>${t}</span>`).join('')}</div>
    ${device(f, S.home('plus'), f === 'ipad' ? 600 : 620, 640)}
    <i class="orb" style="z-index:4;width:84px;height:84px;right:60px;top:${H * 0.55}px"></i>
    <i class="cube" style="z-index:4;width:66px;height:66px;left:62px;top:${H * 0.72}px;rotate:16deg"></i>`,
  /* 2 */ (c, f, H) => `${head(c)}
    <div class="wdeck" style="top:${f === 'ipad' ? 600 : 640}px">
      ${[['plus', -1.6], ['silver', 1.4], ['gold', 1.2], ['black', -1.2]].map(([id, rot], i) => { const lv = level(id); return `<article class="lvl-card" style="--m:linear-gradient(135deg,${lv.g});--t:${lv.tx};rotate:${rot}deg">
        <small>QUAC · MEMBRESÍA</small><strong>${lv.short.toUpperCase()}</strong><i class="ic lvl-duck" style="--i:var(--ic-duck);--s:50px"></i>
        <div class="lvl-b"><em>${lv.range}</em><b>${c.support[i]}</b></div><span class="lvl-n">NIT ••• 8980</span></article>`; }).join('')}
    </div>
    <i class="orb go" style="z-index:4;width:90px;height:90px;left:44px;top:${H - 260}px"></i>
    <i class="plus" style="z-index:4;--s:100px;right:50px;top:${f === 'ipad' ? 470 : 500}px;color:var(--gold-2)">+</i>`,
  /* 3 */ (c, f, H) => `${head(c)}
    ${device(f, S.quacplus('gold', { offset: 66 }), f === 'ipad' ? 640 : 660, 540)}
    <div class="mathbar" style="top:${H - 330}px">${c.support.map((t) => { const w = t.split(' '); return `<div><i><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></i><span><b>${w.slice(0, 2).join(' ')}</b>${w.slice(2).join(' ')}</span></div>`; }).join('')}</div>
    <i class="orb cy" style="z-index:4;width:80px;height:80px;right:50px;top:560px"></i>`,
  /* 4 */ (c, f, H) => `${head(c)}
    ${device(f, S.metodoPago(['pse', 'efecty', 'tarjeta']), f === 'ipad' ? 640 : 660, 540)}
    ${tapAt(f === 'ipad' ? 640 : 660, 540, 604, 663)}
    <div class="tag" style="left:50%;translate:-50% 0;top:${H - 300}px">${OK}<div>Transacción exitosa<small>Se ha validado tu pago.</small></div></div>
    <i class="cube" style="z-index:4;width:76px;height:76px;right:48px;top:600px;rotate:-14deg"></i>
    <i class="orb cy" style="z-index:4;width:76px;height:76px;left:48px;top:${H - 420}px"></i>`,
  /* 5 */ (c, f, H) => `${head(c)}
    ${device(f, S.home('plus'), f === 'ipad' ? 640 : 660, 600)}
    <div class="zoom" style="top:${f === 'ipad' ? 700 : 720}px;left:${f === 'ipad' ? 120 : 140}px;right:${f === 'ipad' ? 120 : 140}px;padding:40px 50px 38px"><p>Tu clave dinámica es:</p><div class="zoom__row"><span class="zoom__code" style="font-size:150px">4938</span>${ring(0.56)}</div><small>${c.support[0]}</small></div>
    <i class="orb" style="z-index:4;width:84px;height:84px;left:40px;top:${H - 360}px"></i>`,
  /* 6 */ (c, f, H) => `${head(c)}
    ${device(f, S.dispositivos(), f === 'ipad' ? 560 : 600, 520)}
    ${tapAt(f === 'ipad' ? 560 : 600, 520, 625, 1307)}
    <div class="tag" style="left:50%;translate:-50% 0;top:${H - 240}px">${OK}<div>${c.support[0]}<small>${c.support[1]}</small></div></div>
    <i class="orb cy" style="z-index:4;width:80px;height:80px;left:44px;top:600px"></i>
    <i class="cube" style="z-index:4;width:70px;height:70px;right:44px;top:${H * 0.6}px;rotate:14deg"></i>`,
];

const slide = (i, fmt) => `<div class="slide" data-fmt="${fmt}" style="--i:${i}">${pano()}${WIDE[fmt] ? WSLIDES[i](COPY[i], fmt, WIDE[fmt].H) : SLIDES[i](COPY[i])}</div>`;

/* Feature graphic: 1024×500, sin alfa. */
const feature = () => `<div class="slide" style="--i:0;width:1024px;height:500px">
  <div class="pano" style="left:-120px;width:9936px;height:2688px;top:-640px"><svg viewBox="0 0 9936 2688" aria-hidden="true"><defs>${halo('fv', '#7633FF')}${halo('fm', '#CB1CE7')}</defs><circle cx="880" cy="900" r="620" fill="url(#fv)"/><circle cx="1120" cy="1120" r="380" fill="url(#fm)"/><circle cx="860" cy="880" r="330" fill="none" stroke="#fff" stroke-opacity=".06" stroke-width="2"/><circle cx="860" cy="880" r="470" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="2"/></svg></div>
  <div style="position:absolute;z-index:3;left:60px;top:82px;width:520px">
    <img src="assets/brand/quac-horizontal-white.svg" alt="" style="width:158px;display:block;margin-bottom:32px">
    <h2 style="font:200 62px/1.06 var(--font-sans);letter-spacing:-.02em">${COPY[0].title[0].replace(' con Quac', ' con<br>Quac')} <b style="font-weight:900;color:var(--cyan)">${COPY[0].title[1]}</b></h2>
    <p style="margin-top:22px;font:600 22px var(--font-sans);color:var(--night-ink-2)">Tu cupo, tus pagos y tu nivel Quac+</p>
  </div>
  <div style="position:absolute;z-index:3;left:600px;top:60px;rotate:-8deg">${phone(S.home('plus'), 300)}</div>
  <article class="lvl-card" style="--m:linear-gradient(135deg,${level('gold').g});--t:${level('gold').tx};position:absolute;z-index:4;left:792px;top:322px;width:216px;height:136px;padding:15px 18px;border-radius:15px;rotate:7deg">
    <small style="font-size:8px">QUAC · MEMBRESÍA</small><strong style="font-size:30px;margin-top:2px">GOLD</strong><span style="position:absolute;left:18px;bottom:13px;font:400 10px var(--font-display)">NIT ••• 8980</span>
  </article>
</div>`;

/* Header de App Store (Header and Search Results): ?solo=header&w=1920&h=823 a escala 2.
   Lo importante va al centro, porque la tienda puede recortar los bordes; abajo se funde con el fondo. */
const header = (w, h) => {
  const pw = Math.round(Math.min(h * 0.47, w * 0.2)), top = Math.round(h * (w / h > 2 ? 0.33 : 0.3)), gap = Math.round(pw * 1.02);
  const fs = Math.round(Math.min(h * 0.088, w * 0.042));
  return `<div class="slide" style="--i:0;width:${w}px;height:${h}px">
  <svg style="position:absolute;inset:0;width:100%;height:100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true"><defs>${halo('xv', '#7633FF')}${halo('xm', '#CB1CE7')}${halo('xs', '#4197ED')}${halo('xg', '#B08A2E')}</defs>
    <circle cx="${w / 2}" cy="${h * 0.62}" r="${h * 0.75}" fill="url(#xv)"/><circle cx="${w / 2}" cy="${h * 0.7}" r="${h * 0.42}" fill="url(#xg)"/>
    <circle cx="${w * 0.12}" cy="${h * 0.3}" r="${h * 0.6}" fill="url(#xs)"/><circle cx="${w * 0.88}" cy="${h * 0.75}" r="${h * 0.65}" fill="url(#xm)"/>
    ${[0.5, 0.75, 1, 1.25].map((k) => `<circle cx="${w / 2}" cy="${h * 0.62}" r="${h * k}" fill="none" stroke="#fff" stroke-opacity=".055" stroke-width="2"/>`).join('')}
  </svg><div class="grain"></div>
  <h2 style="position:absolute;z-index:5;left:0;right:0;top:${Math.round(h * 0.09)}px;text-align:center;font:200 ${fs}px/1.05 var(--font-sans);letter-spacing:-.022em">Lo quiero y con Quac <b style="font-weight:900;color:var(--cyan)">¡Lo tengo!</b></h2>
  <div style="position:absolute;z-index:3;left:${w / 2 - gap - pw / 2}px;top:${top + pw * 0.16}px;rotate:-9deg">${phone(S.home('plus'), pw)}</div>
  <div style="position:absolute;z-index:3;left:${w / 2 + gap - pw / 2}px;top:${top + pw * 0.16}px;rotate:9deg">${phone(S.home('black'), pw)}</div>
  <div style="position:absolute;z-index:4;left:${w / 2 - pw * 0.54}px;top:${top}px">${phone(S.home('gold'), Math.round(pw * 1.08))}</div>
  <i class="orb" style="z-index:4;width:${pw * 0.16}px;height:${pw * 0.16}px;left:${w / 2 + gap * 1.68}px;top:${h * 0.5}px"></i>
  <i class="cube" style="z-index:4;width:${pw * 0.13}px;height:${pw * 0.13}px;left:${w / 2 - gap * 1.85}px;top:${h * 0.6}px;rotate:16deg"></i>
  <i class="orb cy" style="z-index:4;width:${pw * 0.11}px;height:${pw * 0.11}px;left:${w / 2 - gap * 1.6}px;top:${h * 0.3}px"></i>
  <i class="plus" style="z-index:4;--s:${Math.round(pw * 0.2)}px;left:${w / 2 + gap * 1.5}px;top:${h * 0.2}px;color:var(--gold-2)">+</i>
  <div style="position:absolute;z-index:5;left:0;right:0;bottom:0;height:${Math.round(h * 0.22)}px;background:linear-gradient(transparent,var(--night))"></div>
</div>`;
};

/* ── Vista de una sola imagen para exportar: ?solo=3&fmt=ios ── */
const q = new URLSearchParams(location.search);
if (q.has('solo')) {
  document.documentElement.classList.add('solo');
  const fmt = q.get('fmt') || 'ios';
  document.documentElement.dataset.fmt = fmt;
  const solo = q.get('solo');
  document.getElementById('solo').innerHTML = solo === 'feature' ? feature() : solo === 'header' ? header(+q.get('w'), +q.get('h')) : slide(+solo - 1, fmt);
} else {
  const strip = document.getElementById('strip');
  const box = document.getElementById('lb');
  const lbStage = document.getElementById('lbStage');
  const lbCount = document.getElementById('lbCount');
  let fmt = 'ios', at = 0;

  const draw = () => {
    document.documentElement.dataset.fmt = fmt;
    strip.innerHTML = SLIDES.map((_, i) => `<button class="frame" data-i="${i}" aria-label="Ver imagen ${i + 1} en grande">${slide(i, fmt)}</button>`).join('');
  };
  draw();
  strip.addEventListener('click', (e) => { const f = e.target.closest('.frame'); if (f) open(+f.dataset.i); });

  /* Carrusel a pantalla completa: la imagen siempre cabe entera en la ventana. */
  const fit = () => {
    const h = WIDE[fmt]?.H || { ios: 2688, ios63: 2700 }[fmt] || 2208;
    const z = Math.min((innerHeight - 96) / h, (innerWidth - 150) / 1242);
    const el = lbStage.firstElementChild;
    if (!el) return;
    lbStage.style.width = `${1242 * z}px`;
    lbStage.style.height = `${h * z}px`;
    el.style.transform = `scale(${z})`;
  };
  const show = (i) => {
    at = (i + SLIDES.length) % SLIDES.length;
    lbStage.innerHTML = slide(at, fmt);
    lbCount.textContent = `${at + 1} de ${SLIDES.length}`;
    fit();
  };
  const open = (i) => { box.showModal(); show(i); };
  document.getElementById('lbPrev').onclick = () => show(at - 1);
  document.getElementById('lbNext').onclick = () => show(at + 1);
  document.getElementById('lbClose').onclick = () => box.close();
  box.addEventListener('click', (e) => { if (e.target === box) box.close(); });
  addEventListener('keydown', (e) => {
    if (!box.open) return;
    if (e.key === 'ArrowLeft') show(at - 1);
    if (e.key === 'ArrowRight') show(at + 1);
  });
  addEventListener('resize', fit);

  /* Flechas de la tira */
  const step = (d) => strip.scrollBy({ left: d * (strip.firstElementChild.offsetWidth + 16) * 2, behavior: 'smooth' });
  document.getElementById('prev').onclick = () => step(-1);
  document.getElementById('next').onclick = () => step(1);

  const group = (sel, fn) => document.querySelectorAll(sel).forEach((b, _, all) => b.addEventListener('click', () => { all.forEach((x) => x.setAttribute('aria-pressed', x === b)); fn(b); }));
  group('[data-set]', (b) => { fmt = b.dataset.set; draw(); });
  group('[data-gap]', (b) => strip.style.setProperty('--gap', `${b.dataset.gap}px`));
  group('[data-size]', (b) => document.querySelector('.gallery').style.setProperty('--z', b.dataset.size));

  const featBox = document.getElementById('featBox');
  featBox.innerHTML = feature();
  const fitFeat = () => { const el = featBox.firstElementChild; el.style.transformOrigin = '0 0'; el.style.transform = `scale(${featBox.clientWidth / 1024})`; };
  addEventListener('resize', fitFeat); fitFeat();

  /* Tabla de copys, generada desde COPY. */
  document.getElementById('copyRows').innerHTML = COPY.map((c, i) => `<tr>
    <td>${i + 1}</td>
    <td>${c.eyebrow ? `<small>${c.eyebrow}</small>` : ''}<b>${c.title.join(' ')}</b>${c.support.length ? `<span>${c.support.join(' · ')}</span>` : ''}</td>
    <td>${c.src}${c.note ? `<em>${c.note}</em>` : ''}</td>
    <td><span class="st ${c.status}">${c.status === 'ok' ? 'Verificado' : 'Por confirmar'}</span></td></tr>`).join('');
}
