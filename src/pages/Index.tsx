
import React, { useState } from 'react';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import Header from '@/components/Dashboard/Header';
import KPICards from '@/components/Dashboard/KPICards';
import SalesChart from '@/components/Dashboard/SalesChart';
import CustomerOverview from '@/components/Dashboard/CustomerOverview';
import RegionalSales from '@/components/Dashboard/RegionalSales';
import PipelineAnalysis from '@/components/Dashboard/PipelineAnalysis';
import DrilldownModal from '@/components/Dashboard/DrilldownModal';

const Index = () => {
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  
  const handleDrillDown = (customerId: string) => {
    setSelectedCustomerId(customerId);
    setIsDrilldownOpen(true);
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="仪表盘概览" />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <KPICards onDrillDown={handleDrillDown} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SalesChart onDrillDown={handleDrillDown} />
            <PipelineAnalysis onDrillDown={handleDrillDown} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-2">
              <CustomerOverview onDrillDown={handleDrillDown} />
            </div>
            <RegionalSales onDrillDown={handleDrillDown} />
          </div>
        </main>
      </div>
      
      <DrilldownModal 
        open={isDrilldownOpen} 
        onClose={() => setIsDrilldownOpen(false)}
        customerId={selectedCustomerId}
      />
    </div>
  );
};

export default Index;
