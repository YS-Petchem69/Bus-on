import { Terminal, BusSchedule, Ticket, LiveLocationData, TaxiOption, SubwayRoute, SavedRoute } from '../types';

export const TERMINALS: Terminal[] = [
  // 서울 (5개)
  { id: 't1', name: '서울(경부)', region: '서울', code: '010', type: 'all' },
  { id: 't2', name: '센트럴시티(호남)', region: '서울', code: '020', type: 'all' },
  { id: 't3', name: '동서울', region: '서울', code: '032', type: 'all' },
  { id: 't16', name: '강남고속(선릉)', region: '서울', code: '015', type: 'all' },
  { id: 't17', name: '서울남부(강남)', region: '서울', code: '025', type: 'all' },
  
  // 경기/인천 (4개)
  { id: 't12', name: '인천', region: '경기/인천', code: '100', type: 'all' },
  { id: 't13', name: '수원', region: '경기/인천', code: '110', type: 'all' },
  { id: 't18', name: '안산', region: '경기/인천', code: '102', type: 'all' },
  { id: 't19', name: '용인(중부고속)', region: '경기/인천', code: '112', type: 'all' },
  
  // 강원 (4개)
  { id: 't9', name: '강릉', region: '강원', code: '200', type: 'all' },
  { id: 't14', name: '속초', region: '강원', code: '230', type: 'all' },
  { id: 't20', name: '춘천', region: '강원', code: '210', type: 'all' },
  { id: 't21', name: '원주', region: '강원', code: '220', type: 'all' },
  
  // 충청/대전 (3개)
  { id: 't8', name: '대전복합', region: '충청/대전', code: '300', type: 'all' },
  { id: 't22', name: '청주', region: '충청/대전', code: '310', type: 'all' },
  { id: 't23', name: '천안', region: '충청/대전', code: '320', type: 'all' },
  
  // 경북/대구 (4개)
  { id: 't7', name: '대구(동대구)', region: '경북/대구', code: '801', type: 'all' },
  { id: 't15', name: '포항', region: '경북/대구', code: '810', type: 'all' },
  { id: 't24', name: '안동', region: '경북/대구', code: '820', type: 'all' },
  { id: 't25', name: '구미', region: '경북/대구', code: '830', type: 'all' },
  
  // 경남/부산/울산 (5개)
  { id: 't4', name: '부산(노포)', region: '경남/부산/울산', code: '700', type: 'all' },
  { id: 't5', name: '부산사상(서부)', region: '경남/부산/울산', code: '703', type: 'all' },
  { id: 't26', name: '울산', region: '경남/부산/울산', code: '750', type: 'all' },
  { id: 't27', name: '창원', region: '경남/부산/울산', code: '760', type: 'all' },
  { id: 't28', name: '마산', region: '경남/부산/울산', code: '763', type: 'all' },
  
  // 전라/광주 (5개)
  { id: 't6', name: '광주(유·스퀘어)', region: '전라/광주', code: '500', type: 'all' },
  { id: 't11', name: '전주', region: '전라/광주', code: '510', type: 'all' },
  { id: 't10', name: '여수', region: '전라/광주', code: '530', type: 'all' },
  { id: 't29', name: '목포', region: '전라/광주', code: '540', type: 'all' },
  { id: 't30', name: '남원', region: '전라/광주', code: '520', type: 'all' },
];

export const REGIONS = ['전체', '서울', '경기/인천', '충청/대전', '강원', '경북/대구', '경남/부산/울산', '전라/광주'];

export const INITIAL_TICKET: Ticket = {
  id: 'TK-20241024-1004',
  busNumber: '고속버스 1004',
  company: '금호고속',
  busType: 'express',
  grade: 'premium',
  departureDate: '2024.10.24 (화)',
  departureTime: '08:15',
  estimatedArrival: '12:30',
  origin: '여수',
  originDetail: '여수 (여수버스터미널)',
  destination: '부산사상',
  destinationDetail: '부산사상 (부산서부버스터미널)',
  seatNumber: 21,
  seatType: '프리미엄 1인 창측 (우측)',
  platform: '7번 홈',
  price: 49000,
  passengerName: '김버스',
  qrCodeValue: 'BUSON-TK1004-YEO-PUS-20241024-21-VIP',
  status: 'on-trip',
  speed: 95,
  remainingMinutes: 135,
};

export const INITIAL_LIVE_DATA: LiveLocationData = {
  busNumber: '고속버스 1004',
  origin: '여수',
  destination: '부산사상',
  speed: 95,
  remainingTimeText: '2시간 15분',
  departureTime: '14:00',
  restAreaTime: '15:30',
  arrivalTime: '18:15',
  restAreaName: '선산휴게소',
  progressPercent: 58,
  currentLocationName: '남해고속도로 선산 JC 부근 (통영방향)',
  nextRestArea: {
    name: '선산휴게소 (통영방향)',
    distanceKm: 28,
    estimatedArrival: '15:30',
    stopDurationMinutes: 15,
    facilities: ['화장실', '수유실', '할리스커피', 'CU편의점', '전기차충전소', '주유소'],
  },
  highwayName: '남해고속도로 (부산방면)',
  trafficStatus: 'smooth',
};

export const MOCK_BUS_SCHEDULES: BusSchedule[] = [
  {
    id: 's1',
    busNumber: '1004',
    company: '금호고속',
    departureTime: '08:15',
    arrivalTime: '12:30',
    origin: '서울(경부)',
    destination: '부산(노포)',
    grade: 'premium',
    busType: 'express',
    price: 49000,
    totalSeats: 21,
    remainingSeats: 6,
    platform: '7번 홈',
  },
  {
    id: 's2',
    busNumber: '1008',
    company: '중앙고속',
    departureTime: '09:05',
    arrivalTime: '13:20',
    origin: '서울(경부)',
    destination: '부산(노포)',
    grade: 'honor',
    busType: 'express',
    price: 36000,
    totalSeats: 28,
    remainingSeats: 12,
    platform: '8번 홈',
  },
  {
    id: 's3',
    busNumber: '1012',
    company: '한일고속',
    departureTime: '09:40',
    arrivalTime: '13:55',
    origin: '서울(경부)',
    destination: '부산(노포)',
    grade: 'premium',
    busType: 'express',
    price: 49000,
    totalSeats: 21,
    remainingSeats: 2,
    platform: '7번 홈',
  },
  {
    id: 's4',
    busNumber: '1016',
    company: '동양고속',
    departureTime: '10:25',
    arrivalTime: '14:40',
    origin: '서울(경부)',
    destination: '부산(노포)',
    grade: 'regular',
    busType: 'express',
    price: 23000,
    totalSeats: 45,
    remainingSeats: 24,
    platform: '9번 홈',
  },
  {
    id: 's5',
    busNumber: '1020',
    company: '천일고속',
    departureTime: '11:10',
    arrivalTime: '15:25',
    origin: '서울(경부)',
    destination: '부산(노포)',
    grade: 'honor',
    busType: 'express',
    price: 36000,
    totalSeats: 28,
    remainingSeats: 9,
    platform: '8번 홈',
  },
  {
    id: 's6',
    busNumber: '1024',
    company: '삼화고속',
    departureTime: '12:00',
    arrivalTime: '16:15',
    origin: '서울(경부)',
    destination: '부산(노포)',
    grade: 'premium',
    busType: 'express',
    price: 49000,
    totalSeats: 21,
    remainingSeats: 11,
    platform: '7번 홈',
  },
];

export const DEFAULT_TAXI_OPTIONS: TaxiOption[] = [
  {
    destination: '사직야구장',
    waitingMinutes: 3,
    pickupLocation: '터미널 1층 택시 승강장 2번 게이트',
    estimatedFare: 9800,
    distanceKm: 9.2,
    durationMinutes: 18,
  },
  {
    destination: '해운대 해수욕장',
    waitingMinutes: 4,
    pickupLocation: '터미널 1층 택시 승강장 1번 게이트',
    estimatedFare: 18500,
    distanceKm: 18.5,
    durationMinutes: 32,
  },
  {
    destination: '부산역 (KTX)',
    waitingMinutes: 2,
    pickupLocation: '터미널 1층 택시 승강장 3번 게이트',
    estimatedFare: 5500,
    distanceKm: 4.8,
    durationMinutes: 12,
  },
  {
    destination: '서면 젊음의 거리',
    waitingMinutes: 3,
    pickupLocation: '터미널 1층 택시 승강장 2번 게이트',
    estimatedFare: 8900,
    distanceKm: 8.3,
    durationMinutes: 16,
  },
];

export const TAXI_DRIVERS = [
  {
    name: '이원석',
    rating: 4.9,
    carBrand: '기아',
    carModel: 'K8 하이브리드',
    plateNumber: '8291',
    platePrefix: '부산34바',
  },
  {
    name: '박진호',
    rating: 4.8,
    carBrand: '현대',
    carModel: 'G70',
    plateNumber: '5847',
    platePrefix: '부산27바',
  },
  {
    name: '김민수',
    rating: 4.9,
    carBrand: '기아',
    carModel: 'K9',
    plateNumber: '9163',
    platePrefix: '부산42바',
  },
  {
    name: '정순환',
    rating: 4.7,
    carBrand: '현대',
    carModel: 'EQ900',
    plateNumber: '3521',
    platePrefix: '부산18바',
  },
  {
    name: '이대로',
    rating: 4.8,
    carBrand: '제네시스',
    carModel: 'G90',
    plateNumber: '7654',
    platePrefix: '부산51바',
  },
];

export const SUBWAY_INFO: SubwayRoute = {
  line: '부산 1호선',
  lineColor: '#f99d1c',
  station: '노포역 (종합버스터미널 지하 1층 연결)',
  direction: '다대포해수욕장 방면 (하행)',
  nextTrainMinutes: [3, 8, 15],
  walkTimeMinutes: 2,
  majorDestinations: [
    { name: '동래역 (환승 4호선)', durationMinutes: 18 },
    { name: '서면역 (환승 2호선)', durationMinutes: 34 },
    { name: '부산역 (KTX/SRT)', durationMinutes: 45 },
    { name: '남포역 / 자갈치', durationMinutes: 52 },
  ],
};

export const HOTLINK_IMAGES = {
  logo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA43OyM_hn7BbjT2uIcIArxoYSEg3XZtQeXs505Xxht7ziXOwHEZ6SOPtGQs52zrVrXjDj2FRE8K4F2jVJKfoJ_x04D8qnBvVSD-JkpBLPK-0OWGMQt2B1OLOLfyApaVg77ktKKzlZnQYFje-u2LceHD5pi5ukIBH8E9983pXxmzIlpUKJdj3qcwiI-zQDXP3JdmNmdElFfdu7ca0jlePhDKB-tEc-r2ag5BslU2mib_nYFGEbIIWZ4hw',
  logoAlt: 'https://lh3.googleusercontent.com/aida/AEtjO1WyG2KdyM92QWCXI1Li8FGTMAtR5ns7GKKEjiaXGVXumyEe0y8AZLEbwAAUoVBstDq0PhavqLumRwc3q-i3ATOQNllMgTmPGXAxTcYnCUFbvvc9Q2YYVipybSqOttdz741nf0E9onpR9LV4trmw4XjLPoqOaEE9SIm03omx7qUAOzH3bHCVcDaDzglP1R0YK17NAm0RrrIGfIGWaNpg9FQoShzxGQ3SS1WEvIqxW9CVeDG-GivEqr7CBeXL',
  mapBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBhwUsxzgf6OOrtzqKUtjFEJRg1scqfIVWpzXL8_NMW5IacGbztcv2BlYts_EybHx5UGtgb5IVmf-2LgJOZ8LIxim21mbZUiGKrdp55xcR2uUaJs-QzTrXzt2Akog2xWCbJ4bR7tQE3pUbvPt1m3c3zuCt7gr_fjrgzLjYVCaWmuuMm8oge2AEF-XiyFej5CgdwN6Gvn7JR8E_XN14bggco0GTZkxc26RqqEC01_h6JO9Rc7aTTURBzKw',
  bannerPromo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAHEObriJaJZY36iYeaIb7WOag6dXpk2xIsdDCbCG0dQ75kgql2MYXy4Q2LtetDE-jsjGfz2Y3RoydgW25J79gdPHuJwBNYRpLA2g3HPXRTcDEvcCXtczhId7LtIFp9wFBp-5NUa8LLaMZLnH26JuHrV794HhlFAqf0ZIJmUYNkuLNPIVWjpnb-2XMGlLqkTqYSzCv4v_kiR4s7xKC6p5ycTpxnExSk0ZlCVQloxolR7Y5loRmMeRiKQ',
  transferMapBg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDV1hNW-_ucrYTBv2QRH_-1UyFYEteHJDiqws-SLsYSnffWrT10EKmjvBQnzLS7oNWssCTBKZrUe2SM8eElKQhtZ1p5GE1TKFaAwp8ct8dmyNF7XmBMSpexslVu1OKJgeOfva1slwGlKUCuM3cJJqMqOnVoJqWgqarffmowoNgu2RZNBBj7Epf4KiAQegmbfC4CQTUXFwx5H8fkdItl7bAct2KsC6SqcM700NOiOIx9JljzhY6dwIsoCg',
};

export interface PromoEvent {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  backgroundImage: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  description: string;
  details: string[];
}

export const PROMO_EVENTS: PromoEvent[] = [
  {
    id: 'autumn',
    title: '가을 단풍 버스 여행 🍂',
    subtitle: '주요 관광지 노선 최대 20% 특별 할인 혜택',
    emoji: '🍂',
    backgroundImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
    gradientFrom: 'from-[#7c2d12]/85',
    gradientVia: 'via-[#c2410c]/60',
    gradientTo: 'to-transparent',
    description: '가을의 아름다운 단풍을 감상할 수 있는 전국 관광지로의 특별한 버스 여행을 준비했습니다.',
    details: [
      '설악산, 내장산, 남이섬 등 인기 관광지 노선 20% 할인',
      '왕복 패키지 예매 시 추가 10% 할인',
      '예약 기간: 2026년 8월 26일 ~ 10월 31일',
      '출발 기간: 2026년 9월 1일 ~ 11월 30일',
      '1인 이상 누구나 신청 가능',
    ],
  },
  {
    id: 'weekend',
    title: '주말 특가 이벤트 🎉',
    subtitle: '금토일 출발 노선 최대 15% 추가 할인',
    emoji: '🎉',
    backgroundImage: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    gradientFrom: 'from-[#7c2d12]/85',
    gradientVia: 'via-[#ea580c]/60',
    gradientTo: 'to-transparent',
    description: '주말을 즐겁게 보낼 수 있도록 금요일, 토요일, 일요일 출발 노선에 특별 할인을 제공합니다.',
    details: [
      '금토일 출발 모든 노선 15% 할인',
      '최대 할인액: 1인당 최대 5,000원',
      '매주 반복 적용되는 이벤트',
      '예약 제한 없음 (선착순)',
      '다른 쿠폰과 중복 사용 불가',
    ],
  },
  {
    id: 'loyalty',
    title: '마일리지 3배 적립 ⭐',
    subtitle: '이번 달 예매 고객 모두에게 보너스 포인트',
    emoji: '⭐',
    backgroundImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80',
    gradientFrom: 'from-[#0c4a6e]/85',
    gradientVia: 'via-[#0ea5e9]/60',
    gradientTo: 'to-transparent',
    description: '8월 한 달 동안 BusOn 서비스를 이용하는 모든 고객을 위한 특별 마일리지 적립 이벤트입니다.',
    details: [
      '8월 전체 예매 건에 마일리지 3배 적립',
      '적립 기준: 실제 결제 금액의 5% (3배)',
      '최대 적립 제한액: 100,000 마일리지',
      '적립된 마일리지는 다음 달 1일부터 사용 가능',
      '회원 등급 상관없이 모두 적용',
    ],
  },
  {
    id: 'family',
    title: '가족 동반 할인 👨‍👩‍👧‍👦',
    subtitle: '4인 이상 단체 예매 시 1인당 10% 할인',
    emoji: '👨‍👩‍👧‍👦',
    backgroundImage: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1200&q=80',
    gradientFrom: 'from-[#4c1d95]/85',
    gradientVia: 'via-[#9333ea]/60',
    gradientTo: 'to-transparent',
    description: '가족과 함께 떠나는 여행을 더욱 저렴하게! 단체 예매 고객을 위한 할인 이벤트입니다.',
    details: [
      '4인 이상 동시 예매 시 1인당 10% 할인',
      '8인 이상 예매 시 1인당 15% 할인 (추가 5% 할인)',
      '같은 노선, 같은 출발 시간 기준',
      '단체 대표자명 예약 필수',
      '학생 단체도 동일하게 적용',
    ],
  },
  {
    id: 'midweek',
    title: '평일 감성 여행 🌙',
    subtitle: '월~목 출발 편리한 시간대 특가 예약',
    emoji: '🌙',
    backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    gradientFrom: 'from-[#1e293b]/85',
    gradientVia: 'via-[#0f172a]/60',
    gradientTo: 'to-transparent',
    description: '평일의 여유로운 시간, 조용한 버스 환경에서 즐기는 특별한 여행을 제안합니다.',
    details: [
      '월요일~목요일 출발 노선 12% 할인',
      '야간 출발 (20:00 이후) 추가 5% 할인',
      '아침 시간대 (06:00~09:00) 추가 3% 할인',
      '직장인과 학생을 위한 시간대별 특가',
      '당일 예매도 가능 (시간대별로 상이)',
    ],
  },
];

export const SAVED_ROUTES: SavedRoute[] = [
  {
    id: 'sr1',
    origin: '서울(경부)',
    originTerminalId: 't1',
    destination: '부산(노포)',
    destinationTerminalId: 't4',
    isFavorite: true,
    searchCount: 45,
    lastSearchedDate: '2024-10-24',
    createdDate: '2024-09-15',
  },
  {
    id: 'sr2',
    origin: '서울(경부)',
    originTerminalId: 't1',
    destination: '부산사상(서부)',
    destinationTerminalId: 't5',
    isFavorite: true,
    searchCount: 32,
    lastSearchedDate: '2024-10-23',
    createdDate: '2024-09-20',
  },
  {
    id: 'sr3',
    origin: '센트럴시티(호남)',
    originTerminalId: 't2',
    destination: '광주(유·스퀘어)',
    destinationTerminalId: 't6',
    isFavorite: true,
    searchCount: 28,
    lastSearchedDate: '2024-10-22',
    createdDate: '2024-10-01',
  },
  {
    id: 'sr4',
    origin: '동서울',
    originTerminalId: 't3',
    destination: '대전복합',
    destinationTerminalId: 't8',
    isFavorite: false,
    searchCount: 12,
    lastSearchedDate: '2024-10-10',
    createdDate: '2024-10-05',
  },
  {
    id: 'sr5',
    origin: '서울(경부)',
    originTerminalId: 't1',
    destination: '강릉',
    destinationTerminalId: 't9',
    isFavorite: true,
    searchCount: 18,
    lastSearchedDate: '2024-10-21',
    createdDate: '2024-09-25',
  },
];
