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
    lv2Desc: '긴 사거리 (사거리 +30px, 150px)',
    lv3Cost: 220,
    lv3Desc: '연사 다트 (발사 간격 0.8초 -> 0.4초로 단축)',
  },
  tack: {
    name: '압정 타워',
    baseCost: 280,
    range: 75,
    attackSpeed: 1.1,
    damage: 1,
    description: '주변 사방으로 압정을 뿜어내어 다수의 풍선을 공격합니다.',
    lv2Cost: 160,
    lv2Desc: '압정 폭풍 (8방향 -> 12방향 발사체 증설)',
    lv3Cost: 300,
    lv3Desc: '초고속 압정 분출 (발사 간격 1.1초 -> 0.6초로 단축)',
  },
  bomb: {
    name: '폭탄 타워',
    baseCost: 350,
    range: 130,
    attackSpeed: 1.5,
    damage: 2,
    description: '광역 폭발 유탄을 발사합니다. 납 풍선을 파괴할 수 있습니다.',
    lv2Cost: 200,
    lv2Desc: '대형 유탄 (폭발 반경 60px -> 95px로 확대)',
    lv3Cost: 420,
    lv3Desc: '미사일 클러스터 (피해량 2 -> 4, 파편 4개 비산)',
  },
  ice: {
    name: '얼음 원숭이',
    baseCost: 300,
    range: 85,
    attackSpeed: 2.0,
    damage: 0,
    description: '냉기 파동으로 범위 내 풍선을 1.5초간 빙결 정지시킵니다.',
    lv2Cost: 180,
    lv2Desc: '극저온 확장 (사거리 +25px, 빙결 시간 2.0초로 연장)',
    lv3Cost: 350,
    lv3Desc: '서리 파편 (빙결 해제 시 해당 풍선에 피해량 1 부여)',
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
    gold: 1,
    children: null,
    childrenCount: 0,
    isImmuneToSharp: false,
    color: '#E63946',
  },
  blue: {
    name: '파랑 풍선',
    hp: 1,
    speed: 1.3,
    gold: 2,
    children: 'red',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#457B9D',
  },
  green: {
    name: '초록 풍선',
    hp: 1,
    speed: 1.7,
    gold: 3,
    children: 'blue',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#2A9D8F',
  },
  yellow: {
    name: '노랑 풍선',
    hp: 1,
    speed: 2.2,
    gold: 4,
    children: 'green',
    childrenCount: 1,
    isImmuneToSharp: false,
    color: '#F4A261',
  },
  lead: {
    name: '납 풍선',
    hp: 2,
    speed: 0.9,
    gold: 6,
    children: 'blue',
    childrenCount: 2,
    isImmuneToSharp: true,
    color: '#6C757D',
  },
  ceramic: {
    name: '세라믹 풍선',
    hp: 8,
    speed: 1.8,
    gold: 15,
    children: 'yellow',
    childrenCount: 2,
    isImmuneToSharp: false,
    color: '#B08968',
  },
  moab: {
    name: 'MOAB 비행선',
    hp: 60,
    speed: 0.6,
    gold: 100,
    children: 'ceramic',
    childrenCount: 3,
    isImmuneToSharp: false,
    color: '#1D3557',
  },
};
