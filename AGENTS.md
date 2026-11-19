# Instrucciones del producto

- Este repositorio pertenece a Servicios en Campo; la carpeta raíz es su contexto de trabajo.
- Arquitectura autorizada: Angular standalone con NgRx SignalStore; backend por límites de dominio en AWS Lambda y recursos administrados por SAM.
- Promoción: `development → testing → main`; ambientes `development`, `testing`, `production`. Usar PR y checks; no omitir controles.
- Tratar `docs/PRODUCTO.md`, `docs/architecture/ARCHITECTURE.md` y `plan/architecture-foundation-1.md` como contexto de producto y ejecución.
- El único endpoint de esta base es `GET /api/health`. Implementar identidad, membresía y autorización antes de exponer datos o comandos de negocio.
- Nunca derivar la organización autorizada de un campo enviado por el navegador. Todas las claves persistidas deben estar acotadas a organización y ámbito del usuario.
- Conservar cambios existentes; no incorporar contenido, marcas, usuarios, secretos ni datos de BCAN. Los originales son referencia conceptual.
- Ejecutar las pruebas pertinentes y `npm --prefix web run build` cuando cambie el frontend. No desplegar recursos, cambiar DNS ni usar datos reales como parte de la preparación de la base.

