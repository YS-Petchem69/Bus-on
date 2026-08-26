import React from 'react';
import { HOTLINK_IMAGES } from '../data/mockData';
import { TabType } from '../types';

interface HeaderProps {
  currentTab: TabType;
  onNavigate: (tab: TabType) => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenNotifications,
  unreadCount = 2,
  showBack = false,
  onBack,
  title,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#f7f9fc]/95 backdrop-blur-md border-b border-[#e0e3e6]/60 px-5 h-16 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button
            onClick={onBack || (() => onNavigate('home'))}
            aria-label="뒤로가기"
            className="p-2 -ml-2 text-[#003d9b] hover:bg-[#eceef1] active:scale-95 transition-all rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
        ) : (
          <button
            onClick={() => onNavigate('home')}
            aria-label="홈으로 이동"
            className="flex items-center gap-2 group text-left"
          >
            <img
              src={HOTLINK_IMAGES.logo}
              alt="BusOn Logo"
              className="h-8 w-auto object-contain rounded-md"
              onError={(e) => {
                // fallback to text if image fails
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-display font-extrabold text-2xl text-[#003d9b] tracking-tight group-hover:opacity-90 transition-opacity">
              BusOn
            </span>
          </button>
        )}

        {title && showBack && (
          <h1 className="font-display font-bold text-lg text-[#191c1e] truncate">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-1.5 text-[#434654]">
        {currentTab !== 'location' && (
          <button
            onClick={() => onNavigate('location')}
            className="p-2 rounded-full hover:bg-[#eceef1] active:scale-95 transition-all text-[#0052cc] flex items-center justify-center"
            title="실시간 버스 관제"
          >
            <span className="material-symbols-outlined text-[22px]">directions_bus</span>
          </button>
        )}

        <button
          onClick={onOpenNotifications}
          aria-label="알림"
          className="relative p-2 rounded-full hover:bg-[#eceef1] active:scale-95 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined text-2xl text-[#003d9b]">notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        <button
          onClick={() => onNavigate('mypage')}
          aria-label="마이페이지"
          className={`p-2 rounded-full hover:bg-[#eceef1] active:scale-95 transition-all flex items-center justify-center ${
            currentTab === 'mypage' ? 'text-[#0052cc]' : 'text-[#434654]'
          }`}
        >
          <span className="material-symbols-outlined text-2xl">account_circle</span>
        </button>
      </div>
    </header>
  );
};
