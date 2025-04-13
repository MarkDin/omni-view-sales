
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Package2, 
  ShoppingBag, 
  Menu, 
  X, 
  FileSpreadsheet,
  LogOut
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';

interface NavLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, icon, label, isActive, onClick }) => {
  return (
    <Link 
      to={to} 
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-purple-100 text-purple-900" 
          : "text-gray-700 hover:bg-gray-100"
      )}
      onClick={onClick}
    >
      <span className={cn(
        "p-1 rounded-md",
        isActive ? "bg-purple-200" : "bg-gray-100"
      )}>
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
};

const OrdersSidebar = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, user } = useAuth();
  
  const navLinks = [
    { path: "/", label: "仪表盘", icon: <Home size={18} /> },
    { path: "/customers", label: "客户", icon: <Users size={18} /> },
    { path: "/products", label: "产品", icon: <Package2 size={18} /> },
    { path: "/orders", label: "订单", icon: <ShoppingBag size={18} /> },
    { path: "/excel-upload", label: "Excel上传", icon: <FileSpreadsheet size={18} /> },
  ];
  
  const renderNavLinks = (onClick?: () => void) => (
    <div className="space-y-1">
      {navLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          icon={link.icon}
          label={link.label}
          isActive={location.pathname === link.path}
          onClick={onClick}
        />
      ))}
    </div>
  );
  
  if (isMobile) {
    return (
      <>
        <div className="h-16 border-b flex items-center justify-between px-4 bg-white">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-bold text-xl">管理系统</span>
          </Link>
          
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-8">
              <div className="mb-8">
                <Link to="/" className="flex items-center gap-2">
                  <span className="font-bold text-xl">管理系统</span>
                </Link>
              </div>
              {renderNavLinks(() => setIsOpen(false))}
              <div className="mt-4">
                <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
                  <LogOut className="mr-2" size={18} />
                  退出登录
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </>
    );
  }
  
  return (
    <div className="w-64 h-screen border-r flex flex-col bg-white">
      <div className="h-16 border-b flex items-center px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-bold text-xl">管理系统</span>
        </Link>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        {renderNavLinks()}
      </div>
      
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={signOut}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrdersSidebar;
