# Project operating system example

여러 LLM agent와 세션이 같은 프로젝트에서 일할 때 사용하는 범용 skeleton이다.

## 최소 시작

Claude Code만 사용한다면 [`CLAUDE.md`](CLAUDE.md) 하나로 시작해도 된다. 여러 agent runtime이 같은 정책을 공유한다면 [`AGENTS.md`](AGENTS.md)를 공통 원천으로 두고 `CLAUDE.md`는 얇은 adapter로 유지한다.

## 파일 역할

| 파일 | 생성 시점 | 목적 |
|---|---|---|
| [`AGENTS.md`](AGENTS.md) | 공통 정책이 반복될 때 | 모든 agent가 지킬 작업 규칙 |
| [`CLAUDE.md`](CLAUDE.md) | Claude Code 사용 시작 | Claude 전용 진입점 |
| [`CONTEXT.md`](CONTEXT.md) | 제품·도메인 설명이 필요할 때 | 목적, 용어, 불변 조건, 권위 문서 |
| [`HANDOFF.md`](HANDOFF.md) | 작업을 다른 세션이 이어받을 때 | 현재 상태 snapshot |
| [`MEMORY.md`](MEMORY.md) | 검증된 교훈이 반복될 때 | 장기적으로 재사용할 사실과 교훈 |
| [`docs/`](docs/README.md) | 문서가 한 파일을 넘을 때 | 제품·설계·결정·계획·증거 분리 |

## 적용 순서

1. `CLAUDE.md` 또는 `AGENTS.md`의 placeholder를 프로젝트에 맞게 줄인다.
2. 실제 명령과 권위 문서를 확인한 내용만 기록한다.
3. 필요하지 않은 파일과 폴더는 복사하지 않는다.
4. 새 세션에서 rule이 발견되고 실제 작업에 적용되는지 확인한다.
