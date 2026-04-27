# JDS UI Screen Plan

이 문서는 `codex_examples`에 만든 HTML 시안을 기준으로 현재까지의 화면 구성 계획을 정리한다. 실제 구현 전, 화면 흐름과 디자인 방향을 맞추기 위한 작업용 기획 문서다.

## Design Direction

JDS UI는 `DESIGN.md`를 기준으로 한다.

- 다크 터미널/IDE 인터페이스를 기본 톤으로 사용한다.
- VS Code 계열 팔레트와 syntax-highlight 색상을 유지한다.
- 화면은 게임 메뉴라기보다 디버그 도구, IDE, 터미널 세션처럼 보여야 한다.
- 스토리는 긴 설명보다 boot log, command, source file, event queue, status bar로 전달한다.
- 장식은 게임 상태와 다음 행동을 읽는 데 도움이 될 때만 사용한다.
- `frontend-design` 스킬 적용 시, 화면마다 명확한 미학 방향을 잡되 JDS의 터미널/IDE 정체성을 벗어나지 않는다.

## Current Flow

현재 계획한 첫 플레이 진입 흐름은 다음 순서다.

```text
01 Start / Boot Screen
-> 02 Stage Select / Curriculum Pipeline
-> 03 Weapon Select / Source-File Arsenal
-> 04 In-Game HUD
-> 05 Level Up / Upgrade Modal
-> 06 Event / Quest Popup
-> 07 Boss Warning
-> 08 Stage Clear / Result
-> 09 Game Over
-> 10 Collection / Codex
```

우선순위는 01-05번 화면이다. 06-10번은 플레이 구조가 더 명확해진 뒤 구체화한다.

## 01 Start / Boot Screen

시안 파일:

- `01_start_screen_with_design.html`
- `01_start_screen_frontend_design.html` (frontend-design 비교용)

역할:

- 게임에 처음 진입하는 시작 화면.
- SSAFY 디버그 세션과 JDS 세계관을 boot log로 소개한다.
- 플레이어가 `jiyoon@ssafy:~/stage1$` 터미널에 들어온 느낌을 준다.

핵심 구성:

- macOS 스타일 터미널 title bar
- `JDS SURVIVAL` ASCII/logo treatment
- boot log
- `npm run survive` 프롬프트
- Stage 1 세션 정보
- start debug session 버튼

채택 이유:

- `DESIGN.md`를 적용한 버전이 프로젝트 정체성과 잘 맞는다.
- 비교용 `start_screen_without_design.html`보다 JDS의 코딩/디버깅 테마가 훨씬 선명하다.

보류/비교 파일:

- `start_screen_without_design.html`
- 밝은 캐주얼 랜딩 화면에 가까워 JDS 본편 방향으로는 채택하지 않는다.

## 02 Stage Select / Curriculum Pipeline

시안 파일:

- `02_stage_select_frontend_design.html`

이전 시안:

- `02_stage_select_with_design.html`

역할:

- SSAFY 커리큘럼을 스테이지 선택 화면으로 보여준다.
- 각 스테이지를 디버그 세션 또는 실행 파이프라인처럼 선택하게 한다.
- Stage 1이 열려 있고, 이후 스테이지는 잠금 상태로 보인다.

핵심 구성:

- IDE explorer의 curriculum 파일 목록
- 중앙 `Stage Pipeline`
- Stage 1-6 파이프라인 목록
- 선택된 Stage 1 briefing
- event queue
- `continue to weapon select` 버튼

채택 방향:

- `frontend-design` 적용 버전인 `02_stage_select_frontend_design.html`을 우선 후보로 둔다.
- 이유는 단순 카드 그리드보다 “커리큘럼이 실행 파이프라인으로 컴파일된다”는 콘셉트가 강하기 때문이다.

스테이지 정보:

- Stage 1: Python Basics, SSAFY classroom terminal
- Stage 2: Algorithm Basics, online judge
- Stage 3: Web, browser devtools
- Stage 4: Advanced Algorithm, graph debugger
- Stage 5: AI, model evaluation console
- Stage 6: Django Final, production deploy terminal

결정 필요:

- 잠긴 스테이지를 전부 보여줄지, 일부만 preview할지 정해야 한다.
- Stage Select 화면에서 보스 이름을 노출할지, Stage 1 briefing에서만 보여줄지 정해야 한다.

## 03 Weapon Select / Source-File Arsenal

시안 파일:

- `03_weapon_select_frontend_design.html`

역할:

- Stage 1 진입 전 starter weapon을 선택한다.
- 무기를 일반 카드가 아니라 source file로 표현한다.
- 선택한 무기의 전투 성격을 코드와 effect preview로 동시에 보여준다.

핵심 구성:

- 좌측 weapon file explorer
- 중앙 `Python.py` 코드 프리뷰
- 중앙/우측 effect preview arena
- 우측 combat profile
- starter weapon 비교
- `start Stage 1 with Python` 버튼

채택 방향:

- `source-file arsenal bench` 콘셉트를 유지한다.
- Stage 1의 기본 선택지는 `Python.py`, `C_Cpp.c`, `Java.class`다.
- reward weapon은 잠금 상태로 explorer에 표시한다.

무기 표현 원칙:

- Python: 360도 coverage, 안정적 자동 추적
- C/C++: 직선 관통, 빠른 direct debugging
- Java: 근접 방어, orbital guard
- Git/SQL/JavaScript/Django/Linux-Bash는 reward weapon으로 잠금 표시

결정 필요:

- 첫 진입 시 기본 선택을 Python으로 고정할지, 이전 선택을 기억할지 정해야 한다.
- effect preview를 실제 게임 이펙트와 얼마나 비슷하게 만들지 정해야 한다.

## 04 In-Game HUD

시안 파일:

- `04_in_game_hud_frontend_design.html`

역할:

- 실제 전투 중 필요한 정보를 보여준다.
- JDS의 가장 중요한 플레이 화면이므로 정보 밀도와 가독성이 핵심이다.

포함 정보:

- HP
- EXP / Level
- timer
- stage
- selected weapon
- active quest/event
- debug log
- boss warning state

디자인 방향:

- `examples/total_ui/Debug Survival - Terminal UI-print.html` 참고.
- compact debug-console style.
- 전투 화면을 가리지 않는 안정적인 크기.
- 긴 설명보다 짧은 log line과 warning badge 사용.

## 05 Level Up / Upgrade Modal

시안 파일:

- `05_level_up_upgrade_modal_frontend_design.html`

역할:

- 레벨업 시 무기 강화나 스탯을 선택한다.
- 코드 자동완성 또는 quick fix popup처럼 보여야 한다.

구성 후보:

- `Quick Fix` 또는 `Autocomplete` 스타일 modal
- 3개 선택지
- 무기 강화, 스탯 강화, 회복/보조 선택지
- 선택 시 짧은 commit/apply animation

## 06 Event / Quest Popup

시안 파일:

- `06_event_quest_popup_frontend_design.html`

역할:

- 중간 이벤트와 동기들의 도움 요청을 전달한다.
- 스토리와 보상 구조를 연결한다.

예시:

- `IndentationError keeps breaking the lab!`
- `Fix 10 indentation bugs`
- `The IDE is dead. Keep the session alive.`

## 07 Boss Warning

시안 파일:

- `07_boss_warning_frontend_design.html`

역할:

- 보스 등장 직전 긴장감을 만든다.
- 전투 가독성을 해치지 않는 짧고 강한 경고 연출이 필요하다.

예시:

- `CRITICAL ERROR`
- `boss.spawn("Jang Seonhyeong")`
- `I am not losing again!`

## 08 Stage Clear / Result

시안 파일:

- `08_stage_clear_result_frontend_design.html`

역할:

- 스테이지 클리어 결과와 다음 진행을 보여준다.
- 보상, 클리어 시간, 처치한 오류, unlock 정보를 정리한다.

예시:

- `tests passed`
- `commit successful`
- `stage cleared`

## 09 Game Over

시안 파일:

- `09_game_over_frontend_design.html`

역할:

- 실패 결과를 보여주고 재시도 흐름을 제공한다.

예시:

- `Process terminated`
- `debug session failed`
- `retry?`

## 10 Collection / Codex

시안 파일:

- `10_collection_codex_frontend_design.html`

역할:

- 무기, 몬스터, 오류 설명, 보스 로그를 모아보는 도감 화면.
- 게임을 반복할수록 세계관과 학습 로그가 쌓이는 느낌을 준다.

## Open Decisions

- 02번 화면은 `02_stage_select_frontend_design.html`을 우선 후보로 둘지 최종 채택할지 결정해야 한다.
- 03번 화면에서 starter weapon 3종의 preview를 각각 독립적으로 만들지 결정해야 한다.
- 04번 HUD는 실제 전투 가독성이 중요하므로 HTML 시안 이후 Playwright screenshot 검증이 필요하다.
- 화면 간 전환 문구를 command style로 통일할지, button label은 더 직관적으로 쓸지 결정해야 한다.

## Implementation Notes

- 현재 파일들은 HTML/CSS 시안이며 실제 Phaser UI 구현은 아니다.
- 채택된 화면만 나중에 Phaser scene 또는 DOM overlay로 옮긴다.
- 화면 구현 시 `DESIGN.md`의 색상, 폰트, compact UI 규칙을 우선 적용한다.
- `frontend-design`은 JDS 테마 안에서 화면별 콘셉트를 더 선명하게 만드는 데 사용한다.

## Review Deck And Renewal Plan

Added after the 01-10 frontend-design prototype pass:

- `index.html`: review deck for comparing all ten HTML screen drafts in one place.
- `UI_RENEWAL_PLAN.md`: implementation plan for converting the drafts into production JDS UI.

Recommended workflow:

1. Review `index.html` to compare visual consistency, density, and reusable patterns.
2. Use `UI_RENEWAL_PLAN.md` to choose implementation phases and acceptance criteria.
3. Move patterns into production UI only after the shared tokens and component boundaries are clear.
