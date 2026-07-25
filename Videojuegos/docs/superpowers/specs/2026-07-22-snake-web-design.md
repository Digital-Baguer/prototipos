# Snake — videojuego web de un solo archivo

**Fecha:** 2026-07-22
**Estado:** Diseño aprobado

## Objetivo

Un Snake clásico jugable en el navegador, entregado como un único archivo
`snake.html` sin dependencias ni instalación. Se abre con doble clic en
cualquier computadora o teléfono, y funciona sin conexión a internet.

## Alcance

**Incluye:** movimiento, crecer al comer, muerte por choque, puntuación,
récord persistente, pausa, pantalla de fin, controles de teclado y táctiles,
estética neón arcade.

**No incluye (decidido explícitamente):** niveles, power-ups, obstáculos,
menú principal, selección de dificultad, tabla de récords, sonido,
multijugador. Si alguno se necesita después, será un cambio posterior con su
propio diseño.

## Arquitectura

Un solo archivo `snake.html` con HTML, CSS y JavaScript embebidos. El juego se
dibuja en un `<canvas>` 2D. No hay módulos, ni build, ni servidor: la
portabilidad total fue la restricción elegida por encima de la separación en
archivos.

Aunque todo vive en un archivo, el JavaScript se organiza en secciones con
responsabilidades separadas y comentadas:

1. **Configuración** — todas las constantes ajustables juntas al inicio
   (tamaño de rejilla, velocidades, colores). Cambiar el juego debe ser
   cambiar números en un solo lugar.
2. **Estado** — el objeto que describe la partida actual; se reinicia entero
   al empezar una nueva.
3. **Lógica** — avanzar un paso, detectar choques, colocar comida. Funciones
   que solo leen y modifican estado, sin tocar el canvas ni el DOM.
4. **Entrada** — teclado y gestos táctiles; su única salida es encolar giros.
5. **Dibujo** — lee el estado y lo pinta; no modifica nada.
6. **Bucle** — reloj de paso fijo que llama a lógica y dibujo.

La frontera importante es entre **lógica** y **dibujo**: la lógica no sabe que
existe un canvas. Esto mantiene el juego comprensible aunque el archivo sea
único.

## Reglas del juego

- Rejilla de **20 × 20 celdas**.
- La serpiente empieza con **3 segmentos** horizontales en el centro —cabeza
  en la celda (10, 10), cuerpo en (9, 10) y (8, 10)— y dirección inicial hacia
  la derecha.
- Cada paso, la cabeza avanza una celda en la dirección actual.
- Si la cabeza cae sobre la comida: la serpiente crece un segmento (no se
  quita la cola ese paso), suma **10 puntos** y aparece comida nueva.
- **La comida aparece en una celda libre al azar**, nunca sobre la serpiente.
- **Muerte:** la cabeza sale de la rejilla o toca cualquier segmento del
  cuerpo. Las paredes matan; no se atraviesan los bordes.

### Velocidad

El juego avanza a paso fijo medido en tiempo real, **no por cuadro de
pantalla**. Sin esto correría al doble de velocidad en un monitor de 120 Hz
que en uno de 60 Hz.

- Intervalo inicial: **125 ms por paso** (8 pasos por segundo).
- Cada **5 comidas**, el intervalo se reduce un **10 %**.
- Piso: **60 ms por paso** (~16 pasos por segundo). Se alcanza alrededor de
  las 35 comidas y ya no acelera más.

Si la pestaña estuvo oculta y vuelve, el tiempo acumulado se descarta en vez
de ejecutar decenas de pasos de golpe.

### Cola de giros

Los giros del jugador entran en una cola de **hasta 2 pendientes**. En cada
paso se consume uno. Esto hace que una secuencia rápida ↑ luego → respete
ambos giros en orden, en vez de perder el segundo.

Un giro de **180° se descarta** al encolarlo: no se puede girar sobre uno
mismo. La validación se hace contra el último giro encolado, no contra la
dirección actual, para que dos giros rápidos consecutivos no produzcan un
reverso accidental.

## Estados

```
Listo ──(primera entrada)──► Jugando ──(choque)──► Fin
                              ▲    │                │
                     (espacio)│    │(espacio)       │(Enter/clic)
                              │    ▼                │
                             Pausa                  └──► Listo
```

- **Listo:** tablero dibujado, serpiente quieta, mensaje de instrucciones. La
  primera flecha, tecla o deslizamiento arranca la partida. Al entrar en este
  estado el puntaje vuelve a cero, la serpiente y la velocidad se reinician, y
  el récord se conserva.
- **Jugando:** el reloj corre.
- **Pausa:** el reloj se detiene, se muestra el aviso de pausa.
- **Fin:** destello rojo, sacudida breve del tablero, y el marcador con el
  puntaje de la partida y el récord.

## Controles

| Entrada | Acción |
|---|---|
| ↑ ↓ ← → o W A S D | Girar |
| Espacio | Pausar / reanudar |
| Enter o clic/toque en el tablero | Empezar o reiniciar |
| Deslizar el dedo | Girar (móvil) |

El deslizamiento se detecta con un umbral de **24 píxeles**; se toma el eje
con mayor desplazamiento. Las flechas, el espacio y el deslizamiento sobre el
tablero cancelan el comportamiento por defecto del navegador para que la
página no haga scroll mientras se juega.

Un toque cuenta como toque solo si el dedo se movió **menos de 8 píxeles**.
Sin ese margen, un deslizamiento corto que no alcanza a girar se
interpretaría como toque y pausaría la partida en pleno movimiento.

Las teclas se leen por `code` (posición física, para que WASD siga
funcionando en teclados AZERTY) y también por `key`, porque no todos los
navegadores y teclados reportan `code`.

## Puntuación

- 10 puntos por comida.
- El récord se guarda en `localStorage` bajo la clave `snake.highscore` y
  sobrevive al cerrar la pestaña. Si `localStorage` no está disponible (modo
  privado en algunos navegadores), el juego sigue funcionando con el récord
  solo en memoria; no debe romperse ni mostrar errores.

## Presentación

### Disposición

Título y marcador arriba (puntaje y récord), tablero cuadrado debajo, ayuda de
controles al pie. El tablero mide `min(92vw, 70vh, 600px)` de lado, de modo
que ocupa el ancho en móvil y se mantiene cómodo en escritorio.

El canvas usa una resolución interna multiplicada por la densidad de píxeles
de la pantalla, para que se vea nítido en pantallas retina.

### Paleta

| Elemento | Color |
|---|---|
| Fondo de página | `#05070a` |
| Fondo del tablero | `#0a0e14` |
| Rejilla | `rgba(255,255,255,0.04)` |
| Serpiente (cabeza) | `#7CFFB2` |
| Serpiente (cola) | `#00D9FF` |
| Comida | `#FF2E9A` |
| Texto | `#E6F1FF` |
| Destello de muerte | `rgba(255,45,85,0.35)` |

### Detalles visuales

- El cuerpo va en degradado de verde en la cabeza a cian en la cola,
  interpolado por posición del segmento.
- Resplandor con las sombras nativas del canvas (`shadowBlur`), sin imágenes
  ni recursos externos.
- La cabeza lleva dos ojos que se orientan según la dirección de avance.
- La comida late con una oscilación suave de tamaño.
- Tipografía monoespaciada del sistema.

### Movimiento reducido

Si el sistema pide movimiento reducido (`prefers-reduced-motion`), se
desactivan la sacudida al morir y el latido de la comida. El juego en sí no
cambia.

## Criterios de aceptación

Se verifican en un navegador real antes de dar el trabajo por terminado:

1. Al abrir, se ve el tablero y el mensaje de inicio; la serpiente no se mueve.
2. Una flecha arranca la partida y la serpiente responde a los cuatro giros.
3. Presionar la dirección opuesta a la marcha no mata a la serpiente.
4. Comer suma 10 puntos y alarga la serpiente en un segmento.
5. La comida nunca aparece sobre el cuerpo de la serpiente.
6. Chocar con una pared termina la partida.
7. Chocar con el propio cuerpo termina la partida.
8. El espacio pausa y reanuda sin alterar la posición.
9. Tras superar el récord y recargar la página, el récord se conserva.
10. En tamaño de pantalla móvil el tablero cabe completo y el deslizamiento
    gira la serpiente.
11. La consola del navegador no muestra errores durante una partida completa.

## Riesgos conocidos

- **Reloj de paso fijo:** implementarlo con `setInterval` en vez de un
  acumulador de tiempo ataría la velocidad al monitor. Es el error clásico de
  esta clase de juego y el criterio de aceptación no lo detecta a simple
  vista; se revisa en el código.
- **Comida en tablero casi lleno:** buscar una celda libre al azar por
  reintento se vuelve lento cuando quedan pocas. Se recorren las celdas libres
  y se elige entre ellas, lo que además hace correcto el caso de victoria
  (tablero lleno).
