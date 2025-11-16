import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, LogIn, LogOut } from 'lucide-react';
// Use real API data instead of mock data
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [payrollPeriods, setPayrollPeriods] = useState<any[]>([]);
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');
  const [isWeekend, setIsWeekend] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const { toast } = useToast();

  const getEmployeeName = (employeeId: string) => {
    const found = employees.find(e => String(e.id) === String(employeeId));
    if (found) return `${found.first_name} ${found.last_name}`;
    return 'Unknown';
  };

  useEffect(() => {
    if (!user) return;

    const fetchEmployees = async () => {
      try {
        const res = await fetch('/api/employees', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json();
        setEmployees(data.employees || []);
      } catch (err) {
        console.error('Error fetching employees', err);
        toast({ title: 'Error', description: 'Failed to load employees', variant: 'destructive' });
      }
    };

    const fetchPeriods = async () => {
      try {
        const res = await fetch('/api/payroll/periods?status=open', { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch payroll periods');
        const data = await res.json();
        setPayrollPeriods(data.data || data.periods || data.period || data || []);
      } catch (err) {
        console.error('Error fetching payroll periods', err);
      }
    };

    fetchEmployees();
    fetchPeriods();
  }, [user]);

  // Fetch attendance whenever selectedPeriodId changes
  useEffect(() => {
    if (!user) return;

    const toIso = (d: Date) => d.toISOString().slice(0, 10);

    const fetchForPeriod = async (start: string, end: string) => {
      try {
        const res = await fetch(`/api/attendance?start=${start}&end=${end}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch attendance');
        const data = await res.json();
        const list = data.attendance || data.data || [];
        setIsWeekend(false);
        setTodayAttendance(list.map((r: any) => ({
          id: String(r.id),
          employeeId: String(r.employee_id),
          date: r.attendance_date || r.date || null,
          checkIn: r.check_in ? new Date(r.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
          checkOut: r.check_out ? new Date(r.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
          status: r.status || 'absent'
        })));
      } catch (err) {
        console.error('Error fetching attendance for period', err);
        toast({ title: 'Error', description: 'Failed to load attendance for period', variant: 'destructive' });
      }
    };

    const fetchForDate = async (dateStr: string) => {
      try {
        const res = await fetch(`/api/attendance?date=${dateStr}`, { credentials: 'include' });
        if (!res.ok) throw new Error('Failed to fetch attendance');
        const data = await res.json();
        const list = data.attendance || data.data || [];
        setIsWeekend(false);
        setTodayAttendance(list.map((r: any) => ({
          id: String(r.id),
          employeeId: String(r.employee_id),
          date: r.attendance_date || r.date || null,
          checkIn: r.check_in ? new Date(r.check_in).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
          checkOut: r.check_out ? new Date(r.check_out).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : null,
          status: r.status || 'absent'
        })));
      } catch (err) {
        console.error('Error fetching attendance', err);
        toast({ title: 'Error', description: 'Failed to load attendance', variant: 'destructive' });
      }
    };

    (async () => {
      if (selectedPeriodId) {
        const p = payrollPeriods.find(pp => String(pp.id) === String(selectedPeriodId));
        if (p && p.start_date && p.end_date) {
          await fetchForPeriod(p.start_date, p.end_date);
          return;
        }
      }

      // If a specific date is selected, use it (date picker); otherwise default to today
      const dateStr = selectedDate || toIso(new Date());
      const dateObj = new Date(dateStr + 'T00:00:00');
      const day = dateObj.getDay(); // 0 = Sunday, 6 = Saturday
      if (day === 0 || day === 6) {
        setTodayAttendance([]);
        setIsWeekend(true);
        return;
      }
      setIsWeekend(false);
      await fetchForDate(dateStr);
    })();
  }, [user, selectedPeriodId, payrollPeriods, selectedDate]);

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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="period-select" className="text-sm font-medium text-muted-foreground">Payroll Period:</label>
            <select
              id="period-select"
              value={selectedPeriodId}
              onChange={(e) => { setSelectedPeriodId(e.target.value); }}
              className="rounded-md border px-3 py-1"
              aria-label="Select payroll period"
            >
              <option value="">-- Today --</option>
              {payrollPeriods.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.start_date} → {p.end_date})</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="date-select" className="text-sm font-medium text-muted-foreground">Date:</label>
            <input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => { setSelectedPeriodId(''); setSelectedDate(e.target.value); }}
              className="rounded-md border px-3 py-1"
              aria-label="Select date"
              min={`${new Date().getFullYear()}-01-01`}
              max={new Date().toISOString().slice(0,10)}
              disabled={!!selectedPeriodId}
            />
            <div className="text-sm text-muted-foreground">Year: {new Date().getFullYear()}</div>
          </div>
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
                  {isWeekend ? '—' : todayAttendance.filter(a => a.status === 'present').length}
                </div>
                <p className="text-xs text-muted-foreground">{isWeekend ? 'No working hours (weekend)' : `Out of ${employees.length} employees`}</p>
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
                {isWeekend ? '—' : todayAttendance.filter(a => a.status === 'late').length}
              </div>
              <p className="text-xs text-muted-foreground">{isWeekend ? 'Weekend' : 'Today'}</p>
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
              <div className="text-2xl font-bold text-primary">
                {(() => {
                  const times = todayAttendance
                    .map(a => a.checkIn)
                    .filter(Boolean)
                    .map((t: string) => {
                      const parts = t.split(':');
                      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                    });
                  if (times.length === 0) return '—';
                  const avg = Math.round(times.reduce((s: number, v: number) => s + v, 0) / times.length);
                  const hh = Math.floor(avg / 60).toString().padStart(2, '0');
                  const mm = (avg % 60).toString().padStart(2, '0');
                  return `${hh}:${mm}`;
                })()}
              </div>
              <p className="text-xs text-muted-foreground">Average time</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            {isWeekend ? (
              <div className="py-8 text-center text-muted-foreground">No working hours for weekends.</div>
            ) : (
              <div className="space-y-4">
                {todayAttendance.map((record) => (
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
                          {record.date ? new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }) : '—'}
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
                      <Badge className={statusColors[record.status] || statusColors.absent}>
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
