# Diagnóstico de disparos automáticos de Actions

Fecha de comprobación: 2026-11-19.

## Hechos

- Repositorio público, Actions enabled y workflows activos en main.
- ci.yml admite push/pull_request en development, testing y main, y workflow_dispatch.
- promocion.yml admite pull_request_target opened/reopened/synchronize/edited/ready_for_review hacia testing y main; no hace checkout ni ejecuta código del PR.
- GitHub recibió el PR #1 del propietario, fusionable, mismo repositorio y sin marcas para omitir CI.
- No se observó ningún run automático de esos eventos durante la preparación. El cierre/reapertura se probó adicionalmente en servicios-en-campo sin producir un run.
- La ejecución manual 44594853888 terminó success.
- Los intentos de actualización directa de testing y main recibieron Repository rule violations (HTTP 422).
- Las políticas explícitas de eventos están registradas en .github/settings-reference.json.
- La ausencia de ejecuciones no tiene causa confirmada; no se atribuye a GITHUB_TOKEN ni a un incidente general de GitHub.
- El navegador disponible no tenía sesión de GitHub. No se inició ni modificó autenticación.
- Los PR de diagnóstico se cerraron sin fusionarse. Las protecciones se conservaron.

## Reproducción y evidencia para soporte

1. Con sesión web del propietario, abrir un PR de development a testing con un cambio de documentación y comprobar si aparecen zoo/ci y zoo/promotion/testing.
2. Si faltan, registrar evento, hora UTC, actor, SHA, workflow IDs, políticas y respuesta de Actions.
3. Comparar con una ejecución manual de ci.yml sobre la misma rama. No quitar reglas ni declarar aprobación de origen basándose sólo en CI.
4. Adjuntar a GitHub Support la evidencia pública de este repositorio. Este documento no se envió a soporte.

PR: https://github.com/LynxPardelle/servicios-en-campo/pull/1

CI manual: https://github.com/LynxPardelle/servicios-en-campo/actions/runs/44594853888

API: GET /repos/LynxPardelle/servicios-en-campo/actions/workflows ; GET /repos/LynxPardelle/servicios-en-campo/actions/runs ; GET /repos/LynxPardelle/servicios-en-campo/pulls/1 ; GET /repos/LynxPardelle/servicios-en-campo/commits/<sha>/check-runs

[Diagnóstico oficial](https://docs.github.com/en/actions/how-tos/troubleshoot-workflows) · [Eventos](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows) · [Políticas de Actions](https://docs.github.com/en/rest/actions/policies) · [GitHub Support](https://support.github.com/contact)

## Operación mientras se investiga

Se puede continuar en development y ejecutar localmente npm test, npm run test:web y npm run build:web. También se puede ejecutar gh workflow run ci.yml --ref development --repo LynxPardelle/servicios-en-campo. La promoción sigue esperando sus checks obligatorios; una ejecución manual de CI no sustituye el gate de procedencia. AWS permanece desactivado.
