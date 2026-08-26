import React, { useState } from 'react';
import { TabType } from '../types';

interface MyPageScreenProps {
  onNavigate: (tab: TabType) => void;
  onSelectRoute: (origin: string, dest: string) => void;
}

export const MyPageScreen: React.FC<MyPageScreenProps> = ({ onNavigate, onSelectRoute }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState({
    departure: true,
    restArea: true,
    transfer: true,
    marketing: false,
  });

  return (
    <div className="flex flex-col gap-5 px-5 py-4 pb-28 max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn">
      {/* 1. Profile Header Card */}
      <section className="bg-white rounded-3xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#e0e3e6]/80 flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-full bg-[#003d9b] text-white flex items-center justify-center font-display font-extrabold text-xl shadow-md">
            김
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-bold text-lg text-[#191c1e]">김버스 님</h2>
              <span className="text-[10px] font-extrabold bg-[#dae2ff] text-[#003d9b] px-2 py-0.5 rounded-full">
                VIP 등급
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">a01087092265@gmail.com</p>
          </div>
        </div>

        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400">
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
        <div className="bg-white rounded-2xl p-4 border border-[#e0e3e6]/80 shadow-2xs flex flex-col justify-between">
          <span className="text-xs text-gray-500 font-medium">할인 쿠폰</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="font-display font-extrabold text-xl text-[#0052cc]">3</span>
            <span className="text-xs text-gray-600 font-bold">장</span>
          </div>
        </div>
      </section>

      {/* 3. Frequent Routes */}
      <section className="bg-white rounded-2xl p-5 border border-[#e0e3e6]/80 shadow-2xs flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="font-display font-bold text-base text-[#191c1e]">자주 찾는 노선</h3>
          <span className="text-xs text-[#0052cc] font-semibold">관리</span>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { origin: '서울(경부)', dest: '부산(노포)', grade: '프리미엄' },
            { origin: '센트럴시티(호남)', dest: '광주(유·스퀘어)', grade: '우등' },
            { origin: '동서울', dest: '강릉', grade: '우등' },
          ].map((r, i) => (
            <button
              key={i}
              onClick={() => {
                onSelectRoute(r.origin, r.dest);
                onNavigate('search');
              }}
              className="p-3 bg-[#f2f4f7] hover:bg-[#dae2ff]/40 rounded-xl flex items-center justify-between transition-colors text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800">
                  {r.origin.split('(')[0]} → {r.dest.split('(')[0]}
                </span>
                <span className="text-[10px] bg-white text-[#003d9b] px-1.5 py-0.5 rounded font-semibold border border-blue-100">
                  {r.grade}
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
        {[
          { title: '전국 터미널 유실물 센터 조회', icon: 'search' },
          { title: '자주 묻는 질문 (FAQ)', icon: 'help_outline' },
          { title: '환불 및 취소 규정 안내', icon: 'info' },
          { title: '버전 정보 (v2.4.0 최신버전)', icon: 'verified' },
        ].map((item, idx) => (
          <button
            key={idx}
            className="py-2.5 flex items-center justify-between text-xs text-gray-700 hover:text-[#0052cc] transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-gray-400">
                {item.icon}
              </span>
              <span className="font-medium">{item.title}</span>
            </div>
            <span className="material-symbols-outlined text-sm text-gray-400">chevron_right</span>
          </button>
        ))}
      </section>
    </div>
  );
};
