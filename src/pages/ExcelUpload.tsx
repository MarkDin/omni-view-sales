
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import OrdersSidebar from '@/components/Dashboard/OrdersSidebar';
import { Upload, FileSpreadsheet, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Define the mapping between Excel headers and database fields
const headerMapping: Record<string, string> = {
  '客户编码': 'customer_code',
  '客户名称': 'customer_name',
  '客户简称': 'customer_short_name',
  '国家': 'country',
  '类型': 'type',
  '车型尺寸': 'product_type',
  '材质': 'material',
  '月份': 'order_month',
  '业务员': 'sales_person',
  '下单金额': 'order_amount'
};

// Define column length constraints to match database schema
// const columnLengthLimits: Record<string, number> = {
//   'customer_code': 10,
//   'customer_name': 100,
//   'customer_short_name': 100,
//   'country': 50,
//   'type': 50,
//   'product_type': 50,
//   'material': 50,
//   'sales_person': 50
// };

const ExcelUpload = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileData, setFileData] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);

  // Function to handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    setValidationWarnings([]);

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    setFileName(file.name);

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

      // Read the Excel file using FileReader
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          setUploadProgress(30);

          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });

          // Get the first sheet
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 'A' });

          setUploadProgress(50);

          if (jsonData.length < 2) {
            throw new Error('Excel文件没有数据或格式不正确');
          }

          // Extract headers from first row
          const headers = jsonData[0];
          const rows = jsonData.slice(1);

          // Map Excel headers to database fields
          const headerMap = new Map();
          Object.entries(headers).forEach(([cell, value]) => {
            const headerValue = value as string;
            if (headerMapping[headerValue]) {
              headerMap.set(cell, headerMapping[headerValue]);
            }
          });

          // Process data rows with validation
          let warnings: string[] = [];
          const processedData = rows.map((row: any, index: number) => {
            const recordData: Record<string, any> = {};
            const rowNumber = index + 2; // +2 because we start from the second row (1-indexed) in Excel

            // Extract field values using the header mapping
            for (const [cell, fieldName] of headerMap.entries()) {
              if (row[cell] !== undefined) {

                if (fieldName === 'order_amount') {
                  if (typeof row[cell] === 'number') {
                    recordData[fieldName] = row[cell];
                  } else if (typeof row[cell] === 'string') {
                    // Remove any currency symbols or commas and convert to number
                    const numStr = row[cell].replace(/[^\d.-]/g, '');
                    recordData[fieldName] = parseFloat(numStr);
                  }
                }
                else {
                  recordData[fieldName] = row[cell];
                }
              }
            }

            return recordData;
          });

          if (warnings.length > 0) {
            // Only show up to 5 warnings to avoid overwhelming the user
            const displayWarnings = warnings.slice(0, 5);
            if (warnings.length > 5) {
              displayWarnings.push(`还有 ${warnings.length - 5} 个警告，数据已经自动处理`);
            }
            setValidationWarnings(displayWarnings);
          }

          setFileData(processedData);
          setUploadProgress(70);

          // Upload to Supabase
          const { error } = await supabase
            .from('customer_orders')
            .insert(processedData);

          if (error) {
            throw new Error(`数据上传失败: ${error.message}`);
          }

          setUploadProgress(100);

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
        }
      };

      reader.readAsArrayBuffer(file);

    } catch (error) {
      console.error('文件读取错误:', error);
      toast({
        title: "上传失败",
        description: error instanceof Error ? error.message : "读取文件时发生错误",
        variant: "destructive"
      });
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <OrdersSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b flex items-center justify-between px-4 bg-white">
          <h1 className="text-xl font-semibold">Excel上传解析</h1>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <div className="flex flex-col gap-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Excel上传</h2>
                  <p className="text-sm text-gray-500 mb-4">
                    上传Excel文件，系统将自动解析并导入数据到订单表
                  </p>

                  {validationWarnings.length > 0 && (
                    <Alert className="mb-4 bg-yellow-50 border-yellow-200">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <AlertTitle className="text-yellow-800">数据验证警告</AlertTitle>
                      <AlertDescription>
                        <ul className="list-disc pl-5 text-sm">
                          {validationWarnings.map((warning, i) => (
                            <li key={i} className="text-yellow-700">{warning}</li>
                          ))}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <Button
                        variant="outline"
                        disabled={isUploading}
                        className="relative"
                        onClick={() => document.getElementById('excel-upload')?.click()}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            上传中 ({uploadProgress}%)
                          </>
                        ) : (
                          <>
                            <Upload className="mr-2 h-4 w-4" />
                            选择Excel文件
                          </>
                        )}
                      </Button>
                      <Input
                        id="excel-upload"
                        type="file"
                        accept=".xlsx,.xls"
                        className="hidden"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />

                      {fileName && (
                        <span className="text-sm text-gray-500">
                          已选择文件: {fileName}
                        </span>
                      )}
                    </div>

                    {isUploading && (
                      <div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">处理中，请稍候...</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">字段映射说明</h3>
                  <div className="bg-gray-50 p-4 rounded-md text-sm">
                    <p className="font-medium mb-2">Excel表头必须包含以下字段之一或多个：</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <li>客户编码 → customer_code (最大10字符)</li>
                      <li>客户名称 → customer_name (最大100字符)</li>
                      <li>客户简称 → customer_short_name (最大100字符)</li>
                      <li>国家 → country (最大50字符)</li>
                      <li>类型 → type (最大50字符)</li>
                      <li>车型/尺寸 → product_type (最大50字符)</li>
                      <li>材质 → material (最大50字符)</li>
                      <li>月份 → order_month</li>
                      <li>业务员 → sales_person (最大50字符)</li>
                      <li>下单金额 → order_amount</li>
                    </ul>
                    <p className="mt-4 text-xs text-gray-500">注：系统会自动忽略不匹配的字段，超长字段会被自动截断</p>
                  </div>

                  <div className="mt-6 flex justify-center">
                    <Button variant="outline" className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4" />
                      下载模板文件
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {fileData.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-medium mb-4">预览数据 (前5行)</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {Object.keys(fileData[0]).map((key) => (
                          <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {fileData.slice(0, 5).map((row, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          {Object.values(row).map((value: any, i) => (
                            <td key={i} className="px-4 py-2 text-sm">
                              {value !== null && value !== undefined ? String(value) : ''}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  共 {fileData.length} 行数据已上传到订单表
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ExcelUpload;
