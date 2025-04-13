
import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { ProductData } from '@/types/product';

interface ProductsTableProps {
  products: ProductData[];
  handleProductClick: (product: ProductData) => void;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ products, handleProductClick }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>产品名称</TableHead>
            <TableHead>类别</TableHead>
            <TableHead className="text-right">价格</TableHead>
            <TableHead className="text-right">库存</TableHead>
            <TableHead className="text-right">销售额</TableHead>
            <TableHead className="text-right">增长率</TableHead>
            <TableHead className="text-right">利润率</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow 
              key={product.id} 
              className="cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <TableCell className="font-medium">{product.name || 'Unknown'}</TableCell>
              <TableCell>
                <Badge variant="outline">{product.category || 'Uncategorized'}</Badge>
              </TableCell>
              <TableCell className="text-right">¥{product.price}</TableCell>
              <TableCell className="text-right">{product.inventory ?? 0}</TableCell>
              <TableCell className="text-right">¥{product.sales?.toLocaleString() ?? 0}</TableCell>
              <TableCell className="text-right">
                <span className={product.growth && product.growth > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.growth ? `${product.growth}%` : '0%'}
                </span>
              </TableCell>
              <TableCell className="text-right">{product.margin ?? 0}%</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={(e) => {
                  e.stopPropagation();
                  handleProductClick(product);
                }}>
                  <MoreHorizontal size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductsTable;
