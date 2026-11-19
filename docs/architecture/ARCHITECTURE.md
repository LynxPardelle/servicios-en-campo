# Arquitectura de Servicios en Campo

## Decisión

Usar Angular standalone para la aplicación, NgRx SignalStore por flujo y carga diferida por ruta. El backend se divide por capacidad de negocio; cada servicio mantiene sus contratos, autorización y almacenamiento. La base sólo expone health.

HTTP API y Lambda Node.js 24 ARM64 atienden comandos y consultas cortas. DynamoDB `PAY_PER_REQUEST` conserva el estado. S3 privado almacena evidencia mediante enlaces firmados de corta duración; los archivos no pasan por el handler de negocio.

## Límites de servicio previstos

| Servicio | Responsabilidad | Almacenamiento |
|---|---|---|
| Identidad/membresías | Resolver organización, rol y unidades permitidas desde el usuario autenticado | Tabla propia futura |
| Operación | Órdenes, asignaciones, reservas e historial de cambios | OperationsTable |
| Evidencia | Validar pertenencia orden/archivo y emitir enlaces firmados | EvidenceBucket y metadatos de operación |
| Notificaciones | Avisos de asignación/cierre después de una escritura confirmada | SQS y DLQ cuando exista el primer consumidor |

La plantilla actual materializa HTTP API, health, logs y OperationsTable con EvidenceBucket privado. Los límites futuros no se anuncian como endpoints ya implementados.

## Patrones y consistencia

- **Tenant boundary:** membresía derivada del JWT validado y comprobada en cada operación.
- **Optimistic concurrency:** versión esperada y condición en la escritura; una lectura seguida de escritura incondicional no protege la operación.
- **Idempotencia:** clave acotada a organización y usuario/cuenta, hash del comando y resultado persistido en la misma transacción que el cambio.
- **Reserva atómica de capacidad:** la validación pura de traslapes ayuda al dominio, pero el repositorio futuro debe reservar todos los tramos y la versión de la orden en una transacción condicional.
- **Mensajería por necesidad:** SQS con DLQ para avisos y reintentos de consumidores. No agregar un bus sin productores/consumidores definidos.
- **Orquestación:** no usar Step Functions para el CRUD. Añadir una máquina de estados sólo si un proceso real requiere esperas, recuperación por etapa o compensación.

## API y seguridad

`GET /api/health` es público y no consulta datos de negocio. Las demás rutas no están creadas. Antes de añadirlas, configurar Cognito/JWT y permisos por recurso. Mantener CORS restringido a los orígenes de cada ambiente; la base usa mismo origen/proxy y no declara comodines.

El bucket bloquea acceso público, aplica propiedad del propietario y cifra con SSE-S3. La política rechaza HTTP sin TLS. Los permisos de subida y lectura de evidencia aún no existen; se agregarán al servicio específico, no al health.

## Ambientes y promoción

Tres stacks independientes en `infra/environments.json`: development/development, testing/testing y production/main. Nombres físicos generados por CloudFormation evitan colisiones de tablas y buckets. Idealmente usar cuentas AWS separadas; si se usa una cuenta al inicio, exigir roles OIDC y recursos separados por stack. No compartir datos, secretos ni pools de usuarios entre ambientes.

GitHub valida la cadena `development → testing → main`. Una promoción no debe reconstruir reglas de negocio diferentes ni usar secretos de otro ambiente. La base no tiene despliegue automático de AWS configurado.

## Costos y operación

Sin instancias, NAT Gateway, balanceador, OpenSearch ni capacidad Lambda aprovisionada. El cómputo se factura por uso; DynamoDB usa capacidad bajo demanda. Persisten costos posibles por almacenamiento, logs, backups y transferencia, además de versiones de evidencia en S3. No se promete costo cero.

Logs: 14 días. Point-in-time recovery de DynamoDB está activo sólo en producción; debe presupuestarse antes del piloto. Tabla y bucket usa `Retain`: borrar el stack no elimina los datos ni sus costos. Documentar retención y limpieza antes de datos reales. Presupuestos, alertas y prueba de restauración son condiciones del piloto.

## Estado verificable

`services/domain/order.mjs` ofrece `assignOrder` y `transitionOrder`: controla organización, versión esperada, traslapes, estados válidos y evidencia al completar. Son funciones puras; no reservan capacidad ni escriben en AWS.

Las seis pruebas de dominio pasan con Node 24. No hay garantía de concurrencia distribuida hasta implementar y verificar el repositorio transaccional.

