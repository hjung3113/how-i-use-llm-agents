# 자주 사용하는 워크플로우 패턴

하네스가 실행 구조라면 워크플로우는 그 구조 안에서 일이 흘러가는 순서다. 다음 패턴을 작업 크기와 위험도에 맞게 조합한다.

## 1. 저장소 재개

```text
AGENTS/CONTEXT 읽기
→ HANDOFF 확인
→ Git·Issue·PR·CI live state 재검증
→ 보호할 변경 식별
→ 완료 작업 제거
→ 가장 작은 다음 작업 시작
```

- **진입:** 새 세션, compaction 이후, 다른 에이전트에게 인계받았을 때.
- **성공 종료:** 보호할 변경과 실제 남은 작업이 확인되고 다음 작업 하나를 시작할 수 있다.
- **실패/에스컬레이션:** 저장소 identity나 권위가 모호하면 수정하지 말고 필요한 선택을 요청한다.
- **핵심 규칙:** Handoff의 완료 상태를 그대로 믿고 재실행하지도, 완료로 확정하지도 않는다.

## 2. 기능 구현

```text
Issue와 설계 권위 확인
→ acceptance criteria를 증거로 매핑
→ 허용 경로 확정
→ 실패 테스트 또는 최소 재현
→ 구현
→ focused test
→ diff 확인
→ 문서 갱신
```

- **진입:** 범위와 관찰 가능한 acceptance criteria가 있는 기능 또는 계약 변경.
- **성공 종료:** 모든 criterion에 대응하는 diff와 검증 증거가 있다.
- **실패/에스컬레이션:** 요구사항 충돌이나 범위 밖 선행 작업을 발견하면 구현을 멈추고 Issue를 분리하거나 결정받는다.
- **핵심 규칙:** 관련 없는 hardening과 추측성 추상화를 섞지 않는다.

## 3. 버그 진단과 수정

```text
증상 재현
→ 관찰 사실 수집
→ 가설 분리
→ 가장 싼 판별 실험
→ 근본 원인 확정
→ 수정 계약
→ 회귀 테스트
```

- **진입:** 증상을 재현할 수 있고 원인이 불명확하거나 여러 계층에 걸쳐 있다.
- **성공 종료:** 근본 원인이 판별 실험으로 확인되고, 수정 요청이면 회귀 테스트가 통과한다.
- **실패/에스컬레이션:** 남은 가설을 구분할 실험이 없거나 필요한 접근 권한이 없으면, 이미 확인한 증거와 정확한 blocker를 보고한다.
- **핵심 규칙:** 진단 요청과 수정 승인을 구분하고 환경 문제를 제품 버그처럼 고치지 않는다.

## 4. 설계 결정

```text
제품 권위 문서 확인
→ 모호한 용어와 전제 식별
→ 대안과 trade-off 작성
→ 회의적 독립 검토
→ ACCEPT/REVISE/REJECT
→ CONTEXT 또는 ADR 반영
→ 구현 계획은 별도 작성
```

- **진입:** 용어, 모듈 경계, 프로토콜처럼 되돌리기 어렵고 실제 trade-off가 있는 결정.
- **성공 종료:** 결정, 근거, 기각한 대안, 재검토 조건이 권위 문서에 기록된다.
- **실패/에스컬레이션:** 제품 권위가 충돌하거나 결정권자가 불명확하면 구현 계획으로 넘기지 않는다.
- **핵심 규칙:** delivery 순서가 제품 동작의 권위가 되지 않게 한다.

## 5. 독립 리뷰와 focused repair

```text
고정된 diff와 spec
→ read-only 리뷰
→ severity-ranked findings
→ finding별 수정 계약
→ 최소 수정
→ 관련 검증 재실행
→ 재리뷰
```

- **진입:** 고정된 spec과 diff가 있는 중요한 변경 또는 외부 계약.
- **성공 종료:** 구체적인 미해결 finding이 없고 리뷰 verdict가 `ACCEPT`다.
- **실패/에스컬레이션:** 같은 finding이 반복되면 더 넓은 설계 문제인지 판정하고 사용자 또는 설계 권위자에게 올린다.
- **핵심 규칙:** 리뷰어가 수정하지 않고 구현자가 리뷰 범위를 임의로 넓히지 않는다.

## 6. 열린 Issue DAG 처리

```text
Issue live state 수집
→ 이미 완료/리뷰 중인 작업 제거
→ 의존성과 write conflict 분석
→ baseline 먼저 수행
→ parallel-ready lane dispatch
→ lane별 구현과 리뷰
→ 최신 main에 순차 rebase
→ 공유 smoke와 CI
→ merge와 Issue close
```

- **진입:** 여러 열린 Issue의 live state와 write set을 확인할 수 있다.
- **성공 종료:** lane별 gate, 최신 main rebase, 공유 smoke, CI, 승인된 merge/close가 모두 처리된다.
- **실패/에스컬레이션:** write conflict나 선행 결정이 생긴 lane은 병렬 실행에서 빼고 blocked 상태와 owner를 기록한다.
- **핵심 규칙:** 기존 worker와 review 결과를 확인한 뒤 dispatch해 중복 작업을 막는다.

## 7. UI 블랙박스 검증

```text
역할과 outcome mission 정의
→ frontend/backend health 독립 확인
→ 실제 browser 진입
→ 사용자 경로 수행
→ 화면과 상태 변화 기록
→ 위험한 irreversible action 전 gate
→ 실패 지점 handoff
```

- **진입:** 실행 가능한 공개 인터페이스와 역할 기반 outcome mission이 있다.
- **성공 종료:** 역할별 outcome 또는 재현 가능한 실패 지점이 기록된다.
- **실패/에스컬레이션:** 서비스가 도달 불가능하면 frontend/backend health를 분리 진단하고, 비가역 행동은 명시적 승인 전 중단한다.
- **핵심 규칙:** API 호출 순서를 미션에 써서 정답을 알려주지 않는다.

## 8. GitHub 배달과 종료

```text
working tree와 scope 확인
→ 검증 결과 확인
→ 의도적인 commit
→ push
→ PR과 CI
→ merge
→ 별도 승인 시 Issue close
→ HANDOFF 갱신
```

- **진입:** 검증된 diff와 명확한 publish 승인 범위가 있다.
- **성공 종료:** 승인된 마지막 단계까지 원격 상태를 확인하고 working tree 상태를 보고한다.
- **실패/에스컬레이션:** CI 실패, remote drift, 권한 문제에서는 merge하지 않고 증거와 안전한 다음 행동을 보고한다.
- **핵심 규칙:** 로컬 commit과 원격 push, PR, merge, Issue close는 서로 다른 변경이다. 승인 범위를 넘겨 추론하지 않는다.

## 9. 세션 종료와 기억 승격

```text
현재 상태 snapshot
→ 완료/미완료/차단 분리
→ 검증 명령과 결과 기록
→ HANDOFF 작성
→ 반복 가치가 있는 교훈만 MEMORY로 승격
```

- **진입:** 작업을 중단하거나 다른 에이전트가 이어받아야 한다.
- **성공 종료:** 새 에이전트가 live-state 재확인 후 가장 작은 다음 행동을 찾을 수 있다.
- **실패/에스컬레이션:** credential이나 불필요한 원문이 포함되면 저장하지 않고 redaction 후 다시 작성한다.
- **핵심 규칙:** 일회성 로그를 장기 memory에 그대로 복사하지 않는다.
