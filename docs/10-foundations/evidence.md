# 검증 증거를 선택하는 방법

하나의 증거가 작업 전체를 증명하지 않는다. 먼저 실패 비용과 acceptance criteria를 보고, 서로 다른 실패를 잡는 최소 증거 조합을 선택한다.

| 증거 | 주로 증명하는 것 | 단독으로 증명하지 못하는 것 |
|---|---|---|
| diff | 실제 변경 내용, 범위, 예상하지 않은 파일 | 코드가 실행되거나 요구사항을 만족함 |
| focused test | 지정된 입력과 경계에서 예상 동작 | 작성하지 않은 사례, 전체 제품 가치 |
| broader test/build | 주변 모듈과 빌드의 회귀 여부 | 실제 배포 환경과 사용자 여정 |
| independent review | spec·설계·diff에서 발견 가능한 누락, 회귀, 범위 확장 | 실행 환경의 실제 동작과 결함의 완전한 부재 |
| CI | 깨끗한 자동 환경에서 정의된 gate 통과 | 운영 배포, 빠진 test, 사용자에게 보이는 결과 |
| black-box 검증 | 공개 UI/API에서 역할 기반 outcome이 가능함 | 내부 불변 조건, 보안, 모든 경계 사례 |
| runtime observation | 특정 환경에서 실제 process·HTTP·화면 상태 | 다른 환경과 미래 상태의 동일성 |
| receipt/provenance | 어떤 입력·revision·검증이 결과를 만들었는지 추적 가능 | 결과 자체의 절대적인 정확성 |

## 작업별 최소 조합

### 작은 문서 수정

```text
diff + link/format check
```

### 좁은 버그 수정

```text
실패 재현 + focused regression test + diff
```

### 중요한 계약 변경

```text
focused test + broader test + exact diff + independent review
```

### UI 사용자 여정

```text
frontend/backend health + browser black-box mission + 관련 test
```

### 외부 publication 또는 배포

```text
검증된 exact revision + CI + 승인 확인 + publication 직전 drift check
```

## 증거를 기록할 때

- 실행한 명령과 대상 revision을 함께 적는다.
- “통과”와 “실행하지 못함”을 구분한다.
- screenshot이나 외부 문서는 관찰 시점을 기록한다.
- review는 worker와 다른 identity와 context에서 수행한다.
- 검증 이후 output이 바뀌면 이전 verdict를 재사용하지 않는다.
- credential과 private data는 evidence artifact에 넣지 않는다.

완료 주장은 필요한 증거가 모두 있을 때만 한다. 증거가 없으면 성공으로 추정하지 않고 미검증 상태와 다음 gate를 보고한다.
