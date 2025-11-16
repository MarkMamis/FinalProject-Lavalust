import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, LogIn, LogOut } from 'lucide-react';
import { mockAttendance, mockEmployees } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const { toast } = useToast();

  const getEmployeeName = (employeeId: string) => {
    return mockEmployees.find(e => e.id === employeeId)?.name || 'Unknown';
  };

  useEffect(() => {
    fetch('/api/attendance', { credentials: 'include' })
      .then(async (res) => {
        const data = await res.json().catch(() => null);
        if (res.ok && data && Array.isArray(data.attendance)) {
          setTodayAttendance(data.attendance.map((r: any) => ({
            id: String(r.id),
            employeeId: String(r.employee_id),
            date: r.attendance_date,
            checkIn: r.check_in ? new Date(r.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
            checkOut: r.check_out ? new Date(r.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
            status: r.status
          })));
        }
      }).catch(() => {});
  }, []);

  const statusColors = {
    present: 'bg-secondary/10 text-secondary border-secondary/20',
    late: 'bg-warning/10 text-warning border-warning/20',
    absent: 'bg-destructive/10 text-destructive border-destructive/20',
    'half-day': 'bg-primary/10 text-primary border-primary/20',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Attendance Tracking</h1>
          <p className="text-muted-foreground">Monitor employee attendance and working hours</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Present Today
              </CardTitle>
              <Calendar className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {mockAttendance.filter(a => a.status === 'present').length}
              </div>
              <p className="text-xs text-muted-foreground">Out of {mockAttendance.length} employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Late Arrivals
              </CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {mockAttendance.filter(a => a.status === 'late').length}
              </div>
              <p className="text-xs text-muted-foreground">Today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Check-in
              </CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">09:03</div>
              <p className="text-xs text-muted-foreground">Average time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {getEmployeeName(record.employeeId).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{getEmployeeName(record.employeeId)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Check In</p>
                      <p className="font-medium text-foreground">{record.checkIn}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Check Out</p>
                      <p className="font-medium text-foreground">{record.checkOut || '-'}</p>
                    </div>
                    <Badge className={statusColors[record.status]}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
