import React, { useState } from 'react';
import { Ticket, TabType } from '../types';

interface TicketScreenProps {
  tickets: Ticket[];
  onNavigate: (tab: TabType) => void;
  onCancelTicket: (ticketId: string) => void;
}

export const TicketScreen: React.FC<TicketScreenProps> = ({
  tickets,
  onNavigate,
  onCancelTicket,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [showQrZoom, setShowQrZoom] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket>(tickets[0]);

  const activeTickets = tickets.filter((t) => t.status !== 'cancelled' && t.status !== 'completed');
  const historyTickets = tickets.filter((t) => t.status === 'completed' || t.status === 'cancelled');

  return (
    <div className="flex flex-col gap-5 px-5 py-4 pb-28 max-w-md mx-auto sm:max-w-xl md:max-w-2xl animate-fadeIn">
      {/* Tab Switcher: Current vs Past */}
      <div className="flex bg-[#f2f4f7] rounded-full p-1 border border-[#e0e3e6]/80 shadow-xs">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-white shadow-sm text-[#003d9b]'
              : 'text-[#555f6c] hover:bg-white/40'
          }`}
        >
          예매된 승차권 ({activeTickets.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 px-4 rounded-full text-xs font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white shadow-sm text-[#003d9b]'
              : 'text-[#555f6c] hover:bg-white/40'
          }`}
        >
          지난 승차권 내역
        </button>
      </div>

      {activeTab === 'active' && activeTickets.length > 0 ? (
        activeTickets.map((ticket) => (
          <div
            key={ticket.id}
            className="bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#e0e3e6]/80 overflow-hidden flex flex-col"
          >
            {/* Header section with blue band */}
            <div className="bg-[#003d9b] p-5 text-white flex justify-between items-start">
              <div>
                <span className="text-[11px] font-bold bg-white/20 px-2 py-0.5 rounded-full">
                  {ticket.busNumber} · {ticket.company}
                </span>
                <h3 className="font-display font-bold text-2xl mt-1 tracking-tight">
                  {ticket.origin} <span className="text-blue-300">→</span> {ticket.destination}
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">{ticket.departureDate}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-blue-200 block">타는 곳</span>
                <span className="font-display font-extrabold text-xl text-yellow-300">
                  {ticket.platform}
                </span>
              </div>
            </div>

            {/* Middle QR Code Scanner Section */}
            <div className="p-6 flex flex-col items-center justify-center bg-white border-b border-dashed border-gray-200 relative">
              {/* Ticket Notch cutouts on left and right */}
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f7f9fc] border-r border-[#e0e3e6]"></div>
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#f7f9fc] border-l border-[#e0e3e6]"></div>

              {/* QR Code SVG / Visual */}
              <div
                onClick={() => {
                  setSelectedTicket(ticket);
                  setShowQrZoom(true);
                }}
                className="w-48 h-48 bg-white p-3 border-2 border-gray-100 rounded-2xl shadow-sm flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform group"
              >
                {/* Visual SVG QR representation */}
                <svg viewBox="0 0 100 100" className="w-full h-full text-[#191c1e]">
                  <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="4" />
                  <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                  <rect x="9" y="9" width="12" height="12" fill="currentColor" rx="1" />

                  <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="4" />
                  <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                  <rect x="79" y="9" width="12" height="12" fill="currentColor" rx="1" />

                  <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="4" />
                  <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                  <rect x="9" y="79" width="12" height="12" fill="currentColor" rx="1" />

                  {/* Random QR modules */}
                  <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                  <rect x="48" y="15" width="10" height="8" fill="currentColor" />
                  <rect x="36" y="36" width="28" height="8" fill="currentColor" />
                  <rect x="40" y="48" width="8" height="20" fill="currentColor" />
                  <rect x="52" y="56" width="16" height="8" fill="currentColor" />
                  <rect x="72" y="40" width="8" height="16" fill="currentColor" />
                  <rect x="84" y="48" width="12" height="12" fill="currentColor" />
                  <rect x="72" y="72" width="24" height="24" fill="currentColor" />
                  <rect x="40" y="78" width="14" height="10" fill="currentColor" />
                </svg>
                <span className="text-[11px] text-gray-500 mt-2 font-medium group-hover:text-[#0052cc]">
                  터치하여 QR 확대
                </span>
              </div>

              <div className="text-center mt-3">
                <span className="text-xs font-mono font-bold text-gray-700 tracking-wider">
                  {ticket.qrCodeValue}
                </span>
                <p className="text-[11px] text-[#737685] mt-0.5">버스 탑승구 검표기에 태그해 주세요</p>
              </div>
            </div>

            {/* Ticket Seat & Details grid */}
            <div className="p-5 grid grid-cols-3 gap-3 bg-[#f2f4f7]/40 text-center">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[11px] text-gray-500 block">출발 시간</span>
                <span className="font-display font-extrabold text-base text-[#191c1e]">
                  {ticket.departureTime}
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[11px] text-gray-500 block">좌석 번호</span>
                <span className="font-display font-extrabold text-base text-[#003d9b]">
                  {ticket.seatNumber}번
                </span>
              </div>
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[11px] text-gray-500 block">결제 금액</span>
                <span className="font-display font-bold text-sm text-[#191c1e]">
                  {ticket.price.toLocaleString()}원
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="p-4 flex flex-col gap-2 bg-white">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('location')}
                  className="py-3 bg-[#0052cc] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#003d9b] active:scale-95 transition-all"
                >
                  <span
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    location_on
                  </span>
                  실시간 위치 보기
                </button>
                <button
                  onClick={() => onNavigate('transfer')}
                  className="py-3 bg-[#dae2ff] text-[#001848] rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-[#c4d2ff] active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    transfer_within_a_station
                  </span>
                  하차 후 환승 안내
                </button>
              </div>

              <div className="flex justify-between items-center pt-2 px-1 text-xs text-[#737685]">
                <button
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setShowReceipt(true);
                  }}
                  className="hover:underline"
                >
                  전자 영수증 보기
                </button>
                <button
                  onClick={() => {
                    if (confirm('승차권 예매를 취소하시겠습니까? (출발 전 취소 수수료 0원)')) {
                      onCancelTicket(ticket.id);
                    }
                  }}
                  className="text-[#ba1a1a] hover:underline font-semibold"
                >
                  예매 취소
                </button>
              </div>
            </div>
          </div>
        ))
      ) : activeTab === 'active' ? (
        <div className="bg-white rounded-2xl p-10 text-center flex flex-col items-center justify-center gap-3 border border-gray-200">
          <span className="material-symbols-outlined text-4xl text-gray-400">
            confirmation_number
          </span>
          <p className="font-bold text-base text-gray-700">현재 예매된 승차권이 없습니다</p>
          <button
            onClick={() => onNavigate('search')}
            className="px-6 py-2.5 bg-[#0052cc] text-white rounded-full text-xs font-bold shadow-md"
          >
            버스 예매하러 가기
          </button>
        </div>
      ) : (
        /* History Tickets */
        <div className="flex flex-col gap-3">
          {[
            {
              id: 'H1',
              origin: '동서울',
              destination: '강릉',
              date: '2024.10.15',
              seat: '12번',
              price: 24600,
              status: '이용완료',
            },
            {
              id: 'H2',
              origin: '센트럴시티',
              destination: '광주',
              date: '2024.09.28',
              seat: '7번',
              price: 33900,
              status: '이용완료',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 border border-gray-200 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">{item.date}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
                <h4 className="font-bold text-base text-gray-800 mt-1">
                  {item.origin} → {item.destination}
                </h4>
                <p className="text-xs text-gray-500">좌석 {item.seat}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-sm text-gray-900">{item.price.toLocaleString()}원</span>
                <button
                  onClick={() => onNavigate('search')}
                  className="block text-[11px] text-[#0052cc] font-semibold mt-1"
                >
                  다시 예매
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Zoom Modal for Boarding */}
      {showQrZoom && selectedTicket && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowQrZoom(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-xs w-full flex flex-col items-center text-center shadow-2xl animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-[#0052cc]">승차권 모바일 QR</span>
              <button onClick={() => setShowQrZoom(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 bg-white border-2 border-gray-200 rounded-2xl my-2 shadow-inner">
              <svg viewBox="0 0 100 100" className="w-56 h-56 text-[#191c1e]">
                <rect x="0" y="0" width="30" height="30" fill="currentColor" rx="4" />
                <rect x="5" y="5" width="20" height="20" fill="white" rx="2" />
                <rect x="9" y="9" width="12" height="12" fill="currentColor" rx="1" />

                <rect x="70" y="0" width="30" height="30" fill="currentColor" rx="4" />
                <rect x="75" y="5" width="20" height="20" fill="white" rx="2" />
                <rect x="79" y="9" width="12" height="12" fill="currentColor" rx="1" />

                <rect x="0" y="70" width="30" height="30" fill="currentColor" rx="4" />
                <rect x="5" y="75" width="20" height="20" fill="white" rx="2" />
                <rect x="9" y="79" width="12" height="12" fill="currentColor" rx="1" />

                <rect x="36" y="10" width="8" height="8" fill="currentColor" />
                <rect x="48" y="15" width="10" height="8" fill="currentColor" />
                <rect x="36" y="36" width="28" height="8" fill="currentColor" />
                <rect x="40" y="48" width="8" height="20" fill="currentColor" />
                <rect x="52" y="56" width="16" height="8" fill="currentColor" />
                <rect x="72" y="40" width="8" height="16" fill="currentColor" />
                <rect x="84" y="48" width="12" height="12" fill="currentColor" />
                <rect x="72" y="72" width="24" height="24" fill="currentColor" />
              </svg>
            </div>

            <h4 className="font-display font-bold text-lg text-[#191c1e] mt-2">
              {selectedTicket.origin} → {selectedTicket.destination}
            </h4>
            <p className="text-xs font-semibold text-[#003d9b]">
              {selectedTicket.departureTime} 출발 · 좌석 {selectedTicket.seatNumber}번
            </p>
            <p className="text-[11px] text-gray-400 mt-2">화면 밝기가 자동으로 최적화되었습니다.</p>
          </div>
        </div>
      )}

      {/* Electronic Receipt Modal */}
      {showReceipt && selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-900">전자 영수증 (승차권)</h3>
              <button onClick={() => setShowReceipt(false)} className="text-gray-400">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="text-xs space-y-2 text-gray-600">
              <div className="flex justify-between">
                <span>승차권 번호</span>
                <span className="font-mono font-bold text-gray-900">{selectedTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span>운행 노선</span>
                <span className="font-bold text-gray-900">
                  {selectedTicket.originDetail} → {selectedTicket.destinationDetail}
                </span>
              </div>
              <div className="flex justify-between">
                <span>탑승 일시</span>
                <span className="font-bold text-gray-900">
                  {selectedTicket.departureDate} {selectedTicket.departureTime}
                </span>
              </div>
              <div className="flex justify-between">
                <span>좌석 번호</span>
                <span className="font-bold text-gray-900">{selectedTicket.seatNumber}번 (1인)</span>
              </div>
              <div className="flex justify-between">
                <span>결제 수단</span>
                <span className="text-gray-900">신한카드 (9412-****-****) 일시불</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-sm font-bold text-[#003d9b]">
                <span>합계 금액</span>
                <span>{selectedTicket.price.toLocaleString()}원</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full py-3 bg-[#0052cc] text-white font-bold rounded-xl text-sm mt-2"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
