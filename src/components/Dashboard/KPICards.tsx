
import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  ShoppingCart, Target, BarChart2, Percent 
} from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, onClick }) => {
  const isPositive = change > 0;
  const changeText = `${isPositive ? '+' : ''}${change}%`;
  
  return (
    <div 
      className="dashboard-card drill-down-card"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="kpi-label">{title}</p>
          <p className="kpi-value">{value}</p>
          <p className={`kpi-trend ${isPositive ? 'kpi-trend-up' : 'kpi-trend-down'}`}>
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <span className="ml-1">{changeText} vs 上月</span>
          </p>
        </div>
        <div className="flex items-center justify-center p-3 rounded-full bg-dashboard-lightPurple bg-opacity-20">
          {icon}
        </div>
      </div>
    </div>
  );
};

interface KPICardsProps {
  onDrillDown: (section: string) => void;
}

const KPICards: React.FC<KPICardsProps> = ({ onDrillDown }) => {
  const kpis = [
    {
      title: '本月销售额',
      value: '¥1,458,200',
      change: 12.5,
      icon: <DollarSign size={24} className="text-dashboard-blue" />,
      id: 'revenue'
    },
    {
      title: '新增客户',
      value: '48',
      change: 8.2,
      icon: <Users size={24} className="text-dashboard-purple" />,
      id: 'customers'
    },
    {
      title: '订单数量',
      value: '256',
      change: 5.1,
      icon: <ShoppingCart size={24} className="text-dashboard-accent" />,
      id: 'orders'
    },
    {
      title: '平均客单价',
      value: '¥5,696',
      change: -2.4,
      icon: <BarChart2 size={24} className="text-dashboard-gray" />,
      id: 'aov'
    },
    {
      title: '转化率',
      value: '24%',
      change: 3.8,
      icon: <Percent size={24} className="text-green-500" />,
      id: 'conversion'
    },
    {
      title: '目标完成度',
      value: '78%',
      change: 4.5,
      icon: <Target size={24} className="text-blue-500" />,
      id: 'target'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => (
        <KPICard
          key={kpi.id}
          title={kpi.title}
          value={kpi.value}
          change={kpi.change}
          icon={kpi.icon}
          onClick={() => onDrillDown(kpi.id)}
        />
      ))}
    </div>
  );
};

export default KPICards;
