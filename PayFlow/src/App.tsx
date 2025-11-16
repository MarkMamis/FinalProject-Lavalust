import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Auth from "./pages/Auth";
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import { RoleBasedRoute } from './components/RoleBasedRoute';
import Schedule from './pages/Schedule';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminEmployees from './pages/admin/Employees';
import AdminAttendance from './pages/admin/Attendance';
import AdminPayroll from './pages/admin/Payroll';
import AdminPayrollPeriods from './pages/admin/PayrollPeriods';
import AdminDepartments from './pages/admin/Departments';
import AdminSubjects from './pages/admin/Subjects';
import AdminSchedules from './pages/admin/Schedules';
import AdminRooms from './pages/admin/Rooms';
import AdminSalaryGrades from './pages/admin/SalaryGrades';
import AdminDeductions from './pages/admin/Deductions';

// Employee Pages
import EmployeeDashboard from './pages/employee/Dashboard';
import EmployeeSchedule from './pages/employee/Schedule';
import EmployeeAttendance from './pages/employee/Attendance';
import EmployeePayroll from './pages/employee/Payroll';

const queryClient = new QueryClient();

// Smart home route that redirects based on user role
function HomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  // Redirect to appropriate dashboard based on role
  if (user?.role === 'employee') {
    return <Navigate to="/employee" />;
  }

  // Admin and HR go to admin dashboard
  if (user?.role === 'admin' || user?.role === 'hr') {
    return <Navigate to="/admin-dashboard" />;
  }

  // Not authenticated
  return <Navigate to="/auth" />;
}

// Admin Dashboard wrapper
function AdminDashboardPage() {
  return (
    <RoleBasedRoute allowedRoles={['admin', 'hr']}>
      <AdminDashboard />
    </RoleBasedRoute>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/auth" element={<Auth />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Smart Home Route - redirects based on role */}
            <Route path="/" element={<HomePage />} />

            {/* Admin & HR Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
            <Route path="/employees" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminEmployees /></RoleBasedRoute>} />
            <Route path="/attendance" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminAttendance /></RoleBasedRoute>} />
            <Route path="/payroll" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminPayroll /></RoleBasedRoute>} />
            <Route path="/payroll-periods" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminPayrollPeriods /></RoleBasedRoute>} />
            <Route path="/deductions" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminDeductions /></RoleBasedRoute>} />
            <Route path="/salary-grades" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminSalaryGrades /></RoleBasedRoute>} />
            <Route path="/departments" element={<RoleBasedRoute allowedRoles={['admin']}><AdminDepartments /></RoleBasedRoute>} />
            <Route path="/subjects" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminSubjects /></RoleBasedRoute>} />
            <Route path="/schedules" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminSchedules /></RoleBasedRoute>} />
            <Route path="/rooms" element={<RoleBasedRoute allowedRoles={['admin', 'hr']}><AdminRooms /></RoleBasedRoute>} />
            <Route path="/schedule" element={<RoleBasedRoute allowedRoles={['admin', 'hr', 'employee']}><Schedule /></RoleBasedRoute>} />

            {/* Employee Routes */}
            <Route path="/employee" element={<RoleBasedRoute allowedRoles={['employee']}><EmployeeDashboard /></RoleBasedRoute>} />
            <Route path="/employee/schedule" element={<RoleBasedRoute allowedRoles={['employee']}><EmployeeSchedule /></RoleBasedRoute>} />
            <Route path="/employee/attendance" element={<RoleBasedRoute allowedRoles={['employee']}><EmployeeAttendance /></RoleBasedRoute>} />
            <Route path="/employee/payroll" element={<RoleBasedRoute allowedRoles={['employee']}><EmployeePayroll /></RoleBasedRoute>} />

            {/* Catch All */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
