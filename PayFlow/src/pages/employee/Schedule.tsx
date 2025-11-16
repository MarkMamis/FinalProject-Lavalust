import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users, Grid, Download } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

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
  room_floor?: string;
}

export default function EmployeeSchedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  // Data from backend
  const [sections, setSections] = useState<Array<{ id: string; name: string; isActive: boolean; }>>([]);

  useEffect(() => {
    if (user?.employeeId) {
      fetchMySchedules();
      fetchSections();
    }
  }, [user?.employeeId]);

  const fetchMySchedules = () => {
    setLoading(true);
    // Use user.employeeId which matches employee_id in the database
    const employeeId = user?.employeeId;
    if (!employeeId) {
      setLoading(false);
      return;
    }
    
    fetch(`/api/schedules?employee_id=${employeeId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch schedules');
        const data = await res.json().catch(() => ({}));
        const rows = data.schedules || [];
        setSchedules(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching schedules:', err);
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to fetch your schedules',
          variant: 'destructive'
        });
      });
  };

  const fetchSections = () => {
    fetch('/api/sections', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch sections');
        const data = await res.json().catch(() => ({}));
        const rows = data.sections || [];
        const mapped = rows.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          isActive: Boolean(s.is_active)
        }));
        setSections(mapped.filter((s: any) => s.isActive));
      })
      .catch((err) => {
        console.error('Error fetching sections:', err);
      });
  };

  const filteredSchedules = schedules.filter((s) => {
    if (!s.is_active) return false;
    if (selectedSection !== 'all' && String(s.section_id) !== selectedSection) return false;
    return true;
  });

  const getScheduleForDayAndTime = (day: string, time: string) => {
    return filteredSchedules.filter((schedule) => {
      if (schedule.day_of_week !== day) return false;
      
      const [scheduleStartHour, scheduleStartMin] = schedule.start_time.split(':').map(Number);
      const [scheduleEndHour, scheduleEndMin] = schedule.end_time.split(':').map(Number);
      const [slotHour, slotMin] = time.split(':').map(Number);
      
      const scheduleStart = scheduleStartHour * 60 + scheduleStartMin;
      const scheduleEnd = scheduleEndHour * 60 + scheduleEndMin;
      const slotTime = slotHour * 60 + slotMin;
      
      return slotTime >= scheduleStart && slotTime < scheduleEnd;
    });
  };

  const getScheduleDuration = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    
    return Math.ceil((end - start) / 60);
  };

  const totalScheduledHours = filteredSchedules.reduce((sum, schedule) => {
    const duration = getScheduleDuration(schedule.start_time, schedule.end_time);
    return sum + duration;
  }, 0);

  const uniqueSections = Array.from(new Set(schedules.filter(s => s.is_active).map(s => s.section_id)));

  const getSubjectColor = (subjectId: string) => {
    const colors = [
      'bg-blue-50 border-blue-200 text-blue-900',
      'bg-purple-50 border-purple-200 text-purple-900',
      'bg-pink-50 border-pink-200 text-pink-900',
      'bg-green-50 border-green-200 text-green-900',
      'bg-yellow-50 border-yellow-200 text-yellow-900',
      'bg-red-50 border-red-200 text-red-900',
      'bg-indigo-50 border-indigo-200 text-indigo-900',
      'bg-teal-50 border-teal-200 text-teal-900',
    ];
    return colors[parseInt(subjectId) % colors.length];
  };

  const getScheduleGridRows = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    
    return Math.ceil((end - start) / 60);
  };

  const handleDownloadPDF = () => {
    if (!user?.employeeId) {
      toast({
        title: 'Error',
        description: 'Employee ID not found',
        variant: 'destructive'
      });
      return;
    }

    // Open the PDF in a new tab (will trigger download)
    const pdfUrl = `/api/schedules/pdf?employee_id=${user.employeeId}`;
    window.open(pdfUrl, '_blank');
    
    toast({
      title: 'Success',
      description: 'Downloading your weekly schedule PDF...',
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Calendar className="h-8 w-8" />
                My Class Schedule
              </h1>
              <p className="text-muted-foreground">
                Your teaching schedule
              </p>
            </div>
            <Button 
              onClick={handleDownloadPDF}
              className="gap-2"
              variant="default"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Total Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{filteredSchedules.length}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active schedules</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">
                Sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">{uniqueSections.length}</div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Class sections</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">
                Weekly Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{totalScheduledHours} hrs</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Total class time</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filter by Section</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1 max-w-xs">
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Sections" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sections</SelectItem>
                    {sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content: Calendar + List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* View Toggle + Calendar Section */}
          <div className="lg:col-span-2 space-y-4">
            {/* View Mode Toggle */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Schedule View
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === 'weekly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('weekly')}
                      className="gap-2"
                    >
                      <Grid className="h-4 w-4" />
                      Weekly
                    </Button>
                    <Button
                      variant={viewMode === 'monthly' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setViewMode('monthly')}
                      className="gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Monthly
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Calendar Views */}
            {viewMode === 'monthly' ? (
              <ScheduleCalendar 
                schedules={filteredSchedules}
                onDeleteSchedule={() => {}}
                canManageSchedules={false}
              />
            ) : (
              // Weekly Grid View
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Weekly Schedule
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {filteredSchedules.length} schedules
                  </p>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading schedules...</div>
                  ) : filteredSchedules.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">No schedules found</div>
                  ) : (
                    <div className="flex">
                      {/* Fixed Time Column */}
                      <div className="flex-shrink-0">
                        <div className="grid gap-1" style={{ 
                          gridTemplateColumns: '80px',
                          gridAutoRows: '80px'
                        }}>
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-t font-semibold text-sm flex items-center justify-center">
                            <div className="text-xs text-muted-foreground">Time</div>
                          </div>
                          
                          {TIME_SLOTS.map((time) => (
                            <div key={`time-${time}`} className="bg-muted/30 p-2 rounded text-xs font-medium flex items-center justify-center border border-border">
                              {time}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable Days Grid */}
                      <div className="flex-1 overflow-x-auto">
                        <div className="grid gap-1" style={{ 
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gridAutoRows: '80px',
                          minWidth: '600px'
                        }}>
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-t font-semibold text-sm" style={{ gridColumn: '1 / -1' }}>
                            <div className="text-center text-xs text-muted-foreground">Week Schedule</div>
                          </div>
                          {DAYS.map((day) => (
                            <div key={day} className="bg-muted p-2 rounded font-semibold text-sm text-center border border-border">
                              {day.slice(0, 3)}
                            </div>
                          ))}

                          {TIME_SLOTS.map((time) => 
                            DAYS.map((day) => {
                              const daySchedules = getScheduleForDayAndTime(day, time);
                              const isFirstSlot = daySchedules.some(s => s.start_time.slice(0, 5) === time);

                              if (!isFirstSlot || daySchedules.length === 0) {
                                return (
                                  <div
                                    key={`${day}-${time}`}
                                    className="border border-border rounded bg-background hover:bg-muted/30 transition-colors"
                                    style={{ minHeight: '80px' }}
                                  />
                                );
                              }

                              const schedule = daySchedules.find(s => s.start_time.slice(0, 5) === time);
                              if (!schedule) {
                                return (
                                  <div
                                    key={`${day}-${time}`}
                                    className="border border-border rounded bg-background"
                                    style={{ minHeight: '80px' }}
                                  />
                                );
                              }

                              const durationRows = getScheduleGridRows(schedule.start_time, schedule.end_time);
                              const colorClass = getSubjectColor(schedule.subject_id);

                              return (
                                <div
                                  key={`${day}-${time}`}
                                  className={`border-2 rounded p-2 relative cursor-pointer transition-all hover:shadow-lg ${colorClass}`}
                                  style={{ 
                                    minHeight: `${durationRows * 80}px`,
                                    gridRow: `span ${durationRows}`
                                  }}
                                >
                                  <div className="space-y-1">
                                    <div className="font-bold text-sm">
                                      {schedule.subject_code}
                                    </div>
                                    <div className="text-xs font-semibold line-clamp-1">
                                      {schedule.subject_name}
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {schedule.section_name}
                                    </Badge>
                                    <div className="text-xs">
                                      <div>📍 {schedule.room_code}</div>
                                    </div>
                                    <div className="text-xs font-bold mt-1 border-t pt-1">
                                      {schedule.start_time.slice(0, 5)}-{schedule.end_time.slice(0, 5)}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Schedule List Sidebar */}
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Schedule List
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                {filteredSchedules.length} schedules
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {filteredSchedules.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No schedules</p>
                ) : (
                  filteredSchedules.sort((a, b) => {
                    const dayOrder = DAYS.indexOf(a.day_of_week) - DAYS.indexOf(b.day_of_week);
                    if (dayOrder !== 0) return dayOrder;
                    return a.start_time.localeCompare(b.start_time);
                  }).map((schedule) => {
                    const colorClass = getSubjectColor(schedule.subject_id);
                    return (
                      <div
                        key={schedule.id}
                        className={`p-3 rounded-lg border-l-4 text-sm space-y-1 ${colorClass}`}
                      >
                        <div className="font-bold text-xs">
                          {schedule.subject_code} - {schedule.subject_name}
                        </div>
                        <div className="text-xs">
                          <span className="font-semibold">{schedule.section_name}</span>
                        </div>
                        <div className="text-xs">
                          <span>📍 {schedule.room_code}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{schedule.day_of_week}</span>
                          <span>{schedule.start_time.slice(0, 5)}-{schedule.end_time.slice(0, 5)}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
