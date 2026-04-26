# Jiyoon Debug Survival Renewal

Codex로 처음부터 다시 만든 **지윤 디버그 서바이벌** 리뉴얼 버전입니다.

## Stack

- Phaser 3
- TypeScript
- Vite
- Vitest
- Playwright

## Run

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run build
npm test
npm run e2e
```

## Concept

프로그래밍 버그를 적으로 의인화한 터미널 IDE풍 서바이벌 게임입니다.

- Stage 1은 플레이 가능한 수직 슬라이스입니다.
- Stage 2-6은 typed config 로드맵으로 준비되어 있습니다.
- 핵심 루프는 `무기 선택 -> 웨이브 생존 -> 이벤트 -> 보스 -> 클리어`입니다.
