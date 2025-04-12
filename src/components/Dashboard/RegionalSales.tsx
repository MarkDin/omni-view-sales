
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Button } from '@/components/ui/button';

const data = [
  { name: '华东区', value: 3800000 },
  { name: '华北区', value: 2500000 },
  { name: '华南区', value: 2800000 },
  { name: '西南区', value: 1500000 },
  { name: '西北区', value: 900000 }
];

const COLORS = ['#7c3aed', '#2563eb', '#f97316', '#8b5cf6', '#93c5fd'];

interface RegionalSalesProps {
  onDrillDown: () => void;
}

const RegionalSales: React.FC<RegionalSalesProps> = ({ onDrillDown }) => {
  return (
    <div className="dashboard-card h-full">
      <div className="dashboard-card-header">
        <h3>区域销售分布</h3>
      </div>
      <div className="chart-container drill-down-card" onClick={onDrillDown}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`¥${value.toLocaleString()}`, '销售额']}
            />
            <Legend />
          </PieChart>
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

export default RegionalSales;
