# Conceptos (fuente: 1-conceptos.md)

## 1. Qué es un token  [0:03]

- `0:03` Antes de hablar de métodos, hay que entender cómo cobra la inteligencia artificial.
- `0:09` Un modelo de lenguaje no lee palabras: lee tokens.
- `0:13` Un token es un pedazo de texto, más o menos tres cuartos de una palabra.
- `0:19` Esta pregunta sobre un viaje por carretera parece corta, pero se convierte en unos treinta tokens.
- `0:27` Las palabras largas se parten en varios pedazos, y los signos de puntuación cuentan aparte.
- `0:34` Cada token que entra o sale del modelo se cuenta, y cada uno tiene un precio.

## 2. Leer es barato, responder es caro  [0:40]

- `0:40` Hay dos tipos de tokens, y no cuestan lo mismo.
- `0:43` Los de entrada son todo lo que el modelo lee: tu mensaje, las instrucciones, los archivos que le muestras.
- `0:51` Los de salida son todo lo que el modelo responde.
- `0:55` Responder cuesta cinco veces más que leer.
- `0:58` Con Opus, un millón de tokens leídos cuesta cuatro dólares; un millón de tokens respondidos cuesta veinte.
- `1:07` Y hay algo que no se ve: antes de responder, el modelo razona por dentro.
- `1:12` Ese razonamiento también son tokens de salida, y se cobran igual aunque nunca aparezcan en pantalla.
- `1:20` En una prueba real, más del noventa por ciento de lo que respondió el modelo más potente fue razonamiento oculto.

## 3. El modelo no tiene memoria  [1:29]

- `1:29` Esta es la idea más importante del taller.
- `1:32` El modelo no guarda nada entre un mensaje y el siguiente.
- `1:36` Cuando escribes el segundo mensaje, la petición lleva el primero, su respuesta, y el nuevo.
- `1:44` En el tercero viaja todo otra vez, más lo nuevo.
- `1:47` Cada mensaje reenvía la conversación completa.
- `1:51` Por eso la cantidad de tokens procesados crece mucho más rápido que la conversación misma.
- `1:57` Diez mensajes cortos no cuestan diez veces uno: cuestan bastante más, porque cada uno carga con todos los anteriores.

## 4. La ventana de contexto y la caché  [2:06]

- `2:06` Todo lo que viaja en una petición tiene que caber en la ventana de contexto.
- `2:11` En los modelos actuales son un millón de tokens.
- `2:15` Parece mucho, pero un agente que lee archivos y corre pruebas la llena en una tarde.
- `2:21` Para abaratar el reenvío existe la caché.
- `2:24` La primera vez que un bloque viaja, se guarda; cada vez siguiente se relee a una décima parte del precio.
- `2:32` La caché dura una hora y es de cada modelo.
- `2:35` Si a mitad de sesión cambias de modelo, el nuevo no puede leer la caché del anterior, y todo el contexto se vuelve a escribir una vez.
- `2:46` No se pierde nada del trabajo; se paga una escritura completa.

## 5. Qué carga una sesión  [2:51]

- `2:51` Al abrir Claude Code en una carpeta, antes de tu primer mensaje ya viajan varios miles de tokens.
- `2:58` Primero lee el archivo Claude punto m d, que en nuestro método es un puntero de dos líneas hacia el archivo Agents.
- `3:07` El archivo Agents es la memoria del proyecto: qué hay, cómo se trabaja, qué no se toca.
- `3:14` Después cargan las herramientas, las skills y los comandos.
- `3:19` Ese paquete inicial se llama prefijo, y viaja en cada petición de la sesión.
- `3:25` Por eso debe ser corto: lo que sobra ahí se paga en cada mensaje.
- `3:30` El comando context muestra cuánto pesa antes de empezar.

## 6. Un agente es otra mesa  [3:35]

- `3:35` Cuando el trabajo es grande, el agente puede delegar.
- `3:39` Imagina una mesa de trabajo: es tu sesión, con su contexto acumulado.
- `3:45` Un subagente es otra mesa, vacía, que recibe un sobre con una misión concreta.
- `3:51` Lee lo que necesita, hace su parte, y devuelve una hoja corta con el resultado.
- `3:57` Lo que leyó se queda en su mesa; a la tuya solo llega la hoja.
- `4:02` Así la mesa principal no se llena, y varias mesas pueden trabajar al mismo tiempo.
- `4:08` El método usa esto en todas las fases: exploradores, constructores y revisores con mesa propia.

## 7. La spec es la memoria  [4:16]

- `4:16` Juntemos las piezas.
- `4:18` El modelo no recuerda; cada mensaje reenvía todo; releer cuesta; y al cerrar la sesión no queda nada.
- `4:28` La respuesta no es hablar menos con la inteligencia artificial.
- `4:32` La respuesta es dejar por escrito lo que importa, en el repositorio, y arrancar cada tarea desde ese escrito.
- `4:41` Ese escrito se llama spec: qué se pide, qué queda por fuera, y cómo se sabe que quedó bien.
- `4:49` Es la memoria que el modelo no tiene, y cualquiera del equipo puede abrirla en cualquier sesión.
- `4:57` Con esta idea se armó un método. Pero antes de usarlo, hay que montar el taller.
