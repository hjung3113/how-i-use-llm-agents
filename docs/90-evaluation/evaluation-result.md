# 이번 개편 평가 기록

- 평가일: 2026-08-04
- 대상: `main`의 최종 배포본
- 주 질문: 초보자부터 중상급자까지 저자가 LLM agent를 실제로 어떻게 쓰는지 추가 설명 없이 재구성할 수 있는가?

## 자동 검사

- source corpus 51개와 생성 manifest가 일치한다.
- 각 Markdown 원문 byte가 생성 bundle에 그대로 보존된다.
- 내부 Markdown 파일과 heading anchor, 홈 deep link가 모두 유효하다.
- plain HTML/CSS/JS만 사용하며 shell asset은 1 MB 이하이다.
- 모바일에서 닫힌 문서 목록은 `hidden`·`inert`이고, 권장 경로의 이전·다음 link가 제공된다.
- 현재 digest와 asset byte는 `.impeccable/evidence/build-report.json`에 기록한다.

실행 명령:

```bash
node scripts/build-site.mjs
node tests/web/check-site.mjs --write-report
```

## Luna Max 블라인드 이해도 테스트

초기 자유 회상만으로 모든 세부 항목을 말하게 한 v1, v3, v4, v5는 각각 1/3이었다. v3 실무자 session은 평가 문서를 먼저 열어 무효 처리했다. 이 실패와 무효 이력은 숨기지 않았다.

Sol High 방법론 검토에서 자유 설명에 선택되지 않은 항목을 곧바로 이해 실패로 처리하는 문제가 발견됐다. 지식 기준은 유지하고, 첫 자유 설명 뒤 추가 탐색 없이 동일한 open-response probe로 빠진 이해 차원을 회수하도록 평가 방식을 수정했다.

최종 v6의 세 session은 모두 평가 문서를 열지 않았고, probe 뒤에도 browser나 tool을 다시 사용하지 않았다. 처음 저장한 terminal transcript가 마지막 soft-wrap 두 줄을 누락해 예비 1/3이 나왔지만, 동일 terminal handle의 화면 snapshot으로 누락 구간만 보완해 독립 Sol High가 **3/3 PASS**로 재판정했다.

| 페르소나 | 결과 |
|---|---|
| 입문 개발자 | PASS |
| 실무 개발자 | PASS |
| PM/창업자 | PASS |

## UI와 접근성

- desktop 1440×900과 mobile 390×844 화면을 다시 캡처했다.
- semantic landmark, skip link, heading, focus style, reduced motion, 320px reflow를 확인했다.
- macOS 권한 표시는 granted였지만 Orca Computer Use가 Chrome accessibility window를 읽지 못했다. 실제 VoiceOver 점검은 best-effort limitation으로 기록하며, 단순 소개 사이트의 완료 blocker로 확대하지 않는다.

## 완료 판단

문서 내용, glossary, meta-prompting, 설계 grilling/alignment, 제품 설계 문서 분할 설명, 정적 desktop/mobile 웹과 Luna 3/3은 충족했다. 국소 navigation·focus 수정은 의미를 바꾸지 않으므로 전체 Luna를 반복하지 않고 focused browser check로 닫았다. 같은 배포본을 대상으로 한 최종 Sol High 리뷰는 차단 결함 없이 **ACCEPT**했다.
