/**
 * 🎛 ADMIN DASHBOARD - REDFLIX PRO
 * Sistema completo de administração com 16 módulos e 80+ funcionalidades
 */

import { useState } from 'react';
import { AdminLayout } from './admin/AdminLayout';
import { DashboardOverview } from './admin/DashboardOverview';
import { SubscribersList } from './admin/SubscribersList';
import { SubscriberProfile } from './admin/SubscriberProfile';
import { PlansList } from './admin/PlansList';
import { CouponsList } from './admin/CouponsList';
import { VODLibrary } from './admin/VODLibrary';
import { ChannelsIPTV } from './admin/ChannelsIPTV';
import { EPGManager } from './admin/EPGManager';
import { DevicesList } from './admin/DevicesList';
import { FinancialDashboard } from './admin/FinancialDashboard';
import { NotificationsManager } from './admin/NotificationsManager';
import { SettingsPanel } from './admin/SettingsPanel';
import { SoccerModule } from './admin/SoccerModule';
import { LogsAndSecurity } from './admin/LogsAndSecurity';
import { AccessGenerator } from './admin/AccessGenerator';
import { M3UImporter } from './admin/M3UImporter';
import { AIModule } from './admin/AIModule';

interface AdminDashboardProps {
  onClose: () => void;
}

export function AdminDashboard({ onClose }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedSubscriber, setSelectedSubscriber] = useState<string | null>(null);

  const renderPage = () => {
    // Se há um assinante selecionado, mostra o perfil
    if (selectedSubscriber && currentPage === 'subscribers') {
      return (
        <SubscriberProfile
          subscriberId={selectedSubscriber}
          onBack={() => setSelectedSubscriber(null)}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardOverview />;
      
      case 'subscribers':
        return <SubscribersList onSelectSubscriber={setSelectedSubscriber} />;
      
      case 'plans':
        return <PlansList />;
      
      case 'coupons':
        return <CouponsList />;
      
      case 'vod':
        return <VODLibrary />;
      
      case 'channels':
        return <ChannelsIPTV />;
      
      case 'epg':
        return <EPGManager />;
      
      case 'devices':
        return <DevicesList />;
      
      case 'financial':
        return <FinancialDashboard />;
      
      case 'notifications':
        return <NotificationsManager />;
      
      case 'settings':
        return <SettingsPanel />;
      
      case 'soccer':
        return <SoccerModule />;
      
      case 'logs':
        return <LogsAndSecurity />;
      
      case 'access':
        return <AccessGenerator />;
      
      case 'm3u':
        return <M3UImporter />;
      
      case 'ai':
        return <AIModule />;
      
      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">Módulo em Desenvolvimento</h3>
              <p className="text-gray-400">Esta seção será implementada em breve.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AdminLayout 
      currentPage={currentPage} 
      onPageChange={setCurrentPage}
      onBack={onClose}
    >
      {renderPage()}
    </AdminLayout>
  );
}