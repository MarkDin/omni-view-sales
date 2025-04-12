
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from '@/components/ui/button';
import { ChevronDown, BarChart3 } from 'lucide-react';

const data = [
  { name: '线索获取', value: 850, color: '#c4b5fd' },
  { name: '初步接触', value: 620, color: '#a78bfa' },
  { name: '需求挖掘', value: 440, color: '#8b5cf6' },
  { name: '方案制定', value: 315, color: '#7c3aed' },
  { name: '商务谈判', value: 180, color: '#6d28d9' },
  { name: '签约成交', value: 110, color: '#5b21b6' },
];

interface PipelineAnalysisProps {
  onDrillDown: () => void;
}

const PipelineAnalysis: React.FC<PipelineAnalysisProps> = ({ onDrillDown }) => {
  return (
    <div className="dashboard-card h-full">
      <div className="dashboard-card-header">
        <h3>销售漏斗</h3>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <span>本季度</span>
          <ChevronDown size={16} />
        </Button>
      </div>

      <div className="chart-container drill-down-card" onClick={onDrillDown}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              scale="band" 
            />
            <Tooltip 
              formatter={(value) => [`${value} 个客户`, '数量']} 
            />
            <Bar 
              dataKey="value" 
              radius={[0, 4, 4, 0]}
              label={{ position: 'right', formatter: (value: number) => value }}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-between mt-3">
        <div className="text-sm text-gray-500">
          转化率: <span className="font-medium">12.9%</span>
        </div>
        <Button variant="link" className="text-dashboard-purple" onClick={onDrillDown}>
          查看详情
        </Button>
      </div>
    </div>
  );
};

export default PipelineAnalysis;
