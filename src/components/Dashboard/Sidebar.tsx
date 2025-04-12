
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, BarChart3, Users, ShoppingCart, 
  Target, Settings, ChevronLeft, ChevronRight,
  PieChart, MapPin, Calendar, HelpCircle
} from 'lucide-react';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active = false, 
  onClick 
}) => {
  return (
    <div 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
        active 
          ? "bg-dashboard-purple text-white" 
          : "hover:bg-gray-100 text-gray-700"
      )}
      onClick={onClick}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );
};

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarItems = [
    { icon: LayoutDashboard, label: '概览', id: 'overview' },
    { icon: BarChart3, label: '销售业绩', id: 'performance' },
    { icon: Users, label: '客户分析', id: 'customers' },
    { icon: ShoppingCart, label: '产品销售', id: 'products' },
    { icon: Target, label: '销售漏斗', id: 'pipeline' },
    { icon: MapPin, label: '区域分析', id: 'regions' },
    { icon: PieChart, label: '销售渠道', id: 'channels' },
    { icon: Calendar, label: '时间趋势', id: 'trends' }
  ];

  const bottomItems = [
    { icon: Settings, label: '设置', id: 'settings' },
    { icon: HelpCircle, label: '帮助', id: 'help' }
  ];

  return (
    <div 
      className={cn(
        "h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-gray-200">
        {!collapsed && (
          <h2 className="text-xl font-bold text-dashboard-purple">销售数据中心</h2>
        )}
        <button 
          className="p-1 rounded-full hover:bg-gray-100"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={collapsed ? '' : item.label}
            active={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </div>

      <div className="p-3 border-t border-gray-200 space-y-1">
        {bottomItems.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={collapsed ? '' : item.label}
            active={activePage === item.id}
            onClick={() => setActivePage(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
