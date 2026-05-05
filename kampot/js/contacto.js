// Contacto page (with validated form)
function ContactoPage({
  navigate
}) {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    acepta: false
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const update = (k, v) => {
    setForm(f => ({
      ...f,
      [k]: v
    }));
    if (errors[k]) setErrors(e => ({
      ...e,
      [k]: null
    }));
  };
  const submit = e => {
    e.preventDefault();
    const err = {};
    if (!form.nombre.trim()) err.nombre = 'Nombre requerido';
    if (!form.email.trim()) err.email = 'Correo requerido';else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) err.email = 'Correo inválido';
    if (!form.asunto.trim()) err.asunto = 'Asunto requerido';
    if (!form.mensaje.trim()) err.mensaje = 'Mensaje requerido';
    if (!form.acepta) err.acepta = 'Debes aceptar la política de tratamiento de datos';
    setErrors(err);
    if (Object.keys(err).length === 0) setSent(true);
  };
  if (sent) {
    return /*#__PURE__*/React.createElement("section", {
      style: {
        padding: '140px 0',
        minHeight: '60vh'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "container",
      style: {
        textAlign: 'center',
        maxWidth: 720
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 80,
        border: '1px solid var(--wine)',
        marginBottom: 32
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "32",
      height: "32",
      viewBox: "0 0 32 32",
      fill: "none"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 16l7 7 13-14",
      stroke: "var(--wine)",
      strokeWidth: "1.5"
    }))), /*#__PURE__*/React.createElement("div", {
      className: "eyebrow",
      style: {
        marginBottom: 16
      }
    }, "Mensaje recibido"), /*#__PURE__*/React.createElement("h1", {
      className: "display-lg",
      style: {
        marginBottom: 20
      }
    }, "Gracias, ", form.nombre.split(' ')[0], "."), /*#__PURE__*/React.createElement("p", {
      className: "lead",
      style: {
        marginBottom: 32
      }
    }, "Hemos recibido tu mensaje. Un miembro del equipo se pondr\xE1 en contacto en las pr\xF3ximas 48 horas h\xE1biles."), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-ghost",
      onClick: () => navigate('inicio')
    }, "Volver al inicio")));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 56,
      paddingBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow",
    style: {
      marginBottom: 32
    }
  }, "\xA7 Contacto"), /*#__PURE__*/React.createElement("h1", {
    className: "display-xl",
    style: {
      maxWidth: 1000
    }
  }, "Hablemos."), /*#__PURE__*/React.createElement("p", {
    className: "lead",
    style: {
      maxWidth: 640,
      marginTop: 24
    }
  }, "Si tu marca busca un aliado operativo para sus puntos de venta en Colombia, o quieres saber m\xE1s sobre lo que hacemos, escr\xEDbenos."))), /*#__PURE__*/React.createElement("section", {
    style: {
      paddingTop: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.3fr',
      gap: 80
    },
    className: "two-col"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--wine)',
      marginBottom: 32
    }
  }, "Datos de contacto"), /*#__PURE__*/React.createElement(ContactBlock, {
    label: "Raz\xF3n social",
    value: "KAMPOT S.A.S.",
    sub: "Bogot\xE1 \xB7 Colombia"
  }), /*#__PURE__*/React.createElement(ContactBlock, {
    label: "Correo",
    value: "contacto@kampot.com.co",
    sub: "Escr\xEDbenos directamente"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 32,
      fontSize: 14,
      color: 'var(--ink-soft)',
      lineHeight: 1.6
    }
  }, "Los datos completos de contacto se publicar\xE1n pr\xF3ximamente. Mientras tanto, puedes escribirnos a trav\xE9s del formulario.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: submit,
    noValidate: true,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--wine)'
    }
  }, "Formulario"), /*#__PURE__*/React.createElement(Field, {
    label: "Nombre completo",
    required: true,
    error: errors.nombre
  }, /*#__PURE__*/React.createElement("input", {
    value: form.nombre,
    onChange: e => update('nombre', e.target.value),
    placeholder: "Tu nombre"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 28
    },
    className: "two-col"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Correo electr\xF3nico",
    required: true,
    error: errors.email
  }, /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: form.email,
    onChange: e => update('email', e.target.value),
    placeholder: "tu@correo.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Tel\xE9fono",
    error: errors.telefono
  }, /*#__PURE__*/React.createElement("input", {
    value: form.telefono,
    onChange: e => update('telefono', e.target.value),
    placeholder: "Opcional"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Asunto",
    required: true,
    error: errors.asunto
  }, /*#__PURE__*/React.createElement("input", {
    value: form.asunto,
    onChange: e => update('asunto', e.target.value),
    placeholder: "\xBFDe qu\xE9 quieres hablar?"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Mensaje",
    required: true,
    error: errors.mensaje
  }, /*#__PURE__*/React.createElement("textarea", {
    rows: "5",
    value: form.mensaje,
    onChange: e => update('mensaje', e.target.value),
    placeholder: "Cu\xE9ntanos un poco m\xE1s\u2026"
  })), /*#__PURE__*/React.createElement("label", {
    className: "check"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: form.acepta,
    onChange: e => update('acepta', e.target.checked)
  }), /*#__PURE__*/React.createElement("span", null, "Acepto la ", /*#__PURE__*/React.createElement("a", {
    href: "#politica",
    onClick: ev => {
      ev.preventDefault();
      navigate('politica');
    },
    style: {
      textDecoration: 'underline'
    }
  }, "pol\xEDtica de tratamiento de datos"), " de KAMPOT S.A.S.")), errors.acepta && /*#__PURE__*/React.createElement("div", {
    style: {
      color: 'var(--wine)',
      fontSize: 12,
      marginTop: -16
    }
  }, errors.acepta), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-primary"
  }, "Enviar mensaje ", /*#__PURE__*/React.createElement(Arrow, null))))))));
}
function ContactBlock({
  label,
  value,
  sub
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 0',
      borderBottom: '1px solid var(--rule)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'var(--muted)',
      marginBottom: 6
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18,
      fontFamily: 'var(--serif)'
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: 'var(--ink-soft)',
      marginTop: 2
    }
  }, sub));
}
function Field({
  label,
  required,
  error,
  children
}) {
  const child = React.Children.only(children);
  return /*#__PURE__*/React.createElement("div", {
    className: `field boxed ${error ? 'has-error' : ''}`
  }, /*#__PURE__*/React.createElement("label", null, label, required && /*#__PURE__*/React.createElement("span", {
    className: "req"
  }, " *")), child, error && /*#__PURE__*/React.createElement("div", {
    className: "error"
  }, error));
}
Object.assign(window, {
  ContactoPage,
  Field,
  ContactBlock
});
