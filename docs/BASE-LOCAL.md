# Base local de Servicios en Campo
Angular 22.3.0, NgRx Signals 22.0.1 y Node.js 24. Aplicación standalone, ruta lazy y estado por ruta. GET /api/health consulta el mismo handler que Lambda; las rutas de negocio permanecen pendientes de identidad y autorización.
## Verificación
Ejecutar desde la raíz: npm --prefix web ci, npm test, npm run check:config, npm run test:web y npm run build:web.
## Uso local
Abrir dos terminales: npm run dev:api y npm run dev:web. API en 127.0.0.1:4201 y Angular en localhost:4200. El proxy web/proxy.conf.json conecta /api al backend local.
## Ambientes
development usa rama development; testing usa testing; production usa main. infra/environments.json asigna un stack independiente a cada uno. Angular soporta builds --configuration development/testing/production sin incluir secretos.
## Infraestructura
cfn-lint -t infra/template.yaml valida la plantilla. Desde infra/: sam build --config-env development y sam deploy --config-env development. El despliegue real y el alojamiento web requieren configurar AWS conforme al plan; esta preparación no crea recursos.
