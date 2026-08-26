import React, { useState, useEffect } from 'react';
import { TabType, Ticket } from '../types';
import { HOTLINK_IMAGES, INITIAL_LIVE_DATA } from '../data/mockData';

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
  const [progress, setProgress] = useState(58);
  const [isSimulating, setIsSimulating] = useState(true);
  const [showShareToast, setShowShareToast] = useState(false);
  const [showDriverContactModal, setShowDriverContactModal] = useState(false);
  const [showRestAreaModal, setShowRestAreaModal] = useState(false);

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
              남은 시간: 2시간 15분
            </span>
          </div>

          <div className="flex items-center gap-2.5 pt-0.5">
            <div className="font-display text-xl font-bold text-[#191c1e]">
              {activeTicket.origin === '서울' ? '서울경부' : activeTicket.origin}
            </div>
            <span className="material-symbols-outlined text-[#737685] text-lg">arrow_forward</span>
            <div className="font-display text-xl font-bold text-[#191c1e]">
              {activeTicket.destination === '부산' ? '부산노포' : activeTicket.destination}
            </div>
            <span className="text-xs text-[#555f6c] ml-auto font-medium">
              좌석 {activeTicket.seatNumber}번
            </span>
          </div>
        </div>
      </div>

      {/* 2. Simulated Map Canvas Area */}
      <div
        className="absolute inset-0 z-0 bg-[#f2f4f7] bg-cover bg-center"
        style={{ backgroundImage: `url('${HOTLINK_IMAGES.mapBg}')` }}
      >
        {/* Overlay to soften map styling */}
        <div className="absolute inset-0 bg-[#f7f9fc]/30 backdrop-blur-[0.5px]"></div>

        {/* Highway SVG Route Polyline */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 400 800"
        >
          {/* Background Remaining Planned Path (Dashed) */}
          <path
            d="M 100 150 C 145 280, 240 380, 190 670"
            fill="none"
            opacity="0.35"
            stroke="#003d9b"
            strokeDasharray="8 8"
            strokeLinecap="round"
            strokeWidth="7"
          />
          {/* Active Travelled Path (Solid High Contrast Blue) */}
          <path
            d="M 100 150 C 135 270, 175 360, 172 490"
            fill="none"
            stroke="#003d9b"
            strokeLinecap="round"
            strokeWidth="7"
          />
        </svg>

        {/* Map Markers */}

        {/* Start Point Marker: Seoul */}
        <div className="absolute top-[20%] left-[25%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-4 h-4 rounded-full bg-[#737685] border-2 border-white shadow-md"></div>
          <span className="text-[12px] font-bold text-[#191c1e] mt-1 bg-white/90 shadow-xs px-2 py-0.5 rounded-md border border-gray-100">
            서울
          </span>
        </div>

        {/* Current Live Bus Location Marker (with pulsating radar) */}
        <div
          className="absolute top-[58%] left-[44%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 cursor-pointer"
          onClick={() => setIsSimulating(!isSimulating)}
          title="클릭하여 시뮬레이션 토글"
        >
          <div className="relative animate-vibrate-bus">
            {/* Animated Radar Pulse Circle */}
            <div className="absolute inset-0 bg-[#0052cc]/35 rounded-full w-14 h-14 -left-3.5 -top-3.5 animate-pulse-radar pointer-events-none"></div>

            {/* Bus Circular Badge */}
            <div className="w-7 h-7 rounded-full bg-[#003d9b] border-2 border-white shadow-lg flex items-center justify-center relative z-10">
              <span
                className="material-symbols-outlined text-white text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                directions_bus
              </span>
            </div>
          </div>

          {/* Floating Speed Chip */}
          <div className="mt-1.5 bg-[#001848] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 border border-white/30 whitespace-nowrap">
            <span>{speed} km/h</span>
          </div>
        </div>

        {/* Next Rest Area Marker (선산휴게소) */}
        <div
          onClick={() => setShowRestAreaModal(true)}
          className="absolute top-[73%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 cursor-pointer group"
        >
          <div className="w-7 h-7 rounded-full bg-white border border-[#c3c6d6] shadow-md flex items-center justify-center text-[#003d9b] group-hover:scale-110 group-hover:bg-[#dae2ff] transition-all">
            <span className="material-symbols-outlined text-[15px]">local_cafe</span>
          </div>
          <span className="text-[11px] font-bold text-[#191c1e] mt-1 bg-white/95 px-2 py-0.5 rounded-md shadow-xs border border-gray-100 flex items-center gap-1">
            <span>선산휴게소</span>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
          </span>
        </div>

        {/* Destination Marker: Busan */}
        <div className="absolute bottom-[23%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
          <div className="w-5 h-5 rounded-full bg-[#ba1a1a] border-2 border-white shadow-md"></div>
          <span className="text-[12px] font-bold text-[#191c1e] mt-1 bg-white/90 shadow-xs px-2 py-0.5 rounded-md border border-gray-100">
            부산
          </span>
        </div>
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
              <span className="text-[11px] text-[#737685]">경부고속도로 하행</span>
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
              className="absolute h-[4px] bg-[#003d9b] left-6 top-[6px] z-0 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>

            {/* Stop 1: Departure */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-3.5 h-3.5 rounded-full bg-[#003d9b] border-2 border-white shadow-xs mb-1"></div>
              <span className="text-[11px] text-[#555f6c]">출발</span>
              <span className="text-[11px] text-[#191c1e] font-bold">14:00</span>
            </div>

            {/* Stop 2: Rest Area */}
            <div
              className="flex flex-col items-center relative z-10 w-1/4 cursor-pointer"
              onClick={() => setShowRestAreaModal(true)}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-[#003d9b] border-2 border-white shadow-xs mb-1"></div>
              <span className="text-[11px] text-[#555f6c] underline decoration-dotted">휴게소</span>
              <span className="text-[11px] text-[#191c1e] font-bold">15:30</span>
            </div>

            {/* Stop 3: Current Live Position */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-5 h-5 rounded-full bg-white border-2 border-[#003d9b] flex items-center justify-center mb-0.5 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[#003d9b] animate-ping"></div>
              </div>
              <span className="text-[11px] text-[#003d9b] font-extrabold">현재</span>
              <span className="text-[10px] text-[#0052cc] font-medium">영동JC</span>
            </div>

            {/* Stop 4: Destination Expected Arrival */}
            <div className="flex flex-col items-center relative z-10 w-1/4">
              <div className="w-3.5 h-3.5 rounded-full bg-[#e0e3e6] border-2 border-[#737685] mb-1"></div>
              <span className="text-[11px] text-[#555f6c]">도착예정</span>
              <span className="text-[11px] text-[#191c1e] font-bold">18:15</span>
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
                <span className="material-symbols-outlined text-[#0052cc]">local_cafe</span>
                <h3 className="font-display font-bold text-lg text-[#191c1e]">
                  선산휴게소 (마산방향)
                </h3>
              </div>
              <button onClick={() => setShowRestAreaModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-[#f2f4f7] p-3.5 rounded-xl">
              <div>
                <span className="text-xs text-[#737685]">예상 도착 시간</span>
                <p className="text-base font-bold text-[#003d9b]">15:30 (약 25분 후)</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#737685]">정차 예정</span>
                <p className="text-base font-bold text-[#191c1e]">15분간 정차</p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#191c1e] mb-2 block">편의 시설 안내</span>
              <div className="flex flex-wrap gap-2">
                {INITIAL_LIVE_DATA.nextRestArea.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="bg-[#dae2ff]/50 text-[#001848] text-xs font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {fac}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setShowRestAreaModal(false)}
              className="w-full py-3 bg-[#0052cc] text-white font-bold rounded-xl mt-2"
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
