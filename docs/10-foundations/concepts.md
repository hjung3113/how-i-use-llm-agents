# 핵심 개념의 정확한 경계

이 문서는 [쉬운 용어집](../00-start-here/glossary.md)의 정의를 반복하지 않고, 실제 workflow를 설계할 때 지켜야 할 경계와 불변 조건을 정리한다.

## 정보 권위

| 질문 | 권위 | 다른 자료가 대신할 수 없는 것 |
|---|---|---|
| 사용자가 지금 무엇을 원하는가? | 현재 요청과 기록된 Material Decision | 과거 memory가 새 요청을 덮어쓸 수 없다. |
| 제품이 무엇을 보장하는가? | product design, architecture, ADR | plan과 Issue가 영구 제품 계약을 만들지 않는다. |
| 이번에 무엇을 배달하는가? | Issue와 accepted contract | roadmap 전체가 한 Task의 scope가 아니다. |
| 지금 실제 상태가 무엇인가? | Git, runtime, test, PR, CI의 live evidence | handoff와 memory는 현재 상태 증명이 아니다. |
| 에이전트가 어떻게 행동하는가? | 적용 범위의 rule과 authority envelope | tool capability가 곧 permission은 아니다. |

## 요청에서 실행까지

```text
Request
  → Contract
  → Acceptance criteria
  → Task
  → immutable Packet
  → one or more Attempts
```

- Contract는 목표와 경계를 정의한다.
- Acceptance criteria는 관찰 가능한 성공 상태다.
- Task는 scheduling과 ownership 단위다.
- Packet은 한 Task의 실행 입력이며 실행 중 조용히 넓어지지 않는다.
- Attempt는 실제 runtime 실행이다. Attempt failure가 곧 Task completion은 아니다.

## 결과와 검증

```text
Worker Result proposal
  → exact Output Snapshot
  → independent Review
  → Finding and focused Repair | Verified Result
  → separately authorized Application
```

불변 조건:

- worker의 self-report는 verification이 아니다.
- verifier는 worker와 다른 identity와 session을 사용한다.
- verdict는 exact snapshot에 묶인다.
- 검증 후 output이 바뀌면 이전 verdict는 무효다.
- finding은 지우지 않고 successor repair가 해결한다.
- Verified Result는 자동으로 merge·deploy된 Applied Result가 아니다.

## Artifact, Evidence, Provenance, Receipt

| 개념 | 정확한 역할 |
|---|---|
| Artifact | 저장하고 참조할 수 있는 결과 단위 |
| Evidence | 한 claim이나 verdict를 지지하는 provenance-linked 정보 |
| Provenance | 입력·revision·actor·Attempt·환경의 연결 정보 |
| Receipt | 요청부터 결정·작업·검증·limitation·terminal outcome을 연결한 완료 artifact |

모든 Artifact가 Evidence는 아니다. Evidence가 있어도 그것이 지지하지 않는 claim까지 확장할 수 없다. Receipt는 새로운 검증이 아니라 이미 검증된 연결을 terminal outcome으로 기록한다.

## Workflow, Harness, Orchestrator

- Workflow는 한 종류의 일이 흐르는 순서와 exit condition이다.
- Harness는 workflow를 실행하는 역할, tool, authority, state, gate의 배치다.
- Orchestrator는 현재 state와 evidence에서 다음 workflow와 Task를 선택하고 terminal outcome까지 운영한다.

오케스트레이터가 모델의 proposal을 받더라도 Decision Authority와 외부 publication authority를 스스로 만들 수 없다.

## DAG, Lane, Worktree

- DAG edge는 실제 dependency를 나타낸다.
- Lane은 한 Issue와 write ownership을 가진 작업 흐름이다.
- Worktree는 lane을 파일시스템에서 격리하는 수단이다.

worktree가 다르다고 semantic conflict가 사라지는 것은 아니다. overlapping write와 공유 contract는 merge 전 다시 검증한다.

## Handoff와 Memory

- Handoff는 현재 작업의 재개 index이며 live state를 다시 확인해야 한다.
- Memory는 반복 가치가 있는 검증된 장기 교훈이며 현재 Task queue가 아니다.

둘 다 private chat history를 authoritative workflow state로 만드는 대안이 아니다. 권위 있는 상태는 Git, Issue, runtime, artifact에서 재구성할 수 있어야 한다.

## Gate와 Fail closed

Gate는 다음 단계에 필요한 evidence를 정의한다. evidence가 없거나 identity가 달라지면 성공으로 추정하지 않는다.

```text
missing evidence → unverified or blocked
snapshot drift   → reverify
authority gap    → focused decision request
repeated failure → typed block, not infinite retry
```
