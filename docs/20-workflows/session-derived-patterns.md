# 전체 세션에서 추가로 발견한 공통 패턴

로컬에 보존된 Codex 로그 2,514개와 Claude 프로젝트 로그 1,033개, Claude prompt history 6,959건을 다시 분석해 기존 workflow 문서에 직접 드러나지 않았던 반복 습관을 정리했다. 기록 범위는 2026년 3월부터 8월까지이며 자동 생성된 subagent 세션과 중복 worktree가 포함된다. 따라서 이것을 독립 대화 수나 생산성 지표로 해석하지 않고, **여러 프로젝트에서 반복적으로 나타난 행동**만 채택했다.

## 분석 방법과 privacy

1. session metadata에서 기간, 프로젝트, tool·skill 호출을 집계했다.
2. system prompt가 섞이지 않은 사용자 메시지와 Claude prompt history에서 반복 주제를 분류했다.
3. 중복 worktree와 자동 subagent 때문에 단순 횟수는 순위 근거로 사용하지 않았다.
4. 여러 독립 프로젝트와 Codex·Claude 양쪽에서 반복된 패턴만 후보로 남겼다.
5. memory summary와 대표 저장소의 live 문서 구조로 의미를 교차 확인했다.
6. raw prompt, 개인 경로, private 저장소명, credential은 이 문서에 포함하지 않았다.

이 분석은 보존된 로컬 기록의 snapshot이며 모든 과거 활동을 완전하게 대표한다고 주장하지 않는다.

## 1. 세션 위생을 작업의 일부로 본다

반복적으로 사용한 동작:

- 새 주제로 넘어갈 때 context를 정리한다.
- 긴 작업은 compact하고 결정·차단·다음 행동을 파일에 남긴다.
- 새 세션에서는 resume 또는 handoff 후 live state를 다시 확인한다.
- plugin이나 skill 변경 후에는 reload와 실제 invocation을 검증한다.

일반화된 규칙: 긴 대화를 보존하는 것보다 재개 가능한 artifact를 만드는 것이 중요하다.

## 2. 환경과 workflow 자체도 진단 대상이다

에이전트가 반복 실패하면 코드만 고치지 않는다.

```text
제품 결함인가?
→ 테스트/샌드박스 제약인가?
→ 권한·IPC·plugin lifecycle 문제인가?
→ 잘못된 작업 계약이나 orchestration 문제인가?
```

일반화된 규칙: 같은 lifecycle 실패가 반복되면 “조금 더 기다리기”보다 host와 harness 상태를 직접 확인한다.

## 3. Phase와 milestone은 기억 보조 수단이다

장기 프로젝트에서는 discuss → plan → execute → validate → complete 흐름을 자주 사용한다. 그러나 phase 문서가 제품 설계보다 높은 권위가 되면 중단하고 다시 분리한다.

일반화된 규칙: phase는 delivery 진행을 기억하지만 제품의 영구적인 진실을 결정하지 않는다.

## 4. 구현 전 adversarial review를 사용한다

큰 구현에 들어가기 전에 다음을 공격적으로 검토한다.

- 구체화되지 않은 요구사항
- 환경과 실제 배포 조건의 불일치
- 설계 문서 간 모순
- MVP에 필요 없는 범위
- 검증할 수 없는 acceptance criteria

일반화된 규칙: 구현 후 코드 리뷰만으로 비싼 설계 오류를 찾으려 하지 않는다.

## 5. 모델과 역할을 라우팅한다

- 빠른 탐색과 반복 수정: 비용과 속도를 우선
- 복잡한 구현과 디버깅: 코딩 능력과 긴 reasoning
- 설계·용어·최종 리뷰: 강한 모델을 read-only 독립 역할로 사용
- UI 검증: 브라우저를 조작하는 별도 역할

일반화된 규칙: 강한 모델을 모든 단계에 고정하지 않고, 실패 비용이 큰 판단 gate에 집중한다.

## 6. Skill과 plugin도 acceptance test를 가진다

설치됐다는 메시지만으로 완료하지 않는다.

- 올바른 scope에 설치됐는가?
- 새 세션에서 발견되는가?
- trigger가 실제로 동작하는가?
- 지원 파일과 hook이 함께 설치됐는가?
- 다른 runtime에서도 같은 계약을 유지하는가?

일반화된 규칙: configuration artifact와 실제 runtime behavior를 따로 검증한다.

## 7. 계획을 Issue와 실행 packet으로 좁힌다

큰 설계나 roadmap을 그대로 구현자에게 주기보다 다음 단위로 줄인다.

```text
제품 목적
→ 설계 계약
→ milestone/phase
→ Issue acceptance criteria
→ 한 agent가 소유할 작업 packet
```

일반화된 규칙: 상위 문서는 방향을, 하위 packet은 변경 가능한 범위와 검증을 담당한다.

## 8. 완료를 직접 확인하고 다음 상태까지 밀어준다

worker나 review가 끝났는지 먼저 조회하고, 사용자가 승인한 전체 경로가 있다면 local test에서 멈추지 않고 PR·CI·merge·Issue close까지 각각 확인한다.

일반화된 규칙: 자동으로 외부 권한을 넓히지는 않지만 이미 승인된 terminal condition 앞에서 불필요하게 멈추지도 않는다.

## 9. 문서가 많아지면 권위를 재정리한다

반복적으로 생긴 문제는 문서 부족보다 문서 역할 혼합이었다.

- roadmap이 product truth처럼 읽힘
- research가 결정처럼 사용됨
- review report가 현재 설계를 대신함
- handoff가 오래된 live state를 고정함

일반화된 규칙: 새 문서를 추가하기 전에 기존 문서의 목적, 수명, 권위를 분류한다.

## 10. Prompt와 session 자체를 평가한다

완성된 코드뿐 아니라 사용한 prompt와 session도 audit한다.

- 어떤 지시가 반복적으로 무시됐는가?
- 불필요하게 긴 컨텍스트가 있었는가?
- 잘못된 tool이나 model을 선택했는가?
- 사용자가 여러 번 같은 완료 조건을 말해야 했는가?
- 다음에는 rule, skill, template 중 어디에 교훈을 남겨야 하는가?

일반화된 규칙: 한 번의 prompt를 신비화하지 않고 결과와 재작업 비용으로 평가한다.

## 11. 시각 작업은 설계와 실제 화면을 따로 검증한다

UI 작업에서는 세 층을 분리한다.

1. 제품/UX 검토: 첫 화면과 사용자 흐름이 목적을 살리는가?
2. 구현 검토: design system, component, responsive 규칙을 지키는가?
3. 실제 화면 검증: 로컬 서비스를 띄우고 browser에서 도달 가능한가?

일반화된 규칙: 코드와 screenshot만 보고 “사용 가능”하다고 판단하지 않고, 실행 중인 제품에서 역할 기반 mission을 수행한다.

## 12. 중요한 결정은 한 번에 하나씩 좁힌다

용어와 설계의 큰 질문을 한 prompt에 모두 넣으면 판정 근거가 섞이기 쉽다. 중요한 결정을 강한 독립 모델에 위임할 때는 한 번에 하나의 질문, 허용된 근거, `ACCEPT / REVISE / REJECT` 같은 명확한 출력 계약을 사용한다.

일반화된 규칙: 의사결정 자동화는 질문 수를 늘리는 것이 아니라 결정 경계를 좁히는 데 사용한다.

## 입문자에게 바로 적용할 세 가지

처음부터 모든 패턴을 사용하지 않는다.

1. 새 세션에서 current state를 다시 확인한다.
2. 구현 전 목표·범위·검증을 한 번 적는다.
3. 반복되는 규칙만 `CLAUDE.md` 또는 `AGENTS.md`로 승격한다.
