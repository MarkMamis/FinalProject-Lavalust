import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Schedule {
  id: string;
  subject_id: string;
  employee_id: string;
  section_id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  room_code: string;
  is_active: boolean;
  subject_code?: string;
  subject_name?: string;
  teacher_firstname?: string;
  teacher_lastname?: string;
  section_name?: string;
  room_name?: string;
}

interface ScheduleCalendarProps {
  schedules: Schedule[];
  onDeleteSchedule: (id: string) => void;
  canManageSchedules: boolean;
}

export function ScheduleCalendar({ schedules, onDeleteSchedule, canManageSchedules }: ScheduleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get the first day of the month
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  // Get the last day of the month
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  // Get the first day of the calendar grid (might be from previous month)
  const firstDayOfGrid = new Date(firstDayOfMonth);
  firstDayOfGrid.setDate(firstDayOfGrid.getDate() - firstDayOfMonth.getDay());

  const days: Date[] = [];
  const currentGridDate = new Date(firstDayOfGrid);
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentGridDate));
    currentGridDate.setDate(currentGridDate.getDate() + 1);
  }

  // Get day name from date
  const getDayName = (date: Date): string => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[date.getDay()];
  };

  // Get schedules for a specific date
  const getSchedulesForDate = (date: Date): Schedule[] => {
    const dayName = getDayName(date);
    return schedules.filter(
      (s) =>
        s.is_active &&
        s.day_of_week === dayName
    ).sort((a, b) => a.start_time.localeCompare(b.start_time));
  };

  // Color function
  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-900 dark:bg-blue-950 dark:border-blue-700 dark:text-blue-100',
      'bg-purple-100 border-purple-300 text-purple-900 dark:bg-purple-950 dark:border-purple-700 dark:text-purple-100',
      'bg-pink-100 border-pink-300 text-pink-900 dark:bg-pink-950 dark:border-pink-700 dark:text-pink-100',
      'bg-green-100 border-green-300 text-green-900 dark:bg-green-950 dark:border-green-700 dark:text-green-100',
      'bg-yellow-100 border-yellow-300 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-700 dark:text-yellow-100',
      'bg-red-100 border-red-300 text-red-900 dark:bg-red-950 dark:border-red-700 dark:text-red-100',
      'bg-indigo-100 border-indigo-300 text-indigo-900 dark:bg-indigo-950 dark:border-indigo-700 dark:text-indigo-100',
      'bg-teal-100 border-teal-300 text-teal-900 dark:bg-teal-950 dark:border-teal-700 dark:text-teal-100',
    ];
    return colors[parseInt(subjectId) % colors.length];
  };

  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const today = new Date();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Schedule Calendar</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {schedules.length} schedules across the week
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={previousMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-[150px] text-center font-semibold">
              {monthYear}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-semibold text-sm p-2 bg-muted rounded">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, idx) => {
              const isCurrentMonth = day.getMonth() === currentDate.getMonth();
              const isToday =
                day.toDateString() === today.toDateString();
              const daySchedules = getSchedulesForDate(day);

              return (
                <div
                  key={idx}
                  className={`min-h-[140px] border-2 rounded-lg p-2 ${
                    isCurrentMonth ? 'bg-background' : 'bg-muted/30'
                  } ${isToday ? 'border-primary shadow-lg' : 'border-border'}`}
                >
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      isToday
                        ? 'bg-primary text-primary-foreground rounded px-2 py-1 inline-block'
                        : isCurrentMonth
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {day.getDate()}
                  </div>

                  {/* Schedules for this day */}
                  <div className="space-y-1 overflow-y-auto max-h-[100px] text-xs">
                    {daySchedules.length > 0 ? (
                      daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`p-1.5 rounded border-l-2 cursor-pointer hover:shadow-md transition-shadow group ${getSubjectColor(
                            schedule.subject_id
                          )}`}
                          title={`${schedule.subject_name} - ${schedule.teacher_firstname} ${schedule.teacher_lastname}`}
                        >
                          <div className="font-bold line-clamp-1">
                            {schedule.subject_code}
                          </div>
                          <div className="line-clamp-1 text-xs opacity-75">
                            {schedule.start_time.slice(0, 5)}
                          </div>
                          <div className="text-xs opacity-75 line-clamp-1">
                            {schedule.section_name}
                          </div>
                          {canManageSchedules && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('Delete this schedule?')) {
                                  onDeleteSchedule(schedule.id);
                                }
                              }}
                              className="opacity-0 group-hover:opacity-100 text-xs text-red-600 dark:text-red-400 hover:underline mt-1"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-muted-foreground text-xs italic">
                        No classes
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs font-semibold mb-2">Color Legend:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {[
                { name: 'Subject 1', color: 'bg-blue-100' },
                { name: 'Subject 2', color: 'bg-purple-100' },
                { name: 'Subject 3', color: 'bg-pink-100' },
                { name: 'Subject 4', color: 'bg-green-100' },
                { name: 'Subject 5', color: 'bg-yellow-100' },
                { name: 'Subject 6', color: 'bg-red-100' },
                { name: 'Subject 7', color: 'bg-indigo-100' },
                { name: 'Subject 8', color: 'bg-teal-100' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded ${item.color}`} />
                  <span className="text-muted-foreground">Color {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
