import React from 'react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLocation: () => void;
  onNavigateToTransfer: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  onNavigateToLocation,
  onNavigateToTransfer,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: 'n1',
      title: '🚌 하차 5분 전 환승 안내',
      desc: '부산 종합버스터미널 도착 5분 전입니다. 터미널 1층 2번 게이트 택시 승강장 또는 지하 1층 1호선 노포역 환승 정보를 확인하세요.',
      time: '방금 전',
      action: () => {
        onClose();
        onNavigateToTransfer();
      },
      actionText: '환승/택시 안내 보기',
    },
    {
      id: 'n2',
      title: '☕ 선산휴게소 10분 후 도착 예정',
      desc: '15분간 정차 예정입니다. 차량 번호(고속버스 1004)와 재출발 시간(15:45)을 확인해 주세요.',
      time: '15분 전',
      action: () => {
        onClose();
        onNavigateToLocation();
      },
      actionText: '실시간 위치 확인',
    },
    {
      id: 'n3',
      title: '🎫 승차권 발권 완료 안내',
      desc: '서울경부 → 부산노포 (14:30 출발, 21번 좌석) 승차권 예매가 정상 완료되었습니다.',
      time: '1시간 전',
      action: null,
      actionText: '',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[80vh] animate-slideUp">
        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#003d9b]">notifications</span>
            <h3 className="font-display font-bold text-lg text-[#191c1e]">실시간 운행 알림</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:bg-gray-100 rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 mt-2">
          {notifications.map((n) => (
            <div key={n.id} className="py-4 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-sm text-[#191c1e]">{n.title}</h4>
                <span className="text-[10px] text-gray-400">{n.time}</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{n.desc}</p>
              {n.action && (
                <button
                  onClick={n.action}
                  className="self-start text-xs font-bold text-[#0052cc] bg-[#dae2ff]/50 hover:bg-[#dae2ff] px-3 py-1.5 rounded-lg transition-colors mt-1"
                >
                  {n.actionText} →
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-[#f2f4f7] hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-sm mt-3"
        >
          확인 완료
        </button>
      </div>
    </div>
  );
};
