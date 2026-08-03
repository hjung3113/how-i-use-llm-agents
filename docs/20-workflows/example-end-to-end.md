# End-to-end 예시: 중복 알림 버그

다음은 특정 프로젝트를 노출하지 않는 합성 사례다. 목표는 한 사용자의 “저장 버튼을 한 번 눌렀는데 알림이 두 번 간다”는 요청을 검증 가능한 작업으로 바꾸는 것이다.

## 1. 권위와 현재 상태

- `CONTEXT.md`: 저장 성공 한 번당 알림은 최대 한 번 전송된다.
- Issue: 빠른 연속 클릭과 네트워크 retry에서도 중복 알림을 막는다.
- `AGENTS.md`: 알림 모듈만 수정하고 외부 전송은 테스트 double로 검증한다.
- Live evidence: 현재 branch, HEAD, working tree, 기존 실패 테스트를 확인한다.

제품 불변 조건은 `CONTEXT.md`, 이번 배달 범위는 Issue, 작업 방법은 `AGENTS.md`, 현재 사실은 live evidence가 답한다.

## 2. 작업 계약

```yaml
goal: 저장 한 번에 알림이 한 번만 전송된다
allowed_paths:
  - src/notifications/**
  - tests/notifications/**
acceptance:
  - 같은 operation_id의 retry는 한 번만 전송한다
  - 다른 operation_id는 각각 전송한다
forbidden:
  - 실제 외부 알림 전송
  - 무관한 저장 API 리팩터링
```

작은 변경이므로 먼저 계획–실행–검증 하네스를 사용한다. 중복 방지 계약이 외부 동작에 영향을 주므로 구현 후 독립 리뷰를 한 단계 추가한다.

## 3. 구현과 증거

구현자는 실패 테스트를 추가하고 최소 변경을 수행한다.

```text
test duplicate retry       → pass
test distinct operations   → pass
full notification suite    → pass
git diff --check           → pass
```

이 결과는 테스트된 입력에서 동작한다는 증거지만, 요구사항 전체나 운영 환경을 단독으로 증명하지 않는다.

## 4. 독립 리뷰와 repair

리뷰어는 Issue, 제품 불변 조건, 고정된 diff만 읽는다.

```text
REVISE: operation_id가 비어 있을 때 모든 요청이 같은 값으로 합쳐진다.
```

이 finding을 새 작업 계약으로 바꾼다.

```text
operation_id가 없는 요청은 중복 제거 대상으로 취급하지 않고,
해당 경계 테스트만 추가한다. 다른 경로는 수정하지 않는다.
```

focused repair 후 관련 테스트를 다시 실행하고 재리뷰에서 `ACCEPT`를 받는다.

## 5. 최소 receipt

반복 자동화가 필요하다면 채팅의 “완료” 대신 다음 정도의 작은 artifact를 남긴다.

```json
{
  "task_id": "issue-42",
  "source_revision": "abc1234",
  "result_revision": "def5678",
  "checks": [
    {"name": "notification-suite", "status": "passed"},
    {"name": "independent-review", "status": "accepted"}
  ],
  "outcome": "ready_for_publish"
}
```

공개 직전 `result_revision`이 현재 HEAD와 같은지 다시 확인한다. 다르면 성공으로 추정하지 않고 검증을 다시 실행한다.

## 6. 배달과 handoff

- 사용자가 승인한 경우에만 push와 PR을 수행한다.
- CI 통과는 자동 환경의 gate를 증명하지만 실제 운영 배포를 증명하지 않는다.
- merge 후 Issue 종료가 별도 요청이면 live Issue 상태를 확인하고 닫는다.
- `HANDOFF.md`에는 commit, 실행한 검증, 리뷰 verdict, 남은 배포 단계를 기록한다.

최종 상태는 “코드를 작성했다”가 아니라 **고정된 결과가 필요한 검증을 통과했고, 승인된 배달 단계까지 현재 상태가 확인되었다**이다.
