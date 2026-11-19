# Operación de Servicios en Campo

## Estado inicial

La preparación contiene código local, plantilla y planes. No acredita un despliegue ni un flujo comercial operativo. El health sólo valida que su handler responde; no acredita identidad, datos ni disponibilidad de servicios futuros.

## Mapa de ambientes

Usar `infra/environments.json`. development y testing nunca usan datos de producción. Cada stack debe tener su rol y credenciales OIDC acotados al ambiente. El registro de variables, secretos y permisos AWS se realiza cuando se configure el despliegue; no incluir valores reales en Git.

## Validación local

```powershell
node --test services/domain/order.test.mjs
npm --prefix web ci
npm --prefix web run build
```

Validar la plantilla con AWS SAM o cfn-lint antes de crear cambios. La suite de infraestructura y CI de la raíz comprueba también las convenciones compartidas.

## Despliegue futuro

Después de configurar la cuenta y rol del ambiente, revisar el change set desde `infra/`:

```powershell
sam build --config-env development
sam deploy --config-env development
```

El `samconfig.toml` local a `infra/` fija stack y Stage. Repetir con `testing` o `production` sólo después de la promoción correcta y con el rol de ese ambiente. La confirmación de cambios queda activada. La preparación no ejecuta estos comandos.

## Señales y recuperación

- Comprobar `HealthUrl` tras cada despliegue; debe devolver `status=ok`, el producto correcto y Stage esperado.
- Medir errores, throttling y latencia de Lambda/API por stack. No registrar cuerpos con datos de clientes ni tokens.
- Revertir código usando el artefacto previo de ese ambiente y un nuevo change set revisado. No restaurar una tabla completa encima de datos nuevos.
- Probar la restauración DynamoDB hacia una tabla aparte antes del piloto. PITR de producción genera costos; development/testing lo tienen desactivado en esta base.
- La tabla y el bucket tiene retención al borrar el stack. Inventariar y limpiar recursos retenidos con un procedimiento explícito; destruir el stack no equivale a limpiar los datos.
- Definir el plazo y acceso de evidencia antes del piloto. S3 versionado conserva versiones antiguas; no hay borrado automático configurado.

## Primer piloto

Crear orden → asignar unidad libre → iniciar visita → adjuntar evidencia → cerrar orden → consultar historial.

Ejecutarlo con usuarios y datos sintéticos primero en development, luego en testing. Exigir pruebas de acceso cruzado, reintentos, concurrencia y restauración. La promoción a main queda condicionada a evidencia del piloto y al control de ramas.

