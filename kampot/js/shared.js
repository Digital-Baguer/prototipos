// Shared components: Header, Footer, Logo, Icon, Reveal
const {
  useState,
  useEffect,
  useRef
} = React;

// Real KAMPOT brand mark — interlocking K monogram
const MARK_POLYGONS = ["436.5,199.8 355,277.1 290.7,212.9 209.8,212.9 209.8,414.9 97.4,521.6 97.4,115.5 97.5,115.5 97.5,100.5 337.3,100.5", "975.3,895.4 975.3,977 593.4,977 255.8,639.5 336.7,562.7 638.7,864.7 863,864.7 863,783.1", "975.4,736.6 975.4,895.5 862.9,783.1 493.6,413.8 575.2,336.4", "648.7,626.8 560.5,728.3 480.9,648.6 569,547.1", "983.6,100.5 983.6,240 776,478.9 696.4,399.3 858.3,212.9 645.2,212.9 209.8,626.1 97.4,736.6 97.4,577.3 97.4,577.3 601.7,100.5", "432.6,874.2 340.7,979.9 97.5,979.9 97.5,964.8 97.4,964.8 97.4,736.6 209.8,626.1 209.8,867.5 289.5,867.5 352.9,794.5"];
function KampotMark({
  size = 40,
  color = 'currentColor'
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1080 1080",
    style: {
      width: size,
      height: size,
      color,
      flexShrink: 0
    },
    fill: "currentColor"
  }, MARK_POLYGONS.map((p, i) => /*#__PURE__*/React.createElement("polygon", {
    key: i,
    points: p
  })));
}
function LogoHorizontal({
  color = 'currentColor',
  size = 40,
  showWordmark = true
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      color,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement(KampotMark, {
    size: size
  }), showWordmark && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexDirection: 'column',
      gap: 2
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'DM Serif Display', Georgia, serif",
      fontSize: size * 0.78,
      letterSpacing: '0.18em',
      lineHeight: 1
    }
  }, "KAMPOT"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9,
      letterSpacing: '0.32em',
      opacity: 0.65
    }
  }, "S \xB7 A \xB7 S")));
}
function LogoIsotipo({
  size = 64,
  color = 'currentColor',
  bg = 'transparent'
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      background: bg,
      alignItems: 'center',
      justifyContent: 'center',
      color
    }
  }, /*#__PURE__*/React.createElement(KampotMark, {
    size: size * 0.88
  }));
}
function Arrow({
  dir = 'right'
}) {
  const rot = {
    right: 0,
    down: 90,
    left: 180,
    up: 270
  }[dir];
  return /*#__PURE__*/React.createElement("svg", {
    className: "arrow",
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    style: {
      transform: `rotate(${rot}deg)`
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 7h12M8 2l5 5-5 5",
    stroke: "currentColor",
    strokeWidth: "1.2"
  }));
}
const NAV = [{
  slug: 'inicio',
  label: 'Inicio'
}, {
  slug: 'nosotros',
  label: 'Nosotros'
}, {
  slug: 'servicios',
  label: 'Servicios'
}, {
  slug: 'contacto',
  label: 'Contacto'
}, {
  slug: 'pqrs',
  label: 'PQRS'
}];
function Header({
  route,
  navigate
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [route]);
  return /*#__PURE__*/React.createElement("header", {
    className: "site-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container bar"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#inicio",
    className: "brand",
    onClick: e => {
      e.preventDefault();
      navigate('inicio');
    }
  }, /*#__PURE__*/React.createElement(LogoHorizontal, null)), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, NAV.map(item => /*#__PURE__*/React.createElement("a", {
    key: item.slug,
    href: `#${item.slug}`,
    className: route === item.slug ? 'active' : '',
    onClick: e => {
      e.preventDefault();
      navigate(item.slug);
    }
  }, item.label))), /*#__PURE__*/React.createElement("a", {
    className: "nav-cta",
    href: "#contacto",
    onClick: e => {
      e.preventDefault();
      navigate('contacto');
    }
  }, "Hablemos"), /*#__PURE__*/React.createElement("button", {
    className: "menu-toggle",
    onClick: () => setOpen(v => !v),
    "aria-label": "Men\xFA"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none"
  }, open ? /*#__PURE__*/React.createElement("path", {
    d: "M6 6l12 12M6 18L18 6",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "8",
    x2: "21",
    y2: "8",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "16",
    x2: "21",
    y2: "16",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }))))), open && /*#__PURE__*/React.createElement("div", {
    className: "mobile-nav"
  }, NAV.map(item => /*#__PURE__*/React.createElement("a", {
    key: item.slug,
    href: `#${item.slug}`,
    onClick: e => {
      e.preventDefault();
      navigate(item.slug);
    }
  }, item.label))));
}
function Footer({
  navigate
}) {
  return /*#__PURE__*/React.createElement("footer", {
    className: "site-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20,
      color: 'var(--cream)'
    }
  }, /*#__PURE__*/React.createElement(LogoHorizontal, null)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: 'rgba(244,239,230,0.6)',
      maxWidth: 320,
      lineHeight: 1.6
    }
  }, "Operaci\xF3n y administraci\xF3n de tiendas de ropa bajo modelos de franquicia en Colombia.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Explorar"), /*#__PURE__*/React.createElement("ul", null, NAV.map(item => /*#__PURE__*/React.createElement("li", {
    key: item.slug
  }, /*#__PURE__*/React.createElement("a", {
    href: `#${item.slug}`,
    onClick: e => {
      e.preventDefault();
      navigate(item.slug);
    }
  }, item.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Contacto"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, "KAMPOT S.A.S."), /*#__PURE__*/React.createElement("li", null, "Bogot\xE1 \xB7 Colombia"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#contacto",
    onClick: e => {
      e.preventDefault();
      navigate('contacto');
    }
  }, "Formulario de contacto")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", null, "Legal"), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#politica",
    onClick: e => {
      e.preventDefault();
      navigate('politica');
    }
  }, "Pol\xEDtica de tratamiento de datos")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#terminos",
    onClick: e => {
      e.preventDefault();
      navigate('terminos');
    }
  }, "T\xE9rminos y condiciones")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#pqrs",
    onClick: e => {
      e.preventDefault();
      navigate('pqrs');
    }
  }, "PQRS"))))), /*#__PURE__*/React.createElement("div", {
    className: "footer-bottom"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 KAMPOT S.A.S. \xB7 Todos los derechos reservados."), /*#__PURE__*/React.createElement("div", {
    className: "legal"
  }, /*#__PURE__*/React.createElement("span", null, "Bogot\xE1 \xB7 Colombia")))));
}

// Reveal on scroll wrapper
function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  ...rest
}) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShown(true);
        io.disconnect();
      }
    }, {
      threshold: 0.12
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return /*#__PURE__*/React.createElement(Tag, {
    ref: ref,
    className: `reveal ${shown ? 'in' : ''} ${rest.className || ''}`,
    style: {
      ...rest.style,
      transitionDelay: `${delay}ms`
    }
  }, children);
}
Object.assign(window, {
  LogoHorizontal,
  LogoIsotipo,
  KampotMark,
  Arrow,
  Header,
  Footer,
  Reveal,
  NAV
});
