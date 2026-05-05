// Nosotros page
function NosotrosPage({
  navigate
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 56,
      paddingBottom: 72
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 32
    }
  }, "Nosotros \xB7 Sobre Kampot"), /*#__PURE__*/React.createElement("h1", {
    className: "display-xl",
    style: {
      maxWidth: 1100
    }
  }, "Especialistas en la operaci\xF3n de ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--wine)'
    }
  }, "tiendas de moda"), " bajo modelos de franquicia."))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      marginBottom: 24
    }
  }, "KAMPOT S.A.S. es una empresa colombiana enfocada en el desarrollo de actividades comerciales en el sector retail de moda. Nuestra operaci\xF3n principal es la administraci\xF3n de tiendas de ropa bajo modelos de franquicia."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      marginBottom: 20,
      fontSize: 16,
      lineHeight: 1.7
    }
  }, "Participamos en la gesti\xF3n de puntos de venta dedicados a la comercializaci\xF3n de prendas de vestir y accesorios, garantizando una experiencia de compra alineada con los est\xE1ndares de calidad, servicio y cumplimiento que exigen las marcas representadas."), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: 16,
      lineHeight: 1.7
    }
  }, "Operamos con la disciplina propia del retail establecido y la agilidad de un equipo local que entiende el consumidor colombiano."))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--bone)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80
    },
    className: "two-col"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 24
    }
  }, "\xA7 Misi\xF3n"), /*#__PURE__*/React.createElement("h2", {
    className: "display-md",
    style: {
      marginBottom: 20
    }
  }, "Hacer que cada tienda opere a la altura de la marca que representa."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--ink-soft)'
    }
  }, "Operamos puntos de venta f\xEDsicos con est\xE1ndares rigurosos de servicio, cumplimiento y ejecuci\xF3n comercial, aportando a las marcas franquiciantes un aliado local confiable para su crecimiento en Colombia.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 24
    }
  }, "\xA7 Visi\xF3n"), /*#__PURE__*/React.createElement("h2", {
    className: "display-md",
    style: {
      marginBottom: 20
    }
  }, "Ser un operador de retail de moda de referencia en el mercado colombiano."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      lineHeight: 1.7,
      color: 'var(--ink-soft)'
    }
  }, "Aspiramos a ampliar progresivamente la operaci\xF3n de puntos de venta en las principales ciudades del pa\xEDs, representando un portafolio diversificado de marcas nacionales e internacionales."))))), /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '96px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "display-lg",
    style: {
      maxWidth: 800,
      margin: '0 auto 32px'
    }
  }, "\xBFQuieres conocer nuestros servicios en detalle?"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-primary",
    onClick: () => navigate('servicios')
  }, "Ver servicios ", /*#__PURE__*/React.createElement(Arrow, null)))));
}
function ValueIcon({
  kind
}) {
  const common = {
    width: 36,
    height: 36,
    viewBox: '0 0 36 36',
    fill: 'none',
    stroke: 'var(--wine)',
    strokeWidth: 1.2
  };
  if (kind === 'diamond') return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M18 3l15 15-15 15L3 18z"
  }));
  if (kind === 'circle') return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "15"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "6"
  }));
  if (kind === 'square') return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "30",
    height: "30"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "11",
    y: "11",
    width: "14",
    height: "14"
  }));
  return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("path", {
    d: "M18 3l15 28H3z"
  }));
}
Object.assign(window, {
  NosotrosPage
});
