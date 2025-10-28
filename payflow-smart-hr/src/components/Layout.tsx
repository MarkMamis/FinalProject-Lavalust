import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, Clock, DollarSign, LogOut, Building2, CalendarDays } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  // Role-based navigation
  const allNavigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, roles: ['admin', 'hr'] },
    { name: 'Employees', href: '/employees', icon: Users, roles: ['admin', 'hr'] },
    { name: 'Attendance', href: '/attendance', icon: Clock, roles: ['admin', 'hr', 'employee'] },
    { name: 'Payroll', href: '/payroll', icon: DollarSign, roles: ['admin', 'hr', 'employee'] },
    { name: 'Schedule', href: '/schedule', icon: CalendarDays, roles: ['admin', 'hr', 'employee'] },
    { name: 'Departments', href: '/departments', icon: Building2, roles: ['admin'] },
  ];

  const navigation = allNavigation.filter(item =>
    // if user or role is not yet available, hide role-restricted items
    Boolean(user?.role) && item.roles.includes(user!.role as string)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border px-6">
            <DollarSign className="mr-2 h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">PayFlow HR</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {((user?.name && user.name.charAt(0)) || (user?.email && user.email.charAt(0)) || 'U')}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-foreground">{user?.name ?? user?.email ?? 'User'}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.role ?? ''}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm" className="w-full">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
