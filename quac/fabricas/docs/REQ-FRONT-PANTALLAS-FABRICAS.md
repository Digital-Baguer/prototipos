# Requerimiento para el Front — Pantallas del flujo de solicitud de crédito (Canal Tienda)

**Proyecto:** Fábricas de Crédito QUAC · **Versión:** 1.0 · **Fecha:** 2026-07-26
**Equipo front:** Jhon y Juan
**Criterio de aceptación:** el **simulador de escenarios 1–17** — [ver en línea](https://digital-baguer.github.io/prototipos/quac/fabricas/prototipo-mesa-solicitudes.html). Cada pantalla terminada debe verse y comportarse **tal cual el escenario que la simula**.
**Presentaciones por escenario:** [cliente nuevo — N1–N12](https://digital-baguer.github.io/prototipos/quac/fabricas/escenarios-cliente-nuevo.html) · [cliente existente — E0–E7](https://digital-baguer.github.io/prototipos/quac/fabricas/escenarios-cliente-existente.html).
**Documentos hermanos:** `REQ-BACK-SERVICIOS-FABRICAS.md` (contratos C-01…C-13 con JSON sugeridos) · plan de tareas en Google Sheets (F1/F2/F3, tareas J1-xx · J2-xx · J3-xx).

---

## 1. Principios de trabajo

1. **Mock primero, conexión después.** Toda pantalla se construye en dos hitos: **(M)** maqueta navegable con datos inventados — no depende del back — y **(C)** conexión al servicio real, cambiando solo la fuente de datos. Nadie se bloquea: si el servicio no llegó, el hito queda «Bloqueado por back» con fecha incumplida visible.
2. **El front no interpreta negocio.** Nunca se decide con códigos como `no_aplica_mora`: el back envía **instrucciones de presentación** (qué paso activar, qué tarjeta mostrar con tono/título/mensaje, qué proceso iniciar) y el front las ejecuta. Si un dato no viene en la respuesta, **no se muestra** (seguridad: score, centrales, veredictos y motivos internos jamás llegan — no inventarlos con textos propios).
3. **Todo lo lento es asíncrono.** Estudio, OCR, biometría y validación simplificada devuelven un proceso en curso: la pantalla pinta **loader con sub-etapa** y el avance llega por **sondeo** (C-11) — nunca se bloquea la interfaz esperando una respuesta larga.
4. **La solicitud nace en el paso 4.** Antes de validar el token de firma no existe número #: la pestaña, el título y la fila de la Mesa muestran «Atención de cliente» sin id. Al validar el token aparece el # real.
5. **La evaluación vive fuera del árbol de pasos.** «Atender cliente» abre la **pantalla de atención** (sin stepper); el detalle con los 8 pasos solo se abre cuando la solicitud existe o va a crearse. **Nunca mostrar un esqueleto de pasos que no aplican al escenario.**

## 2. Inventario de pantallas y componentes reutilizables

| Componente | Dónde se usa | Referencia en el simulador |
|---|---|---|
| **Pantalla de atención** (consulta de documento + resultado) | Entrada de todos los escenarios | Botón «Atender cliente» |
| **Detalle de la solicitud** (banner de turno + stepper 8 pasos + panel lateral + sucesos) | Escenarios 1, 2, 4–9, 14–16 | Escenario 1 |
| **Tarjeta de resultado** (tono éxito/negativo/aviso + título + mensaje) | Finales de la atención y cierres | Escenarios 3, 10, 11, 17 |
| **Casillas OTP** (6 dígitos + reenvíos + «llenar demo») | Paso 4 (firma) · Paso 8 (correo) · Reactivación | Escenarios 1 y 13 |
| **Modal de prueba de vida** (girar cámara + gestos + procesando) | Paso 7 · Desbloqueo · Reactivación | Escenarios 1, 12, 13 |
| **Carga de fotos del documento** (2 caras + legibilidad) | Paso 2 (OCR) · Paso 7 | Escenario 1 |
| **Loader de proceso con sub-etapa** (spinner + cronómetro + texto) | Estudio · OCR · validación simplificada | Escenarios 1, 8, 12 |
| **Bitácora de sucesos** (drawer con timeline) | Atención y detalle | Botón «Sucesos» |
| **Tabla de la Mesa** (8 columnas + contadores + filtros) | Fase 3 | Vista Mesa |

**Regla de reúso:** cada componente se construye **una sola vez**. La prueba de vida del desbloqueo es el mismo modal del paso 7 (solo liveness, sin fotos); el token de la reactivación es la misma pantalla OTP del paso 4 (valida identidad, no firma T&C).

## 3. Qué consume el front del back (resumen)

Los JSON completos están en el requerimiento del back (§5). Lo que el front debe saber manejar:

**La instrucción de C-02** — el campo `accion` es el **switch principal de la pantalla de atención**: al consultar un documento decide cuál de estas 4 rutas ejecuta el front, sin interpretar negocio:

| `accion` | El front hace |
|---|---|
| `activar_paso` | Abre el detalle de la solicitud con la identificación resuelta y el paso indicado activo (precarga `datos` si vienen) |
| `abrir_solicitud` | Abre la solicitud existente en `paso_actual`, con el # visible |
| `mostrar_resultado` | Pinta la tarjeta final con `tono`, `titulo`, `mensaje` y `monto` — sin activar pasos |
| `iniciar_proceso` | Arranca el mini-flujo indicado (desbloqueo/reactivación) en la misma pantalla de atención |

**El `atencion_id`** — C-02 lo devuelve al clasificar; el front no lo interpreta ni lo muestra: lo guarda y **lo repite en cada llamada siguiente** de esa atención (fotos, OCR, cliente, token, exprés). Al validar el token de firma, la respuesta trae `solicitud_id` y de ahí en adelante se usa ese.

**El sondeo de C-11** — con la Mesa o un detalle abiertos, el front pregunta cada N segundos «¿qué cambió desde {marca}?» y con la respuesta: repinta estados sin parpadeo, resalta lo que `requiere_intervencion` (según `turno`), y **avanza el paso automáticamente** cuando llega un proceso terminado con su resultado.

**Los procesos asíncronos** (C-03.B OCR, C-06 estudio, C-08 identidad, C-12/C-13 exprés) — siempre el mismo patrón: iniciar → recibir `proceso_id` → pintar loader con `sub_etapa` → resolver con el resultado que llegue (por sondeo o consulta puntual).

## 4. Tareas

Las tareas puntuales del front están en el **plan de Google Sheets** (hoja «Plan Fábricas QUAC — 3 fases»), identificadas J1-01…J1-21 (Fase 1), J2-01…J2-06 (Fase 2) y J3-01…J3-03 (Fase 3), cada una con su contrato, criterio de listo y dependencias. Orden interno de la Fase 1:

1. **Estructurar navegación** (J1-01) y **maquetar** atención + detalle + los 8 pasos (J1-02…J1-10) — todo con mock, sin esperar al back.
2. En paralelo, la **capa de servicios** (J1-11: cliente HTTP único, errores legibles, reintentos) y el **sondeo sobre mock** (J1-12).
3. **Conectar** pantalla por pantalla cuando cada servicio esté entregado (J1-13…J1-21) — el criterio de cada conexión es reproducir el escenario correspondiente con datos reales.

## 5. Reglas de comportamiento que el simulador ya define

- **Banner de turno**: siempre dice quién actúa (asesor / cliente / sistema) — se calcula con lo que responde el back, no con lógica propia.
- **Paralelismo**: cuando el estudio pasa la viabilidad, dirección e identidad se habilitan a la vez; al terminar un paso ya resuelto, el stepper lo salta.
- **Edición post-firma**: editar datos del cliente invalida la firma → el flujo regresa al paso 4 (re-token). La dirección se edita siempre sin re-token.
- **Pausa y retoma**: si el cliente se va sin firmar, la gestión queda pausada; al volver, la atención la detecta y la reabre en el punto exacto (C-10).
- **Pestañas tipo navegador**: varias solicitudes abiertas; la de segundo plano avisa cuando cambió (sondeo).
- **Estados con badge**: usar el catálogo real (En proceso · Pausado · En autogestión · Escalado a fábrica · Devuelto por fábrica · Aprobado · Rechazado · y los nuevos de Fase 2).

## 6. Matriz de aceptación

La misma del requerimiento del back (§6): cada escenario 1–17 del simulador lista los contratos que ejercita. La entrega del front se valida recorriendo cada escenario **en el flujo real** y comparándolo lado a lado con el simulador.
