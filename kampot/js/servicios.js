// Servicios page
function ServiciosPage({
  navigate
}) {
  const services = [{
    n: '01',
    t: 'Comercialización de prendas de vestir y accesorios',
    d: 'Venta en punto físico de colecciones de ropa y accesorios de las marcas representadas, con control de inventario, reposición y seguimiento de sell-through por referencia.',
    points: ['Gestión de colecciones por temporada', 'Control de inventario en tienda', 'Reportes de sell-through por SKU']
  }, {
    n: '02',
    t: 'Administración de puntos de venta',
    d: 'Operación integral de tiendas en centros comerciales y calles comerciales de Colombia: personal, caja, aseo, seguridad, mantenimiento y cumplimiento con el centro comercial.',
    points: ['Gestión de personal y nómina en tienda', 'Cuadres de caja y tesorería', 'Relación con el centro comercial']
  }, {
    n: '03',
    t: 'Atención al cliente',
    d: 'Protocolos de servicio alineados con el posicionamiento de cada marca: bienvenida, asesoría de producto, manejo de caso, postventa y fidelización.',
    points: ['Entrenamiento continuo a vendedores', 'Manejo de casos y devoluciones', 'Programas de fidelización por marca']
  }, {
    n: '04',
    t: 'Gestión operativa de tiendas',
    d: 'Cumplimiento de los lineamientos comerciales, visuales y operativos definidos por cada marca franquiciante: visual merchandising, calendario comercial, auditorías y reporting.',
    points: ['Visual merchandising auditado', 'Cumplimiento del calendario comercial', 'Reporting mensual a marcas']
  }];
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
  }, "\xA7 Servicios"), /*#__PURE__*/React.createElement("h1", {
    className: "display-xl",
    style: {
      maxWidth: 1100
    }
  }, "Lo que hacemos por las marcas", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic',
      color: 'var(--wine)'
    }
  }, "que representamos.")), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      maxWidth: 720,
      marginTop: 32
    }
  }, "Nuestra actividad principal es la operaci\xF3n de tiendas de ropa bajo modelos de franquicia, asegurando el cumplimiento de lineamientos comerciales, operativos y de servicio definidos por las marcas representadas."))), services.map((s, i) => /*#__PURE__*/React.createElement("section", {
    key: i,
    style: {
      padding: 0,
      background: i % 2 === 0 ? 'var(--cream)' : 'var(--bone)',
      borderTop: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      padding: '96px 48px',
      maxWidth: 860
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 24,
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "serif",
    style: {
      fontSize: 64,
      color: 'var(--wine)',
      lineHeight: 1
    }
  }, s.n), /*#__PURE__*/React.createElement("h2", {
    className: "display-md"
  }, s.t)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      color: 'var(--ink-soft)',
      lineHeight: 1.7,
      marginBottom: 28
    }
  }, s.d), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, s.points.map(p => /*#__PURE__*/React.createElement("li", {
    key: p,
    style: {
      display: 'flex',
      gap: 14,
      fontSize: 14,
      color: 'var(--ink-soft)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--wine)',
      fontFamily: 'var(--mono)',
      fontSize: 11,
      marginTop: 3
    }
  }, "\u2192"), p)))))), /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--wine)',
      color: 'var(--cream)',
      padding: '104px 0'
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
  }, "\xBFListo para hablar de tu marca?"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-inverse",
    onClick: () => navigate('contacto')
  }, "Ir a contacto ", /*#__PURE__*/React.createElement(Arrow, null)))));
}
Object.assign(window, {
  ServiciosPage
});
