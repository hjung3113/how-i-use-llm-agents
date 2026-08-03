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

사용 시점: 새 세션, compaction 이후, 다른 에이전트에게 인계받았을 때.

핵심 규칙: Handoff에 적힌 완료 상태를 그대로 믿고 같은 작업을 재실행하지도, 반대로 완료로 확정하지도 않는다.

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

사용 시점: 범위가 명확한 기능이나 계약 변경.

핵심 규칙: 관련 없는 hardening과 추측성 추상화를 같은 작업에 섞지 않는다.

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

사용 시점: 실패 원인이 불명확하거나 여러 계층에 걸친 문제.

핵심 규칙: 진단 요청과 수정 승인을 구분하고, 환경 문제를 제품 버그처럼 고치지 않는다.

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

사용 시점: 용어, 모듈 경계, 프로토콜, 되돌리기 어려운 결정.

핵심 규칙: delivery 순서가 제품 동작의 권위가 되지 않게 한다.

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

사용 시점: 중요한 변경, 외부 계약, 보안·데이터·동시성 경계.

핵심 규칙: 리뷰어가 수정하지 않고, 구현자가 리뷰 범위를 임의로 넓히지 않는다.

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

사용 시점: 여러 Issue를 한 번에 처리해야 할 때.

핵심 규칙: 기존 worker와 review 결과를 확인한 뒤 dispatch해 중복 작업을 막는다.

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

사용 시점: 제품의 실제 사용자 약속을 확인할 때.

핵심 규칙: API 호출 순서를 미션에 써서 정답을 알려주지 않는다.

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

사용 시점: 검증된 로컬 결과를 공유 저장소에 반영할 때.

핵심 규칙: commit, push, merge, Issue close는 서로 다른 외부 변경이다. 사용자가 승인한 범위를 넘겨 추론하지 않는다.

## 9. 세션 종료와 기억 승격

```text
현재 상태 snapshot
→ 완료/미완료/차단 분리
→ 검증 명령과 결과 기록
→ HANDOFF 작성
→ 반복 가치가 있는 교훈만 MEMORY로 승격
```

사용 시점: 긴 작업을 중단하거나 다른 에이전트가 이어받아야 할 때.

핵심 규칙: 일회성 로그를 장기 memory에 그대로 복사하지 않는다.

