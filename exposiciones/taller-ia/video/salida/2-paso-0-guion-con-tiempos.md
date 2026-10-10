# Paso 0: montar el taller (fuente: 2-paso-0.md)

## 1. El ciclo asume el contexto  [0:03]

- `0:03` El método es un ciclo de seis fases, desde entender un pedido hasta cerrarlo.
- `0:09` Pero ninguna de esas fases construye el contexto: todas lo asumen.
- `0:15` Asumen que el agente puede leer el código, sus mapas y la base de datos.
- `0:21` Si eso falta, el síntoma es siempre el mismo: el agente pregunta cosas que el código ya responde, o afirma cosas que no verificó.
- `0:32` Montar ese contexto es el paso cero.
- `0:35` Se hace una vez por proyecto, lo hace el arquitecto, y se revisa solo cuando entra un repositorio nuevo o cambia el acceso a datos.

## 2. El workspace y el kit  [0:45]

- `0:45` Todo empieza con una carpeta por proyecto: el workspace.
- `0:49` Dentro va el kit del método: los contratos de cada fase en docs metodología, las plantillas, y los comandos en la carpeta punto claude.
- `1:00` En la raíz, el archivo Claude punto m d de dos líneas, que apunta al archivo Agents.
- `1:07` El kit tiene una sola copia por equipo.
- `1:10` Si hay dos workspaces, el kit vive en uno y el otro lo referencia.
- `1:15` Dos copias siempre terminan distintas.

## 3. Los repositorios, uno al lado del otro  [1:18]

- `1:18` Los repositorios del proyecto se clonan en la raíz del workspace, uno al lado del otro.
- `1:24` Se instalan sus dependencias.
- `1:26` Se anota cuál es la rama principal, porque no siempre es master; a veces el código vivo está en otra rama.
- `1:36` Y el archivo de entorno de cada repositorio apunta a desarrollo, nunca a producción.
- `1:43` Un agente con un punto env que mira a producción es un accidente esperando.

## 4. El archivo Agents de cada repositorio  [1:49]

- `1:49` Cada repositorio necesita su propio archivo Agents.
- `1:53` Es la memoria de cómo se trabaja ahí: la rama principal, la estructura de carpetas, cómo correr las pruebas, las trampas conocidas y cómo se despliega.
- `2:05` No se escribe a mano: el comando doc contexto explora el código real y lo redacta en unas cincuenta líneas.
- `2:13` Lo que el agente no pudo verificar queda marcado por confirmar, y se resuelve con quien conoce el repositorio.
- `2:21` Luego se commitea dentro del repositorio, con su puntero Claude punto m d, para que cada clon lo traiga.

## 5. El archivo Agents del workspace  [2:29]

- `2:29` Hay un segundo archivo Agents, en la raíz del workspace.
- `2:33` Describe lo que no está en ningún repositorio: qué repositorios hay, cómo se conectan, cómo se consulta la base de datos, y las reglas de producción.
- `2:46` Este sí se escribe a mano, con ayuda del agente y desde una plantilla.
- `2:52` Tiene un límite: ciento cincuenta líneas.
- `2:55` Porque viaja completo en cada petición de cada sesión; lo que sobra ahí se paga en cada mensaje.

## 6. La llave de la base de datos  [3:03]

- `3:03` El acceso a la base de datos se configura en tres sitios distintos.
- `3:09` Primero, el usuario: lo crea el administrador de la base, y es de solo lectura.
- `3:15` En SQL Server, eso es el rol de lectura más el permiso de ver definiciones, para que el agente pueda leer el código de los procedimientos almacenados.
- `3:27` Sin permiso de ejecutar: un procedimiento puede escribir aunque su nombre parezca de consulta.
- `3:35` Segundo, la credencial: va en un archivo en la carpeta personal del usuario, nunca en el repositorio ni en un comando.
- `3:44` Tercero, el comando exacto para consultar queda documentado en el archivo Agents, y el permiso para correrlo en la configuración de Claude Code.
- `3:55` Además, los procedimientos almacenados se exportan a archivos dentro de docs contexto, para que el agente los lea sin conectarse.

## 7. Glosario, mapas y verificación  [4:05]

- `4:05` Faltan dos piezas y una prueba.
- `4:08` El glosario: un archivo con los términos del negocio que un agente nuevo no puede adivinar, y las decisiones de arquitectura ya tomadas. Diez términos bastan para arrancar.
- `4:21` Los mapas por módulo: solo para lo que el primer pedido va a tocar. El resto se crea cuando haga falta.
- `4:30` Y la verificación, en una sesión nueva: el prefijo carga limpio; el agente sabe qué repositorios hay sin inventar; corre una consulta real de solo lectura; corre las pruebas de un repositorio; y se niega a escribir en producción citando la regla.
- `4:50` Si las cinco pasan, el taller está montado, y el primer pedido puede arrancar.
