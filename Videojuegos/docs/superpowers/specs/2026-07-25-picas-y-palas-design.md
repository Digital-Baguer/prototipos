# Picas y Palas — página web de un solo archivo

**Fecha:** 2026-07-25
**Estado:** Diseño aprobado (con mockup validado)

## Objetivo

Un juego de deducción "Picas y Palas" (familia *Bulls and Cows*) para dos
personas, entregado como un único archivo `picas.html` sin dependencias ni
instalación. Cada jugador lo abre en su propio móvil; funciona sin conexión.
Comparte la familia visual de los otros juegos del proyecto (Snake, PPT):
fondo oscuro, resplandor neón, tipografía monoespaciada.

## Terminología (fijada para evitar el error clásico de invertirla)

- **PICA** = dígito correcto **en la posición correcta**.
- **PALA** = dígito correcto pero **en otra posición**.
- **nada** = el dígito no está en el número secreto.

## Modelo de juego

**Cada jugador en su propio dispositivo, sin conexión entre ellos.** La página
de cada uno guarda **solo su propio número secreto**. No hay red ni servidor;
el relevo de información entre jugadores es verbal, como jugar en papel, y la
app ayuda a cada lado:

- Juzga automáticamente los intentos que el rival dicta contra tu secreto.
- Lleva el registro de tus propios intentos, con las pistas que anotas a mano.

Gana quien primero adivine el número del otro.

## Reglas

- El número secreto tiene **4 o 5 cifras** (a elección del jugador al empezar).
- Todas las cifras son **distintas**. Se usan los dígitos **0–9**.
- **El cero inicial está permitido** (es un código, no una cantidad): `0-1-2-3`
  es válido.
- Cada intento (propio o del rival) debe cumplir las mismas reglas: longitud
  correcta y dígitos distintos. Un intento que no cumpla se rechaza con un
  aviso y no se registra.

## Arquitectura

Un solo archivo `picas.html` con HTML, CSS y JavaScript embebidos. Interfaz
DOM (sin canvas). Sin módulos, build ni servidor: la portabilidad total es la
restricción, como en los otros juegos.

El JavaScript se organiza en secciones con responsabilidades separadas:

1. **Configuración** — longitudes admitidas, clave de almacenamiento.
2. **Estado** — la partida actual (longitud, secreto, fase, historiales) más
   su carga/guardado en `localStorage`.
3. **Lógica** — funciones puras: validar un intento, evaluar picas/palas,
   generar un secreto al azar. No tocan el DOM.
4. **Transiciones** — empezar partida, registrar un intento de defensa,
   registrar uno de ataque, nueva partida.
5. **Entrada** — teclado y botones; su única salida es invocar una transición.
6. **Interfaz** — pinta la barra de configuración, los dos bloques, las filas
   de historial y el banner de fin.

La frontera importante: la **lógica** de picas/palas es pura y testeable,
separada de la interfaz.

### Función de evaluación

`evaluar(secreto, intento)` devuelve `{ picas, palas }`. Ambos son arreglos de
dígitos distintos de la misma longitud.

- **picas** = número de posiciones `i` donde `secreto[i] === intento[i]`.
- **comunes** = tamaño de la intersección de dígitos (cuántos dígitos del
  intento están en el secreto). Como no hay repetidos, es un conteo simple.
- **palas** = `comunes − picas`.
- Si `picas === 0` y `palas === 0`, la fila se muestra como "nada".

### Validación

`valido(intento, longitud)` es cierto cuando el intento tiene esa longitud,
solo dígitos 0–9, y **todos distintos**.

## Fases y flujo

```
Configurar ──(empezar)──► Jugando ──(4/5 picas en Ataque)──► Ganó
                            │
                            └──(4/5 picas en Defensa)──────► Perdió
   ▲                                                            │
   └──────────────────── (nueva partida) ───────────────────────┘
```

- **Configurar:** eliges 4 o 5 cifras y fijas tu secreto — lo tecleas o pulsas
  **generar** para uno al azar válido. Al pulsar **empezar**, el secreto queda
  bloqueado y comienza la partida. El selector de longitud solo está activo en
  esta fase; para cambiarla, "nueva partida".
- **Jugando:** los dos bloques están activos. La barra superior muestra tu
  número oculto (`••••`) con un botón **ver** para revelarlo, y **nueva
  partida**.
- **Ganó / Perdió:** un banner anuncia el desenlace; la entrada se bloquea y el
  historial queda visible. **Nueva partida** reinicia.

## Los dos bloques

### Defensa (automático) — te intentan adivinar

El rival te dicta su intento; lo tecleas y pulsas **calcular** (o Enter). El
sistema evalúa picas/palas **contra tu secreto** y añade una fila arriba del
historial: los dígitos del intento y las pistas como chips de color (verde
picas, cian palas, gris "nada"). Se lo lees al rival.

Si un intento obtiene **todas picas** (4 o 5), el rival dio con tu número →
fase **Perdió**.

### Ataque (manual) — adivinas su número

Tecleas tu intento contra el secreto del rival, ajustas con los `– +` cuántas
**picas** y **palas** te cantó, y pulsas **añadir**. Se agrega la fila con esas
pistas.

Restricción de la anotación: `picas + palas ≤ longitud`. Al cambiar una, la
otra se ajusta si hiciera falta.

Si anotas **todas picas** (4 o 5), adivinaste → fase **Ganó**.

## Persistencia

La partida completa (longitud, secreto, ambos historiales, fase) se guarda en
`localStorage` bajo la clave `picas.game` tras cada cambio, para que una
recarga accidental no borre tu número ni lo avanzado. Al cargar, se restaura.
"Nueva partida" limpia el almacenamiento. Si `localStorage` no está disponible
(modo privado), el juego funciona en memoria sin romperse.

## Presentación

- Misma paleta que Snake/PPT: fondo `#05070a`, tarjetas `#0a0e14`, verde
  `#7CFFB2` para picas, cian `#00D9FF` para palas, magenta `#FF2E9A` para la
  derrota, gris `#5d7089` para "nada", texto `#E6F1FF`.
- Los dos bloques van lado a lado en escritorio y **apilados en móvil** (el
  uso real es en el teléfono).
- Tipografía monoespaciada del sistema. Resplandor con sombras CSS. Sin
  imágenes ni recursos externos.
- `prefers-reduced-motion` desactiva transiciones no esenciales.

## Criterios de aceptación

Se verifican en un navegador real antes de dar el trabajo por terminado:

1. `evaluar` cumple una tabla de casos hechos a mano, incluyendo dígitos
   presentes pero movidos (palas), coincidencias exactas (picas) y "nada".
2. `evaluar` con el intento igual al secreto da todas picas y cero palas.
3. `valido` rechaza longitudes incorrectas y dígitos repetidos, y acepta un
   número con cero inicial.
4. **generar** produce siempre un secreto válido (longitud correcta, dígitos
   distintos), en 4 y en 5 cifras.
5. En Defensa, teclear un intento del rival añade una fila con las picas/palas
   correctas contra el secreto.
6. Un intento inválido (repetidos o longitud) no se registra y muestra aviso.
7. Todas picas en Defensa lleva a "Perdió" con su banner.
8. En Ataque, añadir un intento con su anotación crea la fila; la anotación
   respeta `picas + palas ≤ longitud`.
9. Todas picas anotadas en Ataque lleva a "Ganó" con su banner.
10. La partida sobrevive a una recarga real (secreto, historiales y fase).
11. "Nueva partida" limpia todo y permite fijar otro secreto y longitud.
12. En tamaño de pantalla móvil los dos bloques se apilan y todo es usable.
13. La consola del navegador no muestra errores durante el juego.

## Riesgos conocidos

- **Invertir pica/pala:** el error clásico. Fijado arriba y cubierto por el
  criterio 1 con una tabla explícita.
- **palas mal calculadas:** si se restara mal la intersección, un dígito
  contado dos veces daría de más. Cubierto por casos con varios dígitos
  movidos.
- **Perder el secreto al recargar:** por eso la partida se persiste; cubierto
  por el criterio 10.

## Fuera de alcance (decidido)

Sonido, sincronización en red entre dispositivos, pistas o ayudas al jugador,
historial entre partidas, y modo contra la máquina. Cualquiera será un cambio
posterior con su propio diseño.
