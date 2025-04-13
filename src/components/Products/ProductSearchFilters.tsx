
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverTrigger, 
  PopoverContent
} from '@/components/ui/popover';
import { Filter, Search, X, ChevronDown } from 'lucide-react';

interface ProductSearchFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  isFiltering: boolean;
  setIsFiltering: (isFiltering: boolean) => void;
  uniqueCategories: string[];
  clearFilters: () => void;
}

const ProductSearchFilters: React.FC<ProductSearchFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  isFiltering,
  setIsFiltering,
  uniqueCategories,
  clearFilters
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="搜索产品..."
            className="pl-10 w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              onClick={() => setSearchQuery('')}
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter size={18} />
              筛选
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56">
            <div className="space-y-4">
              <h4 className="font-medium">分类</h4>
              <div className="flex flex-wrap gap-2">
                {uniqueCategories.map((category) => (
                  <Badge
                    key={category}
                    variant={categoryFilter === category ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      setCategoryFilter(category);
                      setIsFiltering(true);
                    }}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        {(searchQuery || categoryFilter) && (
          <Button variant="ghost" onClick={clearFilters} className="flex items-center gap-2">
            <X size={18} />
            清除筛选
          </Button>
        )}
      </div>
      
      {isFiltering && categoryFilter && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">筛选条件:</span>
          <Badge className="flex items-center gap-1">
            {categoryFilter}
            <button onClick={() => setCategoryFilter(null)}>
              <X size={14} />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ProductSearchFilters;
