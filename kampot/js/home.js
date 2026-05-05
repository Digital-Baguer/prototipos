// Home page
function HomePage({
  navigate,
  tweaks = {}
}) {
  const heroHeadline = tweaks.heroHeadline || 'Operamos y hacemos crecer tiendas de ropa en Colombia.';
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 56,
      paddingBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.3fr 1fr',
      gap: 64,
      alignItems: 'end'
    },
    className: "hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-block',
      width: 24,
      height: 1,
      background: 'currentColor',
      verticalAlign: 'middle',
      marginRight: 12
    }
  }), "Retail de moda \xB7 Colombia"), /*#__PURE__*/React.createElement("h1", {
    className: "display-xl"
  }, heroHeadline.split(/\s+/).reduce((acc, w, i, arr) => {
    if (i === Math.floor(arr.length * 0.45)) acc.push(/*#__PURE__*/React.createElement("br", {
      key: 'b' + i
    }));
    acc.push(w + ' ');
    return acc;
  }, [])), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      marginTop: 32,
      maxWidth: 540
    }
  }, "Administramos puntos de venta f\xEDsicos bajo modelos de franquicia, asegurando el cumplimiento de los lineamientos comerciales, operativos y de servicio de las marcas que representamos."), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 40,
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => navigate('servicios')
  }, "Conoce nuestros servicios ", /*#__PURE__*/React.createElement(Arrow, null)), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('contacto')
  }, "Hablar con el equipo"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-image",
    style: {
      aspectRatio: '2/3',
      minHeight: 480,
      position: 'relative',
      overflow: 'hidden',
      border: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/hero-01-tienda.webp",
    alt: "Interior de tienda de moda con percheros en tonos neutros",
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      display: 'block'
    }
  }))))), /*#__PURE__*/React.createElement("section", {
    style: {
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\xA7 01 \u2014 Qui\xE9nes somos")), /*#__PURE__*/React.createElement("h2", {
    className: "display-lg"
  }, "Una empresa colombiana dedicada a la operaci\xF3n de tiendas de moda", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--wine)'
    }
  }, " bajo modelos de franquicia."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80
    },
    className: "two-col"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.75,
      color: 'var(--ink-soft)'
    }
  }, "KAMPOT S.A.S. es una empresa enfocada en el desarrollo de actividades comerciales en el sector retail de moda. Nuestra operaci\xF3n principal es la administraci\xF3n de tiendas de ropa, garantizando una experiencia de compra alineada con los est\xE1ndares de calidad, servicio y cumplimiento que exigen las marcas representadas."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 17,
      lineHeight: 1.75,
      color: 'var(--ink-soft)'
    }
  }, "Operamos con la disciplina propia del retail establecido y la agilidad de un equipo local que entiende el consumidor colombiano. Nuestro trabajo consiste en que cada visita a una tienda sea digna del nombre que hay en la fachada.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--bone)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "\xA7 02 \u2014 Actividades y servicios")), /*#__PURE__*/React.createElement("h2", {
    className: "display-lg"
  }, "Un aliado operativo para marcas de moda que buscan presencia f\xEDsica", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--wine)'
    }
  }, " bien ejecutada."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1,
      background: 'var(--rule)',
      border: '1px solid var(--rule)'
    },
    className: "services-grid"
  }, [{
    n: '01',
    t: 'Comercialización',
    d: 'Venta de prendas de vestir y accesorios en los puntos de venta que operamos.'
  }, {
    n: '02',
    t: 'Administración',
    d: 'Gestión integral de tiendas: inventario, personal, caja y cumplimiento de KPIs.'
  }, {
    n: '03',
    t: 'Atención al cliente',
    d: 'Estándares de servicio alineados con el posicionamiento de cada marca representada.'
  }, {
    n: '04',
    t: 'Gestión operativa',
    d: 'Cumplimiento de lineamientos comerciales, visuales y operativos de la franquicia.'
  }].map((s, i) => /*#__PURE__*/React.createElement(Reveal, {
    key: i,
    delay: i * 80
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--cream)',
      padding: 40,
      minHeight: 320,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--wine)'
    }
  }, s.n), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "display-sm",
    style: {
      marginBottom: 12
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      color: 'var(--ink-soft)',
      lineHeight: 1.55
    }
  }, s.d)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('servicios')
  }, "Ver el detalle de servicios ", /*#__PURE__*/React.createElement(Arrow, null))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--wine)',
      color: 'var(--cream)',
      padding: '120px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      color: 'rgba(244,239,230,0.7)',
      marginBottom: 24
    }
  }, "\xA7 Siguiente paso"), /*#__PURE__*/React.createElement("h2", {
    className: "display-lg",
    style: {
      maxWidth: 900,
      margin: '0 auto 40px'
    }
  }, "\xBFTu marca busca presencia f\xEDsica en Colombia?", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--bone)'
    }
  }, "Hablemos.")), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-inverse",
    onClick: () => navigate('contacto')
  }, "Contactar al equipo ", /*#__PURE__*/React.createElement(Arrow, null)))));
}
Object.assign(window, {
  HomePage
});
