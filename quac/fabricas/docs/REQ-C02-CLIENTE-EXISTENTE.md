# REQ — C-02 «Identificación del cliente»: escenarios de cliente existente

**Proyecto:** Fábricas de Crédito QUAC · Canal Tienda
**Fuentes:** [FLUJO_CREDITOS_V3 (Google Docs)](https://docs.google.com/document/d/18o5XI5pJ5LQj52SwtOO8sTaZC0Ipg99JwPWhFKxy9U0/edit) — bloques 1 y 2 · diagrama Miro «Bloque 2 — Validación de cupo» · [simulador de escenarios 1–17](https://digital-baguer.github.io/prototipos/quac/fabricas/prototipo-mesa-solicitudes.html)
**Presentación a stakeholders:** [escenarios de cliente existente — E0–E7](https://digital-baguer.github.io/prototipos/quac/fabricas/escenarios-cliente-existente.html) (un diagrama por escenario, con guion del asesor, notificaciones y puntero al PDF)
**Fecha:** 2026-07-26 · **Estado:** pendiente validar las dudas de la §7 con el dueño del requerimiento

---

## 1. La idea central

Hoy el contrato C-02 dice: *«documento → cliente_nuevo / cliente_existe / caso_especial»*. Eso se queda corto: cuando el cliente existe, el back debe ejecutar **todo el árbol del bloque 2 (Validación de cupo)** y devolverle al front **un escenario de entrada** que le diga exactamente qué pantalla pintar.

Regla de caja negra, afinada: **el front no interpreta reglas de negocio** — no "sabe" qué es mora, cupo activo o mora histórica. El back recorre el árbol y le devuelve al front una **instrucción de presentación**: qué paso activar, o qué tarjeta mostrar al asesor (tono, título, mensaje) para que le comente al cliente, y qué notificación se le envió al cliente por canal (SMS / WhatsApp / correo). Toda la lógica de cupo/mora/bloqueos/estudios vive en el back. Los códigos de escenario de §2 son **vocabulario entre negocio y back** para especificar y trazar — no llegan al front como algo que deba interpretar.

**Punto de entrada — la evaluación vive FUERA del árbol de pasos.** En la Mesa, la acción del asesor es **Atender cliente** y abre una **pantalla de atención propia** (documento + consultar), sin stepper ni panel de solicitud. Ahí ocurre la clasificación, y según el resultado: los finales (E1, E2, E6) y los flujos exprés (E3, E4) **transcurren completos en esa pantalla**; el detalle de la solicitud —con su árbol de pasos— **solo se abre cuando la solicitud existe o va a crearse** (crear en E0/E7 con la identificación ya resuelta como primer paso hecho; retomar en E5 en el paso exacto). Nunca se muestra un esqueleto de pasos deshabilitados que no aplican al escenario. La solicitud nace en el paso 4 (firma con token) y únicamente en E0/E7.

Separación clave (propuesta): C-02 responde **rápido y solo con datos internos** (cupo, mora, solicitudes, soportes almacenados, cambios de datos). Las validaciones **lentas o costosas** (antecedentes / reportes negativos = «validación simplificada», que consulta centrales) **no se resuelven dentro de C-02**: C-02 devuelve el escenario candidato y la validación corre como proceso aparte con espera visible (mismo patrón asíncrono del paso 5 + sondeo C-11).

---

## 2. Los escenarios que C-02 puede devolver

| # | Código | Cuándo aplica (condición de negocio) | Qué pinta el front | ¿Crea solicitud? |
|---|---|---|---|---|
| 1 | `cliente_nuevo` | El documento no existe | Paso 2 · Creación del cliente | Sí (nace en paso 4) |
| 2 | `retomar_solicitud` | Existe una solicitud **abierta** (en curso / pausada / en fábrica / autogestión) | «Solicitud recuperada» → retorna al **punto exacto**, mismo ID | No — reutiliza la existente |
| 3 | `cierre_reciente` | Estudio < 90 días **cerrado** con estado que **no permite retomar** | «No puede aplicar por ahora» + estado final previo | No |
| 4 | `cupo_activo` | Tiene cupo y **no está bloqueado** | «Cupo ya activo» — fin, informar que puede comprar | No |
| 5 | `no_aplica_mora` | Cupo bloqueado + **mora vigente** | «No aplica por mora» — fin | No |
| 6 | `desbloqueo` | Cupo bloqueado **por inactividad**, sin mora, **docs+selfie vigentes**, **sin cambio de celular/correo** | Mini-flujo: validación simplificada → prueba de vida → Desbloqueado / fábrica / no viable | Duda D7 |
| 7 | `reactivacion` | **Sin cupo**, eliminado hace ≤ X días, **datos sin cambios**. Flag `requiere_validacion_previa` = true si tuvo mora histórica > Y días | Mini-flujo: (validación simplificada si aplica) → token identidad → prueba de vida → Reactivado / pendiente / fábrica | Duda D7 |
| 8 | `re_estudio` | Cualquier camino que el árbol manda a «validar estudio vigente» y **no hay estudio < 90 días**: bloqueado por otra causa, sin docs/selfie, cambió contacto, cupo eliminado hace > X días, datos cambiaron, nunca tuvo cupo | «Verificar y actualizar datos» → continúa el flujo completo de 8 pasos | Sí (nace en paso 4) |
| 9 | `expirada` | Gestión pausada que **no se retomó dentro de los 90 días** | «Gestión expirada» — no se recupera; se ofrece iniciar una solicitud nueva desde cero | No (la nueva sí, si el cliente acepta) |

> **Nota sobre `cupo_activo`:** significa que la persona llegó a pedir cupo pero **ya tiene uno utilizable**. La consulta termina ahí, **sin crear ninguna solicitud**: el asesor solo le informa que puede pagar en caja con su cupo QUAC (idealmente mostrando el disponible — duda D2).

Los códigos como **Desbloqueado, Reactivado, No viable antecedentes, Pendiente cliente previo, En fábrica de soporte** NO son escenarios de C-02: son **resultados de los mini-flujos** 6 y 7.

---

## 3. La lógica del servicio, aterrizada (orden de evaluación)

El árbol del PDF, normalizado a reglas en orden. La primera que aplica gana:

```
R1  ¿Existe solicitud ABIERTA (no cerrada) para el documento?
      → retomar_solicitud (id + paso exacto)            [ver divergencia §6.1]

R1b ¿Hay una gestión pausada SIN retomar en 90 días?
      → expirada (no se recupera; ofrecer iniciar de nuevo)

R2  ¿Tiene cupo?
  R2a  No bloqueado                      → cupo_activo (fin)
  R2b  Bloqueado y con mora vigente      → no_aplica_mora (fin)
  R2c  Bloqueado por inactividad, sin mora,
       docs+selfie vigentes, sin cambio de celular/correo
                                         → desbloqueo (candidato)
  R2d  Bloqueado (otra causa / sin soportes / cambió contacto)
                                         → sigue a R4

R3  No tiene cupo: ¿fue eliminado hace ≤ X días y los datos NO cambiaron?
  R3a  Sin mora histórica > Y días       → reactivacion (directa)
  R3b  Con mora histórica > Y días       → reactivacion (requiere_validacion_previa)
  R3c  Eliminado hace > X días, o datos cambiaron, o nunca tuvo cupo
                                         → sigue a R4

R4  ¿Existe estudio en los últimos 90 días?
  R4a  Sí, cerrado y NO permite retomar  → cierre_reciente (estado final previo)
  R4b  Sí y permite retomar              → retomar_solicitud (cubierto por R1)
  R4c  No                                → re_estudio (bloque 3, flujo completo)
```

El PDF repite tres veces el patrón «¿datos cambiaron? → validar estudio vigente» y dos veces la validación simplificada; estas reglas lo normalizan: **cualquier cambio de datos degrada el caso a R4** y **la validación simplificada es un proceso único reutilizado** por desbloqueo y reactivación.

### Mini-flujo `desbloqueo` (resultado, no escenario)
1. Validación simplificada (antecedentes + reportes) — **asíncrona**, el asesor ve «validando», nunca el detalle.
   - No supera → **No viable antecedentes** (fin).
2. Prueba de vida (contra la selfie almacenada). **Reutiliza el componente del paso 7** (modal de cámara con gestos; enlace WhatsApp por confirmar — D9), pero **no activa el paso 7**: no existe solicitud ni árbol de 8 pasos. Es solo la prueba de vida, sin captura de documento — tener docs+selfie almacenados es condición de entrada al escenario.
   - Supera → **Desbloqueado** (cupo disponible de inmediato, sin nuevo estudio).
   - No supera → **En fábrica de soporte**.

### Mini-flujo `reactivacion`
0. Si `requiere_validacion_previa`: validación simplificada → no supera = **No viable antecedentes**.
1. Token de identidad al celular registrado. **El envío no es automático**: la pantalla lo ofrece, el asesor le informa al cliente e inicia el envío. **Reutiliza la pantalla de token del paso 4** (casillas OTP, reenvíos), pero **no activa el paso 4**: no existe solicitud. La semántica difiere — el token del paso 4 firma los T&C; este valida identidad (si además refresca la aceptación de T&C → D8). *(Contraste: en `retomar_solicitud` sí se cae en el paso 4 real, porque la solicitud existe.)*
   - Inválido → **Pendiente cliente previo** (reintento según política).
2. Prueba de vida.
   - Supera → **Reactivado**. · No supera → **En fábrica de soporte**.

---

## 4. Contrato C-02 ampliado (dato → dato)

**El front envía:** tipo y número de documento.
**El back devuelve una instrucción de presentación** — el front la ejecuta sin interpretar negocio:

| `accion` | Qué hace el front | Datos que acompañan | Escenarios que la usan |
|---|---|---|---|
| `activar_paso` | Habilita el paso indicado del flujo de 8 pasos | Paso a activar + datos del cliente para precargar | E0 `cliente_nuevo` · E7 `re_estudio` |
| `abrir_solicitud` | Abre la solicitud existente en el punto exacto | Id, paso/fase, todo lo capturado | E5 `retomar_solicitud` |
| `mostrar_resultado` | Pinta una tarjeta final y no activa pasos | Tono (éxito/negativo), título, mensaje para el asesor, monto opcional | E1 `cupo_activo` · E2 `no_aplica_mora` · E6 `cierre_reciente` · `expirada` |
| `iniciar_proceso` | Arranca un mini-flujo exprés con sus propias pantallas | Tipo (desbloqueo/reactivación), monto a recuperar, flags (`requiere_validacion_previa`) | E3 `desbloqueo` · E4 `reactivacion` |

Además, en toda respuesta:
- `atencion_id`: el **id de la sesión de atención** (la pre-solicitud). Su finalidad principal es darle **traza a las atenciones que no crean solicitud** — sin él, los finales informativos y los flujos exprés serían invisibles para bitácora e indicadores. El front no lo interpreta: lo repite en cada llamada siguiente; al validar el token del paso 4 se convierte en `solicitud_id`.
- `notificacion_cliente`: canal + plantilla de lo que se le envió (o se enviará) al cliente, si aplica — ver D10.
- `escenario`: el código de §2 viaja **solo como trazabilidad** (bitácora, sucesos, reportes), no para que el front decida con él.

Los mini-flujos E3 y E4 necesitan **sus propios servicios** (iniciar, verificar token, registrar prueba de vida, consultar avance — asíncrono con sondeo). Propuesta: acordarlos como **C-12 (desbloqueo)** y **C-13 (reactivación)** al confirmar la definición de contratos de servicios — nombres a confirmar con el back.

---

## 5. Cómo se ve cada escenario en el mockup

> Todos los escenarios parten de la **pantalla de atención** (botón «Atender cliente» en la Mesa): consulta del documento sin árbol de pasos. La columna «Recorrido» indica si el escenario se resuelve ahí mismo o abre el detalle de la solicitud.

| Escenario | Escenario del prototipo | Recorrido |
|---|---|---|
| `cliente_nuevo` | 1 · Flujo feliz | Los 8 pasos completos |
| `re_estudio` | 2 · Existente → nuevo estudio | «Verificar y actualizar datos» → flujo completo |
| `cierre_reciente` | 3 · Cierre reciente | «No puede aplicar por ahora» → fin |
| `retomar_solicitud` | 6 · Se va sin tokenizar (retoma) | «Solicitud recuperada» → retoma en el paso exacto |
| `cupo_activo` | 10 · Cupo ya activo | Resultado verde con el disponible → fin sin solicitud |
| `no_aplica_mora` | 11 · No aplica por mora | Resultado rojo, sin detalle de mora en tienda → fin |
| `desbloqueo` | 12 · Desbloqueo de cupo | Info → validación simplificada (loader + simular supera/no supera) → prueba de vida → Desbloqueado / fábrica / no viable |
| `reactivacion` | 13 · Reactivación de cupo | Info → token OTP (con «token inválido» → Pendiente cliente previo) → prueba de vida → Reactivado / fábrica |
| `expirada` | 17 · Retoma tras 90 días | «Gestión expirada» → iniciar solicitud nueva o finalizar |

---

## 6. Optimizaciones propuestas frente al flujo recibido

**6.1 — La solicitud abierta se revisa PRIMERO (R1).** El flujo recibido solo llega a «validar estudio vigente» por ciertas ramas; una solicitud pausada ayer se detecta tarde. Proponemos evaluarla de primera: si hay una gestión abierta, lo operativamente correcto es retomarla, no re-clasificar el cupo. *Divergencia consciente frente al PDF → duda D1.*

**6.2 — La validación simplificada es asíncrona y única.** Consulta centrales (lenta, con costo). No debe resolverse dentro de la consulta del documento: se lanza como proceso con espera visible y sondeo (patrón del paso 5). Y es **el mismo proceso** para desbloqueo y reactivación-con-mora-histórica.

**6.3 — «Datos cambiaron» como guardia transversal.** En vez de repetir la pregunta en 3 ramas, es una condición que degrada cualquier caso exprés a `re_estudio` (R4). Menos árbol, misma lógica.

---

## 7. Dudas para el dueño del requerimiento

| # | Duda | Impacta |
|---|---|---|
| D1 | ¿Una solicitud **abierta** se retoma antes de validar cupo/mora (R1 primero)? ¿Y si aparece mora estando la solicitud en curso — se cierra, se pausa? | Orden del árbol, C-02 |
| D2 | `cupo_activo`: ¿el asesor puede ver/decir el **monto disponible**? | Pantalla fin, seguridad |
| D3 | El diagrama Miro tiene el nodo **«¿Cupo eliminado por solicitud?»** que el PDF no menciona: ¿qué significa (eliminado a petición del cliente)? ¿A dónde va la rama NO (eliminado por otra causa)? | R3 |
| D4 | Parámetros **X** (días desde eliminación) y **Y** (días de mora histórica): valores y ¿configurables o fijos? Ejemplos de respuesta: «180/60 fijos por política» o «180/60 de arranque, configurables desde el catálogo Reglas de negocio». Recomendación: configurables — el catálogo ya existe en Administración. (El propio PDF lo deja anotado «para validar».) | R3, catálogos |
| D5 | `cierre_reciente`: ¿se informa al cliente **cuándo** podrá volver a intentar (fecha)? ¿Los 90 días corren desde el cierre? | Pantalla, C-02 |
| D6 | Cupo bloqueado por **causa distinta a inactividad** (R2d): ¿siempre va a re-estudio, o hay causas que son fin del proceso (ej. bloqueo por fraude)? | R2d |
| D7 | ¿Desbloqueo y reactivación **crean una gestión visible en la Mesa** (con ID, estados, sucesos) o son procesos sin solicitud? Impacta la Mesa (C-01), el sondeo (C-11) y la trazabilidad. | Mesa, contratos |
| D8 | El **token de reactivación**: ¿es solo identidad o también refresca la aceptación de T&C (como la firma del paso 4)? | Legal, C-13 |
| D9 | Prueba de vida en desbloqueo/reactivación: ¿se compara contra la selfie almacenada? ¿Puede hacerse por enlace WhatsApp como en el paso 7? | C-12/C-13, biometría |
| D10 | **Notificaciones al cliente por canal** en los finales pre-solicitud: ¿cuáles se envían, por qué canal (SMS/WhatsApp/correo) y con qué texto? Hay propuestas por escenario en la [presentación](https://digital-baguer.github.io/prototipos/quac/fabricas/escenarios-cliente-existente.html) (ej.: «Hemos identificado que quieres reactivar tu cupo…», «Tu cupo fue desbloqueado…»). El caso mora es sensible: canal privado y sin cifras. | C-02, mensajería |

**Estados nuevos que estos flujos introducen** (validar contra el catálogo de Estados existente): `Cupo ya activo`, `No aplica por mora`, `Desbloqueado`, `Reactivado`, `No viable antecedentes`, `Pendiente cliente previo`, `Expirada`.

---

## 8. Impacto en el plan

- **C-02 queda con esta taxonomía** — la sesión de «Confirmar definición de contrato de servicios» del C-02 se firma sobre este documento.
- **Contratos C-12 (desbloqueo) y C-13 (reactivación)** — entran en la **Fase 2** del plan (cliente existente), con su definición detallada en el requerimiento de servicios del back.
- **C-11 (sondeo)** debe cubrir la validación simplificada asíncrona.
- **C-01 (Mesa)** depende de D7: si desbloqueo/reactivación aparecen en la Mesa, cambian columnas/estados/contadores.
- **Navegación de la Mesa:** el botón de entrada es **«Atender cliente»** (no «Nueva solicitud») — abre la consulta del documento y no presupone la creación de una solicitud. La atención no muestra número # hasta que la solicitud nace (firma del paso 4).
