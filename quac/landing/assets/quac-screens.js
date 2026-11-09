/*
 * Datos y pantallas compartidas por descarga.html y stores.html.
 * LEVELS viene de quac-cliente-fuente/src/data/quacplus.ts y los temas de
 * status_quac_dtos_test.dart. Los montos, el nombre y la clave son datos de demo.
 */
window.Quac = (() => {
  const LEVELS = [
    { id: 'quac', name: 'QUAC', short: 'Quac', points: 900, since: 'Cliente activo · 2026', range: '0 – 2.999 Quacs', g: '#615FEC,#7D2FEB,#CB1CE7', tx: '#fff', main: '#7633FF', dot: 'linear-gradient(135deg,#615FEC,#CB1CE7)', badge: null,
      benefits: [['card', 'Hasta 10 cuotas', 'Financiación estándar']] },
    { id: 'plus', name: 'QUAC PLUS', short: 'Plus', points: 3500, since: 'Miembro Plus · 2025', range: '3.000 – 6.999 Quacs', g: '#7D2EEA,#301281', tx: '#fff', main: '#7D2EEA', dot: 'linear-gradient(135deg,#7D2EEA,#301281)', badge: ['PLUS', '#fff', '#7D2EEA'],
      benefits: [['cal', 'Paga a Plazo', 'Primera cuota a 60 días (máx. 9 cuotas)'], ['card', 'Hasta 10 cuotas', 'Financiación estándar']] },
    { id: 'silver', name: 'QUAC SILVER', short: 'Silver', points: 7500, since: 'Miembro Silver · 2025', range: '7.000 – 11.999 Quacs', g: '#F8F8FB,#C8CCD2,#8E9299', tx: '#4D5159', main: '#8E9299', dot: 'linear-gradient(135deg,#F8F8FB,#8E9299)', badge: ['SILVER', '#2A2A30', '#fff'],
      benefits: [['pct', '5% de descuento siempre', 'Al pagar con Quac'], ['truck', 'Envío gratis', 'En compras online desde $299.900'], ['card', 'Hasta 12 cuotas', 'Financiación estándar'], ['cal', 'Paga a Plazo', 'Primera cuota a 60 días (máx. 9 cuotas)']] },
    { id: 'gold', name: 'QUAC GOLD', short: 'Gold', points: 15000, since: 'Miembro Gold · 2024', range: '12.000 – 19.999 Quacs', g: '#FFF1C2,#ECC66A,#B08A2E', tx: '#4E3B0A', main: '#B08A2E', dot: 'linear-gradient(135deg,#FFF1C2,#B08A2E)', badge: ['GOLD', '#4E3B0A', '#FFF1C2'],
      benefits: [['pct', '8% de descuento siempre', 'Al pagar con Quac'], ['truck', 'Envío gratis', 'En compras online desde $199.900'], ['card', 'Hasta 15 cuotas', 'Financiación estándar'], ['cal', 'Paga a Plazo', 'Primera cuota a 60 días (máx. 9 cuotas)']] },
    { id: 'black', name: 'QUAC BLACK', short: 'Black', points: 22500, since: 'Miembro Élite · 2025', range: '20.000+ Quacs', g: '#2C2C2C,#0A0A0A', tx: '#D8DCE0', main: '#D4A93F', dot: 'linear-gradient(135deg,#3A3A3A,#0A0A0A)', badge: ['BLACK', '#FFFFFF', '#000000'],
      benefits: [['pct', '10% de descuento siempre', 'El máximo del programa'], ['truck', 'Envío gratis', 'En todas tus compras'], ['card', 'Hasta 18 cuotas', 'Financiación estándar'], ['cal', 'Paga a Plazo', 'Primera cuota a 60 días (máx. 9 cuotas)']] },
  ];
  const level = (id) => LEVELS.find((l) => l.id === id);
  const miles = (n) => n.toLocaleString('es-CO');

  const SVG = {
    card: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h3"/></svg>',
    cal: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
    pct: '<svg viewBox="0 0 24 24"><path d="M18 6 6 18"/><circle cx="7.5" cy="7.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
    truck: '<svg viewBox="0 0 24 24"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
    bag: '<svg viewBox="0 0 24 24"><path d="M6 8h12l1 12H5zM9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    money: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6.5 9.5v.01M17.5 14.5v.01"/></svg>',
    chev: '<svg viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
    calgray: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="4" y="5" width="16" height="15" rx="3"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>',
  };

  const icon = (name, size = 24) => `<i class="ic" style="--i:var(--ic-${name});--s:${size}px"></i>`;

  /* Anillo de la clave dinámica: arco rosa sobre gris, como _AnilloPainter. */
  const ring = (p = 0.68) => {
    const c = 2 * Math.PI * 9;
    return `<svg class="qs-ring" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="#d8d8d8" stroke-width="5"/><circle cx="12" cy="12" r="9" fill="none" stroke="#E5147E" stroke-width="5" stroke-dasharray="${c * p} ${c}" transform="rotate(-90 12 12)"/></svg>`;
  };

  const statusBar = () => `<div class="qs-bar"><span>10:43</span><svg viewBox="0 0 66 12" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1"/><rect x="5" y="5.5" width="3" height="6.5" rx="1"/><rect x="10" y="3" width="3" height="9" rx="1"/><rect x="15" y="0" width="3" height="12" rx="1"/><path d="M33 2.2c2.5 0 4.8 1 6.5 2.6l-1.3 1.4A7.5 7.5 0 0 0 33 4.1c-2 0-3.8.8-5.2 2.1l-1.3-1.4A9.4 9.4 0 0 1 33 2.2Zm0 4c1.4 0 2.7.5 3.7 1.5l-1.3 1.4a3.4 3.4 0 0 0-4.8 0l-1.3-1.4c1-1 2.3-1.5 3.7-1.5Zm0 3.9 1.4 1.5-1.4 1.4-1.4-1.4 1.4-1.5Z" transform="translate(0 -1.5)"/><rect x="44" y="1" width="19" height="10" rx="3" fill="none" stroke="currentColor" opacity=".5"/><rect x="45.5" y="2.5" width="15" height="7" rx="1.6"/><rect x="64" y="4" width="2" height="4" rx="1" opacity=".5"/></svg></div>`;

  const header = (lv, name) => {
    const b = lv.badge;
    return `<header class="qs-h" style="--g:${lv.g};--hd:${lv.tx}">
      <div class="qs-h__top">
        <i class="ic qs-h__logo" style="width:83px;height:35px"></i>
        <span style="flex:1"></span>
        <span class="qs-h__btn">${icon('bell', 25)}<span class="qs-h__dot">2</span></span>
        <span class="qs-h__btn">${icon('info', 25)}</span>
      </div>
      <div class="qs-h__row"><span>Hola, ${name}</span>${b ? `<span class="qs-badge" style="background:${b[1]};color:${b[2]}">${b[0]}</span>` : ''}</div>
    </header>`;
  };

  const clave = (code) => `<div class="qs-clave"><span>Tu clave dinámica es:</span><b>${code}</b>${ring()}</div>`;

  const nav = (active) => {
    const items = [['home', 'Inicio'], ['mov', 'Movimientos'], ['pay', 'Pagar'], ['star', 'Quac+'], ['more', 'Más']];
    return `<nav class="qs-nav">${items.map(([ic, t], i) => `<div class="${i === active ? 'on' : ''}">${icon(ic, 25)}<span>${t}</span></div>`).join('')}</nav>`;
  };

  const shell = (lv, active, inner, { name = 'Laura', code = '4938', style = '' } = {}) => `<div class="qs">
      ${statusBar().replace('class="qs-bar"', `class="qs-bar" style="--hd:${lv.tx}"`)}
      ${header(lv, name)}
      <div class="qs-body">${clave(code)}<div class="qs-vp">${inner}</div></div>
      ${nav(active)}
    </div>`;

  /* Solo el contenido de cada tab: el tour los cambia dentro de un mismo shell. */
  const bodies = {
    home() {
      return `<div class="qs-scroll" style="padding-left:0;padding-right:0"><div class="qc" style="margin:0 16px">
        <div class="qc__hd"><div><small>Crédito</small><strong>Quac</strong></div><span class="qc__i">i</span></div>
        <div class="qc__cupo">Tu cupo disponible<b>$1.750.000</b><span class="qc__how">¿Cómo funciona?</span></div>
        <div class="qc__panel"><div>Pago mínimo<b>$86.900</b></div><div>Deuda total<b>$750.000</b></div></div>
        <div class="qc__fecha">${SVG.calgray}<div>Fecha límite de pago<b>17 dic. 2026</b></div><span class="qs-state">Al día</span></div>
        <div class="qc__btn">PAGAR</div>
        <div class="qc__plan">Ver mis planes de pago</div>
      </div></div>`;
    },
    pagar() {
      return `<div class="qs-scroll"><h3 class="qs-title">Pagar</h3>
        <div class="qpay-card"><span class="qpay-card__ic">${SVG.card}</span><div><small>Crédito</small><strong>Quac</strong></div></div>
        <div class="qpay-date"><div class="qpay-date__r"><div>Fecha límite de pago<b>17 dic. 2026</b></div><span class="qs-state">Al día</span></div><hr><div class="qpay-date__c"><span>Cupo disponible</span><b>$1.750.000</b></div></div>
        <div class="qpay-opt" style="margin-top:20px"><div><span>Pago mínimo</span><b>$86.900</b></div>${SVG.chev}</div>
        <div class="qpay-opt"><div><span>Pago total</span><b>$750.000</b><em>A corte del 5 nov. 2026</em></div>${SVG.chev}</div>
        <div class="qpay-opt"><div><span>Otro valor</span></div>${SVG.chev}</div>
      </div>`;
    },
    movimientos() {
      const rows = [
        ['bag', 'Compra en STIRPE', '2 nov. 2026', '$345.500', 345],
        ['abono', 'Abono a tu crédito', '30 oct. 2026', '-$86.900', 260],
        ['bag', 'Compra en derek', '24 oct. 2026', '$205.900', 205],
        ['bag', 'Compra en U82 Shoes', '18 oct. 2026', '$189.900', 189],
        ['abono', 'Abono a tu crédito', '15 oct. 2026', '-$90.200', 270],
        ['bag', 'Compra en Quinta del Mar', '3 oct. 2026', '$120.000', 120],
      ];
      return `<p class="qm-intro">Mira el histórico de todas las compras y abonos que has realizado.</p>
        <div class="qm-chips"><span class="on">Todos</span><span>Compras</span><span>Abonos</span></div>
        <div>${rows.map(([k, t, d, v, q]) => `<div class="qm-row"><span class="qm-ic ${k === 'abono' ? 'abono' : ''}">${k === 'abono' ? SVG.money : SVG.bag}</span><p>${t}<small>${d}</small></p><span class="qm-val ${k === 'abono' ? 'abono' : ''}">${v}<i><b>${q}</b> Quacs</i></span></div>`).join('')}</div>`;
    },
    quacplus(levelId = 'gold', opts = {}) {
      const lv = level(levelId);
      const reached = LEVELS.findIndex((l) => l.id === levelId);
      const cps = ['Plus', 'Silver', 'Gold', 'Black'].map((t, i) => [t, i + 1 <= reached]);
      const progress = { quac: 6, plus: 20, silver: 46, gold: 72, black: 100 }[levelId];
      const benefits = lv.benefits.map(([ic, t, s]) => `<div class="qb-row"><span class="qb-ic">${SVG[ic]}</span><p>${t}<small>${s}</small></p><span class="qb-chip">Activo</span></div>`).join('');
      return `<div class="qs-scroll" style="--mc:${lv.main};${opts.offset ? `margin-top:${-opts.offset}px` : ''}"><h3 class="qs-title">Quac+</h3>
        <section class="qmem" style="--g:${lv.g};--tx:${lv.tx}"><div class="qmem__t"><div><small>QUAC · MEMBRESÍA</small><strong>${lv.short.toUpperCase()}</strong></div><i class="ic" style="--i:var(--ic-duck);--s:30px"></i></div><p>NIT ••• 8980</p><small>${lv.since}</small></section>
        <section class="qwhite"><h4>Tu camino al siguiente nivel</h4>
          <div class="qcam__n">${miles(lv.points)}</div><div class="qcam__l">Quacs ganados</div>
          <div class="qcam__v">1.200 Quacs vencen el 31 dic. 2026</div>
          <div class="qcam__cp">${cps.map(([t, on]) => `<div>${t}<i class="${on ? 'on' : ''}">${on ? SVG.check : ''}</i></div>`).join('')}</div>
          <div class="qcam__tr" style="--p:${progress}%"><span></span><em><i class="ic" style="--i:var(--ic-duck);--s:20px"></i></em></div>
          <div class="qcam__a">Conoce cómo funciona Status Quac →</div>
        </section>
        <section class="qwhite"><h4>Tus Quacs mes a mes</h4>
          <table class="qcon"><thead><tr><th></th><th>COMPRAS</th><th>ABONOS</th><th>TOTAL</th></tr></thead><tbody>
            <tr><td>Octubre</td><td>860</td><td>530</td><td><b>1.390</b></td></tr>
            <tr><td>Septiembre</td><td>415</td><td>590</td><td><b>1.005</b></td></tr>
            <tr><td>Agosto</td><td>720</td><td>545</td><td><b>1.265</b></td></tr>
          </tbody></table></section>
        <section class="qwhite"><h4>Tus beneficios</h4>${benefits}</section>
      </div>`;
    },
  };

  /* SCR-060 «Mis dispositivos» (AQ-012): pantalla completa fuera del shell, con «Volver».
     Textos y orden tomados de scr_060_mis_dispositivos_screen.dart; nombres con el formato
     del api («Sistema · modelo»). Teléfonos, fechas y compra son datos de demo. */
  const DEV = {
    phone: '<svg viewBox="0 0 24 24"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M11 18.5h2"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 3 5 6v5.5c0 4.2 3 7.9 7 9.5 4-1.6 7-5.3 7-9.5V6z"/><path d="m9 12 2.2 2.2L15.2 10"/></svg>',
    login: '<svg viewBox="0 0 24 24"><path d="M10 17l5-5-5-5M15 12H3M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8v.01"/></svg>',
    back: '<svg viewBox="0 0 10 18"><path d="M8.5 1.5 1.5 9l7 7.5"/></svg>',
  };
  const devCard = ({ name, actual, auth, last, buy }) => `<div class="qd-card ${actual ? 'on' : ''}">
      <div class="qd-card__t"><span class="qd-ic">${DEV.phone}</span><div><b>${name}</b>${actual ? '<span class="qd-chip">ESTE TELÉFONO</span>' : ''}</div></div>
      <div class="qd-row">${DEV.shield}<span>Autorizado</span><p>${auth}</p></div>
      <div class="qd-row">${DEV.login}<span>Último ingreso</span><p>${last}</p></div>
      ${buy ? `<div class="qd-row">${SVG.bag}<span>Última compra</span><p>${buy[0]}<small>${buy[1]}</small></p></div>` : ''}
      ${actual ? '<p class="qd-note">Para salir de este teléfono usa «Cerrar sesión» en el menú Más.</p>' : '<div class="qd-btn">Quitar este teléfono</div>'}
    </div>`;
  const dispositivos = () => `<div class="qs qd">
      ${statusBar().replace('class="qs-bar"', 'class="qs-bar" style="--hd:#140f26"')}
      <div class="qd-in">
        <div class="qd-back">${DEV.back}Volver</div>
        <small class="qd-eyebrow">SEGURIDAD</small>
        <h3 class="qd-title">Mis dispositivos</h3>
        <p class="qd-intro">Estos son los teléfonos que pueden entrar a tu cuenta QUAC. Si no reconoces alguno, quítalo.</p>
        ${devCard({ name: 'iPhone · iPhone 15', actual: true, auth: '12 oct 2026 · 8:03 p. m.', last: 'Hoy · 9:40 a. m.', buy: ['$189.900 · U82 Shoes', '18 oct 2026'] })}
        ${devCard({ name: 'Android · Galaxy A54', auth: 'Hoy · 6:12 a. m.', last: 'Hoy · 6:14 a. m.' })}
        <div class="qd-help">${DEV.info}<div><b>¿No reconoces un teléfono?</b>Quítalo y cambia tu contraseña. Así nadie más puede entrar desde ese teléfono.<u>Cambiar contraseña</u></div></div>
      </div>
    </div>`;

  /* SCR-039 «Selecciona método de pago» (AQ-005): ruta fuera del shell, como «Mis dispositivos».
     Nombres y descripciones del catálogo payment_methods (GET /v2/pagos/medios); bloque de color de
     _medioVisual y logo de icono_url. Orden con los cuatro activos, como CatalogoPagosTest. */
  const MEDIOS = [
    ['bancolombia', 'Bancolombia', 'Transfiere desde tu cuenta', '#2C2A29'],
    ['pse', 'PSE', 'Transferencia electrónica', '#004983'],
    ['efecty', 'Efecty', 'Paga en efectivo en puntos efecty', '#FFD919'],
    ['tarjeta', 'Tarjeta crédito', 'Recibimos todas las tarjetas', '#E5BFFF'],
  ];
  const metodoPago = () => `<div class="qs qd">
      ${statusBar().replace('class="qs-bar"', 'class="qs-bar" style="--hd:#140f26"')}
      <div class="qd-in">
        <div class="qd-back">${DEV.back}Volver</div>
        <small class="qd-eyebrow" style="margin-top:8px;letter-spacing:1.5px">PAGAR</small>
        <h3 class="qd-title" style="margin:4px 0 20px;line-height:1.1">Selecciona método de pago</h3>
        <div class="qmp-val"><div><small>Valor a pagar</small><b>$86.900</b></div><span>Cambiar valor</span></div>
        <div class="qmp-list">${MEDIOS.map(([id, n, d, c]) => `<div class="qmp-tile"><i style="background-color:${c};background-image:url(assets/pay/pago-${id}.png)"></i><p>${n}<small>${d}</small></p>${SVG.chev}</div>`).join('')}</div>
      </div>
    </div>`;

  const screens = {
    dispositivos,
    metodoPago,
    home: (id = 'plus', opts) => shell(level(id), 0, bodies.home(), opts),
    pagar: (id = 'plus', opts) => shell(level(id), 2, bodies.pagar(), opts),
    movimientos: (id = 'plus', opts) => shell(level(id), 1, bodies.movimientos(), opts),
    quacplus: (id = 'gold', opts) => shell(level(id), 3, bodies.quacplus(id, opts), opts),
  };

  /* Envuelve una pantalla en el marco. width = ancho exterior en px. */
  const phone = (screen, width, extra = '') => {
    const k = (width * (1 - 0.048)) / 390;
    return `<div class="qp ${extra}" style="--pw:${width}px;--k:${k}"><div class="qp__screen">${screen}</div><i class="qp__cam"></i></div>`;
  };

  const frame = (id, active, inner, opts) => shell(level(id), active, inner, opts);
  return { LEVELS, level, miles, screens, bodies, frame, phone, SVG, ring };
})();
