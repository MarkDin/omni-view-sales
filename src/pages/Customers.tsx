
import React from 'react';
import Header from '@/components/Dashboard/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { type Customer } from "@/types/customer";

const Customers = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*');
      if (error) {
        throw new Error(error.message);
      }
      return data as Customer[];
    },
  });

  // 定义渲染列的配置，不使用ColumnDef类型
  const columns = [
    {
      accessorKey: 'name',
      header: '姓名',
    },
    {
      accessorKey: 'company',
      header: '公司',
      cell: ({ row }: { row: { original: Customer } }) => (
        <div className="flex items-center">
          <Avatar className="mr-2 h-4 w-4">
            <AvatarImage src={`https://ui-avatars.com/api/?name=${row.original.company}&size=32`} />
            <AvatarFallback>{row.original.company.substring(0, 2)}</AvatarFallback>
          </Avatar>
          {row.original.company}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: '邮箱',
    },
    {
      accessorKey: 'phone',
      header: '电话',
    },
    {
      accessorKey: 'address',
      header: '地址',
    },
    {
      accessorKey: 'industry',
      header: '行业',
    },
    {
      accessorKey: 'region',
      header: '地区',
    },
    {
      accessorKey: 'last_order',
      header: '上次购买',
      cell: ({ row }: { row: { original: Customer } }) => {
        const value = row.original.last_order;
        return value ? new Date(value).toLocaleDateString() : '暂无购买记录';
      }
    },
    {
      accessorKey: 'purchase_count',
      header: '购买次数',
    },
    {
      accessorKey: 'lifetime_value',
      header: '终身价值',
    },
    {
      accessorKey: 'score',
      header: '客户评分',
    },
    {
      accessorKey: 'status',
      header: '状态',
      cell: ({ row }: { row: { original: Customer } }) => {
        const status = row.original.status;
        let statusText = '未知';
        let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "default";

        switch (status) {
          case 1:
            statusText = '潜在客户';
            badgeVariant = "secondary";
            break;
          case 2:
            statusText = '活跃客户';
            badgeVariant = "default"; // 使用允许的变体类型
            break;
          case 3:
            statusText = '流失客户';
            badgeVariant = "destructive";
            break;
          default:
            statusText = '未知';
            badgeVariant = "outline";
            break;
        }

        return <Badge variant={badgeVariant}>{statusText}</Badge>;
      },
    },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Header title="客户分析" description="查看客户数据和分析" />

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>客户列表</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : error ? (
              <p>Error: {(error as Error).message}</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.accessorKey}>{column.header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.map((customer) => (
                      <TableRow key={customer.id}>
                        {columns.map((column) => (
                          <TableCell key={`${customer.id}-${column.accessorKey}`}>
                            {column.cell ? column.cell({ row: { original: customer } }) : customer[column.accessorKey as keyof Customer]}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Customers;
