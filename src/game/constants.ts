export interface TowerSpec {
  name: string;
  baseCost: number;
  range: number;
  attackSpeed: number;
  damage: number;
  description: string;
  lv2Cost: number;
  lv2Desc: string;
  lv3Cost: number;
  lv3Desc: string;
}

export const TOWER_SPECS: Record<
  'dart' | 'tack' | 'bomb' | 'ice' | 'boomerang' | 'sniper' | 'wizard',
  TowerSpec
> = {
  dart: {
    name: '다트 원숭이',
    baseCost: 250,
    range: 120,
    attackSpeed: 0.8,
    damage: 1,
    description: '날카로운 다트를 발사하여 기본 풍선을 터뜨립니다.',
    lv2Cost: 180,
    lv2Desc: '사거리 150px, 투사체 크기 1.2배 및 궤적 잔상 이펙트 추가',
    lv3Cost: 350,
    lv3Desc: '발사 간격 0.4초로 단축, 양쪽으로 작은 다트 2발 추가 발사(총 3발 산탄) 및 화려한 회전 이펙트',
  },
  tack: {
    name: '압정 타워',
    baseCost: 320,
    range: 85,
    attackSpeed: 1.1,
    damage: 1,
    description: '주변 사방으로 압정을 뿜어내어 다수의 풍선을 공격합니다.',
    lv2Cost: 220,
    lv2Desc: '12방향 압정 발사, 불꽃 파티클이 흩날리는 이펙트 추가',
    lv3Cost: 420,
    lv3Desc: '발사 간격 0.6초로 단축, 사방으로 거대한 불타는 압정 링이 퍼져나가는 고속 회전 이펙트',
  },
  bomb: {
    name: '폭탄 타워',
    baseCost: 450,
    range: 130,
    attackSpeed: 1.5,
    damage: 2,
    description: '광역 폭발 유탄을 발사합니다. 납 풍선을 파괴할 수 있습니다.',
    lv2Cost: 300,
    lv2Desc: '폭발 반경 95px, 폭발 시 주황색 화염 파티클 12개 비산',
    lv3Cost: 600,
    lv3Desc: '피해량 4, 거대한 네이팜 폭발 이펙트와 함께 주변에 2차 파편 6개 비산 및 화면 미세 진동',
  },
  ice: {
    name: '얼음 원숭이',
    baseCost: 380,
    range: 85,
    attackSpeed: 2.0,
    damage: 0,
    description: '냉기 파동으로 범위 내 풍선을 1.5초간 빙결 정지시킵니다.',
    lv2Cost: 250,
    lv2Desc: '사거리 110px, 빙결 시간 2.0초, 서리 결정 크리스탈 파티클 확장',
    lv3Cost: 500,
    lv3Desc: '서리 파편(빙결 해제 시 피해량 1), 타워 주변에 눈보라 오라 지속 이펙트 렌더링',
  },
  boomerang: {
    name: '부메랑 원숭이',
    baseCost: 350,
    range: 140,
    attackSpeed: 1.2,
    damage: 2,
    description: '곡선 궤도로 적을 관통 공격하는 부메랑을 던집니다.',
    lv2Cost: 240,
    lv2Desc: '사거리 170px, 부메랑 2개 동시 회전 발사',
    lv3Cost: 480,
    lv3Desc: '거대한 불타는 화염 부메랑이 넓은 호를 그리며 다중 적 다단 히트',
  },
  sniper: {
    name: '저격수 원숭이',
    baseCost: 600,
    range: 9999, // 전면 무한
    attackSpeed: 2.2,
    damage: 3,
    description: '맵 어디든 즉시 명중하는 저격 탄환을 발사합니다 (납 파괴 불가).',
    lv2Cost: 400,
    lv2Desc: '발사 간격 1.4초, 피해량 5로 증가',
    lv3Cost: 800,
    lv3Desc: '관통 탄환 장착, 일직선 상의 적 최대 3마리 동시 관통 타격 및 레이저 레이스 이펙트',
  },
  wizard: {
    name: '마법사 원숭이',
    baseCost: 550,
    range: 110,
    attackSpeed: 1.0,
    damage: 2,
    description: '유도 화염구를 발사하여 납과 세라믹 풍선을 강력하게 제압합니다.',
    lv2Cost: 350,
    lv2Desc: '화염구 폭발 범위 추가 및 화염 지속 도트 데미지(Burn)',
    lv3Cost: 700,
    lv3Desc: '거대한 용오름 마법 폭풍 소환, 범위 내 모든 풍선을 연속 타격하는 드래곤 브레스 이펙트',
  },
};

export interface BalloonSpec {
  name: string;
  hp: number;
  speed: number;
  gold: number;
  children: string | null;
  childrenCount: number;
  isImmuneToSharp: boolean;
  color: string;
}

export const BALLOON_SPECS: Record<string, BalloonSpec> = {
  red: {
    name: '빨강 풍선',
    hp: 1,
    speed: 1.0,
    gold: 3,
    children: null,
    childrenCount: 0,
    isImmuneToSharp: false,
    color: '#E63946',
  },
  blue: {
    name: '파랑 풍선',
    hp: 1,
    speed: 1.3,
    gold: 5,
    children: 'red',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#457B9D',
  },
  green: {
    name: '초록 풍선',
    hp: 1,
    speed: 1.7,
    gold: 8,
    children: 'blue',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#2A9D8F',
  },
  yellow: {
    name: '노랑 풍선',
    hp: 1,
    speed: 2.2,
    gold: 12,
    children: 'green',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#F4A261',
  },
  lead: {
    name: '납 풍선',
    hp: 2,
    speed: 0.9,
    gold: 20,
    children: 'blue',
    childrenCount: 2,
    isImmuneToSharp: true,
    color: '#6C757D',
  },
  ceramic: {
    name: '세라믹 풍선',
    hp: 8,
    speed: 1.8,
    gold: 45,
    children: 'yellow',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#B08968',
  },
  moab: {
    name: 'MOAB 비행선',
    hp: 60,
    speed: 0.6,
    gold: 250,
    children: 'ceramic',
    childrenCount: 3,
    isImmuneToSharp: false,
    color: '#1D3557',
  },
  bfb: {
    name: 'BFB 비행선',
    hp: 120,
    speed: 0.45,
    gold: 600,
    children: 'moab',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#450920',
  },
  zomg: {
    name: 'ZOMG 비행선',
    hp: 300,
    speed: 0.3,
    gold: 1500,
    children: 'bfb',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#240046',
  },
};
