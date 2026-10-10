# El ciclo (fuente: 3-ciclo.md)

## 1. El identificador y la carpeta  [0:03]

- `0:03` Cada pedido recibe un identificador, por ejemplo REQ cero cuarenta y dos.
- `0:09` El comando iniciar, con ese identificador, crea una carpeta con su nombre dentro de docs requirements.
- `0:17` Ahí deja el primer documento: la spec.
- `0:20` Los comandos siguientes reciben el mismo identificador y suman sus documentos a esa carpeta: el plan, la auditoría, las correcciones.
- `0:31` Cualquier sesión, de cualquier persona, arranca abriendo esa carpeta.

## 2. Una mesa por fase  [0:36]

- `0:36` El ciclo tiene seis fases, y cada una se trabaja en una sesión nueva.
- `0:42` Recuerda la mesa: una sesión larga es una mesa llena, que rinde peor y cuesta más.
- `0:49` Al cerrar una fase, el agente deja una nota de corte: qué se hizo, qué quedó pendiente y dónde retomar.
- `0:58` La fase siguiente arranca en una mesa limpia, leyendo esa nota y los documentos de la carpeta.
- `1:04` Nada depende de lo que había en la conversación anterior.
- `1:08` Por eso una fase la puede empezar una persona y terminarla otra.

## 3. Entender y planear  [1:13]

- `1:13` La primera fase es entender.
- `1:16` El comando iniciar hace una entrevista: pregunta lo que el código no responde, y para cada pregunta trae una recomendación.
- `1:25` Si el pedido tiene pantalla, el comando mockup dibuja un prototipo antes de escribir una línea de código.
- `1:34` El resultado es la spec, y tú la apruebas.
- `1:37` La segunda fase es planear: el plan sale de la spec, con una tabla que cruza cada punto de la spec con una tarea.
- `1:45` Sin huecos, y sin tareas que no vengan de la spec.

## 4. Construir con ejecutor  [1:49]

- `1:49` La tercera fase es construir.
- `1:52` Aquí entra la orquestación: un director y un constructor.
- `1:56` El director es tu sesión, con el modelo más capaz: piensa, reparte y verifica.
- `2:04` El constructor es otra mesa, con un modelo más económico: escribe el código.
- `2:10` Por cada tarea, el director manda un sobre sellado: la tarea literal, los contratos y las rutas. Nada de la conversación.
- `2:20` El constructor devuelve una hoja: archivos tocados, salida de las pruebas, decisiones y desvíos.
- `2:28` Solo el director marca la tarea como hecha, y solo con la evidencia en la mano.

## 5. Auditar  [2:34]

- `2:34` La cuarta fase es auditar, en otra sesión y, si se puede, con otro modelo.
- `2:40` Quien construye no revisa.
- `2:42` Siete revisores trabajan en paralelo, cada uno con una pregunta.
- `2:47` Funcional: ¿se construyó lo que pide la spec, ni más ni menos?
- `2:53` Bugs: ¿dónde se rompe?
- `2:55` Calidad: ¿respeta las convenciones del repositorio?
- `2:59` Defensivo: ¿qué pasa si falla a mitad?
- `3:02` Base de datos: ¿las consultas corren contra la base real?
- `3:07` Pantalla: ¿se ve como el prototipo aprobado?
- `3:10` Y seguridad: ¿alguien puede inyectar, leer lo que no debe, o entrar sin permiso?
- `3:17` Un consolidador vuelve a correr las pruebas y clasifica cada hallazgo de P cero a P tres.

## 6. Corregir y cerrar  [3:24]

- `3:24` Si la auditoría encuentra algo, la quinta fase corrige: primero una prueba por hallazgo, y luego la corrección.
- `3:34` La sexta fase cierra: una revisión corta que solo mira lo que estaba abierto.
- `3:39` Nunca se firma con un hallazgo grave abierto.
- `3:43` El ciclo da vueltas entre corregir y cerrar hasta que el veredicto es aprobado.
- `3:48` Después vienen dos documentos más: el de QA, para quien prueba, y la tarjeta para Jira, para quien lo lleva a producción.

## 7. Tres reglas  [3:58]

- `3:58` Tres reglas resumen el método.
- `4:01` Una fase por sesión: cada fase arranca en una mesa limpia, desde lo escrito.
- `4:06` Un modelo según la fase: el más capaz para entender y auditar; el más económico para construir.
- `4:15` Y medir: el comando context antes de empezar, y el comando usage para saber cuánto del plan llevas.
- `4:23` El método no es la forma correcta. Es un punto de partida.
- `4:27` Lo probamos en pedidos reales, y lo ajustamos juntos.
