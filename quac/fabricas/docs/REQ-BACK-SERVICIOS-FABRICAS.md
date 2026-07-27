# Requerimiento para el Back — Servicios del flujo de solicitud de crédito (Canal Tienda)

**Proyecto:** Fábricas de Crédito QUAC · **Versión:** 1.0 · **Fecha:** 2026-07-26
**Equipo back:** Edwin (responsable) con apoyo de Leo (líder back)
**Criterio de aceptación:** el **simulador de escenarios 1–17** — [ver en línea](https://digital-baguer.github.io/prototipos/quac/fabricas/prototipo-mesa-solicitudes.html). Implementado cada servicio, el flujo real debe comportarse **tal cual el escenario que lo simula** (cada escenario trae en su guía «?» el camino de preguntas del PDF que reproduce).
**Presentaciones por escenario:** [cliente nuevo — N1–N12](https://digital-baguer.github.io/prototipos/quac/fabricas/escenarios-cliente-nuevo.html) · [cliente existente — E0–E7](https://digital-baguer.github.io/prototipos/quac/fabricas/escenarios-cliente-existente.html).
**Fuente de negocio:** [FLUJO_CREDITOS_V3 (Google Docs)](https://docs.google.com/document/d/18o5XI5pJ5LQj52SwtOO8sTaZC0Ipg99JwPWhFKxy9U0/edit) — las referencias «B# p.#» de este documento apuntan a sus bloques y páginas.

---

## 1. Cómo leer este documento

- Cada contrato define: **qué envía el front → qué devuelve el back**, la **lógica que el back debe garantizar** (reglas numeradas con referencia al PDF y al escenario del simulador que debe reproducir) y un **JSON sugerido** de request/response.
- Los JSON son **sugerencias de forma**: los nombres finales de campos, rutas y tecnología los define el back. Lo no negociable es **qué dato entra y qué dato sale**.
- El front **no interpreta negocio**: recibe instrucciones de presentación (qué paso activar, qué mensaje mostrar, qué proceso iniciar). Los códigos de escenario viajan solo como trazabilidad.

## 2. Orden del plan de trabajo (ratificado)

| Fase | Alcance | Contratos | Escenarios que debe reproducir |
|---|---|---|---|
| **Fase 1 · Crear solicitudes — cliente nuevo** | La atención clasifica "cliente nuevo" y el flujo de 8 pasos funciona hasta activar cupo, con todos sus desvíos | C-02 (parcial), C-03…C-09, C-10, C-11 | 1, 4, 5, 6, 7, 8, 9, 14, 15, 16 (+ autogestión) |
| **Fase 2 · Cliente existente** | Clasificación completa de la atención + flujos exprés | C-02 (completo), C-12, C-13 | 2, 3, 10, 11, 12, 13, 17 |
| **Fase 3 · Mesa de estudios** | Listado con filtros, contadores y estado en vivo | C-01 | — (la Mesa pinta lo producido en fases 1–2) |

**Por qué este orden:** sin solicitudes creadas la Mesa no tiene qué listar; sus columnas y estados son producto de las fases 1–2. **C-11 (sondeo) y C-10 (estado completo) pertenecen a la Fase 1**: estudio, OCR y biometría son asíncronos y la pausa/retoma existe desde el primer flujo.

> **Nota de despliegue (aclaración del dueño, 2026-07-26):** las fases son **orden de construcción, acuerdos y pruebas** — no etapas de salida. El paso a producción se hace **con las tres fases completas**: ningún cliente real toca un flujo parcial.

## 3. Catálogo de contratos

| Código | Servicio | Fase |
|---|---|---|
| C-02 | Identificación y clasificación de la atención | 1–2 |
| C-03 | Creación del cliente (4 operaciones: foto · OCR · contacto · guardar) | 1 |
| C-04 | Tipo de gestión y asesor (autogestión · código · validación facial) | 1 |
| C-05 | Aceptación y firma electrónica — token celular (al validar nace la solicitud) | 1 |
| C-06 | Estudio de crédito (sub-etapas + 5 resultados) | 1 |
| C-07 | Registro de dirección | 1 |
| C-08 | Validación de identidad (5 operaciones) | 1 |
| C-09 | Activación de cupo — token correo | 1 |
| C-10 | Estado completo de una solicitud | 1 |
| C-11 | Sondeo de cambios (estado en vivo) | 1 |
| C-12 | Desbloqueo exprés de cupo | 2 |
| C-13 | Reactivación de cupo eliminado | 2 |
| C-01 | Listado de la Mesa | 3 |

## 4. Reglas transversales

1. **Asincronía:** los procesos largos (estudio, OCR, biometría, validación simplificada) no bloquean la respuesta: se inician, devuelven `proceso_id` y el avance se consulta (C-11 o consulta puntual).
2. **Instrucción de presentación:** toda respuesta le dice al front qué hacer. El front nunca decide con códigos de negocio.
3. **Seguridad del canal tienda:** jamás exponer score, detalle de centrales, veredicto biométrico crudo, motivos internos de fábrica ni detalle de mora.
4. **Notificaciones al cliente:** cada evento notificable registra canal y plantilla (textos pendientes — duda D10).
5. **Trazabilidad:** todo cambio de estado escribe un suceso en la bitácora (qué pasó, cuándo, actor).
6. **Reintentos con límite:** tokens, OCR y biometría tienen máximo de intentos; al agotarse aplica la regla del PDF.
7. **La solicitud nace en C-05.B.** Todo lo anterior es atención preliminar **sin número de solicitud** (usa `atencion_id`).
8. **`atencion_id` — el id de la sesión de atención (la pre-solicitud).** Identifica el hecho de negocio «hoy se atendió a esta persona», exista o no una solicitud después. **Su finalidad principal es darle traza a las atenciones que NO crean solicitud de estudio**: los finales informativos (cupo ya activo · no aplica por mora · cierre reciente · expirada) y los flujos exprés (desbloqueo · reactivación) quedarían invisibles sin él. Con la atención registrada, cada consulta deja bitácora y alimenta indicadores — cuántas personas llegaron y en qué terminó cada una — y este sería su identificador si esas gestiones aparecen en la Mesa (duda D7).
   **Mecánica:** C-02 lo crea y lo devuelve; el front no lo interpreta — **lo repite en cada llamada siguiente** de esa atención (fotos, OCR, cliente, token, exprés) para que el back correlacione la secuencia. Al validar el token (C-05.B), la atención se convierte en la solicitud formal y el front pasa a usar `solicitud_id`. La pausa pre-firma (escenario 6) se recupera por la atención.
   **A diferencia de una sesión técnica, no muere con el login:** sobrevive días (la retoma puede darse con otro asesor en otra caja) y expira solo por regla de negocio (90 días → `Expirada`). **Seguridad:** la sesión autenticada del asesor (login con contexto tienda/bodega) autoriza *quién actúa*; el back valida en cada llamada que la atención sea accionable por esa sesión — el `atencion_id` nunca funciona como credencial y debe ser no adivinable (UUID, no consecutivo).

---

## 5. Detalle por contrato (con JSON sugerido)

### C-02 · Identificación y clasificación de la atención

> **Cuándo ocurre:** cada vez que el asesor pulsa «Atender cliente», digita el documento y consulta — es la **primera llamada de toda atención**.
> **Objetivo:** decirle a la pantalla qué camino sigue esta persona (crear solicitud, retomar una, informar un final o iniciar un proceso exprés), sin que el front tenga que adivinar nada.

**Front envía:** tipo y número de documento + contexto (tienda, caja, asesor logueado).
**Back devuelve:** instrucción `{accion, escenario, datos}`. Acciones: `activar_paso` · `abrir_solicitud` · `mostrar_resultado` · `iniciar_proceso`.

**Lógica exigida (la primera regla que aplica gana):**
1. ¿Existe solicitud **abierta**? → `abrir_solicitud` con id, paso exacto y lo capturado *(escenario 6 · B2 p.7 — divergencia consciente D1)*.
2. ¿Gestión pausada sin retomar en 90 días? → `expirada` *(escenario 17 · B4 p.12)*.
3. ¿Tiene cupo? → activo = `cupo_activo` *(esc. 10 · B2 p.3)* · bloqueado+mora = `no_aplica_mora` *(esc. 11)* · bloqueado por inactividad+soportes+sin cambios = `desbloqueo` *(esc. 12)* · otra causa → regla 5.
4. ¿Sin cupo, eliminado ≤ X días, datos sin cambios? → `reactivacion` (+flag mora histórica > Y) *(esc. 13)*. Si no → regla 5.
5. ¿Estudio < 90 días no retomable? → `cierre_reciente` *(esc. 3)*. Sin nada: no registrado = `cliente_nuevo` *(esc. 1)* · registrado = `re_estudio` *(esc. 2)*.

**Fases:** Fase 1 = reglas 1, 2 y 5 · Fase 2 = reglas 3 y 4. Solo aplica a construcción: en producción va el árbol completo (§2).

```json
// REQUEST
{ "tipo_documento": "CC", "numero_documento": "1098765432",
  "contexto": { "tienda": "015", "caja": "01", "asesor": "1015425789" } }

// RESPONSE — cliente nuevo (escenario 1)
{ "accion": "activar_paso", "escenario": "cliente_nuevo",
  "atencion_id": "AT-90211", "paso": "creacion_cliente", "datos": null }

// RESPONSE — retomar solicitud abierta (escenario 6)
{ "accion": "abrir_solicitud", "escenario": "retomar_solicitud",
  "solicitud_id": 1049, "paso_actual": "firma_token" }

// RESPONSE — resultado final (escenario 10; mismo formato para 11, 3 y 17)
{ "accion": "mostrar_resultado", "escenario": "cupo_activo",
  "resultado": { "tono": "exito", "titulo": "Cupo ya activo",
    "mensaje": "El cliente tiene un cupo activo y disponible.", "monto": 2500000 },
  "notificacion_cliente": { "canal": "sms", "plantilla": "recordatorio_cupo" } }

// RESPONSE — proceso exprés (escenario 12; análogo para 13)
{ "accion": "iniciar_proceso", "escenario": "desbloqueo",
  "atencion_id": "AT-90214",
  "proceso": { "tipo": "desbloqueo", "monto_a_recuperar": 2500000,
    "requiere_validacion_previa": false } }
```

---

### C-03 · Creación del cliente — 4 operaciones

> **Cuándo ocurre:** en el paso 2, cuando la atención clasificó «cliente nuevo» (o un existente que verifica sus datos antes del re-estudio).
> **Objetivo:** dejar al cliente registrado con datos confiables — leídos de su documento (OCR) y con celular y correo verificados como disponibles.

**A · Cargar foto del documento.** Imagen + cara + `atencion_id` → id de foto + legibilidad («vuelve a tomar la foto» si ilegible). Procesar solo con ambas caras *(escenario 1)*.
**B · Procesar OCR.** Ids de las 2 fotos → (asíncrono corto) datos extraídos con códigos DANE. El asesor **verifica antes de guardar**; la consistencia contra lo digitado se valida en C-08 *(B5 p.14)*.
**C · Validar contacto.** Celular y correo → disponibilidad por campo con motivo; no asociados a otro cliente con cupo o solicitud activa *(B1 p.2)*.
**D · Guardar cliente.** Datos verificados → cliente creado/actualizado. Editar **después de la firma** invalida la firma (re-token C-05).

```json
// A — REQUEST (multipart: imagen) + { "atencion_id": "AT-90211", "cara": "frontal" }
// A — RESPONSE
{ "foto_id": "F-771", "legible": true }

// B — REQUEST
{ "atencion_id": "AT-90211", "foto_frontal_id": "F-771", "foto_reverso_id": "F-772" }
// B — RESPONSE (al finalizar el proceso)
{ "estado": "finalizado", "datos": {
    "numero_documento": "1098765432", "nombres": "María Alejandra",
    "apellidos": "Rodríguez López", "fecha_nacimiento": "1995-03-15",
    "lugar_nacimiento": { "dane": "05001", "ciudad": "Medellín", "departamento": "Antioquia" },
    "fecha_expedicion": "2013-04-02",
    "lugar_expedicion": { "dane": "68001", "ciudad": "Bucaramanga", "departamento": "Santander" } } }

// C — REQUEST
{ "celular": "3145678901", "correo": "maria@gmail.com" }
// C — RESPONSE
{ "celular": { "disponible": true },
  "correo": { "disponible": false, "motivo": "asociado_a_otro_cliente" } }

// D — REQUEST
{ "atencion_id": "AT-90211", "cliente": { "numero_documento": "1098765432", "nombres": "...",
    "apellidos": "...", "fecha_nacimiento": "...", "lugar_nacimiento_dane": "05001",
    "fecha_expedicion": "...", "lugar_expedicion_dane": "68001",
    "celular": "3145678901", "correo": "maria@gmail.com" } }
// D — RESPONSE
{ "cliente_id": 88231, "resultado": "creado", "firma_invalidada": false }
```

---

### C-04 · Tipo de gestión y asesor — 3 operaciones

> **Cuándo ocurre:** en el paso 3, justo después de crear o verificar al cliente.
> **Objetivo:** definir cómo se atiende (asistida en tienda o autogestión desde el celular) y dejar constancia de **qué asesor responde** por la gestión (código + rostro validado).

**A · Definir tipo de gestión.** `asistida` → continúa · `autogestion` → enlace único asociado a tienda/origen, enviado por WhatsApp, estado `EN_AUTOGESTION`, la gestión en tienda finaliza *(B1 p.2)*.
**B · Validar código de asesor.** Vacío = asesor logueado; inválido con reintento; al agotar → default `100100` *(B3 p.8)*.
**C · Validación facial del asesor.** Obligatoria antes de continuar; reintentos con la misma regla *(B3 p.8–9)*.

```json
// A — REQUEST
{ "atencion_id": "AT-90211", "tipo": "autogestion" }
// A — RESPONSE
{ "estado": "EN_AUTOGESTION", "enlace_enviado": true, "canal": "whatsapp" }

// B — REQUEST
{ "codigo_asesor": "1015425789" }
// B — RESPONSE
{ "valido": true, "nombre": "Carlos Mejía", "intentos_restantes": 2 }

// C — REQUEST
{ "asesor": "1015425789", "selfie_id": "F-780" }
// C — RESPONSE
{ "resultado": "exitosa" }
```

---

### C-05 · Aceptación y firma electrónica (token celular)

> **Cuándo ocurre:** en el paso 4, cuando el cliente acepta términos y condiciones.
> **Objetivo:** que el cliente **firme electrónicamente** con el código que llega a su celular — con esa firma nace la solicitud formal y queda autorizado el estudio.

**A · Enviar token.** SMS / IVR / WhatsApp — **WhatsApp solo tras usar SMS e IVR**. Historial de envíos visible; límite de reenvíos.
**B · Validar token.** Válido → **crea la solicitud formal** (el token es la firma de T&C) *(B3 p.9)*. Si el cliente se retira sin validar → `Pendiente cliente previo` (pausada) *(escenario 6)*.
**C · Re-firma (regla, no endpoint propio).** El evento **lo dispara C-03.D (guardar cliente)**: si el guardado ocurre después de la firma, el back invalida la firma, limpia los envíos previos y lo señala en la respuesta con `firma_invalidada: true`. Con esa señal el front regresa el flujo al paso 4, y la re-tokenización usa las mismas operaciones A/A2/B. Precisión: en la re-firma **C-05.B no crea otra solicitud** — la solicitud ya existe; registra la nueva firma sobre la misma y el estado vuelve a `EN_PROCESO`.

> Arranque del estudio: el PDF encadena token válido → validaciones automáticas; el simulador usa botón. El back soporta el arranque **por orden del front** (C-06.A); si el negocio decide automático, es configuración — **duda D12**.

```json
// A — REQUEST
{ "atencion_id": "AT-90211", "canal": "sms" }
// A — RESPONSE
{ "enviado": true, "canales_usados": ["sms"], "whatsapp_habilitado": false }

// B — REQUEST
{ "atencion_id": "AT-90211", "codigo": "472918" }
// B — RESPONSE — válido: NACE LA SOLICITUD
{ "valido": true, "solicitud_id": 1049, "estado": "EN_PROCESO" }
// B — RESPONSE — inválido
{ "valido": false, "intentos_restantes": 2 }
```

---

### C-06 · Estudio de crédito

> **Cuándo ocurre:** tras la firma del paso 4 (por orden del asesor con el botón, o automático — duda D12).
> **Objetivo:** evaluar si el cliente puede recibir crédito y con qué cupo, corriendo por debajo antecedentes, Preselecta y validación de contacto — **sin mostrarle la mecánica interna a la tienda**.

**A · Iniciar estudio.** Orden del front → `proceso_id`.
**B · Avance.** El estudio corre solo en el back y pasa por 5 sub-etapas: `validaciones_iniciales` → `viabilidad` → `validacion_contacto` → `asignacion_cupo` → `finalizado`. Cómo se entera el front, paso a paso:

1. El asesor pulsa «Iniciar estudio» → el front llama **C-06.A**, recibe `proceso_id` y la primera sub-etapa, y pinta el loader («Validando viabilidad…»). **Esa llamada termina ahí** — no se queda esperando el resultado.
2. Con el detalle abierto, el front ya tiene corriendo su **temporizador de sondeo (C-11)**: cada N segundos pregunta «¿qué cambió desde {marca}?».
3. Cuando el back avanza de sub-etapa, la **siguiente respuesta del sondeo** trae `sub_etapa: "validacion_contacto"` → el front solo cambia el texto del loader. Así con cada avance.
4. Cuando el estudio **termina**, el sondeo lo trae en `procesos_terminados` con su resultado (`viable_con_cupo` + monto, `requiere_llamada`, o uno de los 3 cierres) → el front resuelve la pantalla y **avanza el paso automáticamente**.
5. La consulta puntual **`GET …/estudio` se usa solo en 3 momentos**, cuando el sondeo aún no ha corrido y se necesita el estado *ya*: al **abrir** la pantalla por primera vez, al **retomar** una solicitud, o al **reconectar** tras perder la red. Devuelve exactamente lo mismo que traería el sondeo, sin esperar el próximo tick.

Regla simple: **el sondeo empuja los cambios; la puntual pinta el estado inicial.** Nunca se usan las dos a la vez para lo mismo. (El mismo patrón aplica a C-08.E — identidad — y a los procesos exprés C-12/C-13.)

| Resultado | Regla | Fuente · escenario |
|---|---|---|
| `no_viable_antecedentes` | Antecedentes negativos | B3 p.10 · **14** |
| `no_viable_centrales` | La Preselecta no aprueba | B4 p.10–11 · **15** |
| `no_aplica_cupo` | PPT/CE/CC>75 sin cotización ni historial | B4 p.11 + B8 · **16** |
| `requiere_llamada` | Contacto no concluyente → llamada automática; no confirma / suplantación → `escalado_fabrica` | B6 p.16–19 · **8** |
| `viable_con_cupo` | Monto preliminar definido | B4 p.11–12 · **1** |

**Reglas:** el detalle jamás viaja al front. Desde que pasa la **viabilidad**, dirección (C-07) e identidad (C-08) se habilitan **en paralelo** *(escenario 1)*.

```json
// A — REQUEST
{ "solicitud_id": 1049 }
// A — RESPONSE
{ "proceso_id": "EST-5540", "sub_etapa": "validaciones_iniciales" }

// B — RESPONSE — en curso
{ "proceso_id": "EST-5540", "sub_etapa": "asignacion_cupo", "finalizado": false,
  "habilita_paralelo": ["direccion", "identidad"] }
// B — RESPONSE — requiere llamada (escenario 8)
{ "finalizado": false, "resultado_parcial": "requiere_llamada",
  "mensaje_asesor": "Pídale al cliente estar pendiente de la llamada" }
// B — RESPONSE — final viable (escenario 1)
{ "finalizado": true, "resultado": "viable_con_cupo", "cupo_preaprobado": 1200000 }
// B — RESPONSE — cierre (escenarios 14/15/16: cambia el código y el título)
{ "finalizado": true, "resultado": "no_viable_antecedentes",
  "instruccion": { "accion": "mostrar_resultado", "tono": "negativo",
    "titulo": "No viable antecedentes",
    "mensaje": "La solicitud finaliza. El detalle no se muestra en tienda." } }
```

---

### C-07 · Registro de dirección

> **Cuándo ocurre:** en el paso 6 — normalmente **en paralelo** mientras el estudio termina — o en cualquier momento que haya que corregirla.
> **Objetivo:** guardar dónde vive el cliente.

**El front envía:** departamento y ciudad (códigos DANE) + dirección/detalle.
**El back devuelve:** confirmación del guardado.
**Reglas:** editable en cualquier momento **sin re-token**; si queda pendiente y no se retoma en 90 días → `Expirada` *(B4 p.12)*.

```json
// REQUEST
{ "solicitud_id": 1049, "departamento_dane": "05", "ciudad_dane": "05001",
  "direccion": "Cra 43A # 18-95 Apto 502" }
// RESPONSE
{ "guardada": true }
```

---

### C-08 · Validación de identidad — 5 operaciones

> **Cuándo ocurre:** en el paso 7 — habilitado en paralelo desde que el estudio pasa la viabilidad.
> **Objetivo:** comprobar que la persona **es quien dice ser** (documento + prueba de vida) y decidir el desenlace: continúa, se corrigen datos, se escala a revisión humana o se cierra por fraude.

**A · Cargar fotos del documento** (si no vienen del OCR; reutilizar almacenadas vigentes *(B5 p.13)*).
**B · Lanzar prueba de vida en tienda** (sesión de captura con gestos).
**C · Generar enlace WhatsApp** para hacerla desde el celular *(B5)*. Sin completar → `Pendiente cliente`; 90 días → `Expirada`.
**D · Registrar la captura** → proceso asíncrono.
**E · Consultar resultado:**

| Resultado | Regla | Fuente · escenario |
|---|---|---|
| `verificada` | Biometría + consistencia + antifraude OK | B5 · **1** |
| `fraude_cerrada` | Tipo/número ≠ digitado | B5 p.14 · **5** |
| `datos_corregidos_reevaluando` | Nombre/apellido/fecha difieren → corrige y re-evalúa (retorna a B4) | B5 p.14 · **4** |
| (silencioso) | Resto difiere → reemplazar y continuar | B5 p.15 |
| `en_revision` | No concluyente / reintentos / suplantadores / biometría anterior inconsistente → `escalado_fabrica` | B5 p.15–16 · **7** |

**Seguridad:** solo estados públicos — nunca el veredicto ni el motivo del escalamiento.
**Retorno de fábrica** *(escenario 9 · B7 p.19–21)*: desatasque → retorna al punto exacto (`EN_PROCESO`) · freno → `DEVUELTO_POR_FABRICA` con `motivo_rechazo` visible para reintentar.

```json
// B — REQUEST
{ "solicitud_id": 1049, "modo": "tienda" }
// B — RESPONSE
{ "sesion_id": "BIO-112" }

// C — RESPONSE
{ "enlace_enviado": true, "canal": "whatsapp", "estado": "PENDIENTE_CLIENTE" }

// E — RESPONSE — verificada (escenario 1)
{ "estado": "verificada" }
// E — RESPONSE — en revisión (escenario 7 — sin motivo)
{ "estado": "en_revision", "solicitud_estado": "ESCALADO_FABRICA" }
// E — RESPONSE — nombre difiere (escenario 4)
{ "estado": "datos_corregidos", "reevaluacion": "en_proceso",
  "mensaje_asesor": "Datos actualizados desde el documento — re-evaluando" }
// E — RESPONSE — fraude (escenario 5)
{ "estado": "cerrada", "instruccion": { "accion": "mostrar_resultado", "tono": "negativo",
    "titulo": "Fraude / inconsistencia", "mensaje": "El documento no corresponde al digitado." } }
// E — RESPONSE — retorno de fábrica con freno (escenario 9)
{ "estado": "devuelto_por_fabrica",
  "motivo_rechazo": "Documento ilegible — solicitar nueva captura" }
```

---

### C-09 · Activación de cupo (token correo)

> **Cuándo ocurre:** en el paso 8, con estudio e identidad ya resueltos — es el cierre del flujo.
> **Objetivo:** dejar el cupo **disponible para comprar**, confirmando el correo del cliente con un token y notificándole la activación.

**A · Enviar token al correo** *(B9 p.23)*. **B · Validar y activar**: a tiempo → `Cupo activado` + notificación SMS/correo; fuera de tiempo → `Pendiente cliente` (90 días → `Expirada`). **C · Cambio de correo**: si reemplaza uno **OK UBICA** → `escalado_fabrica`; si no → actualizar y re-ejecutar UBICA *(B9 p.23)*.

```json
// A — RESPONSE
{ "enviado": true, "correo_ofuscado": "m***a@gmail.com" }

// B — REQUEST
{ "solicitud_id": 1049, "codigo": "835172" }
// B — RESPONSE
{ "valido": true, "estado": "APROBADO", "cupo": 1200000,
  "notificacion_cliente": { "canales": ["sms", "correo"], "plantilla": "cupo_activado" } }

// C — REQUEST
{ "solicitud_id": 1049, "correo_nuevo": "otra@correo.com" }
// C — RESPONSE (reemplaza un correo OK UBICA)
{ "resultado": "requiere_revision", "solicitud_estado": "ESCALADO_FABRICA" }
```

---

### C-10 · Estado completo de una solicitud

> **Cuándo ocurre:** al abrir una solicitud existente — retoma, clic en una fila de la Mesa, cambio de pestaña o después de editar.
> **Objetivo:** entregar la **foto completa** de la solicitud para repintar la pantalla exactamente como quedó, sin que el front reconstruya nada.

**El front envía:** el identificador de la solicitud.
**El back devuelve:** el estado completo — paso actual, sub-etapa de los procesos en curso, datos capturados, resultados públicos, soportes con su estado y la bitácora de sucesos *(lo usan las retomas, las pestañas y las ediciones)*.

```json
// RESPONSE (resumido)
{ "solicitud_id": 1049, "estado": "EN_PROCESO",
  "paso_actual": "registro_direccion",
  "procesos": [ { "tipo": "estudio", "sub_etapa": "asignacion_cupo", "finalizado": false } ],
  "cliente": { "cliente_id": 88231, "nombres": "...", "celular": "...", "correo": "..." },
  "resultados": { "viabilidad": "viable", "cupo_preaprobado": null },
  "soportes": [ { "tipo": "doc_frontal", "estado": "cargada" },
                { "tipo": "selfie", "estado": "en_revision" } ],
  "sucesos": [ { "fecha": "2026-07-26T14:31:00Z", "tono": "ok",
                 "titulo": "Token validado — solicitud creada", "actor": "asesor" } ] }
```

### C-11 · Sondeo de cambios (estado en vivo)

> **Cuándo ocurre:** cada N segundos, automáticamente, mientras haya una Mesa o un detalle abiertos.
> **Objetivo:** que la interfaz **se entere sola** de los cambios — avance de procesos, turnos, intervenciones — sin que el asesor recargue.

**El front envía:**
- la lista de solicitudes que el asesor tiene **abiertas en pantalla** (el detalle activo y las pestañas en segundo plano), **o** los filtros aplicados cuando lo abierto es la Mesa;
- la **marca de tiempo** de la última consulta («desde cuándo pregunto»).

**El back devuelve:** únicamente las solicitudes que **cambiaron desde esa marca** — cada una con su estado actual, la sub-etapa del proceso en curso, si **requiere intervención** (y de quién es el turno) y los **procesos terminados** con su resultado — más la nueva marca para la siguiente consulta.

**Uso por fase:** en Fase 1 alimenta el detalle de la solicitud (avance automático de los pasos); en Fase 3, la Mesa (refresco de lista y contadores).

```json
// REQUEST
{ "solicitudes": [1049, 1046], "desde": "2026-07-26T14:30:00Z" }
// RESPONSE
{ "marca": "2026-07-26T14:30:12Z", "cambios": [
    { "solicitud_id": 1049, "estado": "EN_PROCESO", "sub_etapa": "finalizado",
      "requiere_intervencion": true, "turno": "asesor",
      "procesos_terminados": [ { "tipo": "estudio", "resultado": "viable_con_cupo",
                                 "cupo_preaprobado": 1200000 } ] } ] }
```

---

### C-12 · Desbloqueo exprés (Fase 2)

> **Cuándo ocurre:** cuando C-02 clasificó la atención como candidata a desbloqueo (cupo bloqueado por inactividad, sin mora, soportes vigentes) y el asesor lo inicia.
> **Objetivo:** devolverle al cliente su cupo **sin nuevo estudio de crédito**: una verificación rápida y una prueba de vida.

**A · Iniciar** → validación simplificada asíncrona (antecedentes + reportes) *(B2 p.4)*. **B · Resultado**: supera → prueba de vida · no supera → `No viable antecedentes`. **C · Prueba de vida** (reusa C-08, contra la **selfie almacenada**): exitosa → `Desbloqueado` · no concluyente → `escalado_fabrica` *(escenario 12)*.

```json
// A — REQUEST
{ "atencion_id": "AT-90214" }
// A — RESPONSE
{ "proceso_id": "DES-71", "sub_etapa": "validacion_simplificada" }

// B — RESPONSE — supera
{ "sub_etapa": "prueba_de_vida", "supera_validacion": true }
// B — RESPONSE — no supera
{ "finalizado": true, "resultado": "no_viable_antecedentes" }

// C — RESPONSE — final
{ "finalizado": true, "resultado": "desbloqueado", "cupo_disponible": 2500000,
  "notificacion_cliente": { "canal": "whatsapp", "plantilla": "cupo_desbloqueado" } }
```

### C-13 · Reactivación de cupo eliminado (Fase 2)

> **Cuándo ocurre:** cuando C-02 clasificó la atención como candidata a reactivación (cupo eliminado hace ≤ X días, datos sin cambios) y el asesor envía el token.
> **Objetivo:** recuperar un cupo eliminado hace poco **sin nuevo estudio**, confirmando la identidad del cliente (token + prueba de vida).

**A · Iniciar** → si `requiere_validacion_previa` (mora histórica > Y): validación simplificada primero *(B2 p.5–6)*. Luego **token de identidad** al celular (el envío lo ordena el asesor). **B · Validar token**: válido → prueba de vida · inválido → `Pendiente cliente previo`. **C · Prueba de vida**: exitosa → `Reactivado` · no concluyente → `escalado_fabrica` *(escenario 13)*.

> El token de reactivación valida **identidad**; si además refresca la aceptación de T&C es la duda **D8**.

```json
// A — REQUEST
{ "atencion_id": "AT-90215" }
// A — RESPONSE
{ "token_enviado": true, "celular_ofuscado": "***8901", "requiere_validacion_previa": false }

// B — REQUEST
{ "atencion_id": "AT-90215", "codigo": "619042" }
// B — RESPONSE — inválido
{ "valido": false, "estado": "PENDIENTE_CLIENTE_PREVIO", "permite_reintento": true }

// C — RESPONSE — final
{ "finalizado": true, "resultado": "reactivado", "cupo_disponible": 2500000,
  "notificacion_cliente": { "canal": "whatsapp", "plantilla": "cupo_reactivado" } }
```

---

### C-01 · Listado de la Mesa (Fase 3)

> **Cuándo ocurre:** al abrir la Mesa de estudios, aplicar filtros o cambiar de página.
> **Objetivo:** mostrar **todas las solicitudes de la tienda** con su estado, fase y contadores, para que el asesor sepa qué tiene pendiente y qué requiere su intervención.

**El front envía:** los filtros (estado, rango de fechas, texto de búsqueda) + la página (número y tamaño).
**El back devuelve:** las filas con las 8 columnas, el total de registros (para la paginación) y los 5 contadores de las tarjetas.
**Reglas:** los estados y fases son los producidos por las fases 1–2. Pendiente **D7**: si las atenciones exprés aparecen en la Mesa y con qué identificador.

```json
// REQUEST
{ "filtros": { "estado": null, "desde": "2026-07-01", "hasta": null, "busqueda": "" },
  "pagina": 1, "tamano": 10 }
// RESPONSE
{ "total": 47,
  "contadores": { "total": 47, "pendientes": 12, "aprobados": 20, "rechazados": 9, "escalados": 6 },
  "filas": [ { "solicitud_id": 1049, "cliente": "María Alejandra Rodríguez",
      "documento": "1098765432", "estado": "EN_PROCESO",
      "fase": "Estudio", "paso": "Iniciar estudio", "espera_minutos": 8,
      "asesor": "1015425789", "cupo_preaprobado": null,
      "ultima_actividad": "2026-07-26T14:31:00Z" } ] }
```

---

## 6. Matriz de aceptación (escenario → contratos que ejercita)

| # | Escenario | Contratos |
|---|---|---|
| 1 | Flujo feliz (OCR) | C-02, C-03(A–D), C-04, C-05, C-06, C-07, C-08, C-09, C-11 |
| 2 | Existente → nuevo estudio | C-02, C-03(C–D), C-05…C-09 |
| 3 | Cierre reciente | C-02 |
| 4 | Nombre difiere | C-08.E |
| 5 | Fraude / número no coincide | C-08.E |
| 6 | Se va sin tokenizar (pausa/retoma) | C-05.B, C-02, C-10 |
| 7 | Identidad a revisión | C-08.E |
| 8 | Requiere llamada | C-06 |
| 9 | Retorno de fábrica | C-08, C-11 |
| 10 | Cupo ya activo | C-02 |
| 11 | No aplica por mora | C-02 |
| 12 | Desbloqueo de cupo | C-02, C-12 |
| 13 | Reactivación de cupo | C-02, C-13 |
| 14 | No viable antecedentes | C-06 |
| 15 | No viable centrales | C-06 |
| 16 | No aplica para cupo | C-06 |
| 17 | Retoma tras 90 días (Expirada) | C-02 |

## 7. Dudas abiertas que condicionan la implementación

Para resolver con el dueño del requerimiento:

- **D1 — Orden de evaluación:** ¿una solicitud **abierta** se retoma antes de validar cupo/mora? El PDF evalúa el cupo primero; este requerimiento propone la solicitud abierta de primera (C-02, regla 1). ¿Y si aparece mora estando la solicitud en curso — se cierra, se pausa?
- **D2 — «Cupo ya activo»:** ¿el asesor puede ver y decir el **monto disponible**?
- **D3 — Nodo del diagrama Miro «¿Cupo eliminado por solicitud?»** que el PDF no menciona: ¿qué significa (eliminado a petición del cliente) y a dónde va la rama NO (eliminado por otra causa)?
- **D4 — Parámetros X y Y** (días desde la eliminación del cupo / días de mora histórica): valores y ¿configurables o fijos? Ejemplos de respuesta: «180/60 fijos por política» o «180/60 de arranque, configurables desde el catálogo Reglas de negocio». Recomendación: configurables — el catálogo ya existe en Administración. *(El propio PDF lo deja anotado «para validar».)*
- **D5 — Cierre reciente:** ¿se le informa al cliente **cuándo** podrá volver a intentar (fecha)? ¿Los 90 días corren desde el cierre?
- **D6 — Cupo bloqueado por causa distinta a inactividad:** ¿siempre va a re-estudio, o hay causas (ej. bloqueo por fraude) que son fin del proceso?
- **D7 — ¿Desbloqueo y reactivación crean una gestión visible en la Mesa** (con identificador, estados y sucesos) o son procesos sin solicitud? Impacta C-01 y C-11; su identificador natural sería el `atencion_id`.
- **D8 — Token de reactivación:** ¿valida solo **identidad** o también refresca la aceptación de T&C (como la firma del paso 4)?
- **D9 — Prueba de vida en desbloqueo/reactivación:** ¿se compara contra la selfie almacenada? ¿Puede hacerse por enlace WhatsApp como en el paso 7?
- **D10 — Notificaciones al cliente por canal** en los finales pre-solicitud: ¿cuáles se envían, por qué canal (SMS/WhatsApp/correo) y con qué texto? Hay propuestas por escenario en las presentaciones. El caso mora es sensible: canal privado y sin cifras.
- **D12 — Arranque del estudio:** ¿automático al validar el token (PDF, B3 p.9–10) o por orden del asesor (simulador, variante manual en los escenarios 1, 4–9, 14–16)? Si es manual, definir qué pasa con una solicitud firmada cuyo estudio nunca se lanza. Recomendación: automático — el paso 5 pasa a ser pantalla de avance.

