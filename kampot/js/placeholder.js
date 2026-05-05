// Placeholder legal pages
function Placeholder({
  title,
  navigate
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: '140px 0',
      minHeight: '70vh'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 32
    }
  }, "\xA7 Documento legal"), /*#__PURE__*/React.createElement("h1", {
    className: "display-xl",
    style: {
      marginBottom: 64,
      maxWidth: 1100
    }
  }, title), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720,
      margin: '0 auto',
      textAlign: 'center',
      border: '1px solid var(--rule-strong)',
      padding: '64px 48px',
      background: 'var(--bone)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 72,
      height: 72,
      border: '1px solid var(--wine)',
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "28",
    height: "28",
    viewBox: "0 0 28 28",
    fill: "none"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "3",
    width: "18",
    height: "22",
    stroke: "var(--wine)",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "10",
    x2: "19",
    y2: "10",
    stroke: "var(--wine)",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "14",
    x2: "19",
    y2: "14",
    stroke: "var(--wine)",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "9",
    y1: "18",
    x2: "15",
    y2: "18",
    stroke: "var(--wine)",
    strokeWidth: "1.2"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "display-sm",
    style: {
      marginBottom: 16
    }
  }, "Contenido pendiente de publicaci\xF3n"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--ink-soft)',
      fontSize: 16,
      lineHeight: 1.65,
      marginBottom: 32
    }
  }, title === 'Política de Tratamiento de Datos' ? 'Esta política está en proceso de publicación. Próximamente podrás consultar aquí nuestra política completa de tratamiento de datos personales conforme a la Ley 1581 de 2012.' : 'Los términos y condiciones de uso están en proceso de publicación. Próximamente podrás consultar aquí el documento completo.'), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-ghost",
    onClick: () => navigate('inicio')
  }, "Volver al inicio ", /*#__PURE__*/React.createElement(Arrow, null)))));
}
Object.assign(window, {
  Placeholder
});
