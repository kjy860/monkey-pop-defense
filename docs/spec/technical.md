# 몽키 팝 디펜스 (Monkey Pop Defense) — 기술·데이터 설계

> 문서 버전 v12 · 완성도 100% · 마지막 수정 2026. 10. 30. 14시 38분 33초
> 이 문서만 보고 AI(또는 개발자)가 개발해도 거의 같은 결과가 나오도록 작성되었습니다.

## 기본 정보

| 항목 | 값 |
| --- | --- |
| 사이트 이름 | 몽키 팝 디펜스 (Monkey Pop Defense) |
| 영문 식별자(slug) | monkey-pop-defense |
| 개발 방식(framework) | vite |
| 데이터베이스 사용 | 아니오 |
| 배포 | GitHub → Vercel (무료) |

## 1. 데이터 모델

### 클라이언트 로컬 저장소 스키마 (`localStorage.getItem('monkey_pop_record')`)
```typescript
interface GameSaveRecord {
  highestRoundCleared: number; // 전체 최고 클리어 라운드 (최대 100+)
  difficultyRecords: {
    easy: { cleared: boolean; highestFreeplayRound: number };
    normal: { cleared: boolean; highestFreeplayRound: number };
    hard: { cleared: boolean; highestFreeplayRound: number };
  };
  soundMuted: boolean;
}
```

### 인게임 런타임 엔티티 모델
- **MapConfig**: `id`, `waypoints`, `bgTheme`
- **Tower**: `id`, `type`, `x`, `y`, `range`, `damage`, `attackSpeed`, `level`, `totalInvested`
- **Balloon**: `id`, `type` ('red'|'blue'|'green'|'yellow'|'lead'|'ceramic'|'moab'|'bfb'|'zomg'), `hp`, `maxHp`, `speed`, `pathProgress`, `isImmuneToSharp`, `isFrozen`

## 2. 기술 스택과 폴더 구조

### 기술 스택
- **프레임워크**: React 18 + Vite (TypeScript 5.x)
- **스타일링**: Tailwind CSS v3
- **그래픽 렌더링**: HTML5 Canvas 2D 컨텍스트 (오브젝트 풀링 기반 고성능 렌더러 - 풍선 10배 물량 최적화)
- **상태 관리**: Zustand v4 (인게임 엔티티, 경제, 웨이브, UI 상태 분리)
- **오디오 합성**: Web Audio API (외부 mp3 파일 없이 OscillatorNode/GainNode를 활용한 팝 사운드, 펑 사운드 실시간 합성)
- **영속 저장**: 브라우저 `localStorage` API

### 상세 디렉토리 및 파일 구조
```
monkey-pop-defense/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── src/
    ├── main.tsx             # React 엔트리포인트
    ├── App.tsx              # 메인 애플리케이션 프레임
    ├── index.css            # Tailwind 베이스 및 폰트 설정
    ├── types/
    │   └── game.ts          # 7종 타워, 풍선, 웨이브, 맵 인터페이스 정의
    ├── audio/
    │   └── soundSynth.ts    # Web Audio API 팝/폭발/설치 효과음 신시사이저
    ├── store/
    │   ├── useGameStore.ts  # HUD 상태, 골드, 라이프, 현재 라운드, 배속
    │   └── useRecordStore.ts# 로컬 스토리지 최고 기록 및 음소거 설정
    ├── game/
    │   ├── constants.ts     # 7종 타워 스펙, 풍선 속성(10배 물량), 업그레이드 비용 상수표
    │   ├── mapPaths.ts      # 3종 맵 웨이포인트(초원, 사막, 화산) 및 렌더링 경로
    │   ├── waveData.ts      # 1~100 라운드별 10배 스폰 시퀀스 및 무한모드 생성 공식
    │   ├── collision.ts     # 원-선분, 원-원, 압정 사방 확산 투사체 충돌 판정 알고리즘
    │   ├── entities/        # Canvas 렌더링 엔티티
    │   │   ├── TowerEntity.ts
    │   │   ├── BalloonEntity.ts
    │   │   ├── ProjectileEntity.ts
    │   │   └── ParticleEntity.ts
    │   └── engine.ts        # rAF(requestAnimationFrame) 기반 틱 루프 및 이벤트 디스패처
    └── components/
        ├── HeaderHUD.tsx    # 체력, 골드, 라운드, 배속, 일시정지, 음소거 헤더
        ├── GameCanvas.tsx   # Canvas 렌더링 뷰포트 및 타워 마우스 인터랙션
        ├── TowerShop.tsx    # 우측 7종 타워 구매 목록 및 선택 타워 업그레이드/판매 UI
        └── modals/
            ├── MapSelectModal.tsx   # 시작 시 난이도/맵 선택 모달
            ├── VictoryModal.tsx     # 100R 승리 및 무한모드 선택 모달
            └── GameOverModal.tsx    # 패배 시 재도전 및 최종 스코어 모달
```

### 환경 변수 (Environment Variables)
- 순수 브라우저 클라이언트 기반 애플리케이션으로 백엔드 DB 및 외부 API 키 없이 구동됩니다. 필수 환경 변수 없음.

## 3. 품질 기준 (성능·보안·접근성)

### 품질 및 성능 기준
- **프레임 레이트**: 캔버스 내 100개 이상의 풍선과 50개 이상의 투사체가 동시 활성화되어도 **초당 55~60 FPS** 유지
- **메모리 최적화**: 화면 밖으로 벗어난 투사체와 터진 풍선 오브젝트를 가비지 컬렉터 부담 없이 재사용하는 오브젝트 풀링(Object Pooling) 기법 적용
- **키보드 접근성**: 
  - `Spacebar`: 웨이브 시작 / 일시정지 토글
  - `1`, `2`, `3`, `4`: 해당 단축키로 타워 빠른 선택
  - `Escape`: 타워 선택 해제 및 모달 닫기
- **오류 방지**: 트랙 경로 위나 기존 타워가 있는 타일에는 타워 배치가 불가능하도록 빨간색 사거리 원으로 시각적 오류 피드백 제공

## 변경 이력

| 버전 | 일시 | 변경 내용 |
| --- | --- | --- |
| v12 | 2026. 10. 30. 14시 38분 10초 | 최종 감수: 최종 감수 완료: 100웨이브 및 10배 물량 하드코어 밸런스, 타워 7종 및 이펙트 규칙, 자동 웨이브 시작 버그 방어 로직을 반영하여 개발 문서 전체 동기화 완료 |
| v11 | 2026. 10. 30. 14시 37분 50초 | 풍선 물량 및 난이도를 기존 대비 10배 이상 대폭 확장하고, 업그레이드 필수형 경제 밸런스(타워 가격 및 골드 수급 조절) 전면 개편 반영 |
| v10 | 2026. 10. 30. 14시 18분 39초 | 최종 감수: 최종 감수 완료: 모든 섹션의 일관성을 맞추고, 스테이지 30 및 100웨이브 규칙 검증, 7종 타워 및 압정 타워 판정 오류 수정 반영, 테스트 시나리오 확정 |
| v9 | 2026. 10. 30. 14시 18분 14초 | 타워 3종 추가(마법사, 저격수, 부메랑), 압정 타워 버그 수정(전방향 팝 기능 정상화), 풍선 물량 5배 대폭 확장 및 타워/업그레이드 가격 리밸런싱 반영 |
| v8 | 2026. 10. 30. 10시 45분 31초 | 라운드를 100까지 확장하고, 골드 획득량을 늘려 타워 설치/업그레이드 재미를 강화하며, 자동 웨이브 시작 버그 수정 및 타워 레벨별 시각 이펙트 강화 규칙 추가 |
| v7 | 2026. 10. 30. 9시 46분 59초 | 최종 감수: 최종 감수 완료: 모든 섹션의 기능 명세, 데이터 모델, UI 구성 및 수용 기준 일치성을 검증하고 개발 준비를 완료했습니다. |
| v6 | 2026. 10. 29. 17시 42분 37초 | 최종 감수: 최종 감수 완료: 모든 개발 스펙(타워/풍선/웨이브/화면/테스트) 정합성 검증 및 개발 준비(ready=true) 완료 |
| v5 | 2026. 10. 29. 17시 22분 7초 | 최종 감수: 최종 감수 완료: 전 섹션 수치 및 상성 규칙 모순 검증, 폴더 구조 및 수용 기준 구체화, 개발 시작 가능한 상태(ready=true) 전환 |
| v4 | 2026. 10. 29. 16시 31분 43초 | 최종 감수: 최종 감수 완료: 모든 게임 규칙, 3종 맵 및 타워 밸런스, 30웨이브/무한모드 시퀀스, 테스트 시나리오가 개발 규격에 맞게 확정되었습니다. |
| v3 | 2026. 10. 29. 14시 10분 29초 | 최종 감수: 최종 감수 완료: 타워 업그레이드 수치 및 웨이브 스펙 상세화, tech 파일 구조 완성, 테스트 시나리오 확충 |
| v2 | 2026. 10. 29. 13시 54분 33초 | 난이도별 3개 전용 맵 명세 추가, 30라운드 클리어 후 무한 모드(Freeplay) 규칙 추가, 로컬 스토리지 및 수용 테스트 갱신 |
| v1 | 2026. 10. 29. 13시 44분 33초 | 몽키 디펜스 스타일의 30라운드 타워 디펜스 게임에 대한 초기 요구사항 명세서 작성 및 핵심 질문 도출 |
