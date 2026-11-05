# Revisión de proyectos · 21 oct – 4 nov 2026

Fuente: sesiones de trabajo con agentes de IA en tres workspaces (≈ 220 sesiones): `ecommerce` (GET y tiendas), `ai-quinta-del-mar` (Quinta del Mar) y `claude-code-workflow` (App Quac v2 y origen del método).

---

## 1. Marco de trabajo: desarrollo de software con agentes de IA

### Qué es
Un proceso de desarrollo guiado por especificación (*spec-driven*), donde yo hago el rol de arquitecto: defino el problema, decido y apruebo. Los agentes exploran el código y la base de datos, escriben la especificación, el plan, el código, las pruebas y la auditoría. Cada paso deja un documento en el repositorio, así que cualquier persona (o cualquier modelo) puede retomar donde quedó.

### Cómo evolucionó
| Momento | Qué cambió |
|---|---|
| Mar–may 2026 | Playbook inicial (`PLAYBOOK_SDLC_AGENTES_IA.md`): fases, plantillas, Codex como auditor externo. |
| Jun–sep 2026 | Comandos por fase (`/iniciar`, `/planear`, `/implementar`, `/auditoria`…), mockup como contrato de interfaz, ejecutor Sonnet. |
| Oct 2026 | Contratos de fase independientes del modelo, agentes por rol, auditoría encadenada, empaquetado para el equipo. |

### El ciclo de un requerimiento
```
/roadmap (si son varios REQ) → /iniciar (entrevista + mockup + spec) → /planear (tasks verticales)
→ /implementar (código + pruebas, task por task) → /auditoria → /post-auditoria → /re-auditoria
→ /qa (documento de validación para el dev) → /handoff-jira (tarjeta) → PR y deploy
```
Atajos: `/fix` (ajuste ≤ 3 archivos sobre algo entregado), `/retomar` (lee `corte.md` y dice en qué fase va), `/doc-contexto` (mapa de un módulo o repo).

### Piezas del marco
| Pieza | Para qué |
|---|---|
| **Contratos de fase** (`docs/metodologia/flujos/`) | La regla de cada fase en un archivo; los comandos son adaptadores delgados. Funciona con Claude, Codex u otro harness. |
| **Taller / Paso 0** (`TALLER.md`) | Lo que un workspace necesita antes del primer REQ: repos, `AGENTS.md` por repo, glosario y ADR, acceso de solo lectura a la BD. |
| **Agentes por rol** | Ejecutor (Sonnet, Opus en lógica delicada), revisor de spec, revisor de estándares, auditor (Opus), buscador. |
| **Artefactos por REQ** | `brainstorming.md`, `spec.md`, mockup HTML, `plan.md`, `auditoria.md`, `qa.md`, `handoff-jira.md`, `corte.md`. |
| **Reglas de verificación** | Pruebas por task (TDD), revisión en dos ejes, prueba en pantalla real (R6) con datos copiados en un MySQL efímero, PROD solo lectura. |
| **Auditoría cruzada** | El auditor Opus va en cadena; una auditoría adicional con Codex, Grok o Fable la lanzo aparte y `/post-auditoria` junta los hallazgos. |

### Decisiones tomadas con datos (estas dos semanas)
- **Un solo auditor en la cadena.** Comparativa en GW-201, misma rama: Opus y Fable aprobaron y coincidieron en lo importante; Fable sumó solo hallazgos menores, a 2,5× el precio y 50 % más lento (`docs/metodologia/comparativa-auditores.md`).
- **`/implementar --seguido`**: recorre todas las tasks y encadena la auditoría sin intervención; el modelo se elige por rol.
- **`/fix` acotado**: tras una discusión en Quinta (REQ-QUINTA-047-1), un ajuste con lógica nueva pasa a REQ hijo con el flujo completo, no a fix.

### Llevarlo al equipo (en curso)
- Repo de workspace con el método, README único de instalación y uso, guía de Windows.
- Usuario de BD de solo lectura por persona (creados 2–3 nov para tres developers).
- Herdr (terminal para varias sesiones de agentes) con indicador de estado *trabajando / te necesita / listo*; variante Windows en prueba con un developer.
- Reparto: yo hago `/iniciar` y `/planear` y genero la tarjeta; el developer implementa, audita y publica.
- Pendiente: publicar el repo en GitHub (permiso), rotar credenciales antes del push, guion del taller.

---

## 2. GET y tiendas (workspace `ecommerce`)

### Entregado o en producción
| REQ | Qué hace | Estado |
|---|---|---|
| GW-201 | Tercer nivel de menú y módulo Logística | En PROD |
| GW-205 | Carrito sellado en venta asistida y cambio de contraentrega a pago anticipado | En main/master |
| GW-197 | Celebración al confirmar un carrito (venta asistida) | En PROD |
| CR-001 | Sincronizar campañas del ERP (Customer Retention) a promociones de GET | En PROD desde el 3 nov |
| GW-196 / GW-221 | Login con panel vivo y portadas por temporada (Halloween, Navidad) | Halloween en PROD; Navidad con tarjeta |

### Con método cerrado (tarjeta en Jira), falta PR o deploy
GW-193 canal Web/WhatsApp en promociones · GW-194 devoluciones por mensajero · GW-198 medias con tenis · GW-206 fotos de prendas en entregas · GW-214 compra mínima sobre lista propia · GW-218 nueva venta en tienda del asesor · GW-220 Pulso de hoy con devueltas y canceladas · GW-222 cupo de franja solo si cambia la agenda · CR-002 código de descuento por cédula · SOP-001 gestión de fotos (en master) · SOP-002 generar link de crédito · LOGIS-001 indicadores logísticos.

### En especificación o plan
GW-217 recálculo de comisiones al cambiar presupuesto · GW-223 celebración por pedido pagado · GW-224 colección Esenciales STIRPE · GW-226 migrar tipos de prenda de cms a GET · GW-213 archivo de inventario e-commerce · GW-216 origen de la venta en el detalle del pedido · SOP-003 suplantadores.

### Proyectos (roadmap + épica en Jira)
| Proyecto | Alcance |
|---|---|
| SOP | Migrar a GET las utilidades de soporte de QUAC (9 REQ) y un módulo de diagnóstico del cliente |
| CR | Campañas del ERP → promociones de GET, códigos por cédula, mensajes por Infobip |
| LOGIS | Dashboard logístico y alertas, migrado desde cms |
| FAB | Guiones de llamada Ubica y Confronta, mensajes SMS y de voz del código de aceptación |
| Marketplace | Requerimiento de seller center propio tipo Mercado Libre (tras reunión con proveedor; se descartó cross-docking) |

### Soporte y operación
- Comando `/resumen-caso`: dada una cédula, resumen, diagnóstico y PDF de la cuenta QUAC (usado en 4+ casos).
- Diagnósticos: abonos por sincronizar, liquidación de comisiones de Derek, venta asignada a otra tienda, cupo de franja horaria.
- Alerta de seguridad PHP (php2shell): mensaje y tareas para el equipo (inventario de versiones PHP por repo).
- Descripción del cargo para quien asuma el chatbot de ventas.

---

## 3. Quinta del Mar (workspace `ai-quinta-del-mar`, admin nuevo QAV2)

| REQ | Qué hace | Estado |
|---|---|---|
| 057 / 057-1 | Checklist de sede; exigirlo solo el día de check-in | Handoff hecho |
| 059 | Compras: quitar una línea ya no borra líneas de traslados ni ajustes | Planeado |
| 061 | Traslados: confirmar ya no revive traslados anulados | Handoff; épica y roadmap de inventario y reservas creados en Jira |
| 062 | Control de stock: «Disminuir» ya no graba salida sin stock | Handoff hecho |
| 063 | Edición de reservas por el sistema nuevo | En PROD |
| 064 | Bodegas: quién responde por cada una y quién es el principal | Handoff; falta OPS en PROD |
| 065 | Traslados de inventario | Handoff 3 nov |
| 047-1 | Validar cruce de reservas y mostrar la reserva que bloquea | Handoff hecho |
| 076 | Login del admin nuevo con el nombre SIREQ y fotos de las sedes | Handoff hecho |
| 077 | Dashboard de ocupación con interfaz moderna | Handoff hecho |
| — | Subir api-quinta de PHP 7.4 a 8.2+ | Iniciado |

Además: informe del embudo de conversión del chatbot (cómo leerlo, 6 reservas del bot de 110 que recibieron PDF), investigación de un contrato reportado como firmado, y una cartilla HTML para entender el chatbot (webhook de Infobip, flujo hasta el modelo, caché del prompt).

---

## 4. App Quac v2 (workspace `claude-code-workflow`)

AQ-011.5 avisos remotos · AQ-012 mis dispositivos · AQ-002.6-1 tutorial de novedades (ilustraciones propias) · AQ-008-1 reglas de clave (4 dígitos distintos) · AQ-013 cargar documentos controlado desde la API. El proyecto AQ se trasladó al workspace `ecommerce` el 4 nov.

---

## 5. Cifras de las dos semanas
| | |
|---|---|
| Sesiones de trabajo | ≈ 220 (135 GET · 73 Quinta · 12 App Quac) |
| REQ tocados | ≈ 22 en GET, ≈ 12 en Quinta, 5 en App Quac |
| Commits en el workspace `ecommerce` | 215 |

## 6. Pendientes comunes
- Muchos REQ quedan con tarjeta y sin PR/deploy: el cuello de botella está después del método (PR, SQL en PROD, deploy).
- Adjuntos de Jira pendientes en casi todas las tarjetas.
- Publicar el método para el equipo y la primera prueba completa con un developer.
