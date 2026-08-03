# 제품 설계를 여러 문서로 나누는 법

내가 제품 설계를 여러 문서로 나누는 목적은 파일 수를 늘리는 것이 아니라, 독자와 변경 속도가 다른 정보를 서로 덮어쓰지 않게 하는 것이다. 작은 제품은 한 문서가 더 낫고, 한 문서 안에서 서로 다른 이유로 자주 충돌할 때만 나눈다.

## 한 문서와 여러 문서의 장단점

| 방식 | 장점 | 단점 | 잘 맞는 경우 |
|---|---|---|---|
| 한 문서 | 검색과 읽기 순서가 단순하고 전체 맥락이 붙어 있다. | 길어지면 제품 약속, 구현 계약, 일정이 뒤섞이고 일부 수정이 전체 권위처럼 보인다. | 초기 탐색, 작은 제품, 한 팀이 함께 수정 |
| 여러 문서 | 책임·권위·변경 이력이 분명하고 필요한 부분만 읽을 수 있다. | 문서 지도와 충돌 규칙이 없으면 중복, drift, 링크 순회가 생긴다. | 여러 도메인, 여러 구현 팀, 장기 제품 |

파일 크기만으로 나누지 않는다. 다음 중 하나가 실제로 다를 때 나눈다.

- 답하는 질문
- 책임 있는 독자나 편집자
- 변경 주기
- 권위와 승인 방식
- 다른 문서와 충돌했을 때 우선순위

## 실무에서 자주 쓰는 분할 축

### 1. 제품 → 도메인 → 기능 영역

```text
docs/design/
├── README.md              읽기 순서와 권위
├── product.md             사용자, 문제, outcome, non-goal
├── domain-model.md        용어, entity, invariant
├── workflows.md           영역을 가로지르는 사용자 흐름
└── areas/
    ├── feedback.md        한 기능 영역의 관찰 가능한 동작
    └── execution.md
```

제품이 여러 독립 시스템을 포함하거나 같은 용어가 여러 문서에서 반복될 때 유용하다. 공통 용어와 invariant는 `domain-model.md` 한 곳에 두고, 영역 문서는 local behavior만 추가한다.

### 2. 제품 설계 → 구현 계약

```text
docs/
├── design/                무엇을, 왜, 사용자에게 어떻게 보이는가
└── implementation/        코드·API·DB·테스트에서 어떻게 지키는가
```

제품 설계의 API 초안과 실제 구현 계약이 함께 존재한다면 상태를 명시한다. 예를 들어 “design input, not implementation authority”라고 표시하고, 실제 endpoint나 migration과 충돌하면 구현 권위가 이기도록 정한다.

### 3. 지속 설계 → 시점 결정 → 배달 순서

```text
docs/
├── design/                현재 제품의 지속되는 권위
├── adr/                   대안과 trade-off가 있던 결정
├── plans/                 milestone, dependency, 임시 순서
└── archive/               대체된 roadmap과 과거 설계
```

가장 중요한 분리다. `plan`은 언제 만들지를 정하지만 제품이 영구적으로 어떻게 동작해야 하는지를 새로 정의하지 않는다. 계획이 설계와 충돌하면 계획을 고친다.

### 4. 학습 목적에 따른 분리

사용자 문서가 커지면 Diátaxis처럼 독자의 질문으로 나눌 수 있다.

- Tutorial: 처음부터 성공까지 따라 하기
- How-to: 이미 아는 사용자의 특정 과제 해결
- Reference: 정확한 옵션과 계약 조회
- Explanation: 배경, 이유, trade-off 이해

제품 설계 권위를 이 네 폴더에 흩뿌리지는 않는다. 이 축은 설명 방식이고, product/architecture/ADR 같은 축은 권위의 위치다.

## 내가 관찰한 대표 패턴

공개 저장소에서 확인할 수 있는 두 가지 규모를 예로 든다.

- [`FeedbackOps`](https://github.com/hjung3113/FeedbackOps)는 product overview, canonical domain model, requirement matrix, 기능 영역, cross-system workflow, UI 원칙, API/data draft를 나눈다. 범위가 넓고 독립 시스템이 여러 개일 때 탐색성과 local ownership을 얻지만, draft와 implementation authority의 충돌 규칙이 필수다.
- [`opencode-orchestrated-agent-workflow`](https://github.com/hjung3113/opencode-orchestrated-agent-workflow)는 product, architecture, runtime, task graph, workflow, file protocol, examples를 나누고, 과거 delivery 순서는 [`docs/archive/roadmaps/delivery-plan.md`](https://github.com/hjung3113/opencode-orchestrated-agent-workflow/blob/main/docs/archive/roadmaps/delivery-plan.md)에 보관한다. 제품 권위와 역사적 sequencing을 분리하기에 좋지만, 처음 읽는 사람에게는 `docs/design/README.md`의 읽기 순서가 반드시 필요하다.

이 사례의 구조를 그대로 복사하지 않는다. 제품의 실제 독립 영역과 충돌 위험만 가져온다.

## 규모별 최소 예시

### 작은 제품

```text
docs/
├── README.md
├── product.md             사용자, 문제, 범위, 주요 흐름, non-goal
└── adr/                   실제 trade-off가 생길 때만
```

### 중간 규모 제품

```text
docs/
├── README.md              지도, 읽기 순서, 권위 충돌 규칙
├── product/
│   ├── overview.md
│   ├── domain-model.md
│   └── workflows.md
├── architecture/
│   ├── overview.md
│   └── contracts.md
├── adr/
└── plans/
```

`product/overview.md`가 너무 길다는 이유만으로 기능별 파일을 만들지 않는다. 실제로 독립적인 용어·흐름·편집 책임이 생길 때 `product/areas/`를 추가한다.

## drift를 막는 네 가지 규칙

1. `docs/README.md`에 각 위치가 답하는 질문과 읽기 순서를 쓴다.
2. 같은 사실의 canonical 위치를 하나만 정하고 다른 문서는 링크한다.
3. 초안, 현재 권위, 역사 자료의 상태를 제목 아래에 표시한다.
4. 문서를 나눴는데 한 변경이 늘 여러 파일의 같은 문장을 고치게 만들면 다시 합친다.

루트 `CONTEXT.md`를 함께 쓴다면 제품 설계의 복사본으로 만들지 않는다. `CONTEXT.md`는 agent가 첫 탐색에서 알아야 할 목적·핵심 용어·불변 조건과 canonical 문서 링크만 담는 짧은 입구다. 상세 제품 사실은 `docs/product/` 또는 `docs/design/` 한 곳에만 둔다.

문서 분할은 깊은 module과 같다. 독자는 작은 문서 지도를 interface로 배우고, 필요한 제품 지식을 그 뒤에서 얻어야 한다. 지도를 이해하는 비용이 내용보다 커지면 구조가 너무 얕고 복잡한 것이다.
