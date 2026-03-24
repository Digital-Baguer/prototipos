# Analisis: Anulacion de Carrito, Trazabilidad de Productos y Confirmacion de Cobro

> **Fecha**: 2026-03-23
> **Estado**: En revision
> **Requerimiento**: `docs/tasks/planes/REQ-GETWEB-005-estado-carrito-anulacion-confirmacion.md`

---

## 1. Problema actual

1. **El mensajero no puede anular un pedido cuando el cliente devuelve
   todo.** Si un cliente no desea quedarse con ningun producto, el
   mensajero devuelve toda la bolsa pero no tiene la opcion de anular
   el carrito. El boton COBRAR queda deshabilitado y el mensajero no
   puede cerrar la entrega.

2. **Se pierde la traza de productos devueltos en pedidos parciales.**
   Si un cliente devuelve al menos un producto y el mensajero cobra el
   resto, el pedido se crea correctamente con los productos no devueltos.
   Pero el sistema elimina fisicamente los productos devueltos de la
   base de datos. No queda registro de que esos productos estuvieron
   en el carrito y fueron devueltos.

3. **No hay confirmacion antes de crear el pedido.** Acciones sensibles
   como la creacion del pedido — ya sea cuando el cliente confirma desde
   el link de confirmacion (pago anticipado) o cuando el mensajero
   genera el link de pago — se ejecutan con un solo clic sin una
   ventana que confirme el proceso. Se sugiere un paso intermedio que
   muestre "vas a cobrar X productos por $YYY" para evitar que se
   haga clic por error sin haber revisado.

---

## 2. Solucion propuesta

### 2.1 Anulacion: `carrito_asistido_anulado` + metadata

La columna `carrito_asistido_anulado` ya existe en `store_carrito`
(tinyint, NULL) pero nunca se escribe. Se reutiliza para marcar la
anulacion y se agregan 3 columnas de metadata:

```sql
ALTER TABLE store_carrito ADD COLUMN anulado_por INT NULL AFTER carrito_asistido_anulado;
ALTER TABLE store_carrito ADD COLUMN anulado_fecha DATETIME NULL AFTER anulado_por;
ALTER TABLE store_carrito ADD COLUMN anulado_motivo VARCHAR(255) NULL AFTER anulado_fecha;
```

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `carrito_asistido_anulado` | tinyint (ya existe) | `1` = carrito anulado |
| `anulado_por` | INT NULL (nueva) | `user_id` del usuario que anulo |
| `anulado_fecha` | DATETIME NULL (nueva) | Fecha y hora de la anulacion |
| `anulado_motivo` | VARCHAR(255) NULL (nueva) | Motivo de la anulacion |

**Motivos predefinidos**:

| Origen | Motivo por defecto |
|--------|--------------------|
| Mensajero (devuelve todo) | "Cliente no acepto ningun producto en la entrega" |
| Asesor (futuro, desde panel) | Seleccionable: "Cliente desistio", "Error en el pedido", "Productos agotados", "Otro" + campo libre |

### 2.2 Archivado: `carrito_asistido_archivado`

Para que un asesor pueda ocultar un carrito de su lista sin eliminarlo:

```sql
ALTER TABLE store_carrito ADD COLUMN carrito_asistido_archivado DATETIME NULL AFTER anulado_motivo;
```

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `carrito_asistido_archivado` | DATETIME NULL | Fecha en que se archivo. `NULL` = visible |

- El asesor hace clic en "Archivar" → se escribe `now()`
- El listado de carritos filtra `carrito_asistido_archivado IS NULL`
- Si el asesor quiere verlos, usa un filtro "Mostrar archivados"

### 2.3 Impacto

- Los flujos existentes (crear carrito, confirmar, convertir) no se tocan
- Solo se agregan escrituras nuevas: al anular y al archivar
- get-api no lee ninguno de estos campos — sin impacto

---

## 3. Tracking de productos devueltos

### Situacion actual

`store_carrito_productos.devuelto_mensajeria`:
- `0` = producto normal
- `1` = producto devuelto por mensajero
- get-api lo usa como global scope: `->where('devuelto_mensajeria', 0)`
- `removeProductsInternalDevolution()` **elimina fisicamente** los productos
  con `devuelto_mensajeria=1` durante el checkout

`store_carrito_productos.status`:
- `1` = producto activo
- `0` = producto sin stock / bloqueado
- **No es para devoluciones** — es un flag de disponibilidad que get-api
  actualiza automaticamente al validar stock

### Decision: no crear tabla extra

Cuando un carrito se **anula**, nunca pasa por checkout, por lo tanto
`removeProductsInternalDevolution()` nunca se ejecuta. Los productos
con `devuelto_mensajeria = 1` **permanecen** en la tabla como traza.

Resultado: al consultar un carrito anulado, se pueden ver todos los
productos y cuales fueron marcados como devueltos. No se necesita
tabla adicional.

### Flujo del mensajero

1. Mensajero llega donde el cliente
2. Cliente prueba las prendas
3. Por cada prenda que no quiere: mensajero toca X →
   `devuelto_mensajeria = 1` (endpoint existente `marcarDevolucionProducto`)
4. Si quedan productos activos: mensajero cobra normalmente
5. Si **todos** fueron devueltos: aparece boton "Anular pedido" →
   modal de confirmacion → se marca `carrito_asistido_anulado = 1`
   con metadata (anulado_por, anulado_fecha, anulado_motivo)

---

## 4. Pedidos parciales (cobro con productos devueltos)

### Escenario

Un carrito tiene 3 productos. El mensajero llega, el cliente se prueba
las prendas y devuelve 1. El mensajero marca ese producto como devuelto
(`devuelto_mensajeria = 1`). Quedan 2 productos activos. El mensajero
genera un link de pago o cobra con datafono.

### Flujo actual (problematico)

```
store_carrito_productos:
  Camisa  (devuelto_mensajeria=0) ✓ activo
  Jean    (devuelto_mensajeria=0) ✓ activo
  Zapato  (devuelto_mensajeria=1) ← devuelto por mensajero

         │
         ▼  processCartPayment()
         │
         ├─ validateCart(processPayment: true)
         │    └─ getCartInternal(processPayment: true)
         │         └─ removeProductsInternalDevolution()
         │              └─ DELETE FROM store_carrito_productos
         │                 WHERE carrito_id=X AND devuelto_mensajeria=1
         │                                          ↑
         │                              ██ TRAZA PERDIDA ██
         ▼
  CartDTOFactory::makeInternal()
    → Solo ve Camisa + Jean (el Zapato ya no existe)

         │
         ▼  createOrderFromCartDTO()
         │
  shop_pedido_detalle:
    Camisa  ✓
    Jean    ✓
    (Zapato no existe en ningun lado)
```

**Problema**: No queda registro de que el Zapato estuvo en el carrito
y fue devuelto. Si alguien pregunta "¿que paso con el zapato?", no hay
respuesta en la BD.

### Flujo propuesto

```
store_carrito_productos:
  Camisa  (devuelto_mensajeria=0, status=1) ✓ activo
  Jean    (devuelto_mensajeria=0, status=1) ✓ activo
  Zapato  (devuelto_mensajeria=1, status=1) ← devuelto por mensajero

         │
         ▼  processCartPayment()
         │
         ├─ validateCart(processPayment: true)
         │    └─ getCartInternal(processPayment: true)
         │         └─ removeProductsInternalDevolution()
         │              └─ UPDATE store_carrito_productos
         │                 SET status=0
         │                 WHERE carrito_id=X AND devuelto_mensajeria=1
         │                                          ↑
         │                              ✓ TRAZA CONSERVADA
         ▼
  CartDTOFactory::makeInternal()
    → Solo ve Camisa + Jean (global scope filtra devuelto_mensajeria=0)

         │
         ▼  createOrderFromCartDTO()
         │
  shop_pedido_detalle:
    Camisa  ✓
    Jean    ✓

  store_carrito_productos (traza completa):
    Camisa  (devuelto_mensajeria=0, status=1) → fue al pedido
    Jean    (devuelto_mensajeria=0, status=1) → fue al pedido
    Zapato  (devuelto_mensajeria=1, status=0) → devuelto, no fue al pedido
```

**Resultado**: El pedido se crea correctamente con los 2 productos activos.
El Zapato queda en `store_carrito_productos` como registro historico
con `devuelto_mensajeria=1, status=0`. Trazabilidad completa.

### Recalculo de totales

Cuando el mensajero devuelve un producto, get-web llama al endpoint
`marcarDevolucionProducto` que pone `devuelto_mensajeria=1`. Despues,
al obtener el carrito via get-api (`obtenerCarrito`), el global scope
excluye ese producto y los totales se recalculan automaticamente
(subtotal, descuentos, total) sin incluir el producto devuelto.

El boton COBRAR ya muestra el total correcto ($330.000 en vez de $450.000).
No hay cambio necesario en el recalculo.

### Resumen del cambio

| Aspecto | Antes | Despues |
|---------|-------|---------|
| Productos devueltos durante checkout | Se borran (`DELETE`) | Se marcan inactivos (`status=0`) |
| Traza en `store_carrito_productos` | Se pierde | Se conserva |
| Pedido creado | Solo productos activos | Solo productos activos (sin cambio) |
| Totales del pedido | Correctos | Correctos (sin cambio) |
| Impacto en get-api | — | 1 linea cambiada en `CartProductService` |

---

## 5. Impacto en los 4 repositorios

### get-web (se modifica)

| Archivo | Cambio |
|---------|--------|
| `Carrito.php` (modelo) | Agregar metodo `estaAnulado()`, actualizar `esEditable()` |
| `EntregasController.php` | Nuevo metodo `anularEntregaMensajeria()`, escribir anulacion |
| `Index.vue` | Badge de anulado, filtro para ocultar archivados |
| `MensajeriaDetalle.vue` | Footer dinamico COBRAR/ANULAR |
| `AnularPedidoModal.vue` | **Nuevo componente** |
| `ConfirmarCobroModal.vue` | **Nuevo componente** |
| `ConfirmacionVenta.vue` | Modal de confirmacion de pago (anticipado) |

### get-api (no se modifica)

get-api no lee `carrito_asistido_anulado` ni `carrito_asistido_archivado`.
Sus scopes globales (`cartOpen`, `storeSelected`) siguen funcionando con
`carrito_cerrado` y `pedido_id_convertido`. Las nuevas columnas no
afectan ningun query existente.

### get-api (se modifica — un solo cambio)

**Cambio requerido**: Eliminar el DELETE fisico en `removeProductsInternalDevolution()`.

Hoy este metodo borra los productos con `devuelto_mensajeria=1` justo
antes de crear el pedido. Esto causa perdida de trazabilidad.

**Archivo**: `app/Services/V2/Cart/CartProductService.php`, linea 608

**Codigo actual**:
```php
public function removeProductsInternalDevolution(Cart $cart): void
{
    $hasNonReturnedItems = CartProduct::where('carrito_id', $cart->carrito_id)
        ->where('devuelto_mensajeria', 0)
        ->exists();

    if ($hasNonReturnedItems) {
        CartProduct::where([
            ['carrito_id', $cart->carrito_id],
            ['devuelto_mensajeria', 1]
        ])->delete();   // ← ELIMINA fisicamente los productos devueltos
    }
}
```

**Codigo propuesto** — marcar como inactivos en vez de borrar:
```php
public function removeProductsInternalDevolution(Cart $cart): void
{
    $hasNonReturnedItems = CartProduct::where('carrito_id', $cart->carrito_id)
        ->where('devuelto_mensajeria', 0)
        ->exists();

    if ($hasNonReturnedItems) {
        CartProduct::where([
            ['carrito_id', $cart->carrito_id],
            ['devuelto_mensajeria', 1]
        ])->update(['status' => 0]);   // ← Marca inactivo, no borra
    }
}
```

**¿Por que `status = 0` y no otra cosa?**

- `status` ya se usa en get-api para excluir productos de los calculos
  de precios (`CartPricingService` filtra `['status', 1]` en todas las
  queries de totales, cupones y estrategias)
- `createOrderFromCartDTO()` itera `$cartDTO->products` que viene del
  DTO armado por `CartDTOFactory::makeInternal()` — este ya solo incluye
  productos con `devuelto_mensajeria = 0` por el global scope del modelo
  `CartProduct`
- Por lo tanto el pedido se sigue creando **solo con los productos activos**
  (mismo resultado que hoy)
- La diferencia: los productos devueltos **permanecen** en
  `store_carrito_productos` con `devuelto_mensajeria=1` y `status=0`,
  dando trazabilidad completa

**Analisis de impacto del cambio**:

| Componente | Impacto |
|------------|---------|
| Global scope `internalDevolution` en `CartProduct` | Filtra `devuelto_mensajeria=0` → los devueltos ya son invisibles para queries normales. **Sin impacto.** |
| `CartPricingService` (calculos de totales) | Filtra `['status', 1]` → productos con `status=0` no entran en totales. **Sin impacto.** |
| `CartDTOFactory::makeInternal()` | Usa la relacion `products()` del modelo que tiene el global scope. **Sin impacto.** |
| `createOrderFromCartDTO()` | Itera `$cartDTO->products` (ya filtrado). **Sin impacto.** |
| Queries directas con `DB::table('store_carrito_productos')` | Revisar en `CartController` V1 — usan `status=1` en WHERE. **Sin impacto.** |
| `cloneCart()` en `CartRepository` | Replica productos cargados via `$cartOrigin->load(['products'])` que tiene el scope. **Sin impacto.** |

**Riesgo**: BAJO. El cambio es de `->delete()` a `->update(['status' => 0])`.
Los productos ya eran invisibles por el global scope de `devuelto_mensajeria`.
El `status=0` adicional es un cinturon de seguridad para cualquier query
que no use el global scope.

### cms-stirpe (no se modifica)

Solo lectura. No escribe en `store_carrito`.

### api-crontab-v2 (cambio futuro opcional)

Podria agregar tareas para:
- Marcar carritos como `abandonado` (24h sin confirmar)
- Marcar carritos como `archivado` (30 dias sin convertir)

Esto es opcional y se puede implementar despues.

---

## 6. Migracion de datos existentes

No se requiere migracion de datos. Los campos nuevos son nullable y
los campos existentes (`carrito_asistido_anulado`, etc.) ya tienen
sus valores correctos. Los carritos existentes no anulados tienen
`carrito_asistido_anulado IS NULL`, que es el valor esperado.

---

## 7. Reflejo en la UI

### Listado de carritos (Index.vue)

- Si `carrito_asistido_anulado = 1`: badge rojo "Anulado"
- Si `carrito_asistido_archivado IS NOT NULL`: oculto del listado
  por defecto, visible con filtro "Mostrar archivados"

### Detalle de carrito anulado

Banner superior en el detalle de la venta:

```
┌─────────────────────────────────────────────────────────┐
│  ✕  Este carrito fue anulado                            │
│     23 mar 2026, 3:45 PM · Por: Pedro Rodriguez         │
│     Motivo: Cliente no acepto ningun producto             │
└─────────────────────────────────────────────────────────┘
```

El carrito anulado se muestra en modo solo lectura: productos visibles
(los devueltos con indicador visual), pero sin acciones de edicion.

---

## 8. Modales de confirmacion (frontend)

### 8.1 Anular pedido (MensajeriaDetalle.vue)

**Trigger**: El mensajero mueve todos los productos a "devolver" →
el footer cambia de COBRAR a boton rojo "Anular pedido — devolver todo".

**Modal AnularPedidoModal.vue**:
- Icono rojo (`PackageX`)
- Titulo: "El cliente no se queda con nada"
- Lista de productos devueltos con precio tachado
- Aviso: "Se anulara el carrito y las prendas quedaran como devueltas"
- Botones: Volver + Confirmar anulacion (rojo)
- Al confirmar: `POST /mensajeria/{carrito}/anular`

**Backend** (`EntregasController::anularEntregaMensajeria`):
1. Validar que todos los productos tienen `devuelto_mensajeria = 1`
2. Escribir `carrito_asistido_anulado = 1`
3. Escribir `anulado_por`, `anulado_fecha`, `anulado_motivo`
4. Marcar entrega como completada con observacion de anulacion
5. Retornar exito

### 8.2 Confirmar antes de cobrar (MensajeriaDetalle.vue)

**Trigger**: Mensajero selecciona metodo de pago (link, datafono, efectivo).

**Modal ConfirmarCobroModal.vue** (se interpone antes de ejecutar el pago):
- Total grande centrado
- Lista compacta de productos activos con precio
- Si hay devueltos: nota "N producto(s) sera(n) devuelto(s)"
- Texto breve segun metodo de pago
- Botones: Cancelar + Cobrar $XXX (primario)
- Al confirmar: ejecuta el flujo de pago existente (mismos endpoints)

### 8.3 Confirmar pago del cliente (ConfirmacionVenta.vue)

**Trigger**: Cliente hace clic en "CONFIRMAR PEDIDO" en pagina de
confirmacion cuando `metodo_envio = 'servientrega'` (pago anticipado).

**Modal inline** (Dialog existente de Reka UI):
- Total grande centrado (`text-4xl`)
- Lista compacta de productos con precio
- Nota: "Seras redirigido a la pasarela de pago segura"
- Botones: Volver + Pagar $XXX (con icono candado)
- Al confirmar: ejecuta `handleConfirmar()` existente

**Para mensajeria**: no aplica. El boton confirma directo porque el pago
se cobra despues con el mensajero.

---

## 9. Mockups de referencia

| Mockup | Ubicacion |
|--------|-----------|
| Mis Entregas (anulacion + confirmacion cobro) | `docs/modulos/002-tipo-cobro/mockups/mis-entregas-v2.html` |
| Pagina confirmacion cliente (modal pago) | `docs/modulos/002-tipo-cobro/mockups/confirmacion-cliente.html` |

---

## 10. SQL completo a ejecutar

```sql
-- 1. Metadata de anulacion (3 columnas nuevas)
ALTER TABLE store_carrito ADD COLUMN anulado_por INT NULL AFTER carrito_asistido_anulado;
ALTER TABLE store_carrito ADD COLUMN anulado_fecha DATETIME NULL AFTER anulado_por;
ALTER TABLE store_carrito ADD COLUMN anulado_motivo VARCHAR(255) NULL AFTER anulado_fecha;

-- 2. Archivado (1 columna nueva)
ALTER TABLE store_carrito ADD COLUMN carrito_asistido_archivado DATETIME NULL AFTER anulado_motivo;
```

No se requiere migracion de datos.
