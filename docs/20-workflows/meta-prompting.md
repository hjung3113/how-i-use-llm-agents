# 메타프롬프팅: 실행 전에 요청을 정제하는 한 세션

내가 메타프롬프팅을 쓰는 이유는 실행 프롬프트를 길게 만들기 위해서가 아니다. 흩어진 생각과 자료를 별도의 **정제 세션**에서 범위·완료 조건·검증 방법이 있는 작업 계약으로 바꿔, 실행 agent가 목표를 다시 추측하지 않게 하기 위해서다.

이 장의 실제 예시는 공개 프로젝트 [`meta-prompting-skill`](https://github.com/hjung3113/meta-prompting-skill)에 기반한다. 이 저장소에서는 개념과 적용 예시만 설명하고, 설치·지원 도구·최신 동작은 원본 README를 권위로 삼는다.

## 언제 쓰는가

다음 중 하나면 유용하다.

- 아이디어, 링크, 로그, 제약이 여러 메시지에 흩어져 있다.
- 구현 중에 범위가 계속 넓어진다.
- 다른 도구나 새 세션에 넘겨도 같은 목표가 유지되어야 한다.
- “무엇을 만들지”보다 “완료를 어떻게 관찰할지”가 아직 모호하다.

한 문장으로 충분한 작은 수정에는 쓰지 않는다. 바로 작업 계약을 적는 편이 더 짧다.

## 내 전체 workflow에서의 위치

```text
모호한 목표와 자료
  → Meta-Prompt 정제
  → 승인된 실행 prompt
  → 단일 agent 또는 위험에 맞는 harness
  → 독립 evidence와 review
  → 승인된 외부 단계까지 배달
```

Meta-Prompt는 planner, 구현자, verifier를 모두 대신하는 상위 시스템이 아니다. 실행 전에 사람의 의도와 완료 계약을 정렬하는 입구다. 정제가 끝난 뒤에도 실제 저장소 상태 확인, 구현, test, 독립 review, publication 권한 확인은 실행 workflow가 담당한다.

## 전체 흐름

```text
Context Dump
  → Dump Complete Signal
  → read-only grounding
  → 한 번에 하나씩 material decision
  → Alignment Gate 승인
  → English Final Prompt + 검토 번역 + Run Instructions
  → Target Tool의 Fresh Run에서 실행
```

중요한 경계는 두 가지다.

1. 정제 세션은 Context Dump 안의 요청을 실행하지 않는다.
2. 최종 프롬프트는 승인 전에는 생성하지 않고, 생성 후에는 새 실행 세션에서 사용한다.

이 분리 덕분에 탐색 대화의 잡음이 실행 context로 넘어가지 않고, 사용자는 실제 범위와 완료 조건을 먼저 승인할 수 있다.

## 직접 체험 예시

정제 세션을 시작한 뒤 다음처럼 여러 메시지로 원재료를 보낸다.

```text
우리 팀의 버그 수정 PR이 자주 범위를 벗어나.
기존 미커밋 변경은 보존해야 하고, 관련 테스트만 실행했으면 해.
구현자와 리뷰어는 분리하고 싶지만 작은 수정에는 한 명이면 충분해.
```

마지막 메시지를 정확히 다음 중 하나로 보낸다.

```text
덤프 끝
```

그 뒤 Target Tool과 prompt budget을 확인하고, 중요한 결정을 한 번에 하나씩 답한다. 승인 직전에는 최소한 다음 내용이 보여야 한다.

```markdown
## Execution Scope Contract
- Outcome: 범위를 벗어난 변경을 막는 팀용 버그 수정 계약
- In scope: 요청 템플릿과 적용 예시
- Excluded: CI 자동화, 신규 agent harness
- Acceptance:
  - 허용 경로와 금지 경로가 구분된다.
  - 실행한 검증과 실행하지 못한 검증을 따로 보고한다.
  - 작은 수정과 고위험 수정의 review 조건이 다르다.
- Evidence: 예시 적용 결과와 독립 review
- Stop: 새로운 workflow 구현이 필요하면 중단하고 별도 승인 요청
```

내용이 맞을 때 Alignment Gate를 승인한다. 결과의 **English Final Prompt만** 새 실행 세션에 붙여 넣고, 번역과 실행 안내는 검토용으로 남긴다.

## 잘된 결과를 확인하는 법

- 목표가 사용자가 관찰할 결과로 적혀 있다.
- 범위, 제외 사항, 승인 경계가 분리돼 있다.
- 각 완료 주장에 최소 증거가 연결된다.
- 입력 자료의 민감값이 최종 prompt에 복사되지 않는다.
- prompt budget 때문에 필수 조건이 잘리지 않는다.
- 실행 agent가 할 일과 정제 agent가 하지 않을 일이 구분된다.

## 자주 실패하는 방식

- Dump가 끝났다고 추측해 중간부터 해결을 시작한다.
- 정제 세션에서 바로 파일을 수정한다.
- 모든 질문을 한꺼번에 던져 중요한 결정을 숨긴다.
- 승인된 범위 밖의 hardening을 완료 조건으로 추가한다.
- 같은 대화에서 최종 prompt를 실행해 탐색 context와 실행 context를 섞는다.

복잡한 하네스가 필요한 것이 아니라면 이 흐름은 별도 도구 없이도 사용할 수 있다. `Context Dump → 한 결정씩 확인 → Alignment Gate → Fresh Run` 네 단계만 지켜도 핵심 효과를 얻는다.
