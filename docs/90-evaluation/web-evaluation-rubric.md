# 웹 문서 허브 평가 계약

이 문서는 UI 구현 전에 고정하는 완료 계약이다. 구현 편의를 위해 기준을 낮추지 않는다.

## 목표 독자와 주 과제

대상은 LLM agent를 막 도입한 개발자부터 자신의 workflow를 운영하는 중상급자까지다. 주 과제는 기능을 많이 사용하는 것이 아니라, 저장소 문서를 읽으며 **저자가 LLM agent를 실제로 어떻게 사용하는지 정확히 재구성하는 것**이다.

독자는 웹페이지에서 다음 흐름을 자연스럽게 따라갈 수 있어야 한다.

1. 저자의 핵심 원칙과 기본 workflow를 이해한다.
2. 자신의 숙련도와 작업 위험에 맞는 학습 경로를 고른다.
3. foundation, workflow, tooling으로 세부 근거를 확장한다.
4. 필요할 때 example과 template를 찾아 실제 형태를 확인한다.
5. 원본 Markdown과 평가 근거로 돌아갈 수 있다.

## 범위와 제약

- source corpus는 `README.md`, `CONTRIBUTING.md`, `docs/**/*.md`, `examples/**/*.md`, `templates/**/*.md`의 합집합이다. filesystem glob으로 매번 독립 산출하며 hand-written manifest가 범위를 정하지 못한다.
- `LICENSE`, `third_party/**`, `.agents/**`, `.claude/**`, `.codex/**`, `.opencode/**`, 생성된 web artifact, Impeccable 운영 artifact는 독자용 corpus에서 제외한다. 예상 밖 포함·제외는 검사 실패다.
- source corpus의 모든 정보와 링크를 누락하지 않는다.
- Markdown이 내용의 권위다. 웹페이지는 읽기·탐색 표현이며 새로운 제품 주장을 만들지 않는다.
- 구현은 plain HTML, CSS, JavaScript만 사용한다. runtime framework와 외부 UI dependency를 추가하지 않는다.
- 읽기, 탐색, 현재 위치 공유에 필요한 최소 기능만 둔다. search, progress, local TOC, 이전·다음 control은 아래 과업 기준을 만족하는 데 필요한 경우에만 둔다.
- keyboard, reduced motion, mobile viewport, semantic landmark를 기본 품질로 다룬다.
- canonical 실행 방식, launch URL/command, 지원 browser와 fallback은 구현 전에 이 문서의 `실행 계약`에 고정한다. 모든 browser·Luna·screenshot·Sol 검사는 그 경로만 사용한다.

## 실행 계약

- canonical mode: **dual static** — GitHub Pages와 direct `file://`를 모두 지원한다.
- Pages route: `https://hjung3113.github.io/how-i-use-llm-agents/`
- direct route command: `open "$(pwd)/index.html"`; report가 실행 시 resolve한 absolute `file://` URL을 route identity로 기록한다.
- browser: 현재 Chrome desktop/mobile viewport
- fallback: `file://`에서 fetch·module server 없이 핵심 기능이 동작하고, JavaScript가 실패해도 소개, source map, 원본 Markdown link를 사용할 수 있어야 한다.

rendered-bundle digest가 두 route의 공통 artifact identity다. Luna는 Pages route만 사용한다. 다음 parity smoke는 Pages와 direct route에서 각각 PASS해야 한다.

| Route | Launch | 첫 권장 경로 | document/heading hash reload | no-JS source map | internal/source links | Console |
|---|---|---|---|---|---|---|
| Pages | 200·visible | PASS | 동일 위치 복원 | 접근 가능 | broken 0 | error 0 |
| `file://` | visible | PASS | 동일 위치 복원 | 접근 가능 | broken 0 | error 0 |

## 평가 방식

### 1. 문서 완전성

검사 script가 위 glob에서 source manifest를 생성한다. 웹 구현이 manifest를 손으로 축소할 수 없다. 자동 검사는 다음을 증명해야 한다.

- manifest와 대상 source 집합이 일치한다.
- 각 source의 모든 heading level이 웹 navigation 또는 본문에 대응한다.
- 각 source의 원문 byte가 생성 bundle에 그대로 포함되는지 검사하고, 대표 문서에서 heading·paragraph·list·table·code·link가 renderer smoke를 통과하는지 확인한다. 이 소개 사이트는 범용 Markdown 출판 엔진이 아니므로 51개 문서의 DOM node를 byte 단위로 이중 증명하지 않는다.
- source manifest와 전체 literal payload digest를 기록한다.
- 웹에서 각 source 원문으로 이동할 수 있다.
- authored summary는 navigation label과 첫 진입 안내에만 쓰고 `요약`으로 표시한다. 완전성 주장은 원문에서 결정적으로 생성한 본문에만 적용한다.

### 2. 정보 구조와 읽기 흐름

- 첫 viewport에서 대상, 얻는 결과, 기본 철학, 첫 경로가 보인다.
- `처음 이해하기 → 기반 다지기 → workflow → tooling → examples/templates → evaluation`의 전체 지도가 있다.
- beginner journey는 다음 권장 문서로 계속 이동하면서 현재 section을 잃지 않는다.
- 초보자는 폴더명을 해석하지 않아도 권장 순서를 따른다.
- 중상급자는 전체 목차 또는 search로 지정한 source/heading에 최대 3회 action 안에 도달한다.
- 8개 이상 H2/H3를 가진 긴 문서는 heading 단위 local navigation을 제공한다.

### 3. 핵심 이해도

추가 설명 없는 모든 독자는 다음 source-backed answer key의 기본 loop를 순서대로 자신의 말로 설명해야 한다.

```text
live Git/runtime state와 질문별 authority 확인
→ 좁은 contract로 목표·범위·금지·완료 조건 고정
→ 기본은 single agent가 구현
→ claim에 맞는 test·diff·runtime evidence 확인
→ material risk가 있을 때만 independent review나 DAG 추가
→ verified result와 별도 승인된 commit·push·merge/application 구분
→ 다음 세션이 필요하면 HANDOFF
```

모든 persona는 이 순서, human publication authority, 위험이 낮아지면 복잡도를 내리는 규칙을 맞혀야 한다. `모든 작업에 multi-agent가 필요하다`, `review가 결과를 자동 적용한다`, `commit이 push/merge 권한을 포함한다`, `HANDOFF가 장기 교훈 저장소다`, `meta-prompting이 구현을 실행한다` 중 하나라도 주장하면 FAIL이다.

역할별 추가 항목은 다음과 같다.

| Persona | 추가로 설명할 항목 |
|---|---|
| 입문 개발자 | single agent 기본값, evidence가 필요한 이유, 첫 학습 경로 |
| 실무 개발자 | risk별 escalation/de-escalation, verified result와 applied result, HANDOFF/MEMORY, 설계 review/grilling의 목적 |
| PM/창업자 | meta-prompting의 위치, product authority와 delivery history, 설계 의도 alignment, 사람에게 남는 결정 |

세부 이해 항목:

1. single agent가 기본값인 이유와 복잡도를 올리는 조건
2. live state, authority, contract, evidence, independent review의 관계
3. commit, push, merge 등 외부 효과의 별도 승인 경계
4. meta-prompting이 실행 전 정제 단계이며 executor가 아니라는 점
5. 제품 설계 문서를 나누는 기준과 product authority/delivery history의 차이
6. HANDOFF와 MEMORY의 역할 차이
7. 반복 설계 review와 grilling은 문서를 많이 만드는 의식이 아니라, 머릿속 의도와 기록된 설계의 간극을 드러내고 용어·경계·trade-off를 align하는 과정이라는 점

### 4. 시각·상호작용 품질

- 문서 읽기 모드에 맞는 뚜렷한 시각 세계가 있고, generic AI landing page처럼 보이지 않는다.
- card grid, 과도한 rounded container, gradient text, 무의미한 glow, 장식용 metric을 반복하지 않는다.
- typography hierarchy, measure, contrast, spacing rhythm이 긴 한국어·영어 혼합 문서를 편하게 읽게 한다.
- 색과 motion은 방향·상태·위계에만 사용한다.
- 예시와 도식은 관계·순서·권한 경계를 prose보다 빠르게 이해시키는 경우에만 사용한다. source-backed 내용만 담고, 동등한 text 설명과 작은 화면의 읽기 순서를 제공한다.
- desktop과 mobile에서 navigation이 내용을 가리지 않고 horizontal overflow가 없다.
- focus indicator, skip link, semantic heading order, accessible control name을 제공한다.

### 5. 기술 품질

- 브라우저 console error와 broken internal navigation이 없다.
- 검색과 filtering은 keyboard로 사용할 수 있고 빈 결과를 설명한다.
- URL hash로 문서와 heading을 직접 공유하고 새로고침해도 같은 위치를 복원한다.
- JavaScript가 실패해도 핵심 소개와 문서 접근 경로가 남는다.
- `prefers-reduced-motion`을 존중한다.
- 문서 내용·index 생성 검사는 deterministic하고 외부 network에 의존하지 않는다.

## 블라인드 테스트

서로 다른 Luna Max fresh session에 평가표와 구현 의도를 주지 않고 persona와 outcome mission, 완성된 canonical URL만 제공한다. 동일 Luna Max model/version, 첫 3회 실행, 최대 20분·12 turn, Chrome desktop 1440×900 조건을 고정한다. 첫 substantive comprehension answer 전에 rendered `docs/90-evaluation/**`를 열거나, search result/snippet·browser find·DOM/tool retrieval 등으로 그 내용을 노출한 session은 정답 오염으로 무효 처리해 결과에는 남기되 3/3에 세지 않으며, 미리 등록한 다음 fresh session으로 대체한다. Luna bundle은 URL/hash뿐 아니라 document activation과 search/content-exposure trail도 보존한다.

- 입문 개발자: 첫 화면부터 저자의 실제 사용법을 재구성하고 자신이 먼저 읽을 경로를 고른다.
- 실무 개발자: 위험에 따른 단계 상승·하향과 evidence/authority 경계를 설명한다.
- PM 또는 창업자: meta-prompting과 제품 설계 문서 분할이 전체 방식에서 맡는 역할을 설명한다.

사전에 고정할 neutral mission은 “이 페이지를 처음 본 역할 사용자로서 자유롭게 탐색한 뒤, 저자가 LLM agent를 실제로 사용하는 순서와 복잡도를 바꾸는 조건, 사람에게 남는 권한을 동료에게 설명하라. 역할에 중요한 두 사례도 찾아라.”이다. 구체적인 정답 용어와 경로는 prompt에 주지 않는다.

첫 자유 설명 뒤에는 더 탐색하지 않은 상태에서 다음 **고정 2차 open-response probe**를 한 번만 보낸다. 이는 정의나 정답 관계를 알려 주는 힌트가 아니라, 자유 설명에서 선택되지 않은 이해 차원을 동일하게 회수하기 위한 질문이다.

> 추가로 페이지를 탐색하지 말고 자신의 말로 설명을 완성하라. 입문 개발자: 왜 한 agent로 시작하는지, 왜 evidence가 필요한지, 무엇을 먼저 읽거나 시도할지 설명하라. 실무 개발자: HANDOFF와 MEMORY, Verified Result와 Applied Result를 구분하고 설계 review/grilling의 목적을 설명하라. PM/창업자: meta-prompting이 실행과 어떤 관계인지, 현재 product/design authority와 delivery-plan/roadmap history가 어떻게 다른지, 어떤 결정이 사람에게 남는지 설명하라. 실무 개발자와 PM/창업자: scenario를 처음부터 끝까지 적용해 어떤 기준이 용어를 지배하는지, 충돌을 어떻게 드러내는지, 누가 결정하는지, 어디에 기록하는지, 무엇을 다시 확인하는지, alignment를 언제 끝내거나 의도적으로 생략하는지 설명하라.

자유 설명에서 언급되지 않은 항목은 곧바로 `FAIL`이 아니라 `UNELICITED`로 기록한다. 고정 probe 뒤에도 각 항목을 정확히 설명해야 최종 PASS다. 질문이 평가 대상을 이름 붙이는 것은 이해를 회수하는 것이며, 그 정의·필수 관계·임계값·정답 선택지·문서 경로를 제공하면 정답 오염이다.

실무 개발자와 PM/창업자에게는 평가 corpus 밖의 `tests/web/blind-design-scenario.txt`에 사전 등록한 unseen transfer scenario를 함께 준다. 이 파일의 digest를 Luna evidence bundle에 기록하되 내용은 웹에 노출하지 않는다. 평가 문서와 source 문구도 보여주지 않는다.

다음 여섯 proposition을 scenario에 적용해야 설계 정렬 항목 PASS다.

1. 질문에 맞는 현재 product/design authority를 먼저 식별한다.
2. 용어·상태·권위 충돌을 하나의 bounded question으로 드러낸다.
3. material decision의 최종 권한을 사람 또는 명시적으로 승인된 policy에 남긴다.
4. 판정을 canonical authority document에 반영한다.
5. 관련 문서·schema·example의 정합성을 다시 확인한다.
6. 충돌과 High/Medium finding이 해소되면 멈추고, 작은 reversible 선택에는 full grilling을 생략한다.

평가 페이지의 표현을 되풀이할 뿐 scenario의 충돌을 해결하지 못하면 FAIL이다.

세 세션 모두 다음을 보고한다.

- 실제 탐색 경로와 멈춘 지점
- 이해한 저자의 workflow
- 찾지 못했거나 오해한 정보
- navigation, 가독성, mobile 흐름의 방해 요소

Luna 자신의 self-score는 판정 근거가 아니다. 별도 scorer가 위 answer key와 persona matrix로 full transcript를 채점한다. 실행 전에 scorer contract를 고정한다. 사람 scorer라면 식별자와 shared/persona/transfer proposition별 이진 판정·transcript citation을, model scorer라면 여기에 model/version과 exact scoring prompt를 더해 Luna evidence bundle에 보존한다. raw prompt, transcript, visited URL/hash trail, model/version, date, viewport, turn 수를 보존한다. 첫 3회 결과와 무효 session을 모두 보고하고 rerun을 숨기지 않는다.

기본 loop, human authority, persona 추가 항목을 모두 정확히 설명하고 blocker 없이 목적 문서에 도달해야 PASS다. 기능 활용 능력은 보조 관찰이다. 이해 정답이나 첫 진입 정보 구조가 달라지면 세 역할을 다시 실행한다. 깨진 link, focus, 이전·다음 control처럼 의미를 바꾸지 않는 국소 수정은 focused check로 닫고 전체 Luna 실행을 반복하지 않는다.

## 독립 리뷰

Sol High는 두 시점에 read-only fresh context로 검토한다.

1. 구현 전: 이 평가 계약이 사용자 요청을 빠짐없이 측정하는지 검토한다.
2. 구현 후: source, rendered page, 자동 검사, desktop/mobile screenshot, Luna report를 바탕으로 결과를 검토한다.

finding은 severity, 정확한 위치, 독자 영향, 근거, 최소 수정 방향을 포함한다. 구현 전·후 모두 `ACCEPT`를 받아야 한다.

모든 evidence에는 같은 identity를 기록한다.

- Git HEAD와 Git-visible content digest
- source-manifest digest
- rendered-bundle digest
- canonical URL
- 실행·review timestamp

identity가 바뀌면 그 이후 자동 검사, screenshot, Luna, Sol evidence를 다시 만든다.

## 접근성·성능 기준

- 다음 WCAG 2.2 AA mapping을 고정한다.

| Criteria | Check | Artifact |
|---|---|---|
| 1.1.1, 1.3.1, 1.3.2 | semantic DOM·accessible-name 자동 검사와 heading/landmark 순서 | accessibility report |
| 1.4.3, 1.4.10, 1.4.11, 1.4.12 | contrast, 320 px reflow, text spacing override | report + screenshots |
| 2.1.1, 2.1.2, 2.4.1, 2.4.3, 2.4.7, 2.4.11 | keyboard-only journey, no trap, skip link, visible/unobscured focus | journey log + screenshots |
| 2.4.2, 2.4.4, 2.4.6, 3.1.1 | title, link purpose, labels/headings, `lang=ko` | DOM report |
| 4.1.2 | control name/state | semantic DOM/accessibility snapshot |
| 4.1.3 | dynamic result/status가 있으면 announcement, 없으면 N/A 근거 | semantic DOM report |

- keyboard-only로 skip link → 권장 경로 → 구현이 선택한 direct-navigation mechanism → source heading deep link를 완주한다.
- semantic DOM/accessibility snapshot에서 `banner/navigation/main`, page H1, direct-navigation control의 name·state를 확인한다. 실제 macOS VoiceOver 점검은 가능할 때 추가하되, 로컬 권한 문제만으로 이 단순 소개 사이트의 배포를 막지 않는다.
- Chrome에서 200% zoom과 320 CSS px reflow 시 내용 손실·가로 scroll이 없다.
- review viewport는 desktop 1440×900, mobile 390×844다.
- canonical 첫 load의 local asset 합계는 1 MB 이하이며 외부 network request가 없어야 한다. 문서 payload 자체는 별도 측정해 보고한다.

## Impeccable 증거

- 설치된 Impeccable version을 기록한다.
- 새 surface 작업 전 version-matched `PRODUCT.md` 초기화 완료를 기록한다.
- 구현 전 Read-mode context, concept-seed key, 사용자 direction acknowledgement, 선택된 direction, surface brief를 남긴다.
- image generation을 사용할 수 있으면 세 composition path, 사용자가 승인한 composition, 그 path들을 finish reviewer에 전달한 증거를 남긴다. 사용할 수 없을 때만 고정 N/A 근거를 허용한다.
- built output에 opening direction contract가 남아 있는지 검사한다.
- 구현 후 detector 결과, desktop/mobile screenshot critique, finish-reviewer verdict, `DESIGN.md`와 sidecar를 남긴다.
- detector PASS만으로 Impeccable 사용을 주장하지 않는다.

## Severity

- High: corpus/내용 누락, 핵심 workflow 오해, 접근 불가, evidence identity 불일치처럼 완료 주장을 무효화한다.
- Medium: persona 과업 또는 접근성 과업을 실질적으로 막지만 제한된 workaround가 있다.
- Low: 정보·과업·접근성을 막지 않는 국소적 마감 문제다.
- blocker/material defect는 각각 High/Medium 정의에 해당하는 문제다.

## 요구사항-증거 Matrix

이 표의 모든 행이 PASS여야 자동·수동 품질 gate가 통과한다.

| Requirement | Check | Required artifact |
|---|---|---|
| corpus와 full payload 보존 | generated manifest + normalized inventory/digest comparison | completeness report |
| original source link와 duplicate-authority 방지 | source별 link existence + derived-summary marker 검사 | completeness report |
| plain HTML/CSS/JS와 외부 dependency 금지 | file extension/import/network request inventory | build report |
| 첫 viewport의 대상·결과·철학·경로 | desktop/mobile first-viewport review | screenshots + journey log |
| 현재 section·heading navigation·hash restore | fixed navigation/reload journeys | journey log |
| corpus-wide 3-action path와 긴 문서 local navigation | manifest에서 모든 source/heading 최단 action path와 H2/H3 8개 이상 문서 mapping 열거 | navigation report |
| typography/contrast/spacing과 AI-tell 금지 | Impeccable critique + detector | Impeccable evidence manifest |
| 예시·도식의 이해 기여와 정보 동등성 | source claim mapping + text alternative + desktop/mobile reading-order review | journey log + accessibility report |
| responsive navigation·overflow·focus name | desktop/mobile DOM and interaction audit | accessibility report |
| 두 route launch/navigation/hash/link/console parity | 위 two-row smoke | route parity report |
| beginner continuity와 experienced direct access | fixed browser journeys | journey log |
| optional search/filter empty state | 구현 시 keyboard + live-status journey, 미구현 시 N/A 근거 | journey log |
| no-JS fallback | 두 route에서 JS disable smoke | route parity report |
| reduced motion | media emulation 후 animation/transition 검사 | accessibility report |
| semantic/keyboard/zoom/reflow | WCAG mapping과 대표 journey | accessibility report + screenshots |
| offline deterministic generation | network 차단 상태 2회 build output digest 일치 | build report |
| local asset budget | HTML/CSS/JS/font/image byte 합계 ≤ 1 MB, content payload 별도 | build report |
| Impeccable process와 visual finish | versioned PRODUCT/context/seed/acknowledgement/composition approval/direction contract/detector/critique/finish/documenter | Impeccable evidence manifest |
| Luna comprehension과 transfer | preregistered prompt/transcript/path/exposure trail + frozen external scorer contract + evaluation-content pre-answer exclusion | Luna evidence bundle |
| final independent verdict | 동일 identity의 read-only review | Sol report |

## 필수 Gate

- [ ] 구현 전 Sol High가 평가 기준과 달성 목표를 `ACCEPT`한다.
- [ ] 실행 계약과 two-route parity matrix가 모두 PASS다.
- [ ] 독립 glob으로 생성한 source manifest가 대상 Markdown 집합과 정확히 일치한다.
- [ ] 모든 source 원문 byte가 bundle에 보존되고 대표 renderer smoke가 통과한다.
- [ ] 첫 viewport와 권장 경로가 저자의 실제 사용 방식을 먼저 설명한다.
- [ ] 기본 ordered loop, human authority, persona별 이해 항목이 원문 근거와 함께 전달된다.
- [ ] beginner 연속 경로와 experienced 3-action direct path가 동작한다.
- [ ] URL hash deep link와 reload 복원이 동작한다.
- [ ] JavaScript 비활성 상태에서도 소개와 원문 접근 경로가 남는다.
- [ ] semantic DOM, keyboard, zoom, reflow의 대표 journey를 확인한다.
- [ ] desktop/mobile screenshot review에서 blocker와 material visual defect가 없다.
- [ ] Impeccable PRODUCT/context/seed/acknowledgement/direction contract/critique/detector/finish/documentation 증거가 있다.
- [ ] 현재 HEAD와 배포 route, source manifest, rendered bundle의 identity가 최종 build·Luna·Sol 기록에서 일치한다.
- [ ] Luna Max 블라인드 테스트 3/3이 이해도 기준을 통과한다.
- [ ] 최종 Sol High에서 High·Medium finding 0건과 `ACCEPT`를 받는다.

## 이번 제작의 달성 목표

1. 저장소 문서 전체를 하나의 읽기 지도와 안정적인 deep link로 연결한다.
2. README의 저자 workflow를 첫 화면의 중심에 두고, 적용 절차는 그 다음에 배치한다.
3. 초보자는 안내된 순서로, 중상급자는 선택된 direct-navigation mechanism으로 같은 원문에 도달한다.
4. 원문을 복제·요약하면서 의미를 잃지 않고 모든 heading, 예시, template, 평가 근거를 보존한다.
5. plain HTML/CSS/JS만으로 빠르고 접근 가능한 정적 페이지를 만든다.
6. 문서 도구나 AI landing page의 상투적 UI를 피하고, 읽는 행위 자체가 방향을 제공하는 고유한 시각 체계를 만든다.
7. 자동 완전성 검사, Impeccable 마감, Luna Max 3인 블라인드 테스트, Sol High 최종 `ACCEPT`까지 증거를 남긴다.

## 완료 조건

위 필수 gate가 모두 PASS이고, Luna Max 3/3과 최종 Sol High `ACCEPT`가 확인되면 완료다. 소개 사이트의 독자 과업과 무관한 중복 증거·브라우저별 수동 인증은 완료 조건으로 확대하지 않는다.
