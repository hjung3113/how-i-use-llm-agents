# 자주 사용하는 스킬과 플러그인

도구는 워크플로우를 대신하지 않는다. 먼저 해결하려는 실패 유형을 정하고, 그 실패를 줄이는 가장 작은 도구를 선택한다. 아래 목록은 실제 작업에서 자주 사용한 범주를 공유 가능한 형태로 정리한 것이다.

## 핵심 도구군

### [Superpowers](https://github.com/obra/superpowers)

브레인스토밍, 계획 작성, 테스트 주도 개발, 디버깅, subagent-driven development처럼 소프트웨어 작업의 반복 절차를 skill로 제공한다.

주로 사용하는 개념:

- 구현 전에 요구사항을 구체화한다.
- 계획과 실행을 구분한다.
- 작은 작업 단위마다 검증한다.
- 구현자와 리뷰어 역할을 분리한다.
- 실패한 finding만 집중 수정한다.

잘 맞는 상황: 한 기능을 아이디어에서 검증된 구현까지 일관된 절차로 진행할 때.

### [Get Shit Done](https://github.com/gsd-build/get-shit-done)

프로젝트를 milestone, phase, plan, execution, validation 단위로 운영하는 메타 프롬프팅·컨텍스트 관리 도구다.

자주 사용한 흐름:

```text
new milestone → discuss phase → plan phase
→ execute phase → validate/audit → complete milestone
```

잘 맞는 상황: 여러 세션에 걸친 비교적 큰 프로젝트에서 진행 상태와 계획 파일을 유지할 때.

주의점: 작은 수정에 전체 ceremony를 적용하지 않는다. 계획 유지 비용이 작업 자체보다 커지면 더 작은 하네스로 낮춘다.

### [Orca](https://github.com/stablyai/orca)

여러 CLI 에이전트, Git worktree, terminal을 프로젝트별로 격리해 병렬 운영하는 환경이다. [공식 CLI 문서](https://www.onorca.dev/docs/cli/reference)와 [worktree 모델](https://www.onorca.dev/docs/model/worktrees)을 참고할 수 있다.

주로 사용하는 기능:

- Issue별 worktree와 branch 분리
- 구현 lane과 리뷰 lane 동시 관찰
- Codex, Claude 등 서로 다른 에이전트 실행
- terminal과 browser 상태 확인
- 작업 완료, 차단, handoff 상태 전달

잘 맞는 상황: 서로 독립적인 여러 Issue를 병렬 처리하거나 구현과 독립 리뷰를 물리적으로 분리할 때.

### [Matt Pocock Skills](https://github.com/mattpocock/skills)

설계와 코드베이스 이해를 돕는 작고 조합 가능한 skill 모음이다.

주로 사용하는 skill:

- `domain-modeling`: 용어와 ubiquitous language를 정리한다.
- `codebase-design`: 모듈의 책임, 경계, 깊이를 검토한다.
- `grilling`: 계획이나 설계의 모호함을 구현 전에 공격한다.
- `code-review`: 요구사항 충족과 저장소 규칙 준수를 분리해 검토한다.
- `handover`: 다음 세션이 이어받을 수 있는 상태를 남긴다.

잘 맞는 상황: 코드 작성보다 용어, 모듈 경계, 설계 권위가 문제일 때.

### [context-mode](https://github.com/mksglu/context-mode)

큰 명령 출력과 문서를 바로 대화 컨텍스트에 넣지 않고, 검색·필터·요약 가능한 형태로 다루기 위한 MCP와 hook 기반 도구다.

주로 사용하는 원칙:

- 큰 데이터를 읽기보다 프로그램으로 필터링한다.
- 여러 조회를 한 번에 batch한다.
- 원문은 외부 artifact에 두고 필요한 근거만 컨텍스트로 가져온다.
- compaction 이후에는 이전 결정을 검색하고 이어간다.

잘 맞는 상황: 로그, 대규모 코드 검색, 긴 세션처럼 컨텍스트 범람 위험이 큰 작업.

## 내장 기능과 연결 도구

오픈소스 skill 외에도 다음 기능을 조합한다.

- Codex/Claude subagent: 역할 분리와 독립 분석
- Git과 GitHub CLI: branch, diff, commit, PR, CI, Issue의 실제 상태
- Playwright 또는 브라우저 제어: UI 블랙박스 검증
- MCP connector: GitHub, 문서, 메일, 캘린더 같은 외부 시스템의 구조화된 접근
- memory/chronicle: 과거 작업 경로와 최근 화면 맥락 탐색
- shell과 프로젝트 테스트 러너: 재현 가능한 실행 증거

## Skill, plugin, MCP, harness의 차이

| 요소 | 역할 | 예시 |
|---|---|---|
| Skill | 특정 작업을 수행하는 절차 | 디버깅, 코드 리뷰, domain modeling |
| Plugin | 여러 skill·hook·connector를 묶은 설치 단위 | Superpowers, GitHub plugin |
| MCP/connector | 외부 데이터나 기능을 구조적으로 연결 | GitHub, browser, context-mode |
| Harness | 여러 역할과 도구를 하나의 실행 시스템으로 배치 | 구현자–리뷰어, worktree DAG |
| Rule file | 프로젝트별 권위와 행동 경계 | `AGENTS.md`, `CLAUDE.md` |

## 선택 기준

새 도구를 추가하기 전에 묻는다.

1. 어떤 반복 실패를 막는가?
2. 기존 rule이나 script로 해결되지 않는가?
3. 특정 모델에 종속되는가?
4. 생성하는 상태와 artifact는 어디에 저장되는가?
5. 제거하거나 다른 도구로 옮기기 쉬운가?
6. 설치와 컨텍스트 비용보다 얻는 신뢰성이 큰가?

도구가 많아질수록 같은 책임을 가진 command와 skill이 중복되기 쉽다. 프로젝트마다 하나의 기본 경로를 정하고 예외적으로만 다른 도구를 사용한다.

