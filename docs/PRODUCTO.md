# Servicios en Campo

## Problema y comprador

Asignar y cerrar órdenes de servicio para clientes con horario, unidad responsable y evidencia de atención.

Cliente inicial: Coordinadores de equipos que realizan instalaciones, asistencia y otros servicios en ubicaciones de clientes.

## Propuesta de producto

Crear orden → asignar unidad libre → iniciar visita → adjuntar evidencia → cerrar orden → consultar historial.

La primera versión debe completar este flujo con una organización y usuarios de prueba. La preparación actual contiene la base técnica y reglas puras; la persistencia, autenticación y operación comercial se implementan por fases.

## Modelo de ingresos y validación

Alta de organización y configuración del flujo, más suscripción por equipo operativo. Validar el precio con un piloto; no hay ingresos ni demanda confirmados.

El piloto deberá medir tiempo de operación antes/después, errores evitados, usuarios que repiten el flujo y costo por organización. Son hipótesis de producto; el estado del repositorio no acredita demanda.

## Alcance inicial

- Órdenes por cliente con servicio, dirección, horario y unidad asignada.
- Agenda sin doble reserva para la misma unidad.
- Inicio y cierre con evidencia y registro de actor/fecha.
- Historial visible a los miembros autorizados.
- La primera agenda usa tramos de 15 minutos y duración máxima de 8 horas para poder reservarlos atómicamente. Horarios locales se convierten a instantes con zona.

## Fuera de la primera versión

Optimización automática de rutas, rastreo continuo de ubicación, expedientes médicos, cobro de fondos y facturación fiscal.

## Aislamiento y datos

Organizaciones separadas por membresías verificadas. El navegador nunca define su autoridad enviando un `organizationId`. Usar datos sintéticos hasta pasar las pruebas de permisos, respaldo y retención. El modelo conceptual proviene de BCAN; toda la implementación y el diseño de este producto son propios.

## Primera tarea

`TASK-002`: identidad, membresía y permisos de coordinador/operador antes de publicar una ruta de negocio.

