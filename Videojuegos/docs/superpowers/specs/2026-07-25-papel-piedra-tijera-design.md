# Papel, Piedra y Tijera — página web de un solo archivo

**Fecha:** 2026-07-25
**Estado:** Diseño aprobado

## Objetivo

Un Papel, Piedra y Tijera jugable en el navegador contra la máquina,
entregado como un único archivo `ppt.html` sin dependencias ni instalación.
Se abre con doble clic en cualquier computadora o teléfono y funciona sin
conexión. Comparte la familia visual del Snake del mismo proyecto: fondo
oscuro, resplandor neón, tipografía monoespaciada.

## Alcance

**Incluye:** elegir jugada, rival de azar puro, resolución de la ronda,
animación de revelación, marcador continuo (ganadas/empates/perdidas), mejor
racha persistente, reinicio del marcador, controles de ratón/táctil y teclado.

**No incluye (decidido explícitamente):** partidas al mejor de N, rival que
detecta patrones, sonido, multijugador, historial de jugadas. Si algo se
necesita después, será un cambio posterior con su propio diseño.

## Arquitectura

Un solo archivo `ppt.html` con HTML, CSS y JavaScript embebidos. Sin canvas:
la interfaz es DOM (botones y texto), que es lo natural para este juego. Sin
módulos, ni build, ni servidor; la portabilidad total es la restricción
elegida, igual que en el Snake.

El JavaScript se organiza en secciones con responsabilidades separadas:

1. **Configuración** — las tres jugadas, sus emojis, el mapa de qué vence a
   qué, tiempos de animación, clave de almacenamiento.
2. **Estado** — marcador de la sesión y racha actual; el mejor histórico.
3. **Lógica** — dado dos jugadas, decidir el resultado (`win`/`lose`/`tie`).
   Función pura: no toca el DOM.
4. **Ronda** — orquesta una jugada: bloquear, elegir rival, animar, resolver,
   actualizar marcador, desbloquear.
5. **Entrada** — clic, toque y teclado; su única salida es iniciar una ronda.
6. **Interfaz** — pintar marcador, manos y mensaje de resultado.

La frontera importante es que la **lógica** que decide quién gana es una
función pura y testeable, separada de la animación y del marcador.

## Reglas del juego

- Tres jugadas: **piedra (✊), papel (✋), tijera (✌️)**.
- La máquina elige **al azar puro y uniforme** entre las tres, de forma
  independiente cada ronda. No mira las jugadas anteriores del jugador.
- Resolución: **piedra vence a tijera, tijera vence a papel, papel vence a
  piedra**. Jugadas iguales = empate.
- Cada ronda actualiza el marcador y la racha (ver abajo).

### Función de resultado

`resultado(jugador, maquina)` devuelve `"tie"`, `"win"` o `"lose"` desde la
perspectiva del jugador. Se implementa con un mapa `vence` donde
`vence[a] === b` significa "a le gana a b". Debe cumplir la tabla completa de
9 combinaciones:

| Jugador \ Máquina | piedra | papel | tijera |
|---|---|---|---|
| **piedra** | empate | pierde | gana |
| **papel** | gana | empate | pierde |
| **tijera** | pierde | gana | empate |

## Marcador y racha

- Tres contadores de sesión: **ganadas, empates, perdidas**. Empiezan en cero
  al cargar la página y no se persisten (son de la sesión actual).
- **Racha actual:** número de victorias seguidas. Una victoria la incrementa;
  un empate **o** una derrota la ponen a cero.
- **Mejor racha:** el máximo histórico de la racha actual. Se guarda en
  `localStorage` bajo la clave `ppt.beststreak` y sobrevive al cerrar la
  pestaña. Si `localStorage` no está disponible (modo privado), el juego
  sigue funcionando con la mejor racha solo en memoria; no debe romperse ni
  mostrar errores.
- Un botón **"reiniciar marcador"** vuelve los tres contadores y la racha
  actual a cero. La mejor racha histórica se conserva (borrarla no es parte
  del alcance; el botón limpia la sesión, no el récord).

## Estados y secuencia de una ronda

```
Elige ──(jugada)──► Revelando ──(fin animación)──► Resultado ──► Elige
         botones activos   botones bloqueados        botones activos
```

- **Elige:** los tres botones responden; el mensaje invita a jugar.
- **Revelando:** durante la animación los botones quedan **bloqueados** para
  que no se puedan encolar dos jugadas. Dura unos **500 ms**: un breve conteo
  ("¡Pi–Pa–Pá!") mientras ambas manos "tiemblan".
- **Resultado:** se revelan las dos manos a la vez, se muestra quién ganó y
  se actualiza el marcador. Los botones vuelven a estar activos.

### Movimiento reducido

Si el sistema pide `prefers-reduced-motion`, se salta el conteo y el temblor:
la jugada de la máquina y el resultado aparecen de inmediato. El juego en sí
no cambia.

## Controles

| Entrada | Acción |
|---|---|
| Clic o toque en un botón | Jugar esa mano |
| Tecla **1** | Piedra |
| Tecla **2** | Papel |
| Tecla **3** | Tijera |

Las teclas se leen tanto por `code` (`Digit1`/`Digit2`/`Digit3` y también el
teclado numérico `Numpad1`/`Numpad2`/`Numpad3`) como por `key` (`"1"`, `"2"`,
`"3"`), por la misma razón que en el Snake: no todos los navegadores y
teclados reportan `code`. Las teclas se ignoran mientras el estado es
"Revelando".

## Presentación

### Disposición

De arriba a abajo: título, marcador (ganadas · empates · perdidas) con la
mejor racha debajo, la zona de las dos manos (tú vs máquina) con el mensaje de
resultado en medio, y la fila de tres botones grandes. Al pie, la ayuda de
controles y el botón discreto de reiniciar marcador.

En móvil todo cabe en una columna sin scroll; los botones son suficientemente
grandes para el pulgar.

### Paleta

Reutiliza la del Snake para que ambos juegos se sientos de la misma colección.

| Elemento | Color |
|---|---|
| Fondo de página | `#05070a` |
| Superficie / tarjeta | `#0a0e14` |
| Acento primario (ganas) | `#7CFFB2` (verde neón) |
| Acento secundario | `#00D9FF` (cian) |
| Derrota / alerta | `#FF2E9A` (magenta) |
| Empate / neutro | `#5d7089` |
| Texto | `#E6F1FF` |

El color del mensaje de resultado cambia según el desenlace: verde al ganar,
magenta al perder, gris neutro al empatar.

### Detalles visuales

- Los emojis de las manos van grandes, con un resplandor de color detrás
  (verde para el jugador, cian para la máquina) hecho con sombras CSS.
- El botón sobre el que el jugador tiene el cursor o el foco se ilumina.
- Al resolverse, la mano ganadora late una vez; en empate, ninguna.
- Toda la animación es CSS; sin imágenes ni recursos externos.
- Tipografía monoespaciada del sistema, como en el Snake.

## Criterios de aceptación

Se verifican en un navegador real antes de dar el trabajo por terminado:

1. Al abrir se ven las tres opciones, el marcador en 0-0-0 y el mensaje de
   inicio.
2. La función de resultado cumple las 9 combinaciones de la tabla.
3. Elegir una jugada revela la de la máquina y muestra el desenlace correcto.
4. Ganar suma a "ganadas"; empatar suma a "empates"; perder suma a "perdidas".
5. La racha actual sube con cada victoria y se pone a cero al empatar o perder.
6. La mejor racha refleja el máximo alcanzado y, tras recargar la página, se
   conserva.
7. Durante la animación de revelación los botones no aceptan una segunda
   jugada.
8. Las teclas 1, 2 y 3 juegan piedra, papel y tijera respectivamente.
9. "Reiniciar marcador" pone los contadores y la racha actual a cero y
   conserva la mejor racha histórica.
10. En tamaño de pantalla móvil todo cabe y los botones son tocables.
11. La consola del navegador no muestra errores durante el juego.
12. Sobre una muestra grande de rondas, las tres jugadas de la máquina
    aparecen con frecuencias aproximadamente iguales (azar uniforme).

## Riesgos conocidos

- **Mapa de "qué vence a qué" invertido:** es el error clásico del PPT
  (confundir "a vence a b" con "a pierde con b"). Lo cubre el criterio 2 con
  la tabla completa de 9 casos.
- **Doble jugada durante la animación:** si los botones no se bloquean, un
  clic rápido puede resolver dos rondas encimadas. Cubierto por el criterio 7.
- **Sesgo del generador de azar:** poco probable con `Math.random()`, pero el
  criterio 12 lo comprueba sobre una muestra grande.
