/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, Ticket } from './types';
import { INITIAL_TICKET } from './data/mockData';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { SearchScreen } from './components/SearchScreen';
import { LiveLocationScreen } from './components/LiveLocationScreen';
import { TransferScreen } from './components/TransferScreen';
import { TicketScreen } from './components/TicketScreen';
import { MyPageScreen } from './components/MyPageScreen';
import { NotificationModal } from './components/NotificationModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [tickets, setTickets] = useState<Ticket[]>([INITIAL_TICKET]);
  const [activeTicket, setActiveTicket] = useState<Ticket>(INITIAL_TICKET);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [quickOrigin, setQuickOrigin] = useState('서울(경부)');
  const [quickDestination, setQuickDestination] = useState('부산(노포)');

  const handleBookSuccess = (newTicket: Ticket) => {
    setTickets((prev) => [newTicket, ...prev]);
    setActiveTicket(newTicket);
  };

  const handleCancelTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  const handleSelectQuickRoute = (origin: string, dest: string) => {
    setQuickOrigin(origin);
    setQuickDestination(dest);
    setCurrentTab('search');
  };

  const getHeaderTitle = () => {
    switch (currentTab) {
      case 'search':
        return '통합 버스 예매';
      case 'location':
        return '실시간 버스 위치';
      case 'transfer':
        return '하차 후 환승 안내';
      case 'tickets':
        return '내 승차권';
      case 'mypage':
        return '마이페이지';
      default:
        return undefined;
    }
  };

  const isSubScreen = currentTab !== 'home';

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col font-sans antialiased text-[#191c1e]">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        unreadCount={2}
        showBack={isSubScreen}
        onBack={() => setCurrentTab('home')}
        title={getHeaderTitle()}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full relative">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={setCurrentTab}
            activeTicket={activeTicket}
            onOpenTicketDetail={(t) => {
              setActiveTicket(t);
              setCurrentTab('tickets');
            }}
            onSelectQuickRoute={handleSelectQuickRoute}
          />
        )}

        {currentTab === 'search' && (
          <SearchScreen
            onNavigate={setCurrentTab}
            onBookSuccess={handleBookSuccess}
            activeTicket={activeTicket}
            onOpenTicketQr={() => setCurrentTab('tickets')}
            initialOrigin={quickOrigin}
            initialDestination={quickDestination}
          />
        )}

        {currentTab === 'location' && (
          <LiveLocationScreen
            onNavigate={setCurrentTab}
            activeTicket={activeTicket}
            onOpenTransfer={() => setCurrentTab('transfer')}
          />
        )}

        {currentTab === 'transfer' && <TransferScreen onNavigate={setCurrentTab} />}

        {currentTab === 'tickets' && (
          <TicketScreen
            tickets={tickets}
            onNavigate={setCurrentTab}
            onCancelTicket={handleCancelTicket}
          />
        )}

        {currentTab === 'mypage' && (
          <MyPageScreen
            onNavigate={setCurrentTab}
            onSelectRoute={(org, dst) => {
              setQuickOrigin(org);
              setQuickDestination(dst);
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={setCurrentTab}
        ticketBadgeCount={tickets.length}
      />

      {/* Push Notification Dialog Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateToLocation={() => setCurrentTab('location')}
        onNavigateToTransfer={() => setCurrentTab('transfer')}
      />
    </div>
  );
}
