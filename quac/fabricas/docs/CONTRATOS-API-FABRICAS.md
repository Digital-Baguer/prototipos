# Contratos API — Rutas propuestas · Canal Tienda

**Proyecto:** Fábricas de Crédito QUAC · **Versión:** 1.1 · **Fecha:** 2026-07-27
**Qué es:** el **entregable de las sesiones «Confirmar definición de contrato de servicios»**. El equipo back llega con este documento leído, se apersona del proceso y **ratifica o ajusta** cada contrato: ruta, request, flujo y escenarios de respuesta. Lo ratificado se firma en la pestaña **Contratos** del plan.
**Convención:** las rutas y nombres son **propuestas** — el back define los finales. Lo no negociable es qué dato entra, qué dato sale y el comportamiento. Cada campo de respuesta trae su **contexto: por qué el front lo necesita** — si un campo no responde esa pregunta, sobra; si a la pantalla le falta algo para pintarse, falta un campo.
**Alineación multicanal:** la columna «Web #» referencia la lista de 31 endpoints del canal Web (autogestión) ya definida. Los marcados **compartido** son el mismo servicio en ambos canales.
**Referencias:** [simulador de escenarios 1–17](https://digital-baguer.github.io/prototipos/quac/fabricas/prototipo-mesa-solicitudes.html) · el detalle de reglas de negocio por contrato está en el *Requerimiento de servicios del back*.

---

## Convenciones transversales

- **Identificadores:** antes de la firma del paso 4 todo viaja con `atencion_id` (la sesión de atención); al validar el token de firma nace `solicitud_id` y se usa en adelante.
- **Asincronía:** los procesos largos devuelven `proceso_id`/estado y el avance se consulta (C-06.B, C-08.E, C-11). Ninguna ruta bloquea esperando centrales, OCR o biometría.
- **Errores estándar:** `{ "error": { "codigo": "...", "mensaje": "texto legible para el asesor" } }` — el front muestra `mensaje` tal cual; nunca redacta errores propios.
- **Reenvío de tokens:** toda tokenización a celular soporta **reenvío por SMS · IVR (llamada) · WhatsApp**, con la regla de canal: WhatsApp solo habilitado tras haber usado SMS e IVR. La regla la calcula el back; el front obedece flags.

## Tabla resumen

| Contrato · Op | Operación | Método y ruta propuesta | Web # |
|---|---|---|---|
| CAT.1 | Tipos de documento | `GET /api/catalogos/tipos-documento` | #1 · compartido |
| CAT.2 | Departamentos | `GET /api/catalogos/departamentos` | #2 · compartido |
| CAT.3 | Ciudades por departamento | `GET /api/catalogos/ciudades/{departamento_id}` | #3 · compartido |
| C-02 | Identificar y clasificar la atención | `POST /api/atencion/identificar` | #4 · unificar |
| C-03.A | Cargar foto del documento | `POST /api/atencion/{id}/foto-documento` | #15/#16 |
| C-03.B | Procesar OCR | `POST /api/atencion/{id}/ocr` + `GET …/ocr` | #16 |
| C-03.C | Validar contacto | `POST /api/solicitud/validar-contacto` | #5 · compartido |
| C-03.D | Guardar cliente | `PUT /api/atencion/{id}/cliente` | #6 |
| C-04.A | Tipo de gestión | `POST /api/atencion/{id}/tipo-gestion` | — |
| C-04.B | Validar código de asesor | `GET /api/asesores/{codigo}` | — |
| C-04.C | Validación facial del asesor | `POST /api/asesores/{codigo}/validar-rostro` | — |
| C-05.A | Enviar token de firma | `POST /api/atencion/{id}/token-firma/enviar` | #7 |
| C-05.A2 | **Reenviar** token de firma (sms·ivr·whatsapp) | `POST /api/atencion/{id}/token-firma/reenviar` | #8 |
| C-05.B | Validar token — **nace la solicitud** | `POST /api/atencion/{id}/token-firma/validar` | #9 |
| C-06.A | Iniciar estudio | `POST /api/solicitud/{id}/estudio/iniciar` | #12 |
| C-06.B | Consultar avance del estudio | `GET /api/solicitud/{id}/estudio` | #12/#14/#20 |
| C-07 | Registrar dirección | `PUT /api/solicitud/{id}/direccion` | #13 |
| C-08.A | Cargar fotos del documento (si faltan) | `POST /api/solicitud/{id}/foto-documento` | #15/#16 |
| C-08.B | Iniciar prueba de vida en tienda | `POST /api/solicitud/{id}/prueba-vida/iniciar` | #17 |
| C-08.C | Enlace WhatsApp para prueba de vida | `POST /api/solicitud/{id}/prueba-vida/enlace` | — |
| C-08.D | Completar captura | `POST /api/solicitud/{id}/prueba-vida/completar` | #18 |
| C-08.E | Consultar verificación de identidad | `GET /api/solicitud/{id}/verificacion-identidad` | #19/#28 |
| C-09.A | Enviar token de correo | `POST /api/solicitud/{id}/token-correo/enviar` | #21 |
| C-09.A2 | **Reenviar** token de correo | `POST /api/solicitud/{id}/token-correo/reenviar` | — |
| C-09.B | Validar token y activar cupo | `POST /api/solicitud/{id}/token-correo/validar` | #22/#23 |
| C-09.C | Cambiar correo | `PUT /api/solicitud/{id}/correo` | — |
| C-10 | Estado completo de la solicitud | `GET /api/solicitud/{id}` | #27 |
| C-11 | Sondeo de cambios | `POST /api/solicitudes/cambios` | #27 |
| C-12.A | Iniciar desbloqueo exprés | `POST /api/atencion/{id}/desbloqueo/iniciar` | — |
| C-12.B | Consultar avance del desbloqueo | `GET /api/atencion/{id}/desbloqueo` | — |
| C-12.C | Prueba de vida del desbloqueo | reusa C-08.B/D con `atencion_id` | — |
| C-13.A | Iniciar reactivación (envía token identidad) | `POST /api/atencion/{id}/reactivacion/iniciar` | #29 |
| C-13.A2 | **Reenviar** token de identidad (sms·ivr·whatsapp) | `POST /api/atencion/{id}/reactivacion/token/reenviar` | — |
| C-13.B | Validar token de identidad | `POST /api/atencion/{id}/reactivacion/token/validar` | #30 |
| C-13.C | Prueba de vida de la reactivación | reusa C-08.B/D con `atencion_id` | — |
| C-01 | Listado de la Mesa | `GET /api/solicitudes` | — |

---

## Catálogos — CAT.1 / CAT.2 / CAT.3

Listas `[{ id, nombre }]` (ciudades con su código DANE). **Por qué el front las necesita:** poblar los selectores de tipo de documento (pantalla de atención) y departamento/ciudad (pasos 2 y 6). Se cachean — no se piden en cada pantalla.

---

## Sesión 1 — C-02 · Clasificación de la atención

### `POST /api/atencion/identificar`   *(Web #4 — unificar nombre entre canales)*

**Request**
```
{ "tipo_documento": "CC", "numero_documento": "1098765432",
  "contexto": { "tienda": "015", "caja": "01", "asesor": "1015425789" } }
```

**Flujo del proceso**
1. Crea (o recupera) la **atención** y le asigna `atencion_id`.
2. Ejecuta el árbol de clasificación en orden: ① solicitud abierta → ② gestión expirada (90 días) → ③ estado del cupo (activo / mora / desbloqueo) → ④ reactivación (X·Y días) → ⑤ estudio vigente / nuevo.
3. Devuelve la **instrucción de presentación**; registra el suceso en bitácora.

**Escenarios de respuesta**
- **Cliente nuevo** → `{ "accion": "activar_paso", "escenario": "cliente_nuevo", "atencion_id": "AT-90211", "paso": "creacion_cliente" }`
- **Existente sin nada vigente (re-estudio)** → igual, con `"escenario": "re_estudio"` y `"datos": { …cliente para precargar… }`
- **Solicitud abierta (retomar)** → `{ "accion": "abrir_solicitud", "escenario": "retomar_solicitud", "solicitud_id": 1049, "paso_actual": "firma_token" }`
- **Final informativo** (cupo activo · mora · cierre reciente · expirada) → `{ "accion": "mostrar_resultado", "escenario": "cupo_activo", "resultado": { "tono": "exito", "titulo": "Cupo ya activo", "mensaje": "…", "monto": 2500000 } }`
- **Proceso exprés** (desbloqueo · reactivación) → `{ "accion": "iniciar_proceso", "escenario": "desbloqueo", "atencion_id": "AT-90214", "proceso": { "tipo": "desbloqueo", "monto_a_recuperar": 2500000, "requiere_validacion_previa": false } }`
- **Documento mal formado** → error estándar, sin crear atención.

**Por qué el front necesita cada campo**
- `accion` — es el **switch principal** de la pantalla de atención: decide cuál de las 4 rutas ejecutar (activar paso, abrir solicitud, pintar tarjeta final, arrancar mini-flujo). Sin él, el front tendría que interpretar negocio.
- `escenario` — **no se usa para decidir**: viaja a bitácora, sucesos y reportes (trazabilidad de qué pasó con cada consulta).
- `atencion_id` — lo guarda en memoria y **lo repite en toda llamada siguiente** (fotos, OCR, cliente, token, exprés); es lo que permite al back correlacionar la secuencia y darle traza a las atenciones que no crean solicitud.
- `paso` — qué paso del stepper queda activo al abrir el detalle.
- `datos` (re_estudio) — precarga el formulario para que el asesor solo verifique/corrija, sin re-digitar.
- `solicitud_id` + `paso_actual` (retomar) — con qué id pedir el estado completo (C-10) y en qué paso posicionar el stepper.
- `resultado.tono / titulo / mensaje` — la tarjeta final se pinta **tal cual**: color por tono, título y texto vienen del back (el front nunca redacta mensajes de negocio).
- `resultado.monto` — mostrar el disponible al informar «cupo ya activo» (pendiente confirmar visibilidad — duda D2).
- `proceso.tipo` — cuál mini-flujo montar (desbloqueo o reactivación).
- `proceso.monto_a_recuperar` — se muestra en la tarjeta de inicio del exprés («tu cupo de $2.500.000…»).
- `proceso.requiere_validacion_previa` — si es `true`, el front muestra primero el loader de validación simplificada antes del token.

---

## Sesión 2 — C-03 · Creación del cliente y C-04 · Gestión y asesor

### C-03.A · `POST /api/atencion/{atencion_id}/foto-documento`   *(Web #15/#16)*
**Request:** multipart `imagen` + `{ "cara": "frontal" | "reverso" }`
**Flujo:** almacena la imagen, evalúa legibilidad.
**Respuestas:** `{ "foto_id": "F-771", "legible": true }` · ilegible → `{ "foto_id": null, "legible": false, "mensaje": "Vuelve a tomar la foto" }`

**Por qué el front necesita cada campo**
- `foto_id` — referencia para pedir el OCR (C-03.B) **sin re-subir la imagen**, y para marcar la cara como «cargada» en la pantalla de 2 caras.
- `legible` — habilita el botón «Procesar con OCR» (solo con ambas caras legibles) o dispara la re-toma.
- `mensaje` — el texto del aviso de re-toma, tal cual.

### C-03.B · `POST /api/atencion/{atencion_id}/ocr` → `GET /api/atencion/{atencion_id}/ocr`
**Request (POST):** `{ "foto_frontal_id": "F-771", "foto_reverso_id": "F-772" }`
**Flujo:** lanza la extracción (asíncrona corta); el GET consulta el resultado.
**Respuestas (GET):** `{ "estado": "procesando" }` · `{ "estado": "finalizado", "datos": { numero_documento, nombres, apellidos, fecha_nacimiento, lugar_nacimiento{dane,ciudad,departamento}, fecha_expedicion, lugar_expedicion{…} } }` · `{ "estado": "fallido", "mensaje": "…" }`

**Por qué el front necesita cada campo**
- `estado` — mantener el loader «Obteniendo datos de la imagen…» o resolverlo.
- `datos.*` — **precargar el formulario del paso 2**: nombres y fechas en sus campos, y los lugares ya resueltos a código DANE para dejar los selectores de departamento/ciudad posicionados (el asesor verifica, no digita).
- `mensaje` (fallido) — aviso al asesor + ofrecer reintento de fotos o paso a captura manual.

### C-03.C · `POST /api/solicitud/validar-contacto`   *(Web #5 — compartido)*
**Request:** `{ "celular": "3145678901", "correo": "maria@gmail.com", "numero_documento": "1098765432" }`
**Flujo:** valida formato y que no estén asociados a **otro** cliente con cupo o solicitud activa.
**Respuestas:** `{ "celular": { "disponible": true }, "correo": { "disponible": false, "motivo": "asociado_a_otro_cliente" } }`

**Por qué el front necesita cada campo**
- `celular.disponible` / `correo.disponible` — pintar el ✓/✗ **por campo** y bloquear «Continuar» si alguno falla (el asesor sabe exactamente cuál corregir).
- `motivo` — el texto junto al ✗; viene del back para no inventar causas en el front.

### C-03.D · `PUT /api/atencion/{atencion_id}/cliente`   *(Web #6)*
**Request:** `{ "cliente": { numero_documento, nombres, apellidos, fecha_nacimiento, lugar_nacimiento_dane, fecha_expedicion, lugar_expedicion_dane, celular, correo } }`
**Flujo:** crea o actualiza el cliente; si la atención ya tenía firma, la invalida.
**Respuestas:** `{ "cliente_id": 88231, "resultado": "creado", "firma_invalidada": false }`

**Por qué el front necesita cada campo**
- `cliente_id` — referencia del cliente para el panel lateral y llamadas posteriores.
- `resultado` — el toast de confirmación correcto («cliente creado» vs «datos actualizados»).
- `firma_invalidada` — si es `true`, el front **regresa el flujo al paso 4** (re-token) y lo avisa; es la señal de que la edición ocurrió después de la firma.

### C-04.A · `POST /api/atencion/{atencion_id}/tipo-gestion`
**Request:** `{ "tipo": "asistida" | "autogestion" }`
**Respuestas:** asistida → `{ "ok": true }` · autogestión → `{ "estado": "EN_AUTOGESTION", "enlace_enviado": true, "canal": "whatsapp" }`

**Por qué el front necesita cada campo**
- `estado` — cambia el badge de la gestión a «En autogestión» y **cierra la pantalla en tienda** (la gestión sigue en el celular del cliente).
- `enlace_enviado` / `canal` — la tarjeta de confirmación «enlace enviado por WhatsApp» (el front no envía nada; solo informa lo que el back hizo).

### C-04.B · `GET /api/asesores/{codigo}`
**Respuestas:** `{ "valido": true, "nombre": "Carlos Mejía" }` · `{ "valido": false, "intentos_restantes": 2 }`

**Por qué el front necesita cada campo**
- `valido` / `nombre` — pintar el ✓ con el **nombre** junto al código (confirmación visual de que es el asesor correcto).
- `intentos_restantes` — mensaje de reintento; al llegar a 0 el back aplica el default 100100 y el front solo lo refleja.

### C-04.C · `POST /api/asesores/{codigo}/validar-rostro`
**Request:** `{ "selfie_id": "F-780" }` → **Respuestas:** `{ "resultado": "exitosa" }` · `{ "resultado": "fallida", "intentos_restantes": 1 }`

**Por qué el front necesita cada campo**
- `resultado` — desbloquear el botón «Continuar» del paso 3 (la facial es obligatoria).
- `intentos_restantes` — mensaje de reintento del modal de cámara.

---

## Sesión 3 — C-05 · Token de firma y C-06 · Estudio

### C-05.A · `POST /api/atencion/{atencion_id}/token-firma/enviar`   *(Web #7)*
**Request:** `{ "canal": "sms" }`
**Respuesta:** `{ "enviado": true, "token_id": "TK-1", "expira_en": 300, "canales_usados": ["sms"], "whatsapp_habilitado": false }`

**Por qué el front necesita cada campo**
- `token_id` — referencia para validar (C-05.B) y reenviar (C-05.A2).
- `expira_en` — cronómetro/aviso de expiración junto a las casillas OTP.
- `canales_usados` — el historial de envíos visible en pantalla («Token → SMS · 2:31 p.m.»).
- `whatsapp_habilitado` — habilitar o no el botón WhatsApp. **La regla de escalonamiento la calcula el back**; el front obedece el flag — así la política puede cambiar sin tocar pantalla.

### C-05.A2 · `POST /api/atencion/{atencion_id}/token-firma/reenviar`   *(Web #8)*
**Request:** `{ "token_id": "TK-1", "canal": "sms" | "ivr" | "whatsapp" }`
**Respuestas:** `{ "enviado": true, "canal_usado": "ivr", "whatsapp_habilitado": true }` · canal no habilitado → error estándar.

**Por qué el front necesita cada campo:** `canal_usado` alimenta el historial de envíos · `whatsapp_habilitado` refresca el botón tras cada reenvío.

> **Nota — la re-firma no tiene endpoint propio.** El evento lo dispara **C-03.D (guardar cliente)**: si la edición ocurre después de la firma, el back invalida la firma, limpia los envíos y responde `firma_invalidada: true`; el front regresa al paso 4 y reutiliza C-05.A / A2 / B. En la re-firma, **C-05.B no crea otra solicitud** — registra la nueva firma sobre la solicitud existente y el estado vuelve a `EN_PROCESO`.

### C-05.B · `POST /api/atencion/{atencion_id}/token-firma/validar`   *(Web #9)*
**Request:** `{ "token_id": "TK-1", "codigo": "472918" }`
**Respuestas:** válido → `{ "valido": true, "solicitud_id": 1049, "estado": "EN_PROCESO" }` · inválido → `{ "valido": false, "intentos_restantes": 2 }`

**Por qué el front necesita cada campo**
- `valido` — avanzar al paso 5 o mostrar el error en las casillas.
- `solicitud_id` — **el momento en que aparece el número #**: pestaña, título y fila de la Mesa lo pintan, y desde aquí reemplaza al `atencion_id` en todas las llamadas siguientes.
- `estado` — el badge pasa a «En proceso».
- `intentos_restantes` — mensaje de reintento; al agotar, el back pausa la gestión y el front lo refleja vía sondeo.

### C-06.A · `POST /api/solicitud/{solicitud_id}/estudio/iniciar`   *(Web #12)*
**Respuesta:** `{ "proceso_id": "EST-5540", "sub_etapa": "validaciones_iniciales" }`
*(Si el dueño decide arranque automático — duda D12 — esta ruta la invoca el propio back al validar el token.)*

**Por qué el front necesita cada campo:** `proceso_id` correlaciona las consultas de avance · `sub_etapa` es el primer texto del loader.

### C-06.B · `GET /api/solicitud/{solicitud_id}/estudio`
**Flujo:** expone la sub-etapa (`validaciones_iniciales → viabilidad → validacion_contacto → asignacion_cupo → finalizado`) sin detalle interno. Absorbe los equivalentes Web de FOSYGA (#14) y UBICA (#20).
**Escenarios de respuesta**
- En curso → `{ "sub_etapa": "asignacion_cupo", "finalizado": false, "habilita_paralelo": ["direccion", "identidad"] }`
- Requiere llamada → `{ "finalizado": false, "resultado_parcial": "requiere_llamada", "mensaje_asesor": "Pídale al cliente estar pendiente de la llamada" }`
- Viable → `{ "finalizado": true, "resultado": "viable_con_cupo", "cupo_preaprobado": 1200000 }`
- Cierres (14/15/16) → `{ "finalizado": true, "resultado": "no_viable_antecedentes" | "no_viable_centrales" | "no_aplica_cupo", "instruccion": { "accion": "mostrar_resultado", "tono": "negativo", "titulo": "…", "mensaje": "…" } }`

**Por qué el front necesita cada campo**
- `sub_etapa` — qué loader/texto se muestra («validando viabilidad» / «validando contacto» / «asignando cupo»); el asesor ve avance sin ver mecánica.
- `finalizado` — cortar el sondeo de este proceso y resolver la pantalla.
- `habilita_paralelo` — habilitar los pasos 6 y 7 **sin esperar** a que el estudio termine (el paralelismo del escenario 1). El back decide cuándo; el front obedece.
- `resultado_parcial` + `mensaje_asesor` — el banner ámbar de la llamada con el guion exacto que el asesor le dice al cliente.
- `resultado` / `cupo_preaprobado` — la tarjeta «viable» y el monto en el panel Crédito.
- `instruccion` (cierres) — la tarjeta de cierre se pinta tal cual: el front no sabe qué es «Preselecta», solo pinta tono+título+mensaje.

---

## Sesión 4 — C-07 · Dirección, C-08 · Identidad y C-09 · Activación

### C-07 · `PUT /api/solicitud/{solicitud_id}/direccion`   *(Web #13)*
**Request:** `{ "departamento_dane": "05", "ciudad_dane": "05001", "direccion": "Cra 43A # 18-95 Apto 502" }`
**Respuesta:** `{ "guardada": true }`

**Por qué el front necesita el campo:** `guardada` marca el paso 6 con ✓ y actualiza la dirección en el panel lateral. Editable siempre sin re-token.

### C-08.A · `POST /api/solicitud/{solicitud_id}/foto-documento`
Igual que C-03.A (solo si las fotos no vienen del OCR; si hay almacenadas vigentes se reutilizan y el front las muestra como «cargada»).

### C-08.B · `POST /api/solicitud/{solicitud_id}/prueba-vida/iniciar`   *(Web #17)*
**Request:** `{ "modo": "tienda" }` → **Respuesta:** `{ "sesion_id": "BIO-112", "configuracion": { … } }`

**Por qué el front necesita cada campo:** `sesion_id` correlaciona la captura con su veredicto (C-08.D/E) · `configuracion` son los parámetros que el componente de cámara necesita para iniciar la sesión de gestos.

### C-08.C · `POST /api/solicitud/{solicitud_id}/prueba-vida/enlace`
**Respuesta:** `{ "enlace_enviado": true, "canal": "whatsapp", "estado": "PENDIENTE_CLIENTE" }`

**Por qué el front necesita cada campo:** `enlace_enviado`/`canal` pintan la tarjeta «enlace enviado al celular» · `estado` pone el banner de espera («el cliente completa desde su celular») y el sondeo avisará cuando termine.

### C-08.D · `POST /api/solicitud/{solicitud_id}/prueba-vida/completar`   *(Web #18)*
**Request:** `{ "sesion_id": "BIO-112", "resultado_captura": { … } }` → **Respuesta:** `{ "recibido": true }`

**Por qué el front necesita el campo:** `recibido` pasa la pantalla a «procesando» — el veredicto NUNCA llega aquí (llega por C-08.E), para que la captura y la decisión estén desacopladas.

### C-08.E · `GET /api/solicitud/{solicitud_id}/verificacion-identidad`   *(Web #19/#28)*
**Escenarios de respuesta**
- Verificada → `{ "estado": "verificada" }`
- En revisión (fábrica) → `{ "estado": "en_revision", "solicitud_estado": "ESCALADO_FABRICA" }`
- Datos corregidos (nombre difiere) → `{ "estado": "datos_corregidos", "reevaluacion": "en_proceso", "mensaje_asesor": "Datos actualizados desde el documento — re-evaluando" }`
- Cierre por fraude → `{ "estado": "cerrada", "instruccion": { "accion": "mostrar_resultado", "tono": "negativo", "titulo": "Fraude / inconsistencia", "mensaje": "…" } }`
- Devuelta por fábrica (freno) → `{ "estado": "devuelto_por_fabrica", "motivo_rechazo": "Documento ilegible — solicitar nueva captura" }`

**Por qué el front necesita cada campo**
- `estado` — decide **cuál de las 5 pantallas** del paso 7 se muestra; es el único dato de decisión visual.
- `solicitud_estado` — actualiza el badge global y la fila de la Mesa (escalado cuenta en «Escalados»).
- `reevaluacion` + `mensaje_asesor` — el aviso transparente del caso «nombre difiere» (el sistema corrigió y está re-evaluando).
- `instruccion` — la tarjeta de cierre por fraude, tal cual del back (el front no conoce los controles antifraude).
- `motivo_rechazo` — **el único caso donde un motivo sí se muestra**: el freno de fábrica lo necesita para guiar el reintento («documento ilegible → nueva captura»). Todo lo demás viaja sin motivos.

### C-09.A · `POST /api/solicitud/{solicitud_id}/token-correo/enviar`   *(Web #21)*
**Respuesta:** `{ "enviado": true, "token_id": "TK-9", "correo_ofuscado": "m***a@gmail.com", "expira_en": 600 }`

**Por qué el front necesita cada campo:** `token_id` para validar/reenviar · `correo_ofuscado` muestra a qué correo llegó **sin exponerlo completo** en la pantalla de tienda · `expira_en` para el cronómetro.

### C-09.A2 · `POST /api/solicitud/{solicitud_id}/token-correo/reenviar`
**Request:** `{ "token_id": "TK-9" }` → **Respuesta:** `{ "enviado": true }` — alimenta el historial de reenvíos; el límite lo controla el back.

### C-09.B · `POST /api/solicitud/{solicitud_id}/token-correo/validar`   *(Web #22/#23)*
**Request:** `{ "token_id": "TK-9", "codigo": "835172" }`
**Respuestas:** válido → `{ "valido": true, "estado": "APROBADO", "cupo": 1200000, "notificacion_cliente": { "canales": ["sms","correo"], "plantilla": "cupo_activado" } }` · inválido → `{ "valido": false, "intentos_restantes": 2 }` · fuera de tiempo → estado `PENDIENTE_CLIENTE`.

**Por qué el front necesita cada campo**
- `valido` / `intentos_restantes` — avanzar o mostrar reintento.
- `estado` — el badge final «Aprobado» en detalle y Mesa.
- `cupo` — **el monto grande** de la pantalla de cierre («Cupo aprobado $1.200.000»).
- `notificacion_cliente` — la línea «notificado por SMS y correo» de la tarjeta final y el registro en bitácora — el front informa lo que el back envió, no envía nada.

### C-09.C · `PUT /api/solicitud/{solicitud_id}/correo`
**Request:** `{ "correo_nuevo": "otra@correo.com" }`
**Respuestas:** reemplaza un correo OK-UBICA → `{ "resultado": "requiere_revision", "solicitud_estado": "ESCALADO_FABRICA" }` · si no → `{ "actualizado": true, "reejecutar_verificacion": true }`

**Por qué el front necesita cada campo:** `resultado`/`solicitud_estado` → banner de fábrica si el cambio es sospechoso (el front no sabe por qué — regla UBICA interna) · `reejecutar_verificacion` → aviso de que la verificación corre de nuevo y el paso vuelve a esperar.

---

## Sesión 5 — C-10 · Estado completo y C-11 · Sondeo

### C-10 · `GET /api/solicitud/{solicitud_id}`   *(Web #27, ampliado)*
**Respuesta (resumida):** `{ solicitud_id, estado, paso_actual, procesos: […], cliente: {…}, resultados: {…}, soportes: […], sucesos: […] }`

**Por qué el front necesita cada bloque** — cada uno alimenta una zona fija de la pantalla; con esto el detalle se repinta tal cual quedó sin reconstruir nada:
- `estado` + `paso_actual` — badge global y posición del stepper (dónde quedó el flujo).
- `procesos` — repintar los loaders de lo que sigue corriendo (estudio en «asignación de cupo», identidad «en revisión»).
- `cliente` — el panel lateral **Cliente** (documento, nombre, contacto, dirección).
- `resultados` — el panel **Crédito** (viabilidad, contacto, cupo preaprobado).
- `soportes` — el panel **Soportes** con el estado de cada uno (cargada · en revisión) — nunca el veredicto.
- `sucesos` — el drawer de **bitácora** completo, en orden.

### C-11 · `POST /api/solicitudes/cambios`
**Request:** `{ "solicitudes": [1049, 1046], "desde": "2026-07-26T14:30:00Z" }` — o `{ "filtros": {…}, "desde": … }` cuando lo abierto es la Mesa.
**Respuesta:** `{ "marca": "…", "cambios": [ { "solicitud_id": 1049, "estado": "EN_PROCESO", "sub_etapa": "finalizado", "requiere_intervencion": true, "turno": "asesor", "procesos_terminados": [ { "tipo": "estudio", "resultado": "viable_con_cupo", "cupo_preaprobado": 1200000 } ] } ] }` · sin cambios → `{ "marca": "…", "cambios": [] }`

**Por qué el front necesita cada campo**
- `marca` — el **cursor**: se guarda y se envía en la siguiente consulta; así el back devuelve solo lo nuevo y el sondeo es liviano.
- `cambios[].estado` / `sub_etapa` — repintar badge y loaders **sin recargar** ni parpadear.
- `requiere_intervencion` + `turno` — resaltar la fila/pestaña que necesita al asesor y pintar el banner de turno correcto (¿actúa el asesor, el cliente o el sistema?).
- `procesos_terminados` — el **avance automático**: cuando llega el estudio terminado con su resultado, el paso avanza solo y muestra la tarjeta correspondiente — la experiencia central del estado en vivo.

---

## Fase 2 — C-12 · Desbloqueo y C-13 · Reactivación *(se ratifican en su propia sesión)*

### C-12.A · `POST /api/atencion/{atencion_id}/desbloqueo/iniciar` → `{ "proceso_id": "DES-71", "sub_etapa": "validacion_simplificada" }`
### C-12.B · `GET /api/atencion/{atencion_id}/desbloqueo`
Supera → `{ "sub_etapa": "prueba_de_vida", "supera_validacion": true }` · no supera → `{ "finalizado": true, "resultado": "no_viable_antecedentes" }` · final → `{ "finalizado": true, "resultado": "desbloqueado", "cupo_disponible": 2500000, "notificacion_cliente": {…} }`
### C-12.C · Prueba de vida: reusa C-08.B/D con `atencion_id` (solo liveness, contra la selfie almacenada).

**Por qué el front necesita cada campo:** `proceso_id`/`sub_etapa` → el loader del mini-flujo · `supera_validacion` → pasar de «validando» a la pantalla de prueba de vida · `resultado` → cuál tarjeta final (verde desbloqueado · roja no viable · ámbar fábrica) · `cupo_disponible` → el monto de la tarjeta verde · `notificacion_cliente` → constancia en bitácora de lo enviado al cliente.

### C-13.A · `POST /api/atencion/{atencion_id}/reactivacion/iniciar`   *(Web #29)* → `{ "token_enviado": true, "token_id": "TK-5", "celular_ofuscado": "***8901", "requiere_validacion_previa": false }`
### C-13.A2 · `POST /api/atencion/{atencion_id}/reactivacion/token/reenviar` — `{ "token_id": "TK-5", "canal": "sms" | "ivr" | "whatsapp" }` (misma regla de canales).
### C-13.B · `POST /api/atencion/{atencion_id}/reactivacion/token/validar`   *(Web #30)* — válido → prueba de vida · inválido → `{ "valido": false, "estado": "PENDIENTE_CLIENTE_PREVIO", "permite_reintento": true }`
### C-13.C · Prueba de vida: reusa C-08.B/D · final → `{ "finalizado": true, "resultado": "reactivado", "cupo_disponible": 2500000, "notificacion_cliente": {…} }`

**Por qué el front necesita cada campo:** `token_enviado`/`celular_ofuscado` → tarjeta «token enviado al ••• 8901» sin exponer el número · `requiere_validacion_previa` → mostrar primero el loader de validación simplificada · `estado` PENDIENTE_CLIENTE_PREVIO + `permite_reintento` → la pantalla de token inválido con botón de reintento · `resultado`/`cupo_disponible` → la tarjeta final.

---

## Fase 3 — C-01 · Mesa *(se ratifica en su propia sesión)*

### C-01 · `GET /api/solicitudes?estado=&desde=&hasta=&busqueda=&pagina=1&tamano=10`
**Respuesta:** `{ "total": 47, "contadores": { total, pendientes, aprobados, rechazados, escalados }, "filas": [ { solicitud_id, cliente, documento, estado, fase, paso, espera_minutos, asesor, cupo_preaprobado, ultima_actividad } ] }`

**Por qué el front necesita cada campo:** `total` → el paginador («Mostrando 1–10 de 47») · `contadores` → las 5 tarjetas de arriba (y deben cuadrar con las filas) · `filas[]` → una a una las 8 columnas de la tabla: `estado`→badge, `fase`/`paso`→columna Fase/Paso, `espera_minutos`→el semáforo de espera, `cupo_preaprobado`→columna de monto, `ultima_actividad`→ordenamiento y columna final.

---

## Decisiones multicanal que las sesiones deben cerrar

1. **Cuándo nace la solicitud:** el backlog Web crea `solicitud_id` al registrar datos básicos (#6) y el tercero al validar token (#9); este documento propone `atencion_id` pre-firma y solicitud al validar (C-05.B). **Unificar un solo modelo para ambos canales.**
2. **Taxonomía única de escenarios:** `identificar` Web devuelve `nuevo, conocido, rechazado_recientemente, activo, cupo_activo, cartera_morosa, reactivacion, reingreso_reciente`; Tienda usa `cliente_nuevo, re_estudio, cierre_reciente, retomar_solicitud, cupo_activo, no_aplica_mora, reactivacion, desbloqueo, expirada`. Mapear y quedarse con una.
3. **Desbloqueo en Web:** el canal Web no contempla el escenario de cupo bloqueado por inactividad — ¿aplica también allá?
4. **Nombre del canal IVR:** Web lo llama `llamada`, Tienda `ivr` — unificar el literal.
