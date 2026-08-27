import React, { useState } from 'react';
import { BusType, BusSchedule, Terminal, Ticket, TabType } from '../types';
import { TERMINALS, REGIONS, MOCK_BUS_SCHEDULES, HOTLINK_IMAGES, PROMO_EVENTS, SAVED_ROUTES } from '../data/mockData';

interface SearchScreenProps {
  onNavigate: (tab: TabType) => void;
  onBookSuccess: (newTicket: Ticket) => void;
  activeTicket: Ticket;
  onOpenTicketQr: () => void;
  initialOrigin?: string;
  initialDestination?: string;
  selectedPromoId?: string | null;
  onPromoSelected?: (promoId: string | null) => void;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onNavigate,
  onBookSuccess,
  activeTicket,
  onOpenTicketQr,
  initialOrigin = '서울(경부)',
  initialDestination = '부산(노포)',
  selectedPromoId = null,
  onPromoSelected = () => {},
}) => {
  const [busType, setBusType] = useState<BusType>('express');
  const [origin, setOrigin] = useState(initialOrigin);
  const [destination, setDestination] = useState(initialDestination);
  const [selectedDate, setSelectedDate] = useState('10월 24일 (화)');
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);

  // Modals & Flow
  const [showTerminalModal, setShowTerminalModal] = useState<'origin' | 'destination' | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPassengerModal, setShowPassengerModal] = useState(false);

  // Search Results
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<BusSchedule | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [showCouponList, setShowCouponList] = useState(false);

  // 자주 찾는 노선
  const [savedRoutes, setSavedRoutes] = useState(SAVED_ROUTES);
  const [showSavedRoutesOnly, setShowSavedRoutesOnly] = useState(false);

  // 쿠폰 데이터
  const availableCoupons = [
    { id: 'c1', title: '15% 할인', code: 'SAVE15' },
    { id: 'c2', title: '5,000원 할인', code: 'SAVE5000' },
    { id: 'c3', title: '20% 할인 (주말)', code: 'WEEKEND20' },
  ];

  const handleSwapTerminals = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const handleSelectSavedRoute = (routeOrigin: string, routeDestination: string) => {
    setOrigin(routeOrigin);
    setDestination(routeDestination);
    setHasSearched(false);
    setShowSavedRoutesOnly(false);
  };

  const filteredTerminals = TERMINALS.filter((t) => {
    const matchesRegion = selectedRegion === '전체' || t.region.includes(selectedRegion);
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRegion && matchesSearch;
  }).sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

  const handleSelectTerminal = (terminalName: string) => {
    if (showTerminalModal === 'origin') {
      setOrigin(terminalName);
    } else if (showTerminalModal === 'destination') {
      setDestination(terminalName);
    }
    setShowTerminalModal(null);
    setSearchTerm('');
  };

  const handleSearchBuses = () => {
    setHasSearched(true);
    // scroll to results
  };

  const handleOpenSeatPicker = (schedule: BusSchedule) => {
    setSelectedSchedule(schedule);
    setSelectedSeat(null);
    setSelectedCoupon(null);
    setShowCouponList(false);
    setShowSeatModal(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedSchedule || !selectedSeat) return;

    const couponCode = selectedCoupon 
      ? availableCoupons.find(c => c.id === selectedCoupon)?.code 
      : undefined;

    const newTicket: Ticket = {
      id: `TK-${Date.now().toString().slice(-6)}`,
      busNumber: `고속버스 ${selectedSchedule.busNumber}`,
      company: selectedSchedule.company,
      busType: selectedSchedule.busType,
      grade: selectedSchedule.grade,
      departureDate: '2024.10.24 (화)',
      departureTime: selectedSchedule.departureTime,
      estimatedArrival: selectedSchedule.arrivalTime,
      origin: origin.split('(')[0],
      originDetail: origin,
      destination: destination.split('(')[0],
      destinationDetail: destination,
      seatNumber: selectedSeat,
      seatType: `${selectedSchedule.grade === 'premium' ? '프리미엄' : '우등'} 좌석`,
      platform: selectedSchedule.platform,
      price: selectedSchedule.price * adultCount,
      passengerName: '김버스',
      qrCodeValue: `BUSON-${selectedSchedule.busNumber}-${selectedSeat}`,
      status: 'booked',
      speed: 0,
      remainingMinutes: 240,
      appliedCoupon: couponCode,
    };

    onBookSuccess(newTicket);
    setShowSeatModal(false);
    onNavigate('tickets');
  };

  return (
    <div className="flex flex-col gap-5 px-5 py-4 pb-28 max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn">
      {/* Promo Banner */}
      {selectedPromoId && (
        <section>
          {PROMO_EVENTS.map((promo) => 
            promo.id === selectedPromoId ? (
              <div key={promo.id} className="bg-gradient-to-r from-[#0052cc]/10 to-[#003d9b]/10 border-l-4 border-[#0052cc] rounded-xl p-4 flex items-start gap-3">
                <div className="text-2xl">{promo.emoji}</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-[#191c1e] text-sm">{promo.title}</h3>
                  <p className="text-xs text-[#555f6c] mt-0.5">{promo.subtitle}</p>
                </div>
                <button
                  onClick={() => onPromoSelected(null)}
                  className="text-[#737685] hover:text-[#191c1e] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>
            ) : null
          )}
        </section>
      )}

      {/* Search Card */}
      <section className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-5 flex flex-col gap-4 border border-neutral-100 relative">
        {/* Type Toggle */}
        <div className="flex p-1 bg-[#f2f4f7] rounded-xl w-full">
          <button
            onClick={() => setBusType('express')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              busType === 'express'
                ? 'bg-white shadow-sm text-[#0052cc]'
                : 'text-[#555f6c] hover:bg-white/40'
            }`}
          >
            고속버스
          </button>
          <button
            onClick={() => setBusType('intercity')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all ${
              busType === 'intercity'
                ? 'bg-white shadow-sm text-[#0052cc]'
                : 'text-[#555f6c] hover:bg-white/40'
            }`}
          >
            시외버스
          </button>
        </div>

        {/* Route Selector with Swap Button */}
        <div className="flex items-center justify-between relative px-2 py-3 border-b border-[#e0e3e6]">
          {/* Origin */}
          <div className="flex flex-col items-start w-[45%]">
            <span className="text-[12px] text-[#737685] mb-1 font-medium">출발지</span>
            <button
              onClick={() => setShowTerminalModal('origin')}
              className="text-[18px] font-bold text-[#191c1e] text-left truncate w-full hover:text-[#0052cc] transition-colors"
            >
              {origin}
            </button>
          </div>

          {/* Swap Button */}
          <button
            onClick={handleSwapTerminals}
            aria-label="출도착지 전환"
            className="h-11 w-11 rounded-full bg-[#f2f4f7] flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm border border-white hover:bg-[#dae2ff] transition-all active:scale-90"
          >
            <span className="material-symbols-outlined text-[#0052cc] text-xl">swap_horiz</span>
          </button>

          {/* Destination */}
          <div className="flex flex-col items-end w-[45%] text-right">
            <span className="text-[12px] text-[#737685] mb-1 font-medium">도착지</span>
            <button
              onClick={() => setShowTerminalModal('destination')}
              className={`text-[18px] font-bold text-right truncate w-full transition-colors ${
                destination ? 'text-[#191c1e] hover:text-[#0052cc]' : 'text-[#737685]'
              }`}
            >
              {destination || '도착지 선택'}
            </button>
          </div>
        </div>

        {/* Date Picker Button */}
        <button
          onClick={() => setShowDateModal(true)}
          className="flex items-center justify-between w-full py-3 px-2 border-b border-[#e0e3e6] hover:bg-[#f2f4f7]/60 rounded-lg transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#737685] text-xl">calendar_today</span>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#737685]">가는날</span>
              <span className="text-[16px] text-[#191c1e] font-semibold">{selectedDate}</span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#737685] text-lg">chevron_right</span>
        </button>

        {/* Passenger Count Button */}
        <button
          onClick={() => setShowPassengerModal(true)}
          className="flex items-center justify-between w-full py-2.5 px-2 hover:bg-[#f2f4f7]/60 rounded-lg transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#737685] text-xl">person</span>
            <div className="flex flex-col">
              <span className="text-[11px] text-[#737685]">인원</span>
              <span className="text-[16px] text-[#191c1e] font-semibold">
                어른 {adultCount}명 {childCount > 0 && `· 아동 ${childCount}명`}
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-[#737685] text-lg">chevron_right</span>
        </button>

        {/* CTA Button */}
        <button
          onClick={handleSearchBuses}
          className="mt-2 w-full h-14 bg-[#0052cc] hover:bg-[#003d9b] text-white rounded-full font-display font-bold text-[17px] shadow-[0_8px_24px_rgba(0,82,204,0.2)] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">search</span>
          버스 조회하기
        </button>
      </section>

      {/* 자주 찾는 노선 */}
      {!hasSearched && savedRoutes.filter(r => r.isFavorite).length > 0 && (
        <section className="flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-base text-[#191c1e] flex items-center gap-2">
              <span className="material-symbols-outlined text-lg text-[#0052cc]">star</span>
              자주 찾는 노선
            </h3>
            <span className="text-[10px] text-[#737685] font-semibold">{savedRoutes.filter(r => r.isFavorite).length}개</span>
          </div>

          <div className="flex flex-col gap-2">
            {savedRoutes
              .filter(r => r.isFavorite)
              .sort((a, b) => new Date(b.lastSearchedDate).getTime() - new Date(a.lastSearchedDate).getTime())
              .slice(0, 5)
              .map((route) => (
                <button
                  key={route.id}
                  onClick={() => handleSelectSavedRoute(route.origin, route.destination)}
                  className="p-3 bg-gradient-to-r from-[#f2f4f7] to-[#eceef1] hover:from-[#dae2ff] hover:to-[#eceef1] rounded-lg flex items-center justify-between transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500 font-bold">favorite</span>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-[#191c1e]">{route.origin} → {route.destination}</p>
                      <p className="text-[10px] text-[#737685]">최근: {route.lastSearchedDate} · 검색: {route.searchCount}회</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-[#0052cc] text-lg">arrow_forward</span>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* Bus Schedule Search Results */}
      {hasSearched && (
        <section className="flex flex-col gap-3 animate-fadeIn">
          <div className="flex items-center justify-between px-1">
            <h3 className="font-display font-bold text-base text-[#191c1e]">
              운행 시간표 ({origin.split('(')[0]} → {destination.split('(')[0]})
            </h3>
            <span className="text-xs text-[#0052cc] font-semibold">총 {MOCK_BUS_SCHEDULES.length}회차</span>
          </div>

          <div className="flex flex-col gap-2.5">
            {MOCK_BUS_SCHEDULES.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-xl p-4 card-shadow border border-[#e6e8eb] flex flex-col gap-3 hover:border-[#0052cc]/50 transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                        schedule.grade === 'premium'
                          ? 'bg-[#dae2ff] text-[#003d9b]'
                          : schedule.grade === 'honor'
                          ? 'bg-[#d9e3f2] text-[#131c27]'
                          : 'bg-[#f2f4f7] text-[#555f6c]'
                      }`}
                    >
                      {schedule.grade === 'premium'
                        ? '프리미엄'
                        : schedule.grade === 'honor'
                        ? '우등'
                        : '일반'}
                    </span>
                    <span className="text-xs font-semibold text-[#555f6c]">{schedule.company}</span>
                    <span className="text-[11px] text-[#737685]">{schedule.platform}</span>
                  </div>
                  <span className="text-xs font-semibold text-[#006a1b]">
                    잔여 {schedule.remainingSeats}석 / {schedule.totalSeats}석
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold font-display text-[#191c1e]">
                      {schedule.departureTime}
                    </span>
                    <span className="text-xs text-[#737685]">출발</span>
                    <span className="material-symbols-outlined text-xs text-[#737685]">arrow_forward</span>
                    <span className="text-sm font-semibold text-[#555f6c]">{schedule.arrivalTime} 도착</span>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-[#0052cc]">
                      {schedule.price.toLocaleString()}원
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSeatPicker(schedule)}
                  className="w-full py-2.5 rounded-lg bg-[#f2f4f7] hover:bg-[#0052cc] text-[#003d9b] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">airline_seat_recline_extra</span>
                  좌석 선택하기
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Journey Widget (Exact match to screenshot 2) */}
      <section className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 border-l-4 border-l-[#0052cc] flex flex-col gap-3">
        <div className="flex justify-between items-center mb-0.5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0052cc] text-sm">
              confirmation_number
            </span>
            <span className="text-xs font-bold text-[#0052cc]">예매된 승차권</span>
          </div>
          <span className="text-[11px] text-[#555f6c] bg-[#eceef1] px-2 py-0.5 rounded-md font-medium">
            오늘 {activeTicket.departureTime} 출발
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-[#191c1e]">
              <span>{activeTicket.origin}</span>
              <span className="material-symbols-outlined text-[#737685] text-base">
                arrow_forward
              </span>
              <span>{activeTicket.destination}</span>
            </div>
            <span className="text-xs text-[#555f6c] mt-0.5">
              {activeTicket.seatType} · {activeTicket.seatNumber}번 좌석
            </span>
          </div>

          <button
            onClick={onOpenTicketQr}
            className="bg-[#f2f4f7] hover:bg-[#e0e3e6] p-2.5 rounded-xl border border-[#e0e3e6] transition-colors active:scale-95 flex items-center justify-center"
            title="QR 승차권 보기"
          >
            <span className="material-symbols-outlined text-[#191c1e] text-2xl">qr_code_2</span>
          </button>
        </div>

        <button
          onClick={() => onNavigate('location')}
          className="w-full mt-1 py-2.5 rounded-xl border border-[#0052cc] text-[#0052cc] hover:bg-[#0052cc]/5 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <span
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            location_on
          </span>
          실시간 버스 위치
        </button>
      </section>

      {/* Promotional Banner */}
      <div
        className="w-full h-24 rounded-2xl overflow-hidden relative shadow-sm"
        style={{ backgroundImage: `url('${HOTLINK_IMAGES.bannerPromo}')`, backgroundSize: 'cover' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/70 to-transparent flex items-center px-4">
          <div className="flex flex-col text-white">
            <span className="font-display font-bold text-base">가을 단풍 여행 🍁</span>
            <span className="text-xs opacity-90 mt-0.5">최대 20% 할인 혜택</span>
          </div>
        </div>
      </div>

      {/* Terminal Selection Modal */}
      {showTerminalModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 max-h-[85vh] flex flex-col shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <h3 className="font-display font-bold text-lg text-[#191c1e]">
                {showTerminalModal === 'origin' ? '출발 터미널 선택' : '도착 터미널 선택'}
              </h3>
              <button
                onClick={() => setShowTerminalModal(null)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative my-3">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="터미널명 검색 (예: 서울, 부산, 대전)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f2f4f7] rounded-xl text-sm border-none focus:ring-2 focus:ring-[#0052cc] outline-none"
              />
            </div>

            {/* Region Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {REGIONS.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedRegion === region
                      ? 'bg-[#0052cc] text-white shadow-xs'
                      : 'bg-[#f2f4f7] text-[#555f6c] hover:bg-gray-200'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>

            {/* Terminal List */}
            <div className="flex-1 overflow-y-auto divide-y divide-gray-100 max-h-72 mt-2">
              {filteredTerminals.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleSelectTerminal(t.name)}
                  className="w-full py-3 px-2 flex items-center justify-between hover:bg-[#f2f4f7] rounded-lg transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-[#191c1e]">{t.name}</span>
                    <span className="text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      {t.region}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 text-base">check</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date Picker Modal */}
      {showDateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg">가는 날짜 선택</h3>
              <button onClick={() => setShowDateModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {['10월 24일 (오늘)', '10월 25일 (내일)', '10월 26일 (목)', '10월 27일 (금)', '10월 28일 (토)', '10월 29일 (일)'].map(
                (d) => (
                  <button
                    key={d}
                    onClick={() => {
                      setSelectedDate(d.replace(' (오늘)', ' (화)').replace(' (내일)', ' (수)'));
                      setShowDateModal(false);
                    }}
                    className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-all ${
                      selectedDate.includes(d.slice(0, 6))
                        ? 'border-[#0052cc] bg-[#dae2ff]/40 text-[#0052cc]'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Passenger Count Modal */}
      {showPassengerModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg">승차 인원 선택</h3>
              <button onClick={() => setShowPassengerModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Adult Counter */}
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-bold text-sm">어른</p>
                <p className="text-xs text-gray-500">만 13세 이상</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={adultCount <= 1}
                  onClick={() => setAdultCount(adultCount - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30"
                >
                  -
                </button>
                <span className="font-bold text-base w-4 text-center">{adultCount}</span>
                <button
                  onClick={() => setAdultCount(adultCount + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Child Counter */}
            <div className="flex items-center justify-between py-2 border-t">
              <div>
                <p className="font-bold text-sm">아동 (50% 할인)</p>
                <p className="text-xs text-gray-500">만 6세 ~ 12세</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  disabled={childCount <= 0}
                  onClick={() => setChildCount(childCount - 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-30"
                >
                  -
                </button>
                <span className="font-bold text-base w-4 text-center">{childCount}</span>
                <button
                  onClick={() => setChildCount(childCount + 1)}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowPassengerModal(false)}
              className="w-full py-3 bg-[#0052cc] text-white font-bold rounded-xl mt-2"
            >
              선택 완료
            </button>
          </div>
        </div>
      )}

      {/* Seat Picker Modal */}
      {showSeatModal && selectedSchedule && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Coupon Dropdown Overlay - Prevents scrolling when dropdown is open */}
          {showCouponList && (
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setShowCouponList(false)}
            />
          )}

          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 max-h-[90vh] flex flex-col shadow-2xl animate-slideUp">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <h3 className="font-bold text-lg text-[#191c1e]">좌석 선택 (프리미엄 21석)</h3>
                <p className="text-xs text-gray-500">
                  {selectedSchedule.company} · {selectedSchedule.departureTime} 출발
                </p>
              </div>
              <button onClick={() => setShowSeatModal(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto my-4">
              {/* Seat Map Area */}
              <div className="p-4 bg-[#f2f4f7] rounded-2xl flex flex-col items-center">
                <div className="w-full flex justify-between px-6 mb-3 text-xs text-gray-500 font-semibold border-b border-gray-300 pb-2">
                  <span>운전석 🚍</span>
                  <span>출입문 🚪</span>
                </div>

                {/* Grid representation of 1-2 seating format */}
                <div className="grid grid-cols-4 gap-2.5 w-full max-w-[280px]">
                  {Array.from({ length: 21 }, (_, i) => i + 1).map((seatNum) => {
                    const isOccupied = [2, 5, 8, 12, 16].includes(seatNum);
                    const isSelected = selectedSeat === seatNum;
                    const isAisle = (seatNum - 1) % 3 === 1;

                    return (
                      <React.Fragment key={seatNum}>
                        <button
                          disabled={isOccupied}
                          onClick={() => setSelectedSeat(seatNum)}
                          className={`h-11 rounded-lg text-xs font-bold transition-all flex flex-col items-center justify-center ${
                            isOccupied
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-[#0052cc] text-white shadow-md scale-105 ring-2 ring-blue-300'
                              : 'bg-white text-[#191c1e] hover:bg-blue-50 border border-gray-200'
                          }`}
                        >
                          <span>{seatNum}</span>
                          <span className="text-[9px] opacity-75">
                            {isOccupied ? '마감' : isSelected ? '선택' : '예약'}
                          </span>
                        </button>
                        {/* Insert empty gap for aisle */}
                        {isAisle && <div className="w-2"></div>}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex gap-4 mt-4 text-[11px] text-gray-600">
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 bg-white border rounded"></div>
                    <span>선택가능</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 bg-[#0052cc] rounded"></div>
                    <span>선택좌석</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3.5 h-3.5 bg-gray-300 rounded"></div>
                    <span>예약완료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Bottom Section */}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between py-2 mb-3">
                <div>
                  <span className="text-xs text-gray-500">선택 좌석: {selectedSeat ? `${selectedSeat}번` : '미선택'}</span>
                  <p className="font-bold text-lg text-[#0052cc]">
                    총 {(selectedSchedule.price * adultCount).toLocaleString()}원
                  </p>
                </div>
                
                {/* Coupon Button with Text */}
                <button
                  onClick={() => setShowCouponList(true)}
                  className="flex flex-col items-center gap-1 p-2 bg-[#f2f4f7] hover:bg-[#dae2ff] rounded-lg transition-colors"
                  title="할인 쿠폰 선택"
                >
                  <span className="material-symbols-outlined text-base text-[#0052cc]">
                    {selectedCoupon ? 'check_circle' : 'card_giftcard'}
                  </span>
                  <span className="text-[10px] font-bold text-[#0052cc]">할인쿠폰</span>
                </button>
              </div>

              {/* 이 노선 저장 버튼 */}
              <button
                onClick={() => {
                  const existingRoute = savedRoutes.find(r => r.origin === origin && r.destination === destination);
                  if (existingRoute) {
                    setSavedRoutes(savedRoutes.map(r => 
                      r.id === existingRoute.id 
                        ? { ...r, isFavorite: !r.isFavorite }
                        : r
                    ));
                  }
                }}
                className="w-full px-4 py-2 bg-[#f2f4f7] hover:bg-[#dae2ff] transition-all mb-2 font-semibold text-xs rounded-lg flex items-center justify-center gap-2"
              >
                <span className={`material-symbols-outlined text-base transition-all font-bold ${
                  savedRoutes.find(r => r.origin === origin && r.destination === destination)?.isFavorite 
                    ? 'text-red-500' 
                    : 'text-gray-400'
                }`}>
                  {savedRoutes.find(r => r.origin === origin && r.destination === destination)?.isFavorite ? 'favorite' : 'favorite_border'}
                </span>
                이 노선 저장하기
              </button>

              <button
                disabled={!selectedSeat}
                onClick={handleConfirmBooking}
                className="w-full px-6 py-3.5 bg-[#0052cc] disabled:bg-gray-300 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
              >
                예매하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Selection Modal */}
      {showCouponList && (
        <div className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl animate-slideUp">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">할인 쿠폰 선택</h2>
              <button
                onClick={() => setShowCouponList(false)}
                className="p-1 hover:bg-gray-100 rounded-full text-gray-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              <button
                onClick={() => {
                  setSelectedCoupon(null);
                  setShowCouponList(false);
                }}
                className={`w-full p-3 rounded-lg text-xs font-medium transition-all text-left ${
                  selectedCoupon === null
                    ? 'bg-[#0052cc] text-white'
                    : 'bg-[#f2f4f7] text-gray-700 hover:bg-[#dae2ff]'
                }`}
              >
                쿠폰 사용 안 함
              </button>
              {availableCoupons.map((coupon) => (
                <button
                  key={coupon.id}
                  onClick={() => {
                    setSelectedCoupon(coupon.id);
                    setShowCouponList(false);
                  }}
                  className={`w-full p-3 rounded-lg text-xs font-medium transition-all text-left ${
                    selectedCoupon === coupon.id
                      ? 'bg-[#0052cc] text-white'
                      : 'bg-[#f2f4f7] text-gray-700 hover:bg-[#dae2ff]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{coupon.title}</span>
                    <span className="text-[10px] opacity-75">{coupon.code}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCouponList(false)}
              className="w-full mt-4 py-3 bg-[#003d9b] text-white font-semibold rounded-xl hover:bg-[#002d7f] transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
