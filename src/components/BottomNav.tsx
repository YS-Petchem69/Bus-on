import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  ticketBadgeCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  ticketBadgeCount = 1,
}) => {
  const isTabActive = (tab: TabType) => {
    if (tab === 'home') return currentTab === 'home';
    if (tab === 'tickets') return currentTab === 'tickets';
    if (tab === 'location') return currentTab === 'location' || currentTab === 'transfer';
    if (tab === 'mypage') return currentTab === 'mypage';
    return false;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-[#e0e3e6]/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] px-4 pt-2 pb-6 flex justify-around items-center max-w-md mx-auto sm:max-w-xl md:max-w-2xl rounded-t-2xl">
      {/* Home Tab */}
      <button
        onClick={() => onNavigate('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all active:scale-95 ${
          currentTab === 'home'
            ? 'bg-[#d9e3f2] text-[#003d9b] font-bold px-3'
            : 'text-[#555f6c] hover:text-[#003d9b]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: currentTab === 'home' ? "'FILL' 1" : "'FILL' 0" }}
        >
          home
        </span>
        <span className="text-[11px] mt-0.5 font-medium">홈</span>
      </button>

      {/* Tickets Tab */}
      <button
        onClick={() => onNavigate('tickets')}
        className={`relative flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all active:scale-95 ${
          currentTab === 'tickets'
            ? 'bg-[#d9e3f2] text-[#003d9b] font-bold px-3'
            : 'text-[#555f6c] hover:text-[#003d9b]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: currentTab === 'tickets' ? "'FILL' 1" : "'FILL' 0" }}
        >
          confirmation_number
        </span>
        <span className="text-[11px] mt-0.5 font-medium">내 티켓</span>
        {ticketBadgeCount > 0 && currentTab !== 'tickets' && (
          <span className="absolute top-1 right-5 w-2 h-2 bg-[#0052cc] rounded-full ring-2 ring-white"></span>
        )}
      </button>

      {/* Real-time Location Tab */}
      <button
        onClick={() => onNavigate('location')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all active:scale-95 ${
          currentTab === 'location' || currentTab === 'transfer'
            ? 'bg-[#d9e3f2] text-[#003d9b] font-bold px-3'
            : 'text-[#555f6c] hover:text-[#003d9b]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{
            fontVariationSettings:
              currentTab === 'location' || currentTab === 'transfer' ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          location_on
        </span>
        <span className="text-[11px] mt-0.5 font-medium">실시간 위치</span>
      </button>

      {/* My Page Tab */}
      <button
        onClick={() => onNavigate('mypage')}
        className={`flex flex-col items-center justify-center flex-1 py-1 rounded-full transition-all active:scale-95 ${
          currentTab === 'mypage'
            ? 'bg-[#d9e3f2] text-[#003d9b] font-bold px-3'
            : 'text-[#555f6c] hover:text-[#003d9b]'
        }`}
      >
        <span
          className="material-symbols-outlined text-[24px]"
          style={{ fontVariationSettings: currentTab === 'mypage' ? "'FILL' 1" : "'FILL' 0" }}
        >
          person
        </span>
        <span className="text-[11px] mt-0.5 font-medium">마이페이지</span>
      </button>
    </nav>
  );
};
