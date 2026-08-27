import React, { useState, useEffect, useRef } from 'react';
import { TabType, Ticket } from '../types';
import { HOTLINK_IMAGES, INITIAL_LIVE_DATA } from '../data/mockData';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LiveLocationScreenProps {
  onNavigate: (tab: TabType) => void;
  activeTicket: Ticket;
  onOpenTransfer: () => void;
}

export const LiveLocationScreen: React.FC<LiveLocationScreenProps> = ({
  onNavigate,
  activeTicket,
  onOpenTransfer,
}) => {
  const [speed, setSpeed] = useState(95);
  const [progress, setProgress] = useState(62); // 08:00~11:00(3시간) 중 09:30(1.5시간 경과) = 50%
  const [isSimulating, setIsSimulating] = useState(true);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDriverContactModal, setShowDriverContactModal] = useState(false);
  const [showRestAreaModal, setShowRestAreaModal] = useState(false);
  
  // 여수종합버스터미널 → 부산서부버스터미널 상세 경로
  // (여천동 → 율촌면 → 해룡면 → 순천 → 남해고속도로 → 남해고속도로 2지선)
  const routeCoordinates = [
    [34.758132, 127.716851], // 여수종합버스터미널 (출발지)
    [34.763500, 127.712000], // 여수시 오림동
    [34.768850, 127.697200], // 여천시외버스정류장 (무선로)
    [34.775000, 127.688000], // 17번 국도 (엑스포대로)
    [34.795000, 127.695000], // 율촌면
    [34.820000, 127.730000], // 해룡면 진입
    [34.835000, 127.750000], // 해룡면
    [34.865000, 127.775000], // 순천 신대지구시외버스정류소
    [34.920000, 127.785000], // 동순천IC (남해고속도로 진입)
    [34.980000, 127.850000], // 남해고속도로 1차선 진행
    [35.050000, 127.960000], // 광양 구간
    [35.110000, 128.080000], // 섬진강휴게소 (현재위치)
    [35.150000, 128.220000], // 하동 구간
    [35.210000, 128.411000], // 사천 구간
    [35.230000, 128.550000], // 진주 구간
    [35.250000, 128.670000], // 창원 구간
    [35.270000, 128.800000], // 냉정분기점 (남해고속도로 2지선 분기)
    [35.240000, 128.880000], // 남해고속도로 2지선
    [35.200000, 128.920000], // 남해고속도로 2지선 진행
    [35.175000, 128.945000], // 서부산 요금소
    [35.170000, 128.975000], // 사상IC
    [35.163321, 128.982323], // 부산서부버스터미널 (도착지)
  ];

  // 진행된 경로 (여수종합 ~ 사천 구간, 약 62% 진행)
  const completedRoute = [
    [34.758132, 127.716851],
    [34.763500, 127.712000],
    [34.768850, 127.697200],
    [34.775000, 127.688000],
    [34.795000, 127.695000],
    [34.820000, 127.730000],
    [34.835000, 127.750000],
    [34.865000, 127.775000],
    [34.920000, 127.785000],
    [34.980000, 127.850000],
    [35.050000, 127.960000],
    [35.110000, 128.080000],
    [35.150000, 128.220000],
    [35.210000, 128.411000],
  ];

  // 남은 경로 (사천 ~ 부산서부버스터미널)
  const remainingRoute = [
    [35.210000, 128.411000], // 사천 (현재 위치)
    [35.230000, 128.550000], // 진주
    [35.250000, 128.670000], // 창원
    [35.270000, 128.800000], // 냉정분기점
    [35.240000, 128.880000], // 남해고속도로 2지선
    [35.200000, 128.920000], // 남해고속도로 2지선 진행
    [35.175000, 128.945000], // 서부산 요금소
    [35.170000, 128.975000], // 사상IC
    [35.163321, 128.982323], // 부산서부버스터미널 (도착지)
  ];

  // 여수종합버스터미널 (좌수영로 268)
  const yeosuTerminal = [34.758132, 127.716851];
  // 여천시외버스정류장 (무선로)
  const yeocheomBusStation = [34.768850, 127.697200];
  // 섬진강휴게소 (중간 정류소)
  const semjinRestArea = [35.110000, 128.080000];
  // 부산서부버스터미널 (사상로 201)
  const busanWestTerminal = [35.163321, 128.982323];
  // 현재 위치 (사천 구간, 약 62% 진행)
  const currentLocation = [35.210000, 128.411000];

  // Live speed oscillation for realism
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSpeed((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const nextSpeed = Math.min(108, Math.max(88, prev + delta));
        return nextSpeed;
      });
      setProgress((prev) => (prev >= 98 ? 58 : prev + 0.1));
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleShareRoute = () => {
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] max-w-md mx-auto sm:max-w-xl md:max-w-2xl flex flex-col overflow-hidden bg-[#f2f4f7] select-none animate-fadeIn">
      {/* 1. Info Header Card (Floating Top Card) */}
      <div className="px-5 pt-3 z-20 w-full relative">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-[#e0e3e6]/80 flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#434654] bg-[#eceef1] px-2.5 py-1 rounded-md">
                {activeTicket.busNumber || '고속버스 1004'}
              </span>
              <span className="text-[11px] text-[#006a1b] font-bold bg-[#70ff77]/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#006a1b] rounded-full animate-ping"></span>
                정상 운행
              </span>
            </div>
            <span className="font-display text-[17px] text-[#003d9b] font-extrabold tracking-tight">
              남은 시간: 1시간 12분
            </span>
          </div>

          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="font-display text-xl font-bold text-[#191c1e]">여수(종합)</div>
            <span className="material-symbols-outlined text-[#737685] text-lg">arrow_forward</span>
            <div className="font-display text-xl font-bold text-[#191c1e]">부산(서부)</div>
            <span className="text-xs text-[#555f6c] ml-auto font-medium">
              좌석 {activeTicket.seatNumber}번
            </span>
          </div>
        </div>
      </div>

      {/* 2. Real Map with Leaflet */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <MapContainer
          center={[35.0, 128.4]}
          zoom={8}
          style={{ width: '100%', height: '100%' }}
          className="rounded-none"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* 진행된 경로 (진한 파란색 실선) */}
          <Polyline
            positions={completedRoute}
            color="#0052cc"
            weight={5}
            opacity={1}
            dashArray="0"
          />

          {/* 남은 경로 (투명한 파란색 실선) */}
          <Polyline
            positions={remainingRoute}
            color="#0052cc"
            weight={5}
            opacity={0.5}
            dashArray="0"
          />

          {/* 여수종합버스터미널 마커 */}
          <Marker
            position={yeosuTerminal}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzE2YTM0YSIvPjwvc3ZnPg==',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>여수종합버스터미널 (출발지) - 08:00</Popup>
          </Marker>

          {/* 여천시외버스정류장 마커 */}
          <Marker
            position={yeocheomBusStation}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iIzA2YjZkNCIvPjwvc3ZnPg==',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>여천시외버스정류장 (롯데마트 앞, 무선로) - 08:15</Popup>
          </Marker>

          {/* 섬진강휴게소 마커 */}
          <Marker
            position={semjinRestArea}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iI2Y1OWUwYiIvPjwvc3ZnPg==',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          >
            <Popup>섬진강휴게소 (광양시 진월면) - 통과함 09:30</Popup>
          </Marker>

          {/* 현재 위치 마커 (버스) - 사천 구간 */}
          <Marker
            position={currentLocation}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMDUyY2MiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjEyIiB5PSIxNiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtd2VpZ2h0PSJib2xkIj7iuqzmuLg8L3RleHQ+PC9zdmc+',
              iconSize: [28, 28],
              iconAnchor: [14, 14],
            })}
          >
            <Popup>
              <div className="text-xs">
                <div className="font-bold">현재 위치: 사천 구간</div>
                <div>남해고속도로 진행 중</div>
                <div>시간: 10:00</div>
                <div>속도: {speed} km/h</div>
                <div className="text-green-600 font-semibold">도착까지 약 1시간</div>
              </div>
            </Popup>
          </Marker>

          {/* 부산서부버스터미널 마커 */}
          <Marker
            position={busanWestTerminal}
            icon={L.icon({
              iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iOCIgZmlsbD0iI2RjMjYyNiIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
              iconSize: [24, 24],
              iconAnchor: [12, 12],
            })}
          >
            <Popup>부산서부버스터미널 (사상로 201) - 예정 11:00</Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* 3. Floating Action Buttons (FAB Column) */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
        {/* Share Route */}
        <button
          onClick={handleShareRoute}
          aria-label="경로 공유하기"
          className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#003d9b] hover:bg-[#f2f4f7] active:scale-90 transition-all"
          title="카카오톡/링크로 실시간 위치 공유"
        >
          <span className="material-symbols-outlined text-xl">share</span>
        </button>

        {/* Call Driver / Support */}
        <button
          onClick={() => setShowDriverContactModal(true)}
          aria-label="운행 안내 전화"
          className="w-12 h-12 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center text-[#003d9b] hover:bg-[#f2f4f7] active:scale-90 transition-all"
          title="버스 고객센터 및 승무원 문의"
        >
          <span className="material-symbols-outlined text-xl">call</span>
        </button>

        {/* Jump to Transfer Guide */}
        <button
          onClick={onOpenTransfer}
          aria-label="하차 후 환승 안내"
          className="w-12 h-12 rounded-full bg-[#0052cc] shadow-lg border border-blue-400 flex items-center justify-center text-white hover:bg-[#003d9b] active:scale-90 transition-all group"
          title="하차 후 환승/택시 안내 확인"
        >
          <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform">
            transfer_within_a_station
          </span>
        </button>
      </div>

      {/* Share Toast */}
      {showShareToast && (
        <div className="absolute top-28 left-1/2 -translate-x-1/2 z-40 bg-[#001848] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-sm text-green-400">check_circle</span>
          실시간 버스 위치 링크가 복사되었습니다!
        </div>
      )}

      {/* 4. Bottom Overlay Card (운행 정보 & Timeline) */}
      <div className="absolute bottom-20 left-0 right-0 px-4 z-30">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#e0e3e6]/80">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-[#191c1e]">운행 정보</span>
              <span className="text-[11px] text-[#737685]">국도 17번 · 고속도로 주행</span>
            </div>
            <div className="text-[12px] font-bold text-[#001848] bg-[#d9e3f2] px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0052cc] animate-ping"></span>
              현재 속도: {speed} km/h
            </div>
          </div>

          {/* Horizontal Timeline Track */}
          <div className="relative flex items-center justify-between mt-4 px-2">
            {/* Full Background Track Line */}
            <div className="absolute h-[3px] bg-[#c3c6d6] left-6 right-6 top-[7px] z-0"></div>

            {/* Progress Solid Line */}
            <div
              className="absolute h-[4px] bg-gradient-to-r from-[#0052cc] to-[#003d9b] left-6 top-[6px] z-0 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Stop 1: Departure - 여수종합버스터미널 */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-4 h-4 rounded-full bg-[#16a34a] border-2 border-white shadow-xs mb-1"></div>
              <span className="text-[10px] text-[#555f6c]">출발</span>
              <span className="text-[10px] text-[#191c1e] font-bold">08:00</span>
            </div>

            {/* Stop 2: 여천시외버스정류장 */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-4 h-4 rounded-full bg-[#06b6d4] border-2 border-white shadow-xs mb-1"></div>
              <span className="text-[10px] text-[#555f6c]">정류장</span>
              <span className="text-[10px] text-[#191c1e] font-bold">08:15</span>
            </div>

            {/* Stop 3: Current Live Position - 섬진강휴게소 */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-5 h-5 rounded-full bg-white border-2 border-[#0052cc] flex items-center justify-center mb-0.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#0052cc] animate-pulse"></div>
              </div>
              <span className="text-[10px] text-[#0052cc] font-extrabold">현재</span>
              <span className="text-[9px] text-[#0052cc] font-medium">09:30</span>
            </div>

            {/* Stop 4: Destination - 부산서부버스터미널 */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-4 h-4 rounded-full bg-[#dc2626] border-2 border-white mb-1 animate-pulse"></div>
              <span className="text-[10px] text-[#555f6c]">도착예정</span>
              <span className="text-[10px] text-[#191c1e] font-bold">11:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Rest Area Information Modal */}
      {showRestAreaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#f59e0b]">local_cafe</span>
                <div>
                  <h3 className="font-display font-bold text-lg text-[#191c1e]">섬진강휴게소</h3>
                  <p className="text-xs text-[#737685]">남해고속도로 (여수→부산 방향)</p>
                </div>
              </div>
              <button onClick={() => setShowRestAreaModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-gradient-to-r from-[#fef3c7] to-[#fed7aa] p-3.5 rounded-xl">
              <div>
                <span className="text-xs text-[#92400e]">예상 도착</span>
                <p className="text-base font-bold text-[#b45309]">약 20분 후</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#92400e]">정차 예정</span>
                <p className="text-base font-bold text-[#191c1e]">15분간 정차</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#191c1e] mb-2 block">편의 시설 안내</span>
              <div className="flex flex-wrap gap-2">
                {['화장실', '편의점', '카페', '식당', '충전소', '주유소'].map((fac, i) => (
                  <span
                    key={i}
                    className="bg-[#fef3c7] text-[#b45309] text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#fed7aa]"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl p-3">
              <p className="text-xs text-[#0c4a6e] leading-relaxed">
                <span className="font-bold">💡 팁:</span> 남해고속도로는 경치가 아름답기로 유명합니다. 휴게소에서 바다 풍경을 감상해보세요!
              </p>
            </div>

            <button
              onClick={() => setShowRestAreaModal(false)}
              className="w-full py-3 bg-[#f59e0b] text-white font-bold rounded-xl hover:bg-[#d97706] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}

      {/* Driver/Company Contact Modal */}
      {showDriverContactModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-slideUp">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-display font-bold text-lg text-[#191c1e]">운행 문의 및 긴급 연락</h3>
              <button onClick={() => setShowDriverContactModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <a
                href="tel:025353166"
                className="flex items-center justify-between p-3.5 bg-[#f2f4f7] hover:bg-[#dae2ff]/40 rounded-xl transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-[#191c1e]">금호고속 고객센터</p>
                  <p className="text-xs text-gray-500">02-535-3166 (09:00 ~ 18:00)</p>
                </div>
                <span className="material-symbols-outlined text-[#0052cc]">call</span>
              </a>

              <a
                href="tel:15886900"
                className="flex items-center justify-between p-3.5 bg-[#f2f4f7] hover:bg-[#dae2ff]/40 rounded-xl transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-[#191c1e]">서울고속버스터미널 안내실</p>
                  <p className="text-xs text-gray-500">1688-4700</p>
                </div>
                <span className="material-symbols-outlined text-[#0052cc]">call</span>
              </a>

              <a
                href="tel:1333"
                className="flex items-center justify-between p-3.5 bg-[#f2f4f7] hover:bg-[#dae2ff]/40 rounded-xl transition-colors"
              >
                <div>
                  <p className="font-bold text-sm text-[#191c1e]">고속도로 콜센터 (한국도로공사)</p>
                  <p className="text-xs text-gray-500">1588-2504 (24시간)</p>
                </div>
                <span className="material-symbols-outlined text-[#0052cc]">call</span>
              </a>
            </div>

            <button
              onClick={() => setShowDriverContactModal(false)}
              className="w-full py-3 bg-[#0052cc] text-white font-bold rounded-xl mt-1"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
