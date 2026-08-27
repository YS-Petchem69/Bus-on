import React, { useState } from 'react';
import { TabType } from '../types';
import { SAVED_ROUTES, TERMINALS } from '../data/mockData';

interface MyPageScreenProps {
  onNavigate: (tab: TabType) => void;
  onSelectRoute: (origin: string, dest: string) => void;
}

export const MyPageScreen: React.FC<MyPageScreenProps> = ({ onNavigate, onSelectRoute }) => {
  const [userName, setUserName] = useState('김버스');
  const [userEmail, setUserEmail] = useState('a01087092265@gmail.com');
  
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    departure: true,
    restArea: true,
    transfer: true,
    marketing: false,
  });

  // Modal states
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [lostItemsFilter, setLostItemsFilter] = useState<string | null>(null);
  const [showLostItemsModal, setShowLostItemsModal] = useState(false);
  const [showCouponsModal, setShowCouponsModal] = useState(false);
  const [showFAQModal, setShowFAQModal] = useState(false);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [showSavedRoutesModal, setShowSavedRoutesModal] = useState(false);
  const [savedRoutes, setSavedRoutes] = useState(SAVED_ROUTES);

  const handleSaveProfile = () => {
    setUserName(editName);
    setUserEmail(editEmail);
    setShowProfileEditModal(false);
  };

  // 한글 자음 추출 함수
  const getKoreanConsonant = (text: string): string => {
    const basicConsonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    
    // 첫 번째 한글 글자 찾기
    for (let char of text) {
      const code = char.charCodeAt(0);
      // 한글 음절 범위 (0xAC00 ~ 0xD7A3)
      if (code >= 0xAC00 && code <= 0xD7A3) {
        let index = Math.floor((code - 0xAC00) / (21 * 28));
        
        // 쌍자음을 기본 자음으로 변환
        if (index === 1) index = 0;           // ㄲ -> ㄱ
        else if (index === 4) index = 2;      // ㄸ -> ㄷ
        else if (index === 8 || index === 9) index = 4;  // ㅃ, ㅄ -> ㅂ
        else if (index === 11) index = 6;     // ㅆ -> ㅅ
        else if (index === 14) index = 8;     // ㅉ -> ㅈ
        
        return basicConsonants[Math.min(index, 13)];
      }
    }
    return '기타';
  };

  // 유실물 센터 데이터
  const lostItemsTerminals = [
    { name: '강릉 버스터미널', phone: '033-640-5995', hours: '08:00 ~ 20:00' },
    { name: '강원 속초터미널', phone: '033-636-9500', hours: '08:00 ~ 19:00' },
    { name: '광주(유·스퀘어)', phone: '062-360-8114', hours: '08:00 ~ 20:00' },
    { name: '대구(동대구)', phone: '053-622-0114', hours: '08:00 ~ 20:00' },
    { name: '대전복합터미널', phone: '042-625-5555', hours: '08:00 ~ 20:00' },
    { name: '동서울터미널', phone: '02-446-0504', hours: '08:00 ~ 20:00' },
    { name: '목포 버스터미널', phone: '061-284-2001', hours: '08:00 ~ 18:00' },
    { name: '부산(노포) 터미널', phone: '051-321-1455', hours: '08:00 ~ 18:00' },
    { name: '부산서부 버스터미널', phone: '051-333-1111', hours: '08:00 ~ 18:00' },
    { name: '서울(경부) 터미널', phone: '02-6282-0114', hours: '08:00 ~ 20:00' },
    { name: '센트럴시티(호남)', phone: '02-6359-0551', hours: '08:00 ~ 20:00' },
    { name: '수원 버스터미널', phone: '031-250-5701', hours: '08:00 ~ 20:00' },
    { name: '안동 버스터미널', phone: '054-854-0700', hours: '08:00 ~ 18:00' },
    { name: '여수 버스터미널', phone: '061-664-0114', hours: '08:00 ~ 18:00' },
    { name: '인천 버스터미널', phone: '032-841-8000', hours: '08:00 ~ 20:00' },
    { name: '전주 버스터미널', phone: '063-284-5114', hours: '08:00 ~ 18:00' },
    { name: '청주 버스터미널', phone: '043-214-2114', hours: '08:00 ~ 19:00' },
    { name: '울산 버스터미널', phone: '052-291-2114', hours: '08:00 ~ 18:00' },
    { name: '창원 버스터미널', phone: '055-286-0114', hours: '08:00 ~ 18:00' },
    { name: '포항 버스터미널', phone: '054-294-5000', hours: '08:00 ~ 18:00' },
  ].sort((a, b) => a.name.localeCompare(b.name, 'ko-KR'));

  const lostItemsConsonants = Array.from(new Set(lostItemsTerminals.map(t => getKoreanConsonant(t.name))));
  
  const filteredLostItems = lostItemsFilter
    ? lostItemsTerminals.filter(t => getKoreanConsonant(t.name) === lostItemsFilter)
    : lostItemsTerminals;

  // 할인 쿠폰 데이터
  const coupons = [
    { id: 'c1', title: '15% 할인 쿠폰', description: '전국 노선', discount: '15%', expiryDate: '2026.09.30', code: 'SAVE15' },
    { id: 'c2', title: '5,000원 할인', description: '고속버스 이용 시', discount: '5,000원', expiryDate: '2026.10.15', code: 'SAVE5000' },
    { id: 'c3', title: '20% 할인 쿠폰', description: '주말 노선 한정', discount: '20%', expiryDate: '2026.09.15', code: 'WEEKEND20' },
  ];

  return (
    <>
      <div className="flex flex-col gap-5 px-5 py-4 pb-28 max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn">
        {/* 1. Profile Header Card */}
        <section className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e0e3e6]/80 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#003d9b] text-white flex items-center justify-center font-display font-extrabold text-xl shadow-md">
              {userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-lg text-[#191c1e]">{userName} 님</h2>
                <span className="text-[10px] font-extrabold bg-[#dae2ff] text-[#003d9b] px-2 py-0.5 rounded-full">
                  VIP 등급
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{userEmail}</p>
            </div>
          </div>

          <button 
            onClick={() => {
              setEditName(userName);
              setEditEmail(userEmail);
              setShowProfileEditModal(true);
            }}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 active:bg-gray-200 transition-colors">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </section>

        {/* 2. Mileage & Coupons Summary */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-[#e0e3e6]/80 shadow-2xs flex flex-col justify-between">
            <span className="text-xs text-gray-500 font-medium">보유 마일리지</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-display font-extrabold text-xl text-[#003d9b]">4,850</span>
              <span className="text-xs text-gray-600 font-bold">P</span>
            </div>
          </div>
          <button 
            onClick={() => setShowCouponsModal(true)}
            className="bg-white rounded-2xl p-4 border border-[#e0e3e6]/80 shadow-2xs flex flex-col justify-between hover:bg-[#f8f9fb] active:bg-[#f2f4f7] transition-colors text-left">
            <span className="text-xs text-gray-500 font-medium">할인 쿠폰</span>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="font-display font-extrabold text-xl text-[#0052cc]">3</span>
              <span className="text-xs text-gray-600 font-bold">장</span>
            </div>
          </button>
        </section>

        {/* 3. Frequent Routes */}
        <section className="bg-white rounded-2xl p-5 border border-[#e0e3e6]/80 shadow-2xs flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-base text-[#191c1e]">
              <span className="material-symbols-outlined inline-block align-text-bottom mr-1 text-[20px]">favorite</span>
              자주 찾는 노선
            </h3>
            <button
              onClick={() => setShowSavedRoutesModal(true)}
              className="text-xs text-[#0052cc] font-semibold hover:text-[#003d9b]"
            >
              관리
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {savedRoutes
              .filter(r => r.isFavorite)
              .sort((a, b) => new Date(b.lastSearchedDate).getTime() - new Date(a.lastSearchedDate).getTime())
              .slice(0, 3)
              .map((route) => (
                <button
                  key={route.id}
                  onClick={() => {
                    onSelectRoute(route.origin, route.destination);
                    onNavigate('search');
                  }}
                  className="p-3 bg-[#f2f4f7] hover:bg-[#dae2ff]/40 rounded-xl flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-800">
                      {route.origin.split('(')[0]} → {route.destination.split('(')[0]}
                    </span>
                    <span className="text-[10px] bg-white text-[#003d9b] px-1.5 py-0.5 rounded font-semibold border border-blue-100">
                      {route.searchCount}회
                    </span>
                  </div>
                <span className="text-xs font-bold text-[#0052cc] flex items-center gap-0.5">
                  예매하기
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* 4. Smart Notification Push Settings */}
        <section className="bg-white rounded-2xl p-5 border border-[#e0e3e6]/80 shadow-2xs flex flex-col gap-3">
          <h3 className="font-display font-bold text-base text-[#191c1e]">스마트 운행 알림 설정</h3>

          <div className="divide-y divide-gray-100 text-sm">
            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">출발 30분 전 알림</p>
                <p className="text-xs text-gray-400">승차 홈 및 모바일 검표 안내</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled.departure}
                onChange={(e) =>
                  setNotificationsEnabled({ ...notificationsEnabled, departure: e.target.checked })
                }
                className="w-5 h-5 accent-[#0052cc] rounded"
              />
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">휴게소 정차 10분 전 알림</p>
                <p className="text-xs text-gray-400">휴게소 편의시설 및 정차 시간 안내</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled.restArea}
                onChange={(e) =>
                  setNotificationsEnabled({ ...notificationsEnabled, restArea: e.target.checked })
                }
                className="w-5 h-5 accent-[#0052cc] rounded"
              />
            </div>

            <div className="py-2.5 flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-800">하차 후 환승·택시 연계 알림</p>
                <p className="text-xs text-gray-400">도착 5분 전 지하철/택시 승강장 안내</p>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled.transfer}
                onChange={(e) =>
                  setNotificationsEnabled({ ...notificationsEnabled, transfer: e.target.checked })
                }
                className="w-5 h-5 accent-[#0052cc] rounded"
              />
            </div>
          </div>
        </section>

        {/* 5. Customer Support & App Info */}
        <section className="bg-white rounded-2xl p-5 border border-[#e0e3e6]/80 shadow-2xs flex flex-col gap-2">
          <h3 className="font-display font-bold text-base text-[#191c1e] mb-1">고객센터 & 안내</h3>
          <button
            onClick={() => setShowLostItemsModal(true)}
            className="py-2.5 flex items-center justify-between text-xs text-gray-700 hover:text-[#0052cc] active:bg-blue-50 transition-colors rounded px-2"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-gray-400">search</span>
              <span className="font-medium">전국 터미널 유실물 센터 조회</span>
            </div>
            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
          </button>

          <button
            onClick={() => setShowFAQModal(true)}
            className="py-2.5 flex items-center justify-between text-xs text-gray-700 hover:text-[#0052cc] active:bg-blue-50 transition-colors rounded px-2"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-gray-400">help_outline</span>
              <span className="font-medium">자주 묻는 질문 (FAQ)</span>
            </div>
            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
          </button>

          <button
            onClick={() => setShowRefundModal(true)}
            className="py-2.5 flex items-center justify-between text-xs text-gray-700 hover:text-[#0052cc] active:bg-blue-50 transition-colors rounded px-2"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-gray-400">info</span>
              <span className="font-medium">환불 및 취소 규정 안내</span>
            </div>
            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
          </button>

          <button
            onClick={() => setShowVersionModal(true)}
            className="py-2.5 flex items-center justify-between text-xs text-gray-700 hover:text-[#0052cc] active:bg-blue-50 transition-colors rounded px-2"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-gray-400">verified</span>
              <span className="font-medium">버전 정보 (v2.4.0 최신버전)</span>
            </div>
            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
          </button>
        </section>
      </div>

      {/* Lost Items Modal */}
      {showLostItemsModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end z-[9999]">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-32 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">유실물 센터 조회</h2>
              <button
                onClick={() => {
                  setShowLostItemsModal(false);
                  setLostItemsFilter(null);
                }}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Consonant Filter Buttons */}
            <div className="flex gap-1.5 mb-4 flex-wrap max-h-20 overflow-y-auto">
              <button
                onClick={() => setLostItemsFilter(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  lostItemsFilter === null
                    ? 'bg-[#0052cc] text-white'
                    : 'bg-[#f2f4f7] text-gray-700 hover:bg-[#dae2ff]'
                }`}
              >
                전체
              </button>
              {lostItemsConsonants.map((consonant) => (
                <button
                  key={consonant}
                  onClick={() => setLostItemsFilter(consonant)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    lostItemsFilter === consonant
                      ? 'bg-[#0052cc] text-white'
                      : 'bg-[#f2f4f7] text-gray-700 hover:bg-[#dae2ff]'
                  }`}
                >
                  {consonant}
                </button>
              ))}
            </div>

            {/* Terminals List */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {filteredLostItems.length > 0 ? (
                filteredLostItems.map((terminal, i) => (
                  <div key={i} className="p-3 bg-[#f2f4f7] rounded-xl">
                    <div className="font-semibold text-sm text-[#191c1e] mb-1">{terminal.name}</div>
                    <div className="text-xs text-gray-600 space-y-0.5">
                      <div>📞 {terminal.phone}</div>
                      <div>🕐 {terminal.hours}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500 text-sm">
                  해당하는 터미널이 없습니다.
                </div>
              )}
            </div>
            <button
              onClick={() => {
                setShowLostItemsModal(false);
                setLostItemsFilter(null);
              }}
              className="w-full mt-4 py-3 bg-[#003d9b] text-white font-semibold rounded-xl hover:bg-[#002d7f] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Coupons Modal */}
      {showCouponsModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end z-[9999]">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-32 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">내 할인 쿠폰</h2>
              <button
                onClick={() => setShowCouponsModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
              {coupons.length > 0 ? (
                coupons.map((coupon) => (
                  <div key={coupon.id} className="bg-gradient-to-r from-[#0052cc]/10 to-[#003d9b]/10 border-l-4 border-[#0052cc] rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display font-bold text-base text-[#191c1e]">{coupon.title}</h3>
                          <span className="text-xs font-bold bg-[#0052cc] text-white px-2 py-0.5 rounded-full">{coupon.discount}</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{coupon.description}</p>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-2.5 mb-2">
                      <p className="text-xs text-gray-500 font-medium">쿠폰 코드</p>
                      <p className="font-display font-bold text-sm text-[#0052cc] tracking-widest">{coupon.code}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">유효기한: {coupon.expiryDate}</span>
                      <button className="px-3 py-1.5 bg-[#0052cc] text-white text-xs font-semibold rounded-lg hover:bg-[#003d9b] transition-colors active:scale-95">
                        사용하기
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500 text-sm">
                  <p className="mb-2">사용 가능한 쿠폰이 없습니다.</p>
                  <p className="text-xs">프로모션을 통해 새로운 쿠폰을 받아보세요!</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowCouponsModal(false)}
              className="w-full mt-4 py-3 bg-[#003d9b] text-white font-semibold rounded-xl hover:bg-[#002d7f] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {showFAQModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end z-[9999]">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-32 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">자주 묻는 질문</h2>
              <button
                onClick={() => setShowFAQModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {[
                { q: '예매 후 취소 가능한가요?', a: '출발 3시간 전까지 취소 가능하며, 이용료 10%가 차감됩니다.' },
                { q: '결제 방법은 어떤 것들이 있나요?', a: '신용카드, 체크카드, 계좌이체, 휴대폰 결제가 가능합니다.' },
                { q: '예약한 좌석을 변경할 수 있나요?', a: '출발 하루 전까지 변경 가능하며, 좌석 가격 차액이 발생할 수 있습니다.' },
                { q: '버스 지연 시 환불이 되나요?', a: '3시간 이상 지연 시 이용료의 10%를 환불해드립니다.' },
                { q: '휴게소에서 몇 분 정차하나요?', a: '일반적으로 10~15분 정차하며, 노선에 따라 다를 수 있습니다.' },
              ].map((faq, i) => (
                <details key={i} className="p-3 bg-[#f2f4f7] rounded-xl group cursor-pointer">
                  <summary className="font-semibold text-sm text-[#191c1e] flex justify-between items-center">
                    {faq.q}
                    <span className="material-symbols-outlined text-sm group-open:rotate-180 transition-transform">
                      expand_more
                    </span>
                  </summary>
                  <p className="text-xs text-gray-600 mt-2 ml-2">{faq.a}</p>
                </details>
              ))}
            </div>
            <button
              onClick={() => setShowFAQModal(false)}
              className="w-full mt-4 py-3 bg-[#003d9b] text-white font-semibold rounded-xl hover:bg-[#002d7f] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Refund & Cancellation Policy Modal */}
      {showRefundModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end z-[9999]">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-32 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">환불 및 취소 규정</h2>
              <button
                onClick={() => setShowRefundModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto text-xs text-gray-700">
              <div className="bg-[#dae2ff]/40 p-3 rounded-xl border border-blue-200">
                <div className="font-bold text-[#003d9b] mb-2">📋 취소 수수료</div>
                <div className="space-y-1">
                  <div>• 출발 3시간 이전: 취소 수수료 10% 차감</div>
                  <div>• 출발 3시간 ~ 1시간 이내: 취소 수수료 20% 차감</div>
                  <div>• 출발 1시간 이내: 취소 불가능</div>
                </div>
              </div>

              <div className="bg-[#fef3c7]/40 p-3 rounded-xl border border-amber-200">
                <div className="font-bold text-amber-800 mb-2">💰 환불 방법</div>
                <div className="space-y-1">
                  <div>• 신용카드 결제: 5~7일 이내 환불</div>
                  <div>• 계좌이체: 2~3일 이내 환불</div>
                  <div>• 휴대폰: 당일 환불 (이동통신사 확인 필요)</div>
                </div>
              </div>

              <div className="bg-[#e0f2fe]/40 p-3 rounded-xl border border-cyan-200">
                <div className="font-bold text-cyan-900 mb-2">🚫 특수 상황</div>
                <div className="space-y-1">
                  <div>• 천재지변(태풍, 폭우): 수수료 없이 환불 또는 변경</div>
                  <div>• 운행사 사유 취소: 100% 환불</div>
                  <div>• 승객 사유 지연: 수수료 적용</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowRefundModal(false)}
              className="w-full mt-4 py-3 bg-[#003d9b] text-white font-semibold rounded-xl hover:bg-[#002d7f] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <div className="fixed inset-0 bg-black/30 flex items-end z-[9999]">
          <div className="w-full bg-white rounded-t-3xl p-6 pb-32 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">프로필 설정</h2>
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">사용자 이름</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f2f4f7] border border-[#e0e3e6] rounded-lg text-sm font-medium text-[#191c1e] focus:outline-none focus:border-[#0052cc] focus:bg-white transition-colors"
                  placeholder="사용자 이름을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">이메일</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f2f4f7] border border-[#e0e3e6] rounded-lg text-sm font-medium text-[#191c1e] focus:outline-none focus:border-[#0052cc] focus:bg-white transition-colors"
                  placeholder="이메일을 입력하세요"
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-gray-600 mt-4">
                <p className="font-semibold text-[#003d9b] mb-1">📌 안내</p>
                <p>변경 사항은 저장 버튼을 클릭한 후 적용됩니다.</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowProfileEditModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-3 bg-[#0052cc] text-white font-semibold rounded-xl hover:bg-[#003d9b] transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Info Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 animate-in zoom-in">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#dae2ff] flex items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-[#003d9b]">info</span>
              </div>
            </div>
            <h2 className="font-display font-bold text-xl text-center text-[#191c1e] mb-2">
              BusOn (버스온)
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              스마트 고속·시외버스 통합 모빌리티
            </p>

            <div className="space-y-2 mb-6 text-sm border-t border-b border-gray-200 py-4">
              <div className="flex justify-between">
                <span className="text-gray-600">현재 버전</span>
                <span className="font-semibold text-[#191c1e]">v2.4.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">최신 버전</span>
                <span className="font-semibold text-[#16a34a] flex items-center gap-1">
                  ✓ 최신
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">릴리스 날짜</span>
                <span className="font-semibold text-[#191c1e]">2026.08.26</span>
              </div>
            </div>

            <div className="bg-[#f2f4f7] p-3 rounded-xl mb-6 text-xs text-gray-700">
              <p className="font-semibold mb-1">🎉 v2.4.0 업데이트 사항</p>
              <ul className="space-y-0.5 text-[11px]">
                <li>• 실시간 위치 추적 시스템 개선</li>
                <li>• 고속도로 정체 정보 실시간 업데이트</li>
                <li>• 환승 안내 기능 강화</li>
                <li>• 앱 성능 최적화</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowVersionModal(false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                닫기
              </button>
              <button
                className="flex-1 py-2.5 bg-[#003d9b] text-white font-semibold rounded-xl hover:bg-[#002d7f] transition-colors disabled:opacity-50"
                disabled
              >
                이미 최신
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Routes Management Modal */}
      {showSavedRoutesModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 max-h-[80vh] flex flex-col animate-slideUp shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">자주 찾는 노선 관리</h2>
              <button
                onClick={() => setShowSavedRoutesModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <span className="material-symbols-outlined text-gray-400">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {savedRoutes.length > 0 ? (
                savedRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="p-3 bg-[#f2f4f7] rounded-xl flex items-center justify-between hover:bg-[#dae2ff]/40 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-800">
                        {route.origin} → {route.destination}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        검색: {route.searchCount}회 · 최근: {route.lastSearchedDate}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSavedRoutes(
                          savedRoutes.map(r =>
                            r.id === route.id ? { ...r, isFavorite: !r.isFavorite } : r
                          )
                        );
                      }}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title={route.isFavorite ? '즐겨찾기 제거' : '즐겨찾기 추가'}
                    >
                      <span className="material-symbols-outlined text-lg text-[#0052cc]">
                        {route.isFavorite ? 'favorite' : 'favorite_border'}
                      </span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-500 mb-2">저장된 노선이 없습니다.</p>
                  <p className="text-xs text-gray-400">검색 화면에서 노선을 저장해보세요!</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSavedRoutesModal(false)}
              className="w-full mt-4 py-3 bg-[#0052cc] text-white font-semibold rounded-xl hover:bg-[#003d9b] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
};
