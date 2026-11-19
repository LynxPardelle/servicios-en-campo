# Servicios en Campo

Asignar y cerrar órdenes de servicio para clientes con horario, unidad responsable y evidencia de atención.

Producto nuevo de ZooBeriah Systems inspirado en el dominio de [BCAN](https://github.com/LynxPardelle/BCAN). La base se escribió de forma independiente: no incluye código, marca, contenido ni datos del proyecto de referencia.

## Alcance de esta preparación

- Frontend Angular 22.3 con componentes standalone y NgRx SignalStore.
- Endpoint serverless `GET /api/health`; infraestructura SAM con Lambda Node.js 24 ARM64, HTTP API y almacenamiento DynamoDB bajo demanda, más bucket privado para evidencia.
- Modelo de dominio puro con seis pruebas de reglas. `services/domain/order.mjs` ofrece `assignOrder` y `transitionOrder`: controla organización, versión esperada, traslapes, estados válidos y evidencia al completar. Son funciones puras; no reservan capacidad ni escriben en AWS.
- Plan por fases para conectar identidad, persistencia, interfaz y piloto. El flujo comercial todavía no está disponible de extremo a extremo.

## Arranque y comprobación

Desde la raíz, usar los scripts de `package.json` para preparar y arrancar la base. Comandos directos de comprobación:

```powershell
node --test services/domain/order.test.mjs
npm --prefix web ci
npm --prefix web run build
```

La consola Angular de preparación consulta el health mediante el proxy local. Las pruebas de dominio no necesitan AWS ni credenciales. El comando de servidor local y el resto de las verificaciones están definidos en los scripts de la raíz.

## Documentación

- [Producto](docs/PRODUCTO.md): comprador, flujo, límites y validación comercial.
- [Arquitectura](docs/architecture/ARCHITECTURE.md) y [diagrama](docs/architecture/diagram.mmd).
- [Plan ejecutable](plan/architecture-foundation-1.md): el primer trabajo pendiente es `TASK-002`: identidad, membresía y permisos de coordinador/operador antes de publicar una ruta de negocio.
- [Operación](docs/operacion.md): ambientes, despliegue futuro, verificación y reversión.
- [Procedencia](docs/PROVENANCE.md): separación del proyecto original.

## Ambientes

| Ambiente | Rama | Stack |
|---|---|---|
| development | development | servicios-en-campo-development |
| testing | testing | servicios-en-campo-testing |
| production | main | servicios-en-campo-production |

Los cambios siguen `development → testing → main` mediante PR. Las plantillas y configuración están preparadas; crear el repositorio y sus ambientes no equivale a desplegar recursos de AWS.


## Base compartida y operación local

Ver [base local](docs/BASE-LOCAL.md) y [promoción](docs/promocion.md). Instalar con npm --prefix web ci; validar con npm test, npm run check:config, npm run test:web y npm run build:web. Para el recorrido local abrir dos terminales: npm run dev:api y npm run dev:web. Los resultados de preparación quedarán en [verificación](docs/VERIFICACION.md).
