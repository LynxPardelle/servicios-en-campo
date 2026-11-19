# Actions: incidencia inicial y recuperación verificada

## Estado actual — 2026-11-19

La ejecución automática de CI por push terminó success: https://github.com/LynxPardelle/servicios-en-campo/actions/runs/44615082071 sobre 447048c38e9bc9289c204c093ff108318bbce811. El PR de salto development → main https://github.com/LynxPardelle/servicios-en-campo/pull/1 produjo zoo/promotion/production=failure por GitHub Actions app15368 y quedó BLOCKED. Se cerró sin fusionar. El run de procedencia está en https://github.com/LynxPardelle/servicios-en-campo/actions/runs/44615412101.

Se usó una sonda mínima de eventos y se comprobaron las ejecuciones de los workflows existentes. La sonda se eliminó antes de promover la base. El YAML de CI y el gate de procedencia eran válidos; no se atribuye la ausencia de eventos inicial a una causa no confirmada. Los resultados posteriores a su retirada y las promociones válidas se consultan en el historial de Actions/PR del repositorio.

No se añadieron bypass actors, no se quitaron checks y no se habilitó AWS. Las políticas explícitas permanecen: ci.yml acepta push/pull_request/workflow_dispatch; promocion.yml sólo pull_request_target y sólo lee metadatos.

## Reproducción de la cadena

1. Integrar el cambio en development y esperar zoo/ci automático del commit.
2. Abrir PR development → testing. Esperar zoo/ci y zoo/promotion/testing del PR actual.
3. Fusionar con merge commit. Abrir PR testing → main y esperar zoo/ci y zoo/promotion/production.
4. Fusionar sin opciones de bypass. Verificar los runs push de los carriles y conservar el merge SHA.
5. Un PR development → main debe fallar. Una rama feature o un fork no puede sustituir el origen permitido.

workflow_dispatch sirve para diagnóstico; GitHub no lo evalúa como check obligatorio de un PR. Usar eventos genuinos y el check de la revisión actual. No usar estados emitidos por un token personal para suplantar la app requerida.

## Antecedente

En la preparación inicial se observaron CI manuales correctos y cero runs automáticos para los eventos generados entonces. Se conservaron las reglas y se documentó el límite. La comprobación actual reemplaza ese estado pendiente y guarda evidencia en actions-proof.json.

[Checks obligatorios](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks#checks-from-some-workflow-jobs-are-not-evaluated) · [Eventos de Actions](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows)
