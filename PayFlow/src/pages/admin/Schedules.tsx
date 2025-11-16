import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Plus, Users, Trash2, Grid, List as ListIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AddScheduleDialog } from '@/components/AddScheduleDialog';
import { ScheduleCalendar } from '@/components/ScheduleCalendar';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Convert 24-hour time (HH:MM or HH:MM:SS) to 12-hour format e.g. 13:00 -> 1:00 PM
const formatTime = (time: string) => {
  if (!time) return '';
  const t = time.slice(0,5); // HH:MM
  const [hhStr, mm] = t.split(':');
  let hh = parseInt(hhStr, 10);
  if (Number.isNaN(hh)) return t;
  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12;
  if (hh === 0) hh = 12;
  return `${hh}:${mm} ${ampm}`;
};

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

export default function Schedules() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [selectedScheduleForModal, setSelectedScheduleForModal] = useState<Schedule | null>(null);
  
  // Data from backend
  const [subjects, setSubjects] = useState<Array<{ id: string; code: string; name: string; isActive: boolean; }>>([]);
  const [rooms, setRooms] = useState<Array<{ id: string; code: string; name: string; floor: string; type: string; isActive: boolean; }>>([]);
  const [sections, setSections] = useState<Array<{ id: string; name: string; isActive: boolean; }>>([]);
  const [employees, setEmployees] = useState<Array<{ id: string; first_name: string; last_name: string; }>>([]);

  const canManageSchedules = user?.role === 'admin' || user?.role === 'hr';
  const isAllTeachersView = selectedTeacher === 'all';

  // Fetch data from backend
  useEffect(() => {
    fetchSchedules();
    fetchSubjects();
    fetchRooms();
    fetchSections();
    fetchEmployees();
  }, []);

  const fetchSchedules = () => {
    setLoading(true);
    fetch('/api/schedules', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch schedules');
        const data = await res.json().catch(() => ({}));
        const rows = data.schedules || [];
        console.log('Schedules loaded:', rows); // Debug: check actual day_of_week values
        setSchedules(rows);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching schedules:', err);
        setLoading(false);
        toast({
          title: 'Error',
          description: 'Failed to fetch schedules from server',
          variant: 'destructive'
        });
      });
  };

  const fetchSubjects = () => {
    fetch('/api/subjects', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        const data = await res.json().catch(() => ({}));
        const rows = data.subjects || [];
        const mapped = rows.map((s: any) => ({
          id: String(s.id),
          code: s.code,
          name: s.name,
          isActive: Boolean(s.is_active)
        }));
        setSubjects(mapped.filter((s: any) => s.isActive));
      })
      .catch((err) => {
        console.error('Error fetching subjects:', err);
      });
  };

  const fetchRooms = () => {
    fetch('/api/rooms', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json().catch(() => ({}));
        const rows = data.rooms || [];
        const mapped = rows.map((r: any) => ({
          id: String(r.id),
          code: r.code,
          name: r.name,
          floor: r.floor,
          type: r.type,
          isActive: Boolean(r.is_active)
        }));
        setRooms(mapped.filter((r: any) => r.isActive));
      })
      .catch((err) => {
        console.error('Error fetching rooms:', err);
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

  const fetchEmployees = () => {
    fetch('/api/employees', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json().catch(() => ({}));
        const rows = data.employees || [];
        const mapped = rows.map((e: any) => ({
          id: String(e.id),
          first_name: e.first_name || '',
          last_name: e.last_name || ''
        }));
        setEmployees(mapped);
      })
      .catch((err) => {
        console.error('Error fetching employees:', err);
      });
  };

  const handleAddSchedule = (newSchedule: any) => {
    setLoading(true);
    
    const sectionId = parseInt(newSchedule.section);
    if (isNaN(sectionId)) {
      toast({
        title: 'Error',
        description: 'Invalid section selected',
        variant: 'destructive'
      });
      setLoading(false);
      return;
    }

    fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        subject_id: parseInt(newSchedule.subjectId),
        employee_id: parseInt(newSchedule.facultyId),
        section_id: sectionId,
        day_of_week: newSchedule.dayOfWeek,
        start_time: newSchedule.startTime,
        end_time: newSchedule.endTime,
        room_code: newSchedule.room
      })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to create schedule');
        }
        toast({
          title: 'Success',
          description: 'Schedule created successfully'
        });
        fetchSchedules(); // Refresh the list
      })
      .catch((err) => {
        console.error('Error creating schedule:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to create schedule',
          variant: 'destructive'
        });
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteSchedule = (id: string) => {
    if (!confirm('Are you sure you want to delete this schedule?')) return;
    
    fetch('/api/schedules/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: parseInt(id) })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to delete schedule');
        }
        toast({
          title: 'Success',
          description: 'Schedule deleted successfully'
        });
        fetchSchedules(); // Refresh the list
      })
      .catch((err) => {
        console.error('Error deleting schedule:', err);
        toast({
          title: 'Error',
          description: err.message || 'Failed to delete schedule',
          variant: 'destructive'
        });
      });
  };

  const filteredSchedules = schedules.filter((s) => {
    if (!s.is_active) return false;
    if (selectedSection !== 'all' && String(s.section_id) !== selectedSection) return false;
    if (selectedTeacher !== 'all' && String(s.employee_id) !== selectedTeacher) return false;
    return true;
  });

  const getScheduleForDayAndTime = (day: string, time: string) => {
    return filteredSchedules.filter((schedule) => {
      if (schedule.day_of_week !== day) return false;
      
      // Convert times to minutes for proper comparison
      const [scheduleStartHour, scheduleStartMin] = schedule.start_time.split(':').map(Number);
      const [scheduleEndHour, scheduleEndMin] = schedule.end_time.split(':').map(Number);
      const [slotHour, slotMin] = time.split(':').map(Number);
      
      const scheduleStart = scheduleStartHour * 60 + scheduleStartMin;
      const scheduleEnd = scheduleEndHour * 60 + scheduleEndMin;
      const slotTime = slotHour * 60 + slotMin;
      
      // Include this time slot if the schedule STARTS at or after this slot
      // and the schedule END time is after this slot
      return slotTime === scheduleStart;
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

  const uniqueTeachers = Array.from(new Set(schedules.filter(s => s.is_active).map(s => s.employee_id)));
  const uniqueSections = Array.from(new Set(schedules.filter(s => s.is_active).map(s => s.section_id)));

  // Helper function to get color based on subject
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

  // Get duration rows for a schedule
  const getScheduleGridRows = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;
    
    // Calculate total minutes and convert to rows (1 row = 1 hour)
    const totalMinutes = end - start;
    const rows = totalMinutes / 60;
    
    return rows; // Return exact rows (can be decimal like 2.5 for 2.5 hours)
  };

  // Detect if a teacher has overlapping schedules
  const getTeacherOverlapCount = (employeeId: string, day: string, startTime: string, endTime: string) => {
    const [scheduleStartHour, scheduleStartMin] = startTime.split(':').map(Number);
    const [scheduleEndHour, scheduleEndMin] = endTime.split(':').map(Number);
    const scheduleStart = scheduleStartHour * 60 + scheduleStartMin;
    const scheduleEnd = scheduleEndHour * 60 + scheduleEndMin;

    return filteredSchedules.filter(s => {
      if (s.employee_id !== employeeId || s.day_of_week !== day) return false;
      if (s.start_time === startTime && s.end_time === endTime) return false; // Skip self
      
      const [otherStartHour, otherStartMin] = s.start_time.split(':').map(Number);
      const [otherEndHour, otherEndMin] = s.end_time.split(':').map(Number);
      const otherStart = otherStartHour * 60 + otherStartMin;
      const otherEnd = otherEndHour * 60 + otherEndMin;
      
      // Check for overlap
      return scheduleStart < otherEnd && scheduleEnd > otherStart;
    }).length;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Calendar className="h-8 w-8" />
              Class Schedules
            </h1>
            <p className="text-muted-foreground">
              Manage teaching schedules and class assignments
            </p>
          </div>
          {canManageSchedules && (
            <AddScheduleDialog 
              onAddSchedule={handleAddSchedule}
              subjects={subjects}
              rooms={rooms}
              sections={sections}
            />
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-4">
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Active Teachers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{uniqueTeachers.length}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Assigned faculty</p>
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

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <label className="text-sm font-medium">Filter by Section</label>
                <Select value={selectedSection} onValueChange={setSelectedSection}>
                  <SelectTrigger className="w-full mt-1">
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
              <div className="flex-1">
                <label className="text-sm font-medium">Filter by Teacher</label>
                <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="All Teachers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Teachers</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.first_name} {employee.last_name}
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
                onDeleteSchedule={handleDeleteSchedule}
                canManageSchedules={canManageSchedules}
              />
            ) : (
              // Weekly Grid View
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Weekly Schedule Calendar
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {filteredSchedules.length} schedules | Click on slots to see details
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
                        {/* eslint-disable-next-line react/forbid-dom-props */}
                        <div className="grid gap-1" style={{ 
                          gridTemplateColumns: '80px',
                          gridAutoRows: '80px'
                        }}>
                          {/* Header */}
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-t font-semibold text-sm flex items-center justify-center">
                            <div className="text-xs text-muted-foreground">Time</div>
                          </div>
                          
                          {/* Spacer to align with day headers (keeps the time column rows in sync) */}
                          <div className="bg-muted p-2 rounded font-semibold text-sm text-center border border-border" />

                          {/* Time slots */}
                          {TIME_SLOTS.map((time) => (
                            <div key={`time-${time}`} className="bg-muted/30 p-2 rounded text-xs font-medium flex items-center justify-center border border-border">
                              {formatTime(time)}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Scrollable Days Grid */}
                      <div className="flex-1 overflow-x-auto">
                        {/* eslint-disable-next-line react/forbid-dom-props */}
                        <div className="grid gap-1" style={{ 
                          gridTemplateColumns: 'repeat(6, 1fr)',
                          gridAutoRows: '80px',
                          minWidth: '600px'
                        }}>
                          {/* Header - Days */}
                          {/* eslint-disable-next-line react/forbid-dom-props */}
                          <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-t font-semibold text-sm" style={{ gridColumn: '1 / -1' }}>
                            <div className="text-center text-xs text-muted-foreground">Week Schedule</div>
                          </div>
                          {DAYS.map((day) => (
                            <div key={day} className="bg-muted p-2 rounded font-semibold text-sm text-center border border-border">
                              {day.slice(0, 3)}
                            </div>
                          ))}

                          {/* Time slots and schedules */}
                          {(() => {
                            const renderedCells = new Set<string>();
                            const cells: JSX.Element[] = [];
                            
                            TIME_SLOTS.forEach((time) => {
                              DAYS.forEach((day) => {
                                const cellKey = `${day}-${time}`;
                                
                                // Skip if already rendered as part of a multi-row schedule
                                if (renderedCells.has(cellKey)) {
                                  return;
                                }
                                
                                // Find ALL schedules starting at this exact time
                                const schedulesAtTime = filteredSchedules.filter(s => 
                                  s.day_of_week === day && s.start_time.slice(0, 5) === time
                                );
                                
                                if (schedulesAtTime.length === 0) {
                                  // Empty cell
                                  cells.push(
                                    /* eslint-disable-next-line react/forbid-dom-props */
                                    <div
                                      key={cellKey}
                                      className="border border-border rounded bg-background hover:bg-muted/30 transition-colors"
                                      style={{ minHeight: '80px' }}
                                    />
                                  );
                                  return;
                                }
                                
                                // For each schedule at this time, mark its rows as rendered
                                schedulesAtTime.forEach((schedule) => {
                                  const durationRows = getScheduleGridRows(schedule.start_time, schedule.end_time);
                                  const startTimeIndex = TIME_SLOTS.indexOf(time);
                                  for (let i = 0; i < Math.ceil(durationRows); i++) {
                                    if (startTimeIndex + i < TIME_SLOTS.length) {
                                      renderedCells.add(`${day}-${TIME_SLOTS[startTimeIndex + i]}`);
                                    }
                                  }
                                });
                                
                                // Create a container for all schedules at this time
                                cells.push(
                                  /* eslint-disable-next-line react/forbid-dom-props */
                                  <div
                                    key={cellKey}
                                    className="flex flex-col gap-1"
                                    style={{ 
                                      gridRow: `span ${Math.ceil(getScheduleGridRows(schedulesAtTime[0].start_time, schedulesAtTime[0].end_time))}`
                                    }}
                                  >
                                    {schedulesAtTime.map((schedule) => {
                                      const durationRows = getScheduleGridRows(schedule.start_time, schedule.end_time);
                                      const overlapCount = getTeacherOverlapCount(String(schedule.employee_id), day, schedule.start_time, schedule.end_time);
                                      const hasOverlap = overlapCount > 0;
                                      const colorClass = getSubjectColor(schedule.subject_id);
                                      
                                      // Compact bookmark view for "All Teachers"
                                      if (isAllTeachersView) {
                                        return (
                                          /* eslint-disable-next-line react/forbid-dom-props */
                                          <div
                                            key={`${cellKey}-${schedule.id}`}
                                            className={`border-2 rounded px-2 py-1 relative cursor-pointer transition-all hover:shadow-md flex-1 ${colorClass}`}
                                            style={{ 
                                              minHeight: '40px'
                                            }}
                                            onDoubleClick={() => setSelectedScheduleForModal(schedule)}
                                            title="Double-click for details"
                                          >
                                            <div className="text-xs space-y-0.5">
                                              <div className="font-bold truncate">{schedule.subject_code}</div>
                                              <div className="text-[10px] truncate">👤 {schedule.teacher_firstname?.slice(0, 1)}.{schedule.teacher_lastname}</div>
                                              <div className="text-[10px] font-semibold">{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</div>
                                            </div>
                                          </div>
                                        );
                                      }
                                      
                                      // Full card view for specific teacher selected
                                      return (
                                        /* eslint-disable-next-line react/forbid-dom-props */
                                        <div
                                          key={`${cellKey}-${schedule.id}`}
                                          className={`border-2 rounded p-2 relative group cursor-pointer transition-all hover:shadow-lg flex-1 ${colorClass} ${
                                            hasOverlap ? 'ring-2 ring-red-500 ring-offset-1' : ''
                                          }`}
                                          style={{ 
                                            minHeight: `${durationRows * 80}px`
                                          }}
                                        >
                                          {/* Overlap Warning Badge */}
                                          {hasOverlap && (
                                            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                              {overlapCount}
                                            </div>
                                          )}

                                          <div className="space-y-1 text-xs">
                                            <div className="font-bold">
                                              {schedule.subject_code}
                                            </div>
                                            <div className="font-semibold line-clamp-1">
                                              {schedule.subject_name}
                                            </div>
                                            <Badge variant="secondary" className="text-xs inline-block">
                                              {schedule.section_name}
                                            </Badge>
                                            <div>
                                              <div>👤 {schedule.teacher_firstname?.slice(0, 1)}{schedule.teacher_lastname?.slice(0, 3)}</div>
                                            </div>
                                            <div>
                                              <div>📍 {schedule.room_code}</div>
                                            </div>
                                              <div className="font-bold mt-1 border-t pt-1">
                                                {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                              </div>
                                          </div>
                                          {canManageSchedules && (
                                            <Button
                                              size="sm"
                                              variant="ghost"
                                              className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                              onClick={() => handleDeleteSchedule(schedule.id)}
                                            >
                                              <Trash2 className="h-3 w-3 text-destructive" />
                                            </Button>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              });
                            });
                            
                            return cells;
                          })()}
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
                {filteredSchedules.length} active schedules
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
                          👤 {schedule.teacher_firstname} {schedule.teacher_lastname}
                        </div>
                        <div className="text-xs">
                          <span>📍 {schedule.room_code}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span>{schedule.day_of_week}</span>
                          <span>{formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}</span>
                        </div>
                        {canManageSchedules && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="w-full mt-2 h-7 text-xs"
                            onClick={() => handleDeleteSchedule(schedule.id)}
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Details Modal */}
      <Dialog open={!!selectedScheduleForModal} onOpenChange={(open) => !open && setSelectedScheduleForModal(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Details</DialogTitle>
          </DialogHeader>
          {selectedScheduleForModal && (
            <div className="space-y-4">
              <div className={`p-6 rounded-lg border-2 ${getSubjectColor(selectedScheduleForModal.subject_id)}`}>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Subject</label>
                    <div className="text-2xl font-bold">
                      {selectedScheduleForModal.subject_code} - {selectedScheduleForModal.subject_name}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Section</label>
                      <div className="text-lg font-semibold">
                        <Badge variant="secondary" className="text-sm">
                          {selectedScheduleForModal.section_name}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Room</label>
                      <div className="text-lg font-semibold">📍 {selectedScheduleForModal.room_code}</div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-muted-foreground">Teacher</label>
                    <div className="text-lg font-semibold">
                      👤 {selectedScheduleForModal.teacher_firstname} {selectedScheduleForModal.teacher_lastname}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Day</label>
                      <div className="text-lg font-semibold">{selectedScheduleForModal.day_of_week}</div>
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-muted-foreground">Time</label>
                      <div className="text-lg font-bold">
                        ⏰ {selectedScheduleForModal.start_time.slice(0, 5)} - {selectedScheduleForModal.end_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>

                  {canManageSchedules && (
                    <div className="pt-4 border-t mt-4">
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => {
                          handleDeleteSchedule(selectedScheduleForModal.id);
                          setSelectedScheduleForModal(null);
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Schedule
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
