import React, { useState } from 'react';
import { TabType, TaxiOption } from '../types';
import { HOTLINK_IMAGES, DEFAULT_TAXI_OPTIONS, SUBWAY_INFO } from '../data/mockData';

interface TransferScreenProps {
  onNavigate: (tab: TabType) => void;
}

export const TransferScreen: React.FC<TransferScreenProps> = ({ onNavigate }) => {
  const [transferMode, setTransferMode] = useState<'taxi' | 'subway' | 'bus'>('taxi');
  const [selectedTaxiDest, setSelectedTaxiDest] = useState<TaxiOption>(DEFAULT_TAXI_OPTIONS[0]);
  const [isCallingTaxi, setIsCallingTaxi] = useState(false);
  const [taxiDispatched, setTaxiDispatched] = useState(false);
  const [showTaxiModal, setShowTaxiModal] = useState(false);

  const handleCallTaxi = () => {
    setIsCallingTaxi(true);
    setShowTaxiModal(true);
    setTimeout(() => {
      setIsCallingTaxi(false);
      setTaxiDispatched(true);
    }, 2200);
  };

  const handleCancelTaxi = () => {
    setTaxiDispatched(false);
    setShowTaxiModal(false);
  };

  return (
    <div className="flex flex-col gap-5 px-5 py-4 pb-28 max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn">
      {/* 1. Status Banner: Bus Arrival ETA */}
      <section className="bg-[#dae2ff] rounded-2xl p-4 flex items-center gap-3.5 shadow-sm border border-blue-200/60">
        <div className="bg-[#003d9b] text-white rounded-full p-2.5 flex items-center justify-center shrink-0 shadow-md">
          <span
            className="material-symbols-outlined text-[24px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            timer
          </span>
        </div>
        <div className="flex-1">
          <p className="text-xs text-[#003d9b] font-semibold">부산 종합버스터미널</p>
          <h2 className="font-display text-xl font-bold text-[#001848] tracking-tight">
            5분 후 도착 예정
          </h2>
        </div>
        <button
          onClick={() => onNavigate('location')}
          className="text-xs text-[#0052cc] bg-white/80 font-bold px-3 py-1.5 rounded-full shadow-xs hover:bg-white transition-all"
        >
          위치 확인
        </button>
      </section>

      {/* 2. Transfer Mode Selector (Tabs) */}
      <div className="flex bg-[#f2f4f7] rounded-full p-1 border border-[#e0e3e6]/80 shadow-xs">
        <button
          onClick={() => setTransferMode('subway')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            transferMode === 'subway'
              ? 'bg-white shadow-sm text-[#003d9b]'
              : 'text-[#555f6c] hover:bg-white/40'
          }`}
        >
          <span className="material-symbols-outlined text-base">subway</span>
          지하철/철도
        </button>
        <button
          onClick={() => setTransferMode('taxi')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            transferMode === 'taxi'
              ? 'bg-white shadow-sm text-[#003d9b]'
              : 'text-[#555f6c] hover:bg-white/40'
          }`}
        >
          <span className="material-symbols-outlined text-base">local_taxi</span>
          택시
        </button>
        <button
          onClick={() => setTransferMode('bus')}
          className={`flex-1 py-2.5 px-4 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            transferMode === 'bus'
              ? 'bg-white shadow-sm text-[#003d9b]'
              : 'text-[#555f6c] hover:bg-white/40'
          }`}
        >
          <span className="material-symbols-outlined text-base">directions_bus</span>
          시내버스
        </button>
      </div>

      {/* 3. TAXI MODE (Matches Screenshot 3) */}
      {transferMode === 'taxi' && (
        <section className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e6e8eb] p-5 flex flex-col gap-4">
          {/* Destination Quick Selector Chips */}
          <div>
            <span className="text-xs text-gray-500 font-medium mb-2 block">목적지 빠른 선택</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {DEFAULT_TAXI_OPTIONS.map((opt) => (
                <button
                  key={opt.destination}
                  onClick={() => setSelectedTaxiDest(opt)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedTaxiDest.destination === opt.destination
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'bg-[#f2f4f7] text-[#555f6c] hover:bg-gray-200'
                  }`}
                >
                  {opt.destination}
                </button>
              ))}
            </div>
          </div>

          {/* Header Info */}
          <div className="flex items-start justify-between">
            <div className="flex gap-3">
              <div className="bg-[#f2f4f7] rounded-full p-2.5 h-fit text-[#191c1e] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">local_taxi</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-[#191c1e]">
                  {selectedTaxiDest.destination}
                </h3>
                <p className="text-xs text-[#555f6c] flex items-center gap-1 mt-0.5 font-medium">
                  <span className="material-symbols-outlined text-sm text-[#0052cc]">
                    directions_walk
                  </span>
                  {selectedTaxiDest.pickupLocation}
                </p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-xs text-[#555f6c]">예상 대기시간</p>
              <p className="font-display font-extrabold text-lg text-[#003d9b]">
                약 {selectedTaxiDest.waitingMinutes}분
              </p>
            </div>
          </div>

          {/* Map Preview Area with Stylized Terminal & Route Overlay */}
          <div className="relative h-44 w-full bg-[#f2f4f7] rounded-xl overflow-hidden shadow-inner border border-gray-100">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${HOTLINK_IMAGES.transferMapBg}')` }}
            ></div>

            {/* Visual Markers & Dotted Line */}
            <div className="absolute inset-0 p-3 pointer-events-none">
              {/* Terminal Taxi Stop Badge */}
              <div className="absolute top-6 left-6 bg-[#003d9b] text-white px-2 py-1 rounded-lg shadow-md flex items-center gap-1 text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">directions_bus</span>
                <span>하차장</span>
              </div>

              {/* Dotted Walking Route SVG */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M 50 45 L 95 90 L 170 90 L 250 120"
                  fill="transparent"
                  stroke="#0052cc"
                  strokeDasharray="6,4"
                  strokeWidth="3.5"
                />
              </svg>

              {/* Destination Pin */}
              <div className="absolute bottom-6 right-6 bg-[#ba1a1a] text-white px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1 text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">sports_baseball</span>
                <span>{selectedTaxiDest.destination}</span>
              </div>
            </div>
          </div>

          {/* Estimated Fare & Distance Summary */}
          <div className="bg-[#f2f4f7] rounded-xl p-3.5 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-xs text-[#555f6c]">목적지까지 예상 요금</span>
              <span className="text-[11px] text-[#737685]">
                {selectedTaxiDest.distanceKm}km · 약 {selectedTaxiDest.durationMinutes}분 소요
              </span>
            </div>
            <p className="font-display font-extrabold text-base text-[#191c1e]">
              약 {selectedTaxiDest.estimatedFare.toLocaleString()}원
            </p>
          </div>

          {/* Taxi Call CTA Button */}
          <button
            onClick={handleCallTaxi}
            className="w-full bg-[#003d9b] hover:bg-[#0052cc] text-white h-14 rounded-2xl font-display font-bold text-base shadow-[0_8px_24px_rgba(0,82,204,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <span
              className="material-symbols-outlined text-xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_taxi
            </span>
            택시 호출하기
          </button>
        </section>
      )}

      {/* 4. SUBWAY / RAIL MODE */}
      {transferMode === 'subway' && (
        <section className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e6e8eb] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: SUBWAY_INFO.lineColor }}
              ></span>
              <h3 className="font-display font-bold text-lg text-[#191c1e]">{SUBWAY_INFO.line}</h3>
            </div>
            <span className="text-xs font-bold text-[#0052cc] bg-[#dae2ff] px-2.5 py-1 rounded-full">
              도보 {SUBWAY_INFO.walkTimeMinutes}분 연결
            </span>
          </div>

          <div className="bg-[#f2f4f7] rounded-xl p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">승차역</span>
              <span className="text-sm font-bold text-[#191c1e]">{SUBWAY_INFO.station}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500 font-medium">운행 방면</span>
              <span className="text-xs font-semibold text-[#003d9b]">{SUBWAY_INFO.direction}</span>
            </div>
          </div>

          {/* Next Trains Live Countdown */}
          <div>
            <span className="text-xs font-bold text-[#191c1e] mb-2 block">실시간 열차 도착 정보</span>
            <div className="grid grid-cols-3 gap-2">
              {SUBWAY_INFO.nextTrainMinutes.map((min, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center flex flex-col items-center ${
                    idx === 0
                      ? 'border-[#0052cc] bg-[#dae2ff]/30 text-[#003d9b]'
                      : 'border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  <span className="text-[10px] text-gray-500">{idx + 1}번째 열차</span>
                  <span className="font-display font-extrabold text-base mt-0.5">{min}분 후</span>
                  <span className="text-[10px] text-[#006a1b] font-medium">당역 진입중</span>
                </div>
              ))}
            </div>
          </div>

          {/* Major Destinations Travel Time */}
          <div>
            <span className="text-xs font-bold text-[#191c1e] mb-2 block">주요 거점 이동 소요시간</span>
            <div className="divide-y divide-gray-100">
              {SUBWAY_INFO.majorDestinations.map((dest, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-xs">
                  <span className="font-semibold text-gray-800">{dest.name}</span>
                  <span className="font-bold text-[#003d9b]">{dest.durationMinutes}분 소요</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. CITY BUS MODE */}
      {transferMode === 'bus' && (
        <section className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e6e8eb] p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-lg text-[#191c1e]">
              터미널 앞 시내버스 정류장
            </h3>
            <span className="text-xs text-gray-500">정류장 ID: 08-012</span>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { num: '50번', type: '일반', dest: '부산대학교 · 온천장', min: 4, remainStops: 2 },
              { num: '148번', type: '일반', dest: '덕천역 · 신라대학교', min: 7, remainStops: 4 },
              { num: '1002번', type: '급행', dest: '서면역 · 센텀시티', min: 11, remainStops: 6 },
            ].map((bus, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#f2f4f7] rounded-xl flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-2 py-0.5 rounded text-white ${
                        bus.type === '급행' ? 'bg-[#ba1a1a]' : 'bg-[#0052cc]'
                      }`}
                    >
                      {bus.num}
                    </span>
                    <span className="text-xs font-semibold text-gray-800">{bus.dest}</span>
                  </div>
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    {bus.remainStops}개 정류장 전
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-display font-bold text-sm text-[#ba1a1a]">
                    {bus.min}분 후
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Taxi Dispatch Simulation Modal */}
      {showTaxiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl flex flex-col gap-4 animate-slideUp">
            {isCallingTaxi ? (
              <div className="py-8 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 rounded-full border-4 border-[#0052cc] border-t-transparent animate-spin"></div>
                <div>
                  <h3 className="font-display font-bold text-xl text-[#191c1e]">
                    주변 택시를 호출하고 있습니다
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    터미널 승강장 주변 3분 이내 빈 차 매칭 중...
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#006a1b] animate-ping"></span>
                    <h3 className="font-display font-bold text-lg text-[#006a1b]">
                      택시 배차가 완료되었습니다!
                    </h3>
                  </div>
                  <button onClick={handleCancelTaxi} className="text-gray-400">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <div className="bg-[#f2f4f7] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-gray-500 font-semibold">부산34바 8291 (카카오T)</span>
                    <h4 className="font-display font-bold text-base text-[#191c1e] mt-0.5">
                      기아 K8 하이브리드
                    </h4>
                    <p className="text-xs text-[#003d9b] font-semibold mt-1">기사님: 이원석 님 (★ 4.9)</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">도착 예정</span>
                    <p className="font-display font-extrabold text-xl text-[#0052cc]">약 2분</p>
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-[#003d9b]">
                  <p className="font-bold">승강장 안내</p>
                  <p className="text-gray-600 mt-0.5">
                    부산종합버스터미널 1층 2번 게이트 앞 택시 전용 승강장으로 이동해 주세요.
                  </p>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleCancelTaxi}
                    className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl text-sm"
                  >
                    호출 취소
                  </button>
                  <button
                    onClick={() => setShowTaxiModal(false)}
                    className="flex-1 py-3 bg-[#0052cc] text-white font-bold rounded-xl text-sm"
                  >
                    확인 및 위치 보기
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
