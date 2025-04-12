
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { 
  ChevronDown,
  Calendar,
  BarChart3,
  LineChart
} from 'lucide-react';

const data = [
  { name: '1月', 目标: 400000, 实际: 350000 },
  { name: '2月', 目标: 300000, 实际: 280000 },
  { name: '3月', 目标: 350000, 实际: 390000 },
  { name: '4月', 目标: 450000, 实际: 480000 },
  { name: '5月', 目标: 400000, 实际: 380000 },
  { name: '6月', 目标: 500000, 实际: 520000 },
  { name: '7月', 目标: 550000, 实际: 620000 },
  { name: '8月', 目标: 550000, 实际: 510000 },
  { name: '9月', 目标: 450000, 实际: 490000 },
  { name: '10月', 目标: 550000, 实际: 570000 },
  { name: '11月', 目标: 600000, 实际: 640000 },
  { name: '12月', 目标: 700000, 实际: 750000 }
];

interface SalesChartProps {
  onDrillDown: () => void;
}

const SalesChart: React.FC<SalesChartProps> = ({ onDrillDown }) => {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-header">
        <h3>销售趋势</h3>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Calendar size={16} />
            <span>年度</span>
            <ChevronDown size={16} />
          </Button>
          <Button size="sm" variant="ghost">
            <BarChart3 size={16} />
          </Button>
          <Button size="sm" variant="ghost">
            <LineChart size={16} />
          </Button>
        </div>
      </div>
      <div className="chart-container drill-down-card" onClick={onDrillDown}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" />
            <YAxis 
              tickFormatter={(value) => `${value / 10000}万`}
            />
            <Tooltip 
              formatter={(value) => [`¥${value.toLocaleString()}`, undefined]}
              labelFormatter={(name) => `${name} 销售数据`}
            />
            <Legend />
            <Bar dataKey="实际" fill="#7c3aed" />
            <Bar dataKey="目标" fill="#93c5fd" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-end mt-3">
        <Button variant="link" className="text-dashboard-purple" onClick={onDrillDown}>
          查看详情
        </Button>
      </div>
    </div>
  );
};

export default SalesChart;
