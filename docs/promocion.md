# Ambientes y promoción

| Ambiente GitHub | Rama exacta | Stack |
| --- | --- | --- |
| development | development | servicios-en-campo-development |
| testing | testing | servicios-en-campo-testing |
| production | main | servicios-en-campo-production |

El cambio entra en development. Se promueve por PR development → testing → main usando merge commits. Testing y main requieren zoo/ci y zoo/promotion/testing o zoo/promotion/production. Los tres carriles bloquean borrado y force push; no hay bypass configurado.

El control de origen usa pull_request_target de metadatos exclusivamente, sin checkout ni ejecución del código del PR. Comprueba la rama de origen y el ID del mismo repositorio. CI usa pull_request con permisos de lectura y no obtiene credenciales AWS.

Se conserva el modelo de cero aprobaciones obligatorias de la primera ronda para que un propietario individual pueda promover. Estas reglas exigen PR, origen y pruebas; no acreditan revisión humana independiente. El administrador puede modificar las reglas. development admite integración directa y PR desde feature.

## Conexión AWS pendiente

El deploy está desactivado por defecto: sólo se habilita con ENABLE_AWS_DEPLOY=true como variable de repositorio después de configurar y probar los ambientes. AWS_DEPLOY_ROLE_ARN y AWS_REGION son variables de cada GitHub Environment; no se almacenan claves AWS de larga duración. El rol debe aceptar OIDC aud=sts.amazonaws.com y sub=repo:LynxPardelle/servicios-en-campo:environment:<ambiente>, limitado a su stack y recursos.

El job de despliegue depende de CI, comprueba la rama y sólo despliega el backend. Comprueba el output HealthUrl y el ambiente devuelto. El artefacto Angular se guarda en Actions; su alojamiento web se completa en la siguiente fase. No se han provisionado cuentas, roles, dominios ni certificados.

## Verificación y reversión

Revisar Settings → Rules → Rulesets y Settings → Environments antes de promover. La evidencia de esta preparación se guarda en docs/VERIFICACION.md. Para revertir: commit de revert en development y promoción por testing y main, sin borrar ni reescribir los carriles. Tablas y buckets tienen retención; revertir código no revierte datos.

[Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets) · [OIDC en AWS](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws)
