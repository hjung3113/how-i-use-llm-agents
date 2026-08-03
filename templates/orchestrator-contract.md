# Orchestrator contract template

## External interface

```text
request → verified outcome | focused decision request | typed block
```

## Human authority

사람만 결정할 material change:

- [objective/scope/user contract 변화]
- [durable architecture/operation dependency]
- [irreversible external effect]

## Coordinator responsibilities

- request contract 작성
- relevant context 선택
- workflow/skill/model 선택
- task graph와 packet 작성
- dependency/write conflict scheduling
- runtime observation reconciliation
- independent verification dispatch
- finding별 repair와 replan
- status/resume/cancel 관리
- receipt 또는 typed block 발행

## Task packet

```yaml
task_id: ""
workflow: ""
objective: ""
requires: []
read_resources: []
write_resources: []
acceptance: []
allowed_capabilities: []
forbidden_actions: []
expected_artifacts: []
deadline: ""
escalation_condition: ""
```

## Verification separation

- worker identity/session:
- verifier identity/session:
- exact target revision/snapshot:
- required evidence:
- pass/finding/block semantics:

## Loop boundaries

- retry budget:
- same-cause failure rule:
- cancellation reconciliation:
- typed block conditions:
- completion receipt fields:

## Publication boundary

- verified result location:
- user target application authority:
- drift check immediately before publication:
