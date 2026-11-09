/*
 * Galería de imágenes de tienda.
 * Todos los textos viven en COPY: al confirmarlos se cambian aquí y se
 * actualizan a la vez las imágenes y la tabla de copys.
 */
const { screens: S, phone, level, SVG, ring } = Quac;

/* estado: 'ok' = verificado contra la fuente; 'check' = necesita confirmación. */
const COPY = [
  { eyebrow: '', title: ['Lo quiero y con Quac', '¡Lo tengo!'], support: ['Sin historial crediticio', 'Sin cuota inicial', 'Sin cuota de manejo'], src: 'Frase de marca y beneficios del brand book. Confirmado.', status: 'ok' },
  { eyebrow: 'Quac+', title: ['Estrenar tiene', 'niveles.'], key: 'gold', support: ['Primera cuota a 60 días', '5% de descuento', '8% de descuento', '10% de descuento'], src: 'Lema de Quac+ y data/quacplus.ts. Gold 8% confirmado.', status: 'ok' },
  { eyebrow: 'Quac+ · Quacs', title: ['Pagar a tiempo,', 'paga.'], support: ['Gana Quacs por tus abonos a tiempo', 'Acumula Quacs en cada compra'], src: 'Lema de Quac+. Sin cantidades, para que la imagen no dependa de la regla vigente.', status: 'ok' },
  { eyebrow: 'Seguridad', title: ['Compra seguro con tu', 'clave dinámica'], html: 'Compra seguro con<br>tu <b>clave dinámica</b>', support: ['Cambia cada 30 segundos'], src: 'Texto del home del sitio. 30 s: totp_generator.dart.', status: 'ok' },
  { eyebrow: 'Seguridad', title: ['Administra tus', 'dispositivos'], support: ['Quitamos Android · Galaxy A54', 'Ya no puede entrar a tu cuenta'], src: 'SCR-060 «Mis dispositivos» y hoja «Quitar este teléfono» (AQ-012). Textos de la app; teléfonos y fechas de demo.', note: 'AQ-012 sigue en su rama y no ha llegado a main: publicar esta imagen cuando la función esté en producción.', status: 'check' },
  { eyebrow: 'Pagos', title: ['Paga con PSE,', 'tarjeta o Efecty'], support: ['PSE', 'Tarjeta', 'Efecty', 'Bancolombia'], src: 'SCR-039 «Selecciona método de pago». Nombres y descripciones del catálogo payment_methods; logos del CDN de Quac (Bancolombia, del asset de la app anterior). Los cuatro medios, confirmados.', note: 'La app solo muestra los medios activos en el catálogo: en staging Bancolombia está apagado. Confirmar que en producción salen los cuatro.', status: 'check' },
  { eyebrow: 'Movimientos', title: ['Cada compra', 'suma Quacs'], support: ['345 Quacs', 'Compra en STIRPE'], src: 'Regla de 1 Quac por cada $1.000; $345.500 da 345 Quacs.', status: 'ok' },
  { eyebrow: 'Quac+ · Beneficios', title: ['Sube de nivel y', 'desbloquea más'], key: 'gold', support: [], src: 'Brand book, cap. 09: “sube de nivel y desbloquea descuentos, envíos gratis y más cuotas”.', status: 'ok' },
  { eyebrow: '', title: ['Tu app sube de nivel', 'contigo'], key: 'gold', support: [], src: 'QuacHeader: el header toma el color del nivel del cliente.', status: 'ok' },
];

/* Panorámica: un solo fondo de 8 × 1242 que cada imagen recorta por su posición. */
const W = 1242, N = 9;
const halo = (id, c) => `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity=".82"/><stop offset=".45" stop-color="${c}" stop-opacity=".26"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const pano = () => {
  const blobs = [
    [620, 1500, 1050, 'v'], [1240, 2300, 760, 'm'], [40, 500, 640, 's'],
    [1900, 1400, 980, 'g'], [2500, 2500, 760, 'v'],
    [3150, 900, 820, 'v'], [3700, 2200, 760, 's'],
    [4350, 1000, 960, 'p'], [4950, 2300, 760, 'v'],
    [5600, 1250, 940, 'm'], [5250, 2450, 700, 's'],
    [6842, 1500, 900, 's'], [7442, 500, 640, 'm'],
    [8062, 1700, 980, 'v'], [8592, 500, 640, 's'],
    [9292, 1500, 940, 'm'], [9942, 2450, 760, 'g'],
  ].map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#h${c})"/>`).join('');
  const rings = [[1242, 1500], [3726, 1250], [6210, 1600], [8694, 1300], [11178, 1450]].flatMap(([x, y]) =>
    [520, 860, 1200, 1540].map((r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-opacity=".055" stroke-width="3"/>`)).join('');
  return `<div class="pano"><svg viewBox="0 0 ${W * N} 2688" preserveAspectRatio="xMidYMin slice" aria-hidden="true"><defs>${halo('hv', '#7633FF')}${halo('hm', '#CB1CE7')}${halo('hs', '#4197ED')}${halo('hg', '#B08A2E')}${halo('hp', '#E5147E')}</defs>${blobs}${rings}</svg></div><div class="grain"></div>`;
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
  /* 4 */ (c) => `${head(c)}
    <div class="stage" style="top:calc(640px + var(--ph-top))"><div class="ph">${phone(S.home('plus'), PH)}</div>
      <div class="zoom"><p>Tu clave dinámica es:</p><div class="zoom__row"><span class="zoom__code">4938</span>${ring(0.68)}</div><small>${c.support[0]}</small></div>
      <i class="orb" style="width:96px;height:96px;left:28px;top:1250px"></i>
    </div>`,
  /* 5 · Mis dispositivos: la lista y el aviso de la hoja al quitar un teléfono. */
  (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.dispositivos(), PH)}</div>
      <i class="tap" style="left:796px;top:1307px"></i>
      <div class="tag" style="left:50%;translate:-50% 0;top:1716px"><i class="ok"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i><div>${c.support[0]}<small>${c.support[1]}</small></div></div>
      <i class="orb cy" style="width:88px;height:88px;left:40px;top:300px"></i>
      <i class="cube" style="width:76px;height:76px;right:46px;top:1050px;rotate:14deg"></i>
    </div>`,
  /* 6 */ (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.metodoPago(), PH)}</div>
      <i class="tap" style="left:775px;top:837px"></i>
      <div class="tag" style="left:50%;translate:-50% 0;top:1420px"><i class="ok"><svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg></i><div>Transacción exitosa<small>Se ha validado tu pago.</small></div></div>
      <i class="cube" style="width:84px;height:84px;right:44px;top:300px;rotate:-14deg"></i>
      <i class="orb cy" style="width:84px;height:84px;left:44px;top:1180px"></i>
    </div>`,
  /* 7 */ (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.movimientos('plus'), PH)}</div>
      <div class="tag" style="right:40px;top:1490px"><i><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></i><div>${c.support[0]}<small>${c.support[1]}</small></div></div>
      <i class="orb cy" style="width:84px;height:84px;left:48px;top:640px"></i>
    </div>`,
  /* 8 */ (c) => `${head(c)}
    <div class="stage"><div class="ph">${phone(S.quacplus('gold', { offset: 555 }), PH)}</div>
      <i class="orb go" style="width:100px;height:100px;left:36px;top:220px"></i>
      <i class="plus" style="--s:110px;right:44px;top:1500px;color:var(--gold-2)">+</i>
    </div>`,
  /* 9 */ (c) => `${head(c)}
    <div class="stage tower" style="top:calc(560px + var(--ph-top))">
      <div class="ph" style="top:0;transform:translateX(-50%) scale(.88);transform-origin:50% 0">${phone(S.home('plus'), 740)}</div>
      <div class="ph" style="top:250px;transform:translateX(-50%) scale(.94);transform-origin:50% 0">${phone(S.home('gold'), 740)}</div>
      <div class="ph" style="top:510px">${phone(S.home('black'), 740)}</div>
    </div>`,
];

const slide = (i, fmt) => `<div class="slide" data-fmt="${fmt}" style="--i:${i}">${pano()}${SLIDES[i](COPY[i])}</div>`;

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

/* ── Vista de una sola imagen para exportar: ?solo=3&fmt=ios ── */
const q = new URLSearchParams(location.search);
if (q.has('solo')) {
  document.documentElement.classList.add('solo');
  const fmt = q.get('fmt') || 'ios';
  document.documentElement.dataset.fmt = fmt;
  document.getElementById('solo').innerHTML = q.get('solo') === 'feature' ? feature() : slide(+q.get('solo') - 1, fmt);
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
    const h = fmt === 'ios' ? 2688 : 2208;
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
