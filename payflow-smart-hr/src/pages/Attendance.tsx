import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, LogIn, LogOut } from 'lucide-react';
import { mockAttendance, mockEmployees } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [clockedIn, setClockedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);

  const getEmployeeName = (employeeId: string) => {
    return mockEmployees.find(e => e.id === employeeId)?.name || 'Unknown';
  };

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
  };

  const handleClockOut = () => {
    if (checkInTime && user?.employeeId) {
      const checkOutTime = new Date();
      const newRecord = {
        id: `att${Date.now()}`,
        employeeId: user.employeeId,
        date: new Date().toISOString(),
        checkIn: checkInTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        checkOut: checkOutTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: 'present' as const,
      };
      setTodayAttendance([newRecord, ...todayAttendance]);
      setClockedIn(false);
      setCheckInTime(null);
      setElapsedTime(0);
    }
  };

  // Filter attendance based on role
  const filteredAttendance = user?.role === 'employee'
    ? [...todayAttendance, ...mockAttendance.filter(a => a.employeeId === user.employeeId)]
    : mockAttendance;

  const statusColors = {
    present: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
    late: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
    absent: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
    'half-day': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {user?.role === 'employee' ? 'My Attendance' : 'Attendance Tracking'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'employee' 
              ? 'View your attendance records and working hours'
              : 'Monitor employee attendance and working hours'}
          </p>
        </div>

        {user?.role === 'employee' && (
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
        )}

        {user?.role !== 'employee' && (
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Present Today
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
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
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
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
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">09:03</div>
                <p className="text-xs text-muted-foreground">Average time</p>
              </CardContent>
            </Card>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {user?.role === 'employee' ? 'My Attendance Records' : "Today's Attendance"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
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
