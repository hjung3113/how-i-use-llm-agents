# Claude Code 기능을 언제 사용하는가

기능 명칭과 동작은 바뀔 수 있으므로 실제 설정 전 [Anthropic 공식 문서](https://docs.anthropic.com/en/docs/claude-code/getting-started)를 확인한다.

## 기본 CLI와 세션

- `claude`: 현재 디렉터리에서 대화형 세션 시작
- `claude --continue`: 현재 디렉터리의 최근 대화 이어가기
- `claude --resume`: 이전 세션 선택 또는 ID로 재개
- `claude -p`: 비대화형 실행

전체 옵션은 [공식 CLI reference](https://docs.anthropic.com/en/docs/claude-code/cli-usage)를 따른다. 입문자는 대화형 세션부터 시작하고 `-p` 자동화는 허용 도구와 실패 처리를 설계한 뒤 사용한다.

## `CLAUDE.md`

팀이 공유할 프로젝트 지침, 자주 쓰는 명령, 아키텍처 규칙을 둔다. 짧고 구체적으로 유지한다. 개인 취향과 credential을 repository 파일에 넣지 않는다.

이 저장소에서는 여러 agent runtime에 공통인 정책은 `AGENTS.md`, Claude Code 전용 진입점은 `CLAUDE.md`로 나누는 방식을 예시로 사용한다. 회사에서 Claude Code만 쓴다면 `CLAUDE.md` 하나로 시작해도 된다.

## Permission

Claude Code는 파일과 명령을 실제로 실행하므로 권한은 편의 기능이 아니라 안전 경계다.

- 입문자는 기본 permission prompt를 유지한다.
- 반복되는 안전한 read/test 명령만 팀 검토 후 허용한다.
- 광범위한 우회 옵션을 기본 설정으로 공유하지 않는다.
- 외부 시스템 credential은 조직의 안전한 제공 방식을 따른다.

## Skill과 command

반복 작업 절차를 재사용한다. 좋은 skill은 명확한 trigger, 좁은 책임, 입력·출력, 검증, 실패 조건이 있다.

사용 시점: 같은 종류의 debugging, review, planning 절차를 여러 프로젝트에서 반복할 때.

## Subagent

독립된 관점이나 병렬 가능한 작업에 사용한다.

좋은 예:

- 구현자와 read-only reviewer 분리
- 제품/UX와 아키텍처 관점 분리
- write set이 겹치지 않는 두 탐색 작업

나쁜 예: 10분짜리 한 파일 수정에 역할을 여러 개 만든다.

## MCP

MCP는 모델이 외부 데이터와 도구에 구조적으로 접근하는 표준이다. GitHub, 문서, 데이터베이스 같은 시스템 연결에 사용할 수 있다. 개념과 제품별 지원은 [공식 MCP 안내](https://docs.anthropic.com/en/docs/mcp)를 참고한다.

연결 전 확인할 것:

- 어떤 데이터에 접근하는가?
- read와 write 권한이 분리되는가?
- 어떤 호출이 외부 효과를 만드는가?
- 로그에 비밀이나 개인 데이터가 남는가?

## Hook

도구 호출 전후에 검사, formatting, 알림 같은 정책을 자동화한다.

사용 시점: 사람의 기억에 의존하면 반복적으로 빠지는 기계적 gate가 있을 때.

주의점: hook이 에이전트의 실제 상태와 다르게 성공을 보고하거나 작업을 무한 재시도하지 않게 한다.

## Plugin

여러 skill, command, hook, agent를 함께 배포한다. 설치 단위가 커질수록 팀에 주입되는 규칙과 권한을 검토해야 한다.

도입 전 최소 확인:

- source와 license
- 포함된 hook과 외부 통신
- 업데이트와 제거 방법
- project scope와 user scope
- 실제 새 세션에서의 동작
