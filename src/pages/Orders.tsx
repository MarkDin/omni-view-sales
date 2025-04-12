
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Upload, FileSpreadsheet, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import * as XLSX from 'xlsx';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';

// Define the type for order data
interface OrderData {
  id: string;
  customer_code?: string;
  customer_name?: string;
  customer_short_name?: string;
  country?: string;
  type?: string;
  product_type?: string;
  size?: string;
  material?: string;
  order_month?: string;
  sales_person?: string;
  order_amount?: number;
}

const Orders = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Query to fetch orders
  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_orders')
        .select('*');
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }
      
      return data as OrderData[];
    }
  });

  // Function to handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      return;
    }
    
    const file = files[0];
    
    // Check if file is an Excel file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "文件格式错误",
        description: "请上传Excel文件（.xlsx或.xls格式）",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      // Upload file to Supabase Storage
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('orders')
        .upload(fileName, file);
      
      if (uploadError) {
        throw new Error('文件上传失败');
      }
      
      setUploadProgress(40);
      
      // Get file URL for processing
      const { data: urlData } = await supabase.storage
        .from('orders')
        .getPublicUrl(fileName);
      
      if (!urlData) {
        throw new Error('无法获取文件URL');
      }
      
      const fileUrl = urlData.publicUrl;
      
      // Fetch and process the Excel file
      const response = await fetch(fileUrl);
      const fileBuffer = await response.arrayBuffer();
      
      setUploadProgress(60);
      
      // Parse Excel file
      const workbook = XLSX.read(fileBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(firstSheet);
      
      setUploadProgress(80);
      
      // Map Excel columns to database fields and filter out invalid fields
      const validFields = [
        'customer_code', 'customer_name', 'customer_short_name', 
        'country', 'type', 'product_type', 'size', 'material', 
        'order_month', 'sales_person', 'order_amount'
      ];
      
      const processedData = jsonData.map((row: any) => {
        const validData: any = {};
        
        Object.keys(row).forEach(key => {
          // Check if the Excel column header matches a valid database field
          if (validFields.includes(key)) {
            // Parse date if it's order_month field
            if (key === 'order_month' && row[key]) {
              try {
                // Try to parse Excel date or string date format
                if (typeof row[key] === 'number') {
                  // Convert Excel date serial number to JS Date
                  const excelEpoch = new Date(1899, 11, 30);
                  const date = new Date(excelEpoch.getTime() + row[key] * 24 * 60 * 60 * 1000);
                  validData[key] = date.toISOString().split('T')[0]; // YYYY-MM-DD format
                } else if (typeof row[key] === 'string') {
                  // Try to parse string date
                  const date = new Date(row[key]);
                  if (!isNaN(date.getTime())) {
                    validData[key] = date.toISOString().split('T')[0];
                  } else {
                    validData[key] = null;
                  }
                } else {
                  validData[key] = null;
                }
              } catch (e) {
                validData[key] = null;
              }
            } else {
              validData[key] = row[key];
            }
          }
        });
        
        return validData;
      });
      
      // Insert data into Supabase
      const { error: insertError } = await supabase
        .from('customer_orders')
        .insert(processedData);
      
      if (insertError) {
        throw new Error('数据插入失败');
      }
      
      setUploadProgress(100);
      
      // Refetch orders list
      refetch();
      
      toast({
        title: "上传成功",
        description: `成功导入 ${processedData.length} 条订单数据`,
      });
      
    } catch (error) {
      console.error('Excel处理错误:', error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "导入数据时发生错误",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset the input field to allow uploading the same file again
      event.target.value = '';
    }
  };
  
  // Format the order amount as currency
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '';
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY'
    }).format(amount);
  };
  
  // Format the date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: 'long'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b flex items-center px-6 bg-white">
          <h1 className="text-xl font-semibold">订单管理</h1>
        </div>
        
        <main className="flex-1 overflow-y-auto p-6">
          {/* Upload Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Excel导入</h3>
                <p className="text-sm text-gray-500 mt-1">
                  上传Excel文件批量导入订单数据
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  disabled={isUploading}
                  className="relative"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      上传中 ({uploadProgress}%)
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      选择文件
                    </>
                  )}
                </Button>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                
                <Button variant="default" disabled={isUploading}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  下载模板
                </Button>
              </div>
            </div>
            
            {isUploading && (
              <div className="mt-4">
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1 text-right">处理中，请稍候...</p>
              </div>
            )}
          </div>
          
          {/* Orders Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-6">订单列表</h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">加载中...</span>
              </div>
            ) : error ? (
              <div className="text-center py-10 text-red-500">
                加载失败，请稍后重试
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                暂无订单数据，请上传Excel文件导入
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>客户编码</TableHead>
                      <TableHead>客户名称</TableHead>
                      <TableHead>国家</TableHead>
                      <TableHead>类型</TableHead>
                      <TableHead>车型</TableHead>
                      <TableHead>材质</TableHead>
                      <TableHead>月份</TableHead>
                      <TableHead>业务员</TableHead>
                      <TableHead className="text-right">下单金额</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell>{order.customer_code || '-'}</TableCell>
                        <TableCell>{order.customer_name || '-'}</TableCell>
                        <TableCell>{order.country || '-'}</TableCell>
                        <TableCell>{order.type || '-'}</TableCell>
                        <TableCell>{order.product_type || '-'}</TableCell>
                        <TableCell>{order.material || '-'}</TableCell>
                        <TableCell>{formatDate(order.order_month)}</TableCell>
                        <TableCell>{order.sales_person || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(order.order_amount)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Orders;
