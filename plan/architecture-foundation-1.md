---
goal: Preparar y completar el primer flujo de Servicios en Campo
version: 1
date_created: 2026-11-19
last_updated: 2026-11-19
owner: ZooBeriah Systems
status: In progress
tags: [architecture, angular, serverless, product]
---

# Introduction

![Status: In progress](https://img.shields.io/badge/status-In%20progress-yellow)

Asignar y cerrar órdenes de servicio para clientes con horario, unidad responsable y evidencia de atención. Este plan diferencia la preparación técnica del flujo comercial pendiente.

## 1. Requirements & Constraints

- **REQ-001**: Angular standalone con NgRx SignalStore por flujo.
- **REQ-002**: Backend por dominio en Lambda Node.js 24 y AWS SAM.
- **REQ-003**: Ambientes independientes development, testing y production; ramas development, testing y main.
- **SEC-001**: Validar JWT y resolver membresía antes de exponer una ruta de negocio.
- **SEC-002**: Nunca aceptar del navegador la organización, comprador, precio o permiso como prueba de autoridad.
- **CON-001**: Sólo `GET /api/health` queda expuesto en esta base.
- **CON-002**: No copiar código, contenido ni datos del proyecto BCAN; datos sintéticos en pruebas.
- **PAT-001**: Escritor condicional, versiones esperadas e idempotencia transaccional; mínimo costo en reposo.
- **PAT-002**: Los servicios poseen su almacenamiento. SQS/Step Functions sólo se añaden por un proceso concreto.

## 2. Implementation Steps

### Implementation Phase 1

- GOAL-001: Dejar arquitectura, infraestructura base y reglas puras comprobadas.

| Task | Description | Completed | Date |
|---|---|---|---|
| TASK-001 | Crear documentos, `infra/template.yaml`, configuración de tres ambientes y `services/domain/order.mjs` con seis pruebas de reglas. El frontend/health y controles compartidos se verifican en la preparación integral. | ✅ | 2026-11-19 |

### Implementation Phase 2

- GOAL-002: Completar identidad y el primer comando persistente. Depende de TASK-001.

| Task | Description | Completed | Date |
|---|---|---|---|
| TASK-002 | Crear `services/shared/identity.mjs` y autorizador JWT de API Gateway/Cognito. Resolver organización por membresía activa del `sub`, no por el cuerpo ni por un header libre. Roles iniciales `coordinator` y `operator`. Aceptación: Pruebas de token ausente, organización ajena y operador que modifica una orden no asignada: denegados; health permanece público. | | |
| TASK-003 | Crear `services/dispatch/repository.mjs` y `services/dispatch/handler.mjs`. Guardar orden/version e idempotencia con escrituras condicionales. Para la agenda piloto usar tramos de 15 minutos, citas de hasta 8 horas y reserva atómica de todos los tramos de la unidad; la validación debe rechazar horas fuera de esa cuadrícula. Aceptación: Dos asignaciones concurrentes al mismo tramo producen una sola aceptación; reintentar la misma clave no crea otra orden; la versión anterior falla. | | |
| TASK-004 | Implementar en `web/src/app/features/dispatch/` las vistas de pendientes, asignación y cierre con SignalStore por ruta. Usar hora local sólo para presentación y enviar instantes ISO con zona al backend. Aceptación: Un coordinador completa el flujo con dos órdenes sintéticas y ve un conflicto de horario sin perder el formulario. | | |

### Implementation Phase 3

- GOAL-003: Completar el flujo y comprobarlo en ambientes inferiores. Depende de los tres trabajos anteriores.

| Task | Description | Completed | Date |
|---|---|---|---|
| TASK-005 | Crear `services/evidence/handler.mjs` para enlaces firmados de subida y lectura. Comprobar membresía y relación orden/archivo; usar claves generadas por servidor en el bucket privado. Incorporar registro de cambios sólo después de confirmar la operación. Aceptación: Un operador puede adjuntar evidencia de su orden; otra organización y una clave de otro expediente reciben 403; tamaño/tipo permitidos se validan. | | |
| TASK-006 | Ejecutar piloto en development y repetirlo en testing con datos sintéticos. Medir asignaciones exitosas, conflictos, duración y fallos de cierre; fijar política de retención de evidencia antes de usar datos de clientes. Aceptación: Flujo completo documentado, prueba de restauración, respaldo identificado y revisión del costo observado antes de promover testing → main. | | |

## 3. Alternatives

- **ALT-001**: Servidores siempre activos no se eligen para esta primera versión por su costo en reposo.
- **ALT-002**: Step Functions no agrega valor al CRUD de la base; reconsiderar para procesos con etapas recuperables.
- **ALT-003**: Reutilizar el proyecto original se descarta en esta preparación; una implementación propia separa marca, datos y reglas de cliente.

## 4. Dependencies

- **DEP-001**: Node.js 24, Angular 22.3 y NgRx Signals 22.0.1.
- **DEP-002**: AWS SAM CLI o cfn-lint para infraestructura.
- **DEP-003**: Cuenta y roles OIDC por ambiente, aún sin provisionar por esta preparación.
- **DEP-004**: Acordar retención y recuperación antes de incorporar datos de clientes.

## 5. Files

- **FILE-001**: `services/domain/order.mjs` y `order.test.mjs`.
- **FILE-002**: `infra/template.yaml`, `infra/environments.json`, `infra/samconfig.toml`.
- **FILE-003**: `web/src/app/features/` para el flujo Angular.
- **FILE-004**: `services/shared/identity.mjs` y los adaptadores futuros descritos en cada tarea.
- **FILE-005**: `docs/architecture/ARCHITECTURE.md`, `docs/PRODUCTO.md`, `docs/operacion.md`.

## 6. Testing

- **TEST-001**: Ejecutar `node --test services/domain/order.test.mjs`; seis casos de dominio deben pasar.
- **TEST-002**: Probar token ausente, membresía retirada y acceso cruzado por organización antes de exponer negocio.
- **TEST-003**: Ejecutar dos comandos concurrentes contra DynamoDB real de development y demostrar una sola aceptación cuando compiten por el mismo recurso.
- **TEST-004**: Completar el flujo sintético en Angular y repetirlo en testing con un usuario independiente.
- **TEST-005**: Compilar `web/`, validar SAM, revisar el artefacto y probar restauración hacia recursos separados.

## 7. Risks & Assumptions

- **RISK-001**: Una prueba pura no demuestra atomicidad de DynamoDB. Las tareas de persistencia bloquean la operación comercial.
- **RISK-002**: Datos retenidos, logs, backups y versiones de archivos pueden generar costo sin solicitudes.
- **RISK-003**: Se debe validar la utilidad y precio del producto con compradores; no hay demanda confirmada.
- **ASSUMPTION-001**: El primer piloto usa una organización y datos sintéticos; el aislamiento entre dos organizaciones se prueba antes de datos reales.

## 8. Related Specifications / Further Reading

- [Producto](../docs/PRODUCTO.md)
- [Arquitectura](../docs/architecture/ARCHITECTURE.md)
- [AWS SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html)
- [DynamoDB bajo demanda](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/on-demand-capacity-mode.html)
- [NgRx SignalStore](https://ngrx.io/guide/signals/signal-store)

