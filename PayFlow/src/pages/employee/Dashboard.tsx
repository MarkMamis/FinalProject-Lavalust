import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertCircle, DollarSign, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockAttendance, mockEmployees, mockPayroll } from '@/lib/mockData';

interface AttendanceStats {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalHours: number;
}

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AttendanceStats>({
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    totalHours: 0,
  });
  const [recentAttendance, setRecentAttendance] = useState<any[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to get employee stats
    setTimeout(() => {
      // Filter attendance records for current employee
      const employeeAttendance = mockAttendance.filter(
        (a) => a.employeeId === user?.employeeId
      );

      // Calculate stats
      const present = employeeAttendance.filter((a) => a.status === 'present').length;
      const absent = employeeAttendance.filter((a) => a.status === 'absent').length;
      const late = employeeAttendance.filter((a) => a.status === 'late').length;

      // Get recent 5 records
      const recent = employeeAttendance.slice(-5).reverse();

      // Calculate total earnings
      const earnings = mockPayroll
        .filter((p) => p.employeeId === user?.employeeId)
        .reduce((sum, p) => sum + p.netSalary, 0);

      setStats({
        presentDays: present,
        absentDays: absent,
        lateDays: late,
        totalHours: employeeAttendance.length * 8, // Assuming 8-hour workdays
      });
      setRecentAttendance(recent);
      setTotalEarnings(earnings);
      setLoading(false);
    }, 500);
  }, [user?.employeeId]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present':
        return 'bg-emerald-100 text-emerald-900';
      case 'absent':
        return 'bg-red-100 text-red-900';
      case 'late':
        return 'bg-amber-100 text-amber-900';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome, {user?.name}!</h1>
          <p className="text-muted-foreground mt-2">Here's your work overview for this month.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Present Days */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <Clock className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.presentDays}</div>
              <p className="text-xs text-muted-foreground">Days worked</p>
            </CardContent>
          </Card>

          {/* Absent Days */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Absent Days</CardTitle>
              <AlertCircle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{stats.absentDays}</div>
              <p className="text-xs text-muted-foreground">Days missed</p>
            </CardContent>
          </Card>

          {/* Late Days */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Days</CardTitle>
              <Calendar className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{stats.lateDays}</div>
              <p className="text-xs text-muted-foreground">Times tardy</p>
            </CardContent>
          </Card>

          {/* Total Earnings */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">₱{totalEarnings.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Attendance */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : recentAttendance.length > 0 ? (
              <div className="space-y-4">
                {recentAttendance.map((attendance, index) => (
                  <div key={index} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{new Date(attendance.date).toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {attendance.check_in ? new Date(attendance.check_in).toLocaleTimeString() : 'No check-in'} - {attendance.check_out ? new Date(attendance.check_out).toLocaleTimeString() : 'No check-out'}
                      </p>
                    </div>
                    <Badge className={getStatusColor(attendance.status)}>
                      {attendance.status.charAt(0).toUpperCase() + attendance.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 py-4">No attendance records found</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Work Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Hours Worked</p>
                <p className="text-2xl font-bold text-primary">{stats.totalHours}h</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Attendance Rate</p>
                <p className="text-2xl font-bold text-secondary">
                  {stats.presentDays + stats.absentDays > 0
                    ? Math.round((stats.presentDays / (stats.presentDays + stats.absentDays)) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
