# 워크플로 다이어그램 패턴 리서치

작성일: 2026-08-04  
범위: `docs/20-workflows/*.md`를 위한 편집형 프로세스 시각화. UI 구현은 포함하지 않는다.

## 결론

이 사이트에는 범용 UML보다 **한 개의 주 흐름, 명시적인 소유자, 소수의 결정 gate, 흐름과 분리된 evidence, 서로 다른 terminal outcome**을 일관되게 표현하는 작은 시각 문법이 맞다. 데스크톱에서는 책임이 핵심인 경우만 swimlane을 쓰고, 모바일에서는 같은 순서를 단일 세로 spine으로 바꾸며 각 단계에 owner chip을 붙인다. 다이어그램은 본문을 대체하지 않고 핵심 관계를 먼저 보게 하는 편집 장치여야 한다.

OMG의 BPMN은 Pool/Lane으로 참여자와 책임 구획을, Gateway로 분기·합류를, Event로 시작·종료를, Association으로 artifact 연결을 구분한다. 이 의미만 빌리고 BPMN 기호 전체를 복제하지 않는다. [OMG BPMN 소개](https://www.omg.org/bpmn/Documents/Introduction_to_BPMN.pdf), [OMG BPMN 2.0.2 명세 페이지](https://www.omg.org/spec/BPMN/)

## 권장 visual grammar

| 의미 | 권장 표현 | 사용 규칙 |
|---|---|---|
| 시작 | 작은 filled dot + 짧은 진입 조건 | 페이지당 하나를 기본값으로 한다. |
| 작업 | 얇은 테두리의 직사각 카드 | 동사형 한국어 제목 1줄, 필요할 때만 보조 설명 1줄. |
| handoff | 실선 화살표 + owner chip | 책임이 바뀌는 화살표에는 전달물이나 조건을 직접 쓴다. |
| decision gate | 각진 diamond 또는 세로 spine을 가르는 notch | 질문문보다 실제 판정 기준을 쓰고 모든 출구에 결과 라벨을 붙인다. |
| evidence/artifact | 작은 문서 chip + 점선 hairline | 실행 순서와 섞지 말고, 무엇이 어떤 판정을 뒷받침하는지 옆 rail에 연결한다. |
| feedback/repair | 주 경로 바깥쪽을 도는 한 개의 accent loop | `finding → focused repair → 재검증`처럼 실제 재진입점에 닫는다. |
| terminal outcome | 넓은 pill/card | `완료`, `보완 후 재진입`, `중단·에스컬레이션`을 각각 다음 행동과 함께 쓴다. |

Mermaid 공식 swimlane 문법도 task, event, start/end, decision, connector를 소수의 형태로 구분하고, lane은 한 종류의 ownership만 나타내며 cross-lane handoff를 라벨링하라고 안내한다. 다만 현재 swimlane 기능은 새 diagram type으로 문법 변경 가능성이 명시되어 있으므로, **콘텐츠 모델과 초기 스케치의 참고 문법**으로 쓰고 사이트의 장기 표현 계약으로 결박하지 않는 편이 안전하다. [Mermaid swimlane 공식 문서](https://mermaid.js.org/syntax/swimlanes), [Mermaid flowchart 공식 문서](https://mermaid.js.org/syntax/flowchart.html)

### 장식 없이 매력적으로 만드는 장치

- lane마다 다른 강한 색 대신 아주 옅은 surface tint와 1px rule을 쓴다. 강조색은 gate 또는 repair loop 한 곳에만 쓴다.
- 원형 단계 번호, 짧은 status chip, 넓은 바깥 여백으로 정보 위계를 만든다. 그림자, 3D, 아이콘 모음은 쓰지 않는다.
- 단계 카드의 하단에 `입력`, `증거`, `산출물` 중 실제로 필요한 한 항목만 작은 caption으로 둔다.
- 흐름 끝에는 선을 끊지 말고 terminal card에 접속시켜 “어디서 끝났는가”를 한눈에 보이게 한다.
- 다이어그램 위에 한 문장 takeaway를 둔다. 독자는 그림을 해독하기 전에 이 그림이 증명하는 관계를 안다.
- 한국어 label은 짧은 동사구를 우선하고, 영어 도메인 용어는 보조 크기로 병기한다. 긴 문장은 본문이나 공개된 text transcript로 돌린다.

## 우선 적용할 원문 구간

### P0-1. `harness-patterns.md` — `4. Worktree DAG 하네스`

**추천 형식:** dependency DAG + 세 개의 가로 lane + merge gate.

- `Baseline`에서 A/B는 병렬로 갈라지고 C는 A 이후에만 열리게 한다.
- 각 lane 안에는 `구현 → focused test → 독립 리뷰`를 작게 반복한다.
- lane 끝의 evidence chip을 최종 `최신 main rebase → 공유 smoke → CI` gate로 모은다.
- terminal은 `통합 완료`와 `blocked lane/owner 기록` 두 갈래로 명시한다.

이 구간은 단순 순서보다 **의존성, write ownership, 병렬 가능성, 최종 합류 조건**이 핵심이라 가장 높은 시각화 가치가 있다.

### P0-2. `orchestrator-as-operator.md` — `오케스트레이터가 소유하는 책임`과 `Coordinator loop 예시`

**추천 형식:** 3-lane activity map + terminal outcome fan-out.

- lane은 `사람/Decision Authority`, `Orchestrator`, `Worker + Verifier`처럼 ownership 하나만 표현한다.
- 중앙 orchestrator spine에 intake, context compilation, task graph, dispatch, observation, verification을 둔다.
- `independent pass`, `finding`, `material decision`, `no useful action`을 네 개의 명시적 gate 결과로 만든다.
- 끝은 `receipt`, `focused repair`, `decision 대기`, `typed block` 네 terminal card로 펼친다.

Mermaid는 lane이 “누가 소유하는가”를 답하도록 하고, decision을 그 결정을 소유한 lane 안에 두라고 권한다. [Mermaid swimlane good practices](https://mermaid.js.org/syntax/swimlanes)

### P0-3. `design-alignment.md` — `내가 사용하는 정렬 루프`

**추천 형식:** evidence-backed feedback loop.

- 주 spine은 `현재 권위 → bounded question → 반영/back-check → 독립 검토`다.
- `REVISE`는 질문으로 돌아가는 accent loop, `REJECT`는 전제 재검토로 빠지는 별도 출구, `ACCEPT`는 material decision과 구현 계획으로 이어지는 출구다.
- 각 gate 옆에 판단 근거인 `권위 문서`, `사용자 답`, `review finding`을 점선 evidence chip으로 붙인다.
- `ACCEPT`와 “제품 선택 승인”을 같은 terminal로 합치지 않는다. reviewer verdict와 decision authority가 다르다는 본문 계약을 그림에서도 지킨다.

### P1-4. `example-end-to-end.md` — 1~6 전체

**추천 형식:** 번호가 있는 editorial process list + 한 번의 repair loop.

- 여섯 장을 세로 spine으로 연결하고 각 장의 오른쪽에 `authority`, `contract`, `test`, `finding`, `receipt`, `handoff` artifact를 하나씩 붙인다.
- 4장에서 나온 `REVISE`만 3장의 focused repair로 되돌린다. 나머지 흐름은 직선으로 유지한다.
- 마지막은 `ready_for_publish`, `승인된 배달 단계`, `남은 외부 단계`를 구분한 terminal strip으로 마친다.

USWDS process list는 중요한 순차 과정의 3~10개 고수준 단계를 분명한 위계로 보여 주는 용도이며, 짧고 평행한 heading과 semantic heading level을 권장한다. 이 사례의 6단계에 잘 맞는다. [USWDS Process list](https://designsystem.digital.gov/components/process-list/)

### P1-5. `workflow-patterns.md` — `3. 버그 진단과 수정` + `5. 독립 리뷰와 focused repair`

**추천 형식:** 나란한 두 개의 compact loop.

- 진단 패널은 `관찰 → 가설 → 가장 싼 판별 실험 → 근본 원인`으로 좁아지는 funnel-spine을 쓴다.
- 리뷰 패널은 `고정 diff → independent review → finding → 최소 수정 → 재리뷰`의 닫힌 loop를 쓴다.
- 두 패널의 공통 gate는 `증거가 원인을/수정을 실제로 구분하는가`이고, 실패 출구는 blocker와 이미 확인한 evidence를 남긴다.
- 모든 workflow 아홉 개를 한 그림에 넣지 않는다. 선형 목록은 본문이 더 잘하며, 분기와 재진입이 있는 두 구간만 그린다.

### P1-6. `meta-prompting.md` — `전체 흐름`

**추천 형식:** 네 단계 editorial strip (`Context Dump → 한 결정씩 확인 → Alignment Gate → Fresh Run`).

- 현재 Mermaid의 여섯 box를 독자의 실제 mental model인 네 단계로 묶는다.
- `Dump 종료 선언`과 `Alignment 승인`만 gate 모양으로 강조한다.
- 정제 세션과 실행 세션 사이에는 넓은 여백/끊어진 rule을 두어 context boundary를 보이게 한다.
- 모바일에서도 같은 네 단계가 그대로 세로 process list가 되므로 별도 축소판이 필요 없다.

## Decision gate와 terminal outcome 규칙

- gate는 실제 분기가 있는 곳에만 쓴다. 단순 검사는 작은 checklist/evidence chip이면 충분하다.
- branch label은 모호한 `예/아니오`보다 `ACCEPT / REVISE`, `dispatch / blocked`, `publish / reverify`처럼 결과와 다음 행동을 쓴다.
- status 종류는 최소화한다. GOV.UK task-list 지침도 기본적으로 필요한 최소 상태부터 시작하고, task name과 status를 함께 보여 주도록 권한다. [GOV.UK complete multiple tasks](https://design-system.service.gov.uk/patterns/complete-multiple-tasks/), [GOV.UK task list](https://design-system.service.gov.uk/components/task-list/)
- 색은 의미의 보조 수단이다. 완료/경고/차단은 색과 함께 형태, icon 또는 텍스트 label로 반복한다. WCAG는 색만으로 정보를 구분하지 않도록 요구한다. [WCAG 2.2 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color)
- 독자가 이해해야 하는 선, node 경계, icon은 인접 색과 충분히 구분되어야 한다. WCAG의 non-text contrast 해설은 이해에 필요한 graphical object에 3:1 대비를 설명한다. [WCAG 2.2 Non-text Contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)

## Responsive/mobile adaptation

1. **전체 그림을 축소하지 않는다.** 데스크톱의 좌→우 spine을 모바일에서 위→아래 spine으로 바꾼다.
2. **순서를 보존한다.** swimlane을 역할별 덩어리로 재그룹하지 않고, 각 step에 owner chip을 붙여 시간 순서를 유지한다.
3. **handoff를 문장으로 보강한다.** cross-lane arrow는 `다음 담당: verifier · 전달물: fixed diff`처럼 card 사이 label이 된다.
4. **evidence rail을 inline으로 접는다.** 데스크톱의 옆 rail은 모바일에서 해당 단계 아래의 한 줄 `증거` disclosure 또는 caption이 된다.
5. **정말 2차원 관계가 필수일 때만 국소 가로 스크롤을 허용한다.** 페이지 전체가 아니라 diagram container 안에 한정하고, 바로 아래에 동일 정보를 읽는 순서대로 적은 text transcript를 둔다.
6. **320 CSS px에서 본문은 단일 열로 reflow한다.** WCAG 2.2는 의미상 2차원 배치가 필요한 일부 콘텐츠를 예외로 인정하지만, 일반 콘텐츠는 정보 손실과 양방향 스크롤 없이 reflow해야 한다. [WCAG 2.2 Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)

USWDS step indicator는 선형 다단계 진행에만 적합하고, 조건부·비선형 흐름에는 다른 접근을 권한다. 작은 화면에서는 긴 label을 생략할 수 있지만 현재 단계와 총 단계는 텍스트로 남기고 `aria-current`를 제공해야 한다. 따라서 이 문서의 DAG와 repair loop를 progress bar로 단순화하면 안 된다. [USWDS Step indicator](https://designsystem.digital.gov/components/step-indicator/)

## 접근성·콘텐츠 계약

- 각 다이어그램에 보이는 제목과 한 문장 요약을 제공한다.
- 구조가 복잡하면 인접한 본문에 완전한 text transcript를 둔다. W3C WAI는 복잡한 flow chart/diagram에 짧은 식별 설명과 본질적 정보를 담은 긴 설명을 함께 제공하고, 가능하면 본문에서 그림을 요약하도록 권한다. [WAI Complex Images](https://www.w3.org/WAI/tutorials/images/complex/)
- Mermaid를 사용한다면 `accTitle`과 `accDescr`를 반드시 채운다. [Mermaid Accessibility options](https://mermaid.js.org/config/accessibility)
- 시각 순서와 DOM 읽기 순서를 같게 한다. 반응형 CSS가 node의 의미 순서를 바꾸게 두지 않는다.
- hover만으로 evidence를 노출하지 않는다. label과 핵심 상태는 항상 보이고, 추가 설명은 키보드와 touch로도 접근 가능해야 한다.

## 피해야 할 결과

- 모든 단계를 같은 box와 같은 화살표로 만든 generic flowchart
- lane 축에 owner, phase, status를 섞은 swimlane
- gate 출구가 라벨 없이 갈라지는 diamond 숲
- 증거 artifact가 실행 단계처럼 주 spine을 차지하는 그림
- 완료를 초록, 실패를 빨강으로만 구분하는 상태 지도
- 데스크톱 SVG를 모바일에서 글자까지 축소한 미니어처
- 한 장에 모든 워크플로를 합친 poster형 infographic

가장 작은 유효 세트는 **P0 세 구간부터**다. 이 세 그림만으로도 저장소의 차별점인 dependency, authority, evidence, repair, terminal semantics를 보여 줄 수 있다. P1은 본문 독해에서 실제 이탈이 관찰될 때 추가한다.
