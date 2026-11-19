# Verificación de la base

Fecha: 2026-11-19.

- 10 pruebas Node de dominio, health, mapeo de ambientes y recorrido HTTP local aprobadas.
- 3 pruebas Angular de carga, fallo/reintento y respuesta inválida aprobadas.
- Build Angular production aprobado. Development y testing definidos por separado.
- Plantilla SAM validada con cfn-lint 1.60.1 sin hallazgos.
- Mapeo development/development, testing/testing y production/main comprobado; stacks separados.
- Dependencias web de producción: auditoría sin hallazgos; los cinco lockfiles resuelven el mismo conjunto de dependencias.
- Código nuevo; sin copiar datos, contenido ni marcas de los repositorios de origen.

GitHub tiene tres rulesets activos sin bypass; testing y main requieren PR, zoo/ci y su check de origen de GitHub Actions (app 15368). Los tres GitHub Environments están restringidos a sus ramas exactas. El despliegue AWS está desactivado. Identidad, persistencia de negocio, alojamiento web y el primer piloto siguen en el plan. Las pruebas puras no acreditan autorización ni transacciones distribuidas.

## Configuración remota confirmada

- integrity: https://github.com/LynxPardelle/servicios-en-campo/rules/27667624
- testing: https://github.com/LynxPardelle/servicios-en-campo/rules/27667630
- production: https://github.com/LynxPardelle/servicios-en-campo/rules/27667635

ENABLE_AWS_DEPLOY=false comprobado como variable del repositorio. Las promociones se registran en el historial de pull requests y sus checks; los merge commits conservan el origen development → testing → main.
