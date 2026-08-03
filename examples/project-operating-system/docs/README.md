# 프로젝트 문서 지도

이 폴더는 전체 예시다. 실제 프로젝트에서는 내용이 필요한 폴더만 만든다.

| 위치 | 목적 | 현재 권위 여부 |
|---|---|---|
| [`product`](product/README.md) | 사용자, 문제, 범위, 비목표 | 제품 동작의 권위 |
| [`architecture`](architecture/README.md) | 시스템 경계와 계약 | 시스템 구조의 권위 |
| [`adr`](adr/0000-template.md) | 되돌리기 어려운 결정 | 승인된 결정의 권위 |
| [`agents`](agents/README.md) | Issue tracker, domain, agent 참조 | 작업 절차의 보조 권위 |
| [`plans`](plans/README.md) | delivery 순서와 임시 계획 | 제품 동작의 권위가 아님 |
| [`research`](research/README.md) | 조사 근거와 불확실성 | 결정 전 입력 |
| [`reviews`](reviews/README.md) | 고정 revision의 독립 검토 | 검증 증거 |
| [`operations`](operations/README.md) | 실행·배포·복구 절차 | 운영 절차의 권위 |
| [`archive`](archive/README.md) | 대체된 역사 자료 | 현재 권위가 아님 |

## 충돌을 해결하는 질문

- 제품이 무엇을 보장하는가? → `product`, 관련 ADR
- 시스템이 어떻게 구성되는가? → `architecture`, 관련 ADR
- 이번에 무엇을 배달하는가? → Issue와 `plans`
- 지금 실제 상태가 무엇인가? → Git, runtime, test, PR, CI
- 과거에 무엇을 검토했는가? → `reviews`, `research`, `archive`
