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
  type AttendanceStatus = 'present' | 'late' | 'absent' | 'half-day';
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const { toast } = useToast();

  // Stopwatch effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (clockedIn && checkInTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - checkInTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [clockedIn, checkInTime]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleClockIn = () => {
    const now = new Date();
    setCheckInTime(now);
    setClockedIn(true);
    setElapsedTime(0);
    if (user?.employeeId) {
      // Client-side guard: allow clock-in between 06:00 and 09:00 (server will also enforce)
      const hh = now.getHours();
      const mm = now.getMinutes();
      const currentTime = `${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}`;
      if (currentTime < '06:00' || currentTime > '08:59') {
        setClockedIn(false);
        setCheckInTime(null);
        toast({ title: 'Clock-in not allowed', description: 'Clock-in is allowed only between 06:00 and 09:00', variant: 'destructive' });
        return;
      }

      fetch('/api/attendance/clockin', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: user.employeeId })
      }).then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setClockedIn(false);
          setCheckInTime(null);
          toast({ title: 'Clock-in failed', description: data?.error || 'Server error', variant: 'destructive' });
        } else {
          toast({ title: 'Clocked in', description: 'Your check-in was recorded' });
        }
      }).catch(() => {
        setClockedIn(false);
        setCheckInTime(null);
        toast({ title: 'Network error', description: 'Failed to reach server', variant: 'destructive' });
      });
    }
  };

  const handleClockOut = () => {
    if (checkInTime && user?.employeeId) {
      const checkOutTime = new Date();
      const newRecord: {
        id: string;
        employeeId: string | number;
        date: string;
        checkIn: string | null;
        checkOut: string | null;
        status: AttendanceStatus;
      } = {
        id: `att${Date.now()}`,
        employeeId: user.employeeId,
        date: new Date().toISOString(),
        checkIn: checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        checkOut: checkOutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'present',
      };
      // client-side determine tentative status: if clock-out before 17:00 -> half-day
      const coH = checkOutTime.getHours();
      if (coH < 17) {
        newRecord.status = 'half-day';
      }
      setTodayAttendance([newRecord, ...todayAttendance]);
      setClockedIn(false);
      setCheckInTime(null);
      setElapsedTime(0);
      fetch('/api/attendance/clockout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employee_id: user.employeeId })
      }).then(async (res) => {
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          toast({ title: 'Clock-out failed', description: data?.error || 'Server error', variant: 'destructive' });
        } else {
          toast({ title: 'Clocked out', description: 'Your check-out was recorded' });
        }
      }).catch(() => {
        toast({ title: 'Network error', description: 'Failed to reach server', variant: 'destructive' });
      });
    }
  };

  useEffect(() => {
    if (user?.employeeId) {
      fetch('/api/attendance/employee?id=' + encodeURIComponent(user.employeeId), { credentials: 'include' })
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
            const today = new Date().toISOString().slice(0, 10);
            const todays = data.attendance.filter((a: any) => a.attendance_date === today);
            if (todays.length && !todays[0].check_out) {
              setClockedIn(true);
              setCheckInTime(todays[0].check_in ? new Date(todays[0].check_in) : new Date());
            }
          }
        }).catch(() => {});
    }
  }, [user?.employeeId]);

  const filteredAttendance = [...todayAttendance, ...mockAttendance.filter(a => a.employeeId === user?.employeeId)];

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
          <h1 className="text-3xl font-bold text-foreground">My Attendance</h1>
          <p className="text-muted-foreground">View your attendance records and working hours</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">Time Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  {clockedIn ? 'Currently working' : 'Not clocked in'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                {clockedIn && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Working Time</p>
                    <p className="text-3xl font-bold text-primary">{formatTime(elapsedTime)}</p>
                  </div>
                )}
                <Button
                  size="lg"
                  onClick={clockedIn ? handleClockOut : handleClockIn}
                  className={clockedIn ? 'bg-destructive hover:bg-destructive/90' : ''}
                >
                  {clockedIn ? (
                    <>
                      <LogOut className="mr-2 h-5 w-5" />
                      Clock Out
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-5 w-5" />
                      Clock In
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
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
