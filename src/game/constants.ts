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

export const TOWER_SPECS: Record<'dart' | 'tack' | 'bomb' | 'ice', TowerSpec> = {
  dart: {
    name: '다트 원숭이',
    baseCost: 200,
    range: 120,
    attackSpeed: 0.8,
    damage: 1,
    description: '날카로운 다트를 발사하여 기본 풍선을 터뜨립니다.',
    lv2Cost: 120,
    lv2Desc: '사거리 150px, 투사체 크기 1.2배 및 궤적 잔상 이펙트 추가',
    lv3Cost: 220,
    lv3Desc: '발사 간격 0.4초로 단축, 양쪽으로 작은 다트 2발 추가 발사(총 3발 산탄) 및 회전 이펙트',
  },
  tack: {
    name: '압정 타워',
    baseCost: 280,
    range: 75,
    attackSpeed: 1.1,
    damage: 1,
    description: '주변 사방으로 압정을 뿜어내어 다수의 풍선을 공격합니다.',
    lv2Cost: 160,
    lv2Desc: '12방향 압정 발사, 불꽃 파티클이 흩날리는 이펙트 추가',
    lv3Cost: 300,
    lv3Desc: '발사 간격 0.6초로 단축, 사방으로 거대한 불타는 압정 링이 퍼져나가는 고속 회전 이펙트',
  },
  bomb: {
    name: '폭탄 타워',
    baseCost: 350,
    range: 130,
    attackSpeed: 1.5,
    damage: 2,
    description: '광역 폭발 유탄을 발사합니다. 납 풍선을 파괴할 수 있습니다.',
    lv2Cost: 200,
    lv2Desc: '폭발 반경 95px, 폭발 시 주황색 화염 파티클 12개 비산',
    lv3Cost: 420,
    lv3Desc: '피해량 4, 거대한 네이팜 폭발 이펙트와 함께 주변에 2차 파편 6개 비산 및 화면 미세 진동',
  },
  ice: {
    name: '얼음 원숭이',
    baseCost: 300,
    range: 85,
    attackSpeed: 2.0,
    damage: 0,
    description: '냉기 파동으로 범위 내 풍선을 1.5초간 빙결 정지시킵니다.',
    lv2Cost: 180,
    lv2Desc: '사거리 110px, 빙결 시간 2.0초, 서리 결정 크리스탈 파티클 확장',
    lv3Cost: 350,
    lv3Desc: '서리 파편(빙결 해제 시 피해량 1), 타워 주변에 눈보라 오라 지속 이펙트 렌더링',
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
    gold: 2, // 상향된 골드 경제
    children: null,
    childrenCount: 0,
    isImmuneToSharp: false,
    color: '#E63946',
  },
  blue: {
    name: '파랑 풍선',
    hp: 1,
    speed: 1.3,
    gold: 4,
    children: 'red',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#457B9D',
  },
  green: {
    name: '초록 풍선',
    hp: 1,
    speed: 1.7,
    gold: 6,
    children: 'blue',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#2A9D8F',
  },
  yellow: {
    name: '노랑 풍선',
    hp: 1,
    speed: 2.2,
    gold: 8,
    children: 'green',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#F4A261',
  },
  lead: {
    name: '납 풍선',
    hp: 2,
    speed: 0.9,
    gold: 12,
    children: 'blue',
    childrenCount: 2,
    isImmuneToSharp: true,
    color: '#6C757D',
  },
  ceramic: {
    name: '세라믹 풍선',
    hp: 8,
    speed: 1.8,
    gold: 25,
    children: 'yellow',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#B08968',
  },
  moab: {
    name: 'MOAB 비행선',
    hp: 60,
    speed: 0.6,
    gold: 150,
    children: 'ceramic',
    childrenCount: 3,
    isImmuneToSharp: false,
    color: '#1D3557',
  },
  bfb: {
    name: 'BFB 비행선',
    hp: 120,
    speed: 0.45,
    gold: 350,
    children: 'moab',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#450920',
  },
  zomg: {
    name: 'ZOMG 비행선',
    hp: 300,
    speed: 0.3,
    gold: 800,
    children: 'bfb',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#240046',
  },
};
