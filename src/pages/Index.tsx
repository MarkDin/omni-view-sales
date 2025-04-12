
import React, { useState } from 'react';
import Sidebar from '@/components/Dashboard/Sidebar';
import Header from '@/components/Dashboard/Header';
import KPICards from '@/components/Dashboard/KPICards';
import SalesChart from '@/components/Dashboard/SalesChart';
import RegionalSales from '@/components/Dashboard/RegionalSales';
import CustomerOverview from '@/components/Dashboard/CustomerOverview';
import PipelineAnalysis from '@/components/Dashboard/PipelineAnalysis';
import DrilldownModal from '@/components/Dashboard/DrilldownModal';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

const Index = () => {
  const [activePage, setActivePage] = useState('overview');
  const [drilldownOpen, setDrilldownOpen] = useState(false);
  const [drilldownSection, setDrilldownSection] = useState('');
  const [drilldownData, setDrilldownData] = useState(null);

  const handleDrillDown = (section: string, data = null) => {
    setDrilldownSection(section);
    setDrilldownData(data);
    setDrilldownOpen(true);
  };

  const getTitleByPage = () => {
    switch (activePage) {
      case 'overview':
        return { title: '销售概览', description: '全面了解销售业绩，客户和产品数据' };
      case 'performance':
        return { title: '销售业绩', description: '深入分析销售团队和个人表现' };
      case 'customers':
        return { title: '客户分析', description: '客户分布、忠诚度和价值分析' };
      case 'products':
        return { title: '产品销售', description: '产品销量、利润率和趋势分析' };
      case 'pipeline':
        return { title: '销售漏斗', description: '销售流程各阶段的转化和周期' };
      case 'regions':
        return { title: '区域分析', description: '不同地区的销售表现对比' };
      case 'channels':
        return { title: '销售渠道', description: '各销售渠道的效果对比分析' };
      case 'trends':
        return { title: '时间趋势', description: '销售数据的时间序列分析' };
      default:
        return { title: '销售数据中心', description: '全面的销售数据分析平台' };
    }
  };

  // Only show the overview content for now
  const renderContent = () => {
    if (activePage === 'overview') {
      return (
        <>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">关键指标</h2>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <CalendarDays size={16} />
                <span>本月</span>
              </Button>
            </div>
            <KPICards onDrillDown={(section) => handleDrillDown(section)} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <SalesChart onDrillDown={() => handleDrillDown('sales_chart')} />
            <RegionalSales onDrillDown={() => handleDrillDown('regional')} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CustomerOverview onDrillDown={(customerId) => handleDrillDown('customer', customerId)} />
            <PipelineAnalysis onDrillDown={() => handleDrillDown('pipeline')} />
          </div>
        </>
      );
    }
    
    // Placeholder for other pages
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-700 mb-2">{getTitleByPage().title}</h3>
          <p className="text-gray-500">该功能正在开发中，敬请期待...</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6">
          <Header 
            title={getTitleByPage().title} 
            description={getTitleByPage().description} 
          />
          <div className="dashboard-section">
            {renderContent()}
          </div>
        </div>
      </div>
      
      <DrilldownModal 
        open={drilldownOpen} 
        onClose={() => setDrilldownOpen(false)}
        section={drilldownSection}
        data={drilldownData}
      />
    </div>
  );
};

export default Index;
