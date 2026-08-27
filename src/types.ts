export type TabType = 'home' | 'search' | 'location' | 'transfer' | 'tickets' | 'mypage';

export type BusType = 'express' | 'intercity'; // 고속버스 | 시외버스
export type BusGrade = 'premium' | 'honor' | 'regular'; // 프리미엄 | 우등 | 일반

export interface Terminal {
  id: string;
  name: string;
  region: string;
  code: string;
  type: 'all' | 'express' | 'intercity';
}

export interface BusSchedule {
  id: string;
  busNumber: string;
  company: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  grade: BusGrade;
  busType: BusType;
  price: number;
  totalSeats: number;
  remainingSeats: number;
  platform: string;
}

export interface Ticket {
  id: string;
  busNumber: string;
  company: string;
  busType: BusType;
  grade: BusGrade;
  departureDate: string;
  departureTime: string;
  estimatedArrival: string;
  origin: string;
  originDetail: string;
  destination: string;
  destinationDetail: string;
  seatNumber: number;
  seatType: string;
  platform: string;
  price: number;
  passengerName: string;
  qrCodeValue: string;
  status: 'booked' | 'boarding' | 'on-trip' | 'completed' | 'cancelled';
  speed: number;
  remainingMinutes: number;
  appliedCoupon?: string;
}

export interface RestArea {
  name: string;
  distanceKm: number;
  estimatedArrival: string;
  stopDurationMinutes: number;
  facilities: string[];
}

export interface LiveLocationData {
  busNumber: string;
  origin: string;
  destination: string;
  speed: number;
  remainingTimeText: string;
  departureTime: string;
  restAreaTime: string;
  arrivalTime: string;
  restAreaName: string;
  progressPercent: number;
  currentLocationName: string;
  nextRestArea: RestArea;
  highwayName: string;
  trafficStatus: 'smooth' | 'slow' | 'congested';
}

export interface TaxiOption {
  destination: string;
  waitingMinutes: number;
  pickupLocation: string;
  estimatedFare: number;
  distanceKm: number;
  durationMinutes: number;
}

export interface TaxiDriver {
  name: string;
  rating: number;
  carBrand: string;
  carModel: string;
  plateNumber: string;
  platePrefix: string;
}

export interface SubwayRoute {
  line: string;
  lineColor: string;
  station: string;
  direction: string;
  nextTrainMinutes: number[];
  walkTimeMinutes: number;
  majorDestinations: { name: string; durationMinutes: number }[];
}
