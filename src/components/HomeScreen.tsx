import React, { useState, useEffect } from 'react';
import { TabType, Ticket } from '../types';
import { HOTLINK_IMAGES, PROMO_EVENTS } from '../data/mockData';

interface HomeScreenProps {
  onNavigate: (tab: TabType) => void;
  activeTicket: Ticket;
  onOpenTicketDetail: (ticket: Ticket) => void;
  onSelectQuickRoute: (origin: string, destination: string) => void;
  onPromoBooking: (promoId: string) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigate,
  activeTicket,
  onOpenTicketDetail,
  onSelectQuickRoute,
  onPromoBooking,
}) => {
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [showPromoModal, setShowPromoModal] = useState(false);

  useEffect(() => {
    // 모달이 열려 있으면 자동 회전 중지
    if (showPromoModal) return;

    const interval = setInterval(() => {
      setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % PROMO_EVENTS.length);
    }, 4000); // 4초마다 변경

    return () => clearInterval(interval);
  }, [showPromoModal]);

  return (
    <div className="flex flex-col gap-6 px-5 py-4 pb-28 max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn">
      {/* Greeting Section */}
      <section className="pt-2">
        <h1 className="font-display text-[26px] sm:text-[30px] font-extrabold text-[#191c1e] tracking-tight leading-[1.3]">
          안녕하세요,<br />
          <span className="text-[#003d9b]">어디로 떠나시나요?</span>
        </h1>
        <p className="text-sm text-[#555f6c] mt-1.5 font-normal">
          고속·시외버스 통합 예매부터 실시간 운행 관제까지
        </p>
      </section>

      {/* Main Navigation Grid */}
      <section className="grid grid-cols-1 gap-4">
        {/* Card 1: Integrated Ticket Booking (Featured Top Card) */}
        <button
          onClick={() => onNavigate('search')}
          className="bg-[#d9e3f2] hover:bg-[#cddbf0] text-left rounded-2xl p-5 card-shadow transition-all duration-200 flex flex-col justify-between min-h-[148px] border border-blue-100/50 active:scale-[0.98] group relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#0052cc]/5 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className="bg-[#0052cc] text-white rounded-full p-2.5 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">confirmation_number</span>
            </div>
            <span className="material-symbols-outlined text-[#3e4853] group-hover:translate-x-1 transition-transform text-lg">
              arrow_forward_ios
            </span>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-xl text-[#001848] mb-0.5">통합 버스 예매</h2>
              <span className="text-[11px] bg-white/80 text-[#003d9b] font-bold px-2 py-0.5 rounded-full shadow-xs">
                실시간 잔여석
              </span>
            </div>
            <p className="text-sm text-[#3e4853] leading-snug">고속/시외버스 통합 검색 및 빠른 예매</p>
          </div>
        </button>

        {/* 2 Column Grid for Secondary Feature Cards */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Card 2: Real-time Bus Location */}
          <button
            onClick={() => onNavigate('location')}
            className="bg-white hover:bg-[#f2f4f7] text-left rounded-2xl p-4 card-shadow border border-[#e6e8eb] transition-all duration-200 flex flex-col justify-between min-h-[168px] active:scale-[0.98] group"
          >
            <div className="flex items-center justify-between mb-3 text-[#003d9b]">
              <div className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center group-hover:bg-[#dae2ff] transition-colors">
                <span
                  className="material-symbols-outlined text-[24px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  location_on
                </span>
              </div>
              <span className="w-2 h-2 rounded-full bg-[#006a1b] animate-ping"></span>
            </div>
            <div>
              <h2 className="font-display font-bold text-[17px] text-[#191c1e] mb-1">
                실시간 버스 위치
              </h2>
              <p className="text-[12px] text-[#555f6c] leading-tight font-normal">
                실시간 버스 이동 경로 및 도착 예정 시간 확인
              </p>
            </div>
          </button>

          {/* Card 3: Transfer & Taxi Guide */}
          <button
            onClick={() => onNavigate('transfer')}
            className="bg-white hover:bg-[#f2f4f7] text-left rounded-2xl p-4 card-shadow border border-[#e6e8eb] transition-all duration-200 flex flex-col justify-between min-h-[168px] active:scale-[0.98] group"
          >
            <div className="flex items-center gap-1.5 mb-3 text-[#003d9b]">
              <div className="w-10 h-10 rounded-full bg-[#f2f4f7] flex items-center justify-center group-hover:bg-[#dae2ff] transition-colors">
                <span className="material-symbols-outlined text-[20px]">subway</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#f2f4f7] flex items-center justify-center group-hover:bg-[#dae2ff] transition-colors">
                <span className="material-symbols-outlined text-[18px]">local_taxi</span>
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-[17px] text-[#191c1e] mb-1">
                하차 후 환승 안내
              </h2>
              <p className="text-[12px] text-[#555f6c] leading-tight font-normal">
                도착 터미널 연계 지하철 노선 및 택시 호출
              </p>
            </div>
          </button>
        </div>
      </section>

      {/* Quick Active Ticket Banner */}
      <section className="bg-white rounded-2xl p-4 card-shadow flex items-center justify-between border border-[#e6e8eb] relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0052cc]"></div>
        <div className="flex items-center gap-3 pl-1">
          <div className="bg-[#f2f4f7] p-2.5 rounded-xl text-[#003d9b] flex items-center justify-center">
            <span className="material-symbols-outlined text-[22px]">schedule</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-[#0052cc] bg-[#dae2ff] px-1.5 py-0.5 rounded">
                예매한 버스
              </span>
              <span className="text-[11px] text-[#737685]">운행 중</span>
            </div>
            <p className="text-[15px] font-bold text-[#191c1e] mt-0.5">
              오늘 {activeTicket.departureTime} {activeTicket.origin} → {activeTicket.destination}
            </p>
            <p className="text-xs text-[#555f6c]">
              {activeTicket.seatType} · {activeTicket.seatNumber}번
            </p>
          </div>
        </div>

        <button
          onClick={() => onOpenTicketDetail(activeTicket)}
          className="bg-[#0052cc] text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-[#003d9b] active:scale-95 transition-all shadow-md shadow-blue-500/20 whitespace-nowrap ml-2"
        >
          티켓 확인
        </button>
      </section>

      {/* Quick Route Shortcut Chips */}
      <section>
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="font-display text-sm font-bold text-[#191c1e]">자주 찾는 인기 노선</h3>
          <span className="text-xs text-[#737685]">원터치 검색</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { origin: '서울(경부)', dest: '부산(노포)' },
            { origin: '동서울', dest: '강릉' },
            { origin: '센트럴시티(호남)', dest: '광주(유·스퀘어)' },
            { origin: '서울(경부)', dest: '대전복합' },
            { origin: '서울(경부)', dest: '대구(동대구)' },
            { origin: '센트럴시티(호남)', dest: '전주' },
          ].map((route, idx) => (
            <button
              key={idx}
              onClick={() => onSelectQuickRoute(route.origin, route.dest)}
              className="bg-white hover:bg-[#dae2ff]/50 border border-[#e0e3e6] px-3 py-1.5 rounded-full text-xs font-medium text-[#191c1e] flex items-center gap-1.5 transition-all active:scale-95"
            >
              <span>{route.origin.split('(')[0]}</span>
              <span className="text-[#737685] material-symbols-outlined text-[14px]">
                arrow_forward
              </span>
              <span className="font-bold text-[#003d9b]">{route.dest.split('(')[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Promotional Banner with Auto-Rotation */}
      <section>
        <div
          className="w-full h-24 rounded-2xl overflow-hidden relative shadow-sm cursor-pointer group transition-opacity duration-300"
          onClick={() => setShowPromoModal(true)}
        >
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url('${PROMO_EVENTS[currentPromoIndex].backgroundImage}')` }}
          ></div>
          <div className={`absolute inset-0 bg-gradient-to-r ${PROMO_EVENTS[currentPromoIndex].gradientFrom} ${PROMO_EVENTS[currentPromoIndex].gradientVia} ${PROMO_EVENTS[currentPromoIndex].gradientTo} flex items-center px-5 transition-all duration-500`}>
            <div className="flex flex-col text-white flex-1">
              <span className="font-display text-lg font-bold">{PROMO_EVENTS[currentPromoIndex].title}</span>
              <span className="text-xs text-blue-100 mt-0.5">
                {PROMO_EVENTS[currentPromoIndex].subtitle}
              </span>
            </div>
            <span className="material-symbols-outlined text-white/80 group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </div>

          {/* Pagination Indicators */}
          <div className="absolute bottom-2.5 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
            {PROMO_EVENTS.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPromoIndex(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentPromoIndex
                    ? 'bg-white w-6 h-1.5'
                    : 'bg-white/50 w-1.5 h-1.5 hover:bg-white/70'
                }`}
                aria-label={`Go to promotion ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Promo Detail Modal */}
      {showPromoModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-end sm:items-center justify-center" onClick={() => setShowPromoModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-y-auto sm:rounded-3xl shadow-2xl animate-fadeIn" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-[#191c1e]">
                {PROMO_EVENTS[currentPromoIndex].title}
              </h2>
              <button
                onClick={() => setShowPromoModal(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[24px] text-[#555f6c]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5">
              {/* Event Description */}
              <div>
                <p className="text-sm text-[#555f6c] leading-relaxed">
                  {PROMO_EVENTS[currentPromoIndex].description}
                </p>
              </div>

              {/* Event Details */}
              <div className="space-y-3">
                <h3 className="font-display font-bold text-[#191c1e]">이벤트 상세 내용</h3>
                <ul className="space-y-2.5">
                  {PROMO_EVENTS[currentPromoIndex].details.map((detail, idx) => (
                    <li key={idx} className="flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-[#0052cc] flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <span className="text-sm text-[#3e4853]">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const promoId = PROMO_EVENTS[currentPromoIndex].id;
                  setShowPromoModal(false);
                  // App.tsx의 onPromoBooking에서 탭 변경 처리
                  onPromoBooking(promoId);
                }}
                className="w-full bg-[#0052cc] hover:bg-[#003d9b] text-white font-bold py-3 rounded-2xl transition-all active:scale-95 mt-6"
              >
                이제 예매하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
