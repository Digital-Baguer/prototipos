# Analisis: Estado del Carrito de Venta Asistida

> **Fecha**: 2026-03-23
> **Estado**: En revision
> **Alcance**: Agregar maquina de estados al carrito de venta asistida,
> flujo de anulacion, y modales de confirmacion de cobro.

---

## 1. Problema actual

El estado de un carrito de venta asistida se infiere cruzando 5 campos
booleanos independientes:

| Para saber si... | Hay que revisar |
|-------------------|-----------------|
| Es venta asistida | `es_venta_asistida = 1` |
| Esta confirmado | `carrito_asistido_confirmado IS NOT NULL` |
| Fue convertido a pedido | `pedido_id_convertido IS NOT NULL AND != 0` |
| Esta anulado | `carrito_asistido_anulado = 1` (nunca se escribe hoy) |
| Esta cerrado | `carrito_cerrado = 1 AND carrito_bloqueado = 1` |

Esto genera:
- Queries complejas con multiples condiciones para filtrar carritos
- Ambiguedad en estados intermedios (ej: confirmado pero no convertido ¿esta activo?)
- No hay forma de anular un carrito y registrar quien, cuando y por que
- No hay forma de archivar carritos viejos sin eliminarlos
- No hay forma de distinguir un carrito abandonado de uno activo

---

## 2. Solucion propuesta

### 2.1 Nueva columna `estado_asistido`

```sql
ALTER TABLE store_carrito ADD COLUMN estado_asistido
    ENUM('borrador','confirmado','convertido','anulado','abandonado','archivado')
    NULL DEFAULT NULL
    AFTER es_venta_asistida;

ALTER TABLE store_carrito ADD INDEX idx_estado_asistido (estado_asistido);
```

| Estado | Significado | Equivalencia actual |
|--------|-------------|---------------------|
| `borrador` | Asesor esta armando el carrito | `es_venta_asistida=1`, sin confirmar, sin convertir |
| `confirmado` | Cliente confirmo el listado | `carrito_asistido_confirmado IS NOT NULL` |
| `convertido` | Se creo pedido asociado | `pedido_id_convertido IS NOT NULL AND != 0` |
| `anulado` | Asesor o mensajero anulo | `carrito_asistido_anulado = 1` (sin uso hoy) |
| `abandonado` | Sin actividad 24h+ sin confirmar | No existe hoy |
| `archivado` | Asesor archivo o 30 dias sin convertir | No existe hoy |

**`NULL`** = No es venta asistida (carritos normales de tienda online).
Solo se escribe cuando `es_venta_asistida = 1`.

**Nota**: `convertido` indica que el carrito genero un pedido. No implica
que el pedido este pagado — el estado de pago le pertenece al pedido
(`shop_pedidos.estado_pedido_id`), no al carrito. El ciclo de vida del
carrito termina al convertirse.

### 2.2 Columnas de metadata de anulacion

```sql
ALTER TABLE store_carrito ADD COLUMN anulado_por INT NULL AFTER carrito_asistido_anulado;
ALTER TABLE store_carrito ADD COLUMN anulado_fecha DATETIME NULL AFTER anulado_por;
ALTER TABLE store_carrito ADD COLUMN anulado_motivo VARCHAR(255) NULL AFTER anulado_fecha;
```

| Columna | Tipo | Descripcion |
|---------|------|-------------|
| `anulado_por` | INT NULL | `user_id` del usuario que anulo (asesor o mensajero) |
| `anulado_fecha` | DATETIME NULL | Fecha y hora de la anulacion |
| `anulado_motivo` | VARCHAR(255) NULL | Motivo de la anulacion |

### 2.3 Motivos de anulacion predefinidos

| Origen | Motivo por defecto |
|--------|--------------------|
| Mensajero (devuelve todo) | "Cliente no acepto ningun producto en la entrega" |
| Asesor (desde panel) | Seleccionable: "Cliente desistio", "Error en el pedido", "Productos agotados", "Otro" + campo libre |

---

## 3. Diagrama de transiciones

```
                    ┌──────────────┐
                    │              │
          ┌────────►│  abandonado  │
          │ (cron   │              │
          │  24h)   └──────────────┘
          │
    ┌─────┴─────┐     confirmar     ┌─────────────┐     checkout      ┌─────────────┐
    │           ├──────────────────►│             ├──────────────────►│             │
    │ borrador  │                   │ confirmado  │                   │ convertido  │
    │           │◄──────────────────┤             │                   │             │
    └─────┬─────┘   desconfirmar    └──────┬──────┘                   └─────────────┘
          │          (solo admin)          │
          │                               │
          │         ┌──────────────┐      │
          │         │              │      │
          ├────────►│   anulado    │◄─────┘
          │ anular  │              │  anular
          │         └──────────────┘
          │
          │         ┌──────────────┐
          │         │              │
          └────────►│  archivado   │
            archivar│              │
            (manual └──────────────┘
             o cron
             30 dias)
```

**Transiciones permitidas**:

| Desde | Hacia | Quien | Cuando |
|-------|-------|-------|--------|
| `borrador` | `confirmado` | Cliente (via link confirmacion) | Al confirmar el listado |
| `borrador` | `anulado` | Asesor | Decide no continuar con la venta |
| `borrador` | `abandonado` | Cron (api-crontab-v2) | 24h sin actividad del cliente |
| `borrador` | `archivado` | Asesor manual o cron 30 dias | Limpieza |
| `confirmado` | `convertido` | Sistema (checkout) | Al crear pedido via `processCartPayment()` |
| `confirmado` | `anulado` | Asesor o mensajero | Cliente desiste o devuelve todo |
| `confirmado` | `borrador` | Admin | `desconfirmarCarrito()` (backdoor existente) |
| `abandonado` | `borrador` | Asesor | Reactivar carrito abandonado |

**Transiciones NO permitidas** (estados finales):
- Desde `convertido`: el carrito ya cumplio su ciclo. Cualquier accion posterior
  es sobre el **pedido** (cancelar, modificar via `modifyOrder()`).
- Desde `anulado`: estado final. Si se quiere reactivar, se duplica el carrito.
- Desde `archivado`: estado final. Mismo criterio que anulado.

---

## 4. Tracking de productos devueltos

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
   modal de confirmacion → se marca `estado_asistido = 'anulado'`

---

## 5. Pedidos parciales (cobro con productos devueltos)

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

## 6. Impacto en los 4 repositorios

### get-web (se modifica)

| Archivo | Cambio |
|---------|--------|
| `Carrito.php` (modelo) | Agregar accessor `getEstadoDisplay()`, actualizar `esEditable()` |
| `VentaAsistidaController.php` | Escribir `estado_asistido` en `crearCarrito()` y `confirmarVenta()` |
| `EntregasController.php` | Nuevo metodo `anularEntregaMensajeria()`, escribir estado en anulacion |
| `Index.vue` | Badge de estado, filtro por estado |
| `MensajeriaDetalle.vue` | Footer dinamico COBRAR/ANULAR |
| `AnularPedidoModal.vue` | **Nuevo componente** |
| `ConfirmarCobroModal.vue` | **Nuevo componente** |
| `ConfirmacionVenta.vue` | Modal de confirmacion de pago (anticipado) |

### get-api (no se modifica)

get-api no conoce `estado_asistido`. Sus scopes globales (`cartOpen`,
`storeSelected`) siguen funcionando con `carrito_cerrado` y
`pedido_id_convertido`. La nueva columna no afecta ningun query existente.

**Unico punto de contacto**: cuando get-api ejecuta `markAsConverted()`,
get-web deberia actualizar `estado_asistido = 'convertido'`. Esto se
puede hacer:
- **Opcion A**: En el controller de get-web despues de llamar a
  `procesarVenta()` del CarritoService (recomendada — get-web ya
  tiene el contexto)
- **Opcion B**: Que get-api tambien escriba la columna (no recomendada —
  acopla get-api a un campo que solo usa get-web)

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

## 7. Migracion de datos existentes

Para carritos de venta asistida existentes, se puede ejecutar un script
unico que infiera el estado a partir de los campos actuales:

```sql
-- Carritos convertidos a pedido
UPDATE store_carrito
SET estado_asistido = 'convertido'
WHERE es_venta_asistida = 1
  AND pedido_id_convertido IS NOT NULL
  AND pedido_id_convertido != 0;

-- Carritos confirmados pero no convertidos
UPDATE store_carrito
SET estado_asistido = 'confirmado'
WHERE es_venta_asistida = 1
  AND carrito_asistido_confirmado IS NOT NULL
  AND (pedido_id_convertido IS NULL OR pedido_id_convertido = 0)
  AND (carrito_asistido_anulado IS NULL OR carrito_asistido_anulado = 0);

-- Carritos anulados (si hubiera alguno)
UPDATE store_carrito
SET estado_asistido = 'anulado'
WHERE es_venta_asistida = 1
  AND carrito_asistido_anulado = 1;

-- El resto: borradores
UPDATE store_carrito
SET estado_asistido = 'borrador'
WHERE es_venta_asistida = 1
  AND estado_asistido IS NULL;
```

---

## 8. Reflejo del estado en la UI

### Listado de carritos (Index.vue)

| Estado | Badge | Color | Visible en lista principal |
|--------|-------|-------|---------------------------|
| `borrador` | Borrador | Gris | Si |
| `confirmado` | Confirmado | Azul | Si |
| `convertido` | Pedido creado | Verde | Si |
| `anulado` | Anulado | Rojo | No (pestaña "Anulados") |
| `abandonado` | Abandonado | Amarillo | Si (pestaña "Abandonados" o filtro) |
| `archivado` | — | — | No (solo visible con filtro explicito) |

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

## 9. Modales de confirmacion (frontend)

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
2. Actualizar `estado_asistido = 'anulado'`
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

## 10. Mockups de referencia

| Mockup | Ubicacion |
|--------|-----------|
| Mis Entregas (anulacion + confirmacion cobro) | `docs/modulos/002-tipo-cobro/mockups/mis-entregas-v2.html` |
| Pagina confirmacion cliente (modal pago) | `docs/modulos/002-tipo-cobro/mockups/confirmacion-cliente.html` |

---

## 11. SQL completo a ejecutar

```sql
-- 1. Estado del carrito asistido
ALTER TABLE store_carrito ADD COLUMN estado_asistido
    ENUM('borrador','confirmado','convertido','anulado','abandonado','archivado')
    NULL DEFAULT NULL
    AFTER es_venta_asistida;

ALTER TABLE store_carrito ADD INDEX idx_estado_asistido (estado_asistido);

-- 2. Metadata de anulacion
ALTER TABLE store_carrito ADD COLUMN anulado_por INT NULL AFTER carrito_asistido_anulado;
ALTER TABLE store_carrito ADD COLUMN anulado_fecha DATETIME NULL AFTER anulado_por;
ALTER TABLE store_carrito ADD COLUMN anulado_motivo VARCHAR(255) NULL AFTER anulado_fecha;

-- 3. Migracion de datos existentes
UPDATE store_carrito SET estado_asistido = 'convertido'
WHERE es_venta_asistida = 1
  AND pedido_id_convertido IS NOT NULL AND pedido_id_convertido != 0;

UPDATE store_carrito SET estado_asistido = 'confirmado'
WHERE es_venta_asistida = 1
  AND carrito_asistido_confirmado IS NOT NULL
  AND (pedido_id_convertido IS NULL OR pedido_id_convertido = 0)
  AND (carrito_asistido_anulado IS NULL OR carrito_asistido_anulado = 0);

UPDATE store_carrito SET estado_asistido = 'anulado'
WHERE es_venta_asistida = 1 AND carrito_asistido_anulado = 1;

UPDATE store_carrito SET estado_asistido = 'borrador'
WHERE es_venta_asistida = 1 AND estado_asistido IS NULL;
```
