
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketDistributionProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export const MarketDistributionChart: React.FC<MarketDistributionProps> = ({ data }) => {
  // 确保数据存在且是数组
  const topMarkets = Array.isArray(data) ? data.slice(0, 10) : [];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>地区分布（每人每天只记录一次）</CardTitle>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={topMarkets}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value: number) => [`${value} 独立访客数`, '访客数']}
              labelFormatter={(name) => `地区: ${name}`}
            />
            <Bar dataKey="value" fill="#8884d8" name="独立访客数" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
