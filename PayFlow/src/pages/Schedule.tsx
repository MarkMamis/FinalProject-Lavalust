import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { mockEmployees } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { AddScheduleDialog } from '@/components/AddScheduleDialog';

interface Schedule {
  id: string;
  employeeId: string;
  date: string;
  startTime: string;
  endTime: string;
  shift: string;
}

const initialSchedules: Schedule[] = [
  {
    id: 'sch1',
    employeeId: 'emp1',
    date: '2025-11-01',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'Morning',
  },
  {
    id: 'sch2',
    employeeId: 'emp2',
    date: '2025-11-01',
    startTime: '09:00',
    endTime: '17:00',
    shift: 'Morning',
  },
  {
    id: 'sch3',
    employeeId: 'emp3',
    date: '2025-11-01',
    startTime: '14:00',
    endTime: '22:00',
    shift: 'Afternoon',
  },
];

export default function Schedule() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<Schedule[]>(initialSchedules);

  const getEmployeeName = (employeeId: string) => {
    return mockEmployees.find(e => e.id === employeeId)?.name || 'Unknown';
  };

  const handleAddSchedule = (scheduleData: any) => {
    const newSchedule: Schedule = {
      id: `sch${schedules.length + 1}`,
      ...scheduleData,
    };
    setSchedules([...schedules, newSchedule]);
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    setSchedules(schedules.filter(s => s.id !== scheduleId));
  };

  // Filter schedules based on role
  const filteredSchedules = user?.role === 'employee'
    ? schedules.filter(s => s.employeeId === user.employeeId)
    : schedules;

  const canManageSchedule = user?.role === 'admin' || user?.role === 'hr';

  const shiftColors = {
    Morning: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
    Afternoon: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
    Evening: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    Night: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {user?.role === 'employee' ? 'My Schedule' : 'Work Schedule'}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === 'employee'
                ? 'View your upcoming work schedule'
                : 'Manage employee work schedules'}
            </p>
          </div>
          {canManageSchedule && (
            <AddScheduleDialog onAddSchedule={handleAddSchedule} subjects={[]} rooms={[]} sections={[]} />
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchedules.map((schedule) => (
            <Card key={schedule.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {getEmployeeName(schedule.employeeId).charAt(0)}
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {getEmployeeName(schedule.employeeId)}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(schedule.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  {canManageSchedule && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSchedule(schedule.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Working Hours</span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold text-foreground">
                    {schedule.startTime} - {schedule.endTime}
                  </div>
                  <Badge className={shiftColors[schedule.shift as keyof typeof shiftColors]}>
                    {schedule.shift} Shift
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchedules.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground mb-2">No schedules found</p>
              <p className="text-sm text-muted-foreground">
                {canManageSchedule
                  ? 'Add a new schedule to get started'
                  : 'Your schedule will appear here once created'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
