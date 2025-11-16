import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { ClassSchedule } from '@/lib/mockData';

interface AddScheduleDialogProps {
  onAddSchedule: (schedule: Omit<ClassSchedule, 'id' | 'isActive'>) => void;
  subjects: Array<{ id: string; code: string; name: string; isActive: boolean; }>;
  rooms: Array<{ id: string; code: string; name: string; floor: string; type: string; isActive: boolean; }>;
  sections: Array<{ id: string; name: string; isActive: boolean; }>;
}

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  position_title: string;
  department_name: string;
  status: string;
}

export function AddScheduleDialog({ onAddSchedule, subjects, rooms, sections }: AddScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [existingSchedules, setExistingSchedules] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    subjectId: '',
    facultyId: '',
    section: '',
    dayOfWeek: 'Monday' as ClassSchedule['dayOfWeek'],
    startTime: '08:00',
    endTime: '10:00',
    room: '',
  });

  useEffect(() => {
    // Fetch employees and schedules when dialog opens
    if (open) {
      fetch('/api/employees', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          const activeEmployees = (data.employees || [])
            .filter((emp: any) => emp.status === 'active')
            .map((emp: any) => ({
              id: String(emp.id),
              first_name: emp.first_name || emp.firstname || '',
              last_name: emp.last_name || emp.lastname || '',
              email: emp.email || '',
              position_title: emp.position_title || '',
              department_name: emp.department_name || '',
              status: emp.status || 'active'
            } as Employee));
          setEmployees(activeEmployees);
        })
        .catch(err => console.error('Error fetching employees:', err));

      fetch('/api/schedules', { credentials: 'include' })
        .then(res => res.json())
        .then(data => {
          setExistingSchedules(data.schedules || []);
        })
        .catch(err => console.error('Error fetching schedules:', err));
    }
  }, [open]);

  // Check if a teacher is already assigned to the selected subject+section
  const getTeacherAssignmentWarning = (employeeId: string) => {
    if (!formData.subjectId || !formData.section) return null;
    // Find any active assignment for this subject+section
    const existingAssignment = existingSchedules.find((schedule: any) =>
      schedule.is_active &&
      String(schedule.subject_id) === formData.subjectId &&
      String(schedule.section_id) === formData.section
    ) || null;

    // Only warn if the assignment exists and it's assigned to a different teacher
    if (existingAssignment && String(existingAssignment.employee_id) !== String(employeeId)) {
      return existingAssignment;
    }

    return null;
  };

  // Check if a section is already assigned for the selected subject.
  // Returns the existing schedule if found, otherwise null.
  const getSectionAssignment = (sectionId: string) => {
    if (!formData.subjectId) return null;
    return existingSchedules.find((schedule: any) =>
      schedule.is_active &&
      String(schedule.section_id) === sectionId &&
      String(schedule.subject_id) === formData.subjectId
    ) || null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subjectId || !formData.facultyId || !formData.section || !formData.room) {
      alert('Please fill in all required fields: Subject, Teacher, Section, and Room');
      return;
    }

    // Check if teacher is already assigned to this subject+section
    const existingAssignment = existingSchedules.find(
      (schedule: any) => 
        schedule.is_active &&
        String(schedule.employee_id) === formData.facultyId &&
        String(schedule.subject_id) === formData.subjectId &&
        String(schedule.section_id) === formData.section
    );

    if (existingAssignment) {
      const teacherName = employees.find(e => e.id === formData.facultyId);
      const subjectName = subjects.find(s => s.id === formData.subjectId);
      const sectionName = sections.find(s => s.id === formData.section);
      
      if (!confirm(
        `Warning: ${teacherName?.first_name} ${teacherName?.last_name} is already assigned to ${subjectName?.name} (${sectionName?.name}).\n\nDo you still want to create this schedule?`
      )) {
        return;
      }
    }

    onAddSchedule(formData);
    setFormData({
      subjectId: '',
      facultyId: '',
      section: '',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '10:00',
      room: '',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Class Schedule</DialogTitle>
            <DialogDescription>
              Create a new class schedule by selecting subject, section, room, day, and time.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject *</Label>
              <Select
                value={formData.subjectId}
                onValueChange={(value) => setFormData({ ...formData, subjectId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.filter(s => s.isActive).map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.code} - {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacher">Teacher / Instructor *</Label>
              <Select
                value={formData.facultyId}
                onValueChange={(value) => setFormData({ ...formData, facultyId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {employees.length === 0 ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Loading teachers...
                    </div>
                  ) : (
                    employees.map((employee) => {
                      const hasWarning = getTeacherAssignmentWarning(employee.id);
                      return (
                        <SelectItem 
                          key={employee.id} 
                          value={employee.id}
                          className={hasWarning ? 'bg-yellow-50 border-l-4 border-yellow-500' : ''}
                        >
                          <div className="flex items-center gap-2">
                            <span>
                              {employee.first_name} {employee.last_name}
                              {employee.position_title && (
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({employee.position_title})
                                </span>
                              )}
                            </span>
                            {hasWarning && (
                              <span className="text-xs font-semibold text-yellow-700 ml-auto">
                                ⚠️ Already Assigned
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
              <Label htmlFor="section">Section *</Label>
              <Select
                value={formData.section}
                onValueChange={(value) => setFormData({ ...formData, section: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  {sections.filter(s => s.isActive).map((section) => {
                    const assignment = getSectionAssignment(section.id);
                    const assignedEmployee = assignment ? employees.find(e => String(e.id) === String(assignment.employee_id)) : null;
                    // Disable section if it's assigned to someone else (unless selected teacher matches)
                    const isDisabled = !!assignment && String(assignment.employee_id) !== String(formData.facultyId);
                    return (
                      <SelectItem key={section.id} value={section.id} disabled={isDisabled} className={isDisabled ? 'opacity-60 pointer-events-none' : ''}>
                        <div className="flex items-center justify-between w-full">
                          <span>{section.name}</span>
                          {assignment && (
                            <span className="text-xs text-yellow-700 ml-2">Assigned: {assignedEmployee ? `${assignedEmployee.first_name} ${assignedEmployee.last_name}` : '—'}</span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
                            <div className="space-y-2">
                <Label htmlFor="room">Room *</Label>
                <Select
                  value={formData.room}
                  onValueChange={(value) => setFormData({ ...formData, room: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      1st Floor - Classrooms
                    </div>
                    {rooms
                      .filter((r) => r.isActive && r.floor === '1st Floor')
                      .map((room) => (
                        <SelectItem key={room.id} value={room.code}>
                          {room.code} - {room.name}
                        </SelectItem>
                      ))}
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-2">
                      2nd Floor - Laboratory Rooms
                    </div>
                    {rooms
                      .filter((r) => r.isActive && r.floor === '2nd Floor')
                      .map((room) => (
                        <SelectItem key={room.id} value={room.code}>
                          {room.code} - {room.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Day of Week *</Label>
              <Select
                value={formData.dayOfWeek}
                onValueChange={(value: ClassSchedule['dayOfWeek']) =>
                  setFormData({ ...formData, dayOfWeek: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p className="text-muted-foreground">
                You can create multiple schedules with gaps. For example, Monday 8-10am and Monday 1-3pm 
                will show as two separate class sessions with a break in between.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Schedule</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}