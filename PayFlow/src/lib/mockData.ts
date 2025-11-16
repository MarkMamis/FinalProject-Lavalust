export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: 'pending' | 'processed' | 'paid';
}

// Faculty-specific interfaces
export interface Subject {
  id: string;
  code: string;
  name: string;
  units: number;
  hoursPerWeek: number;
  semester: '1st' | '2nd' | 'Summer';
  schoolYear: string;
  isActive: boolean;
}

export interface ClassSchedule {
  id: string;
  subjectId: string;
  facultyId: string;
  section: string;
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  room: string;
  isActive: boolean;
}

export interface FacultyLoad {
  id: string;
  facultyId: string;
  facultyName: string;
  subjects: {
    subjectCode: string;
    subjectName: string;
    section: string;
    units: number;
    hoursPerWeek: number;
  }[];
  totalUnits: number;
  totalHoursPerWeek: number;
  hourlyRate: number;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  floor: '1st Floor' | '2nd Floor';
  type: 'Classroom' | 'Laboratory';
  isActive: boolean;
}

// Mock Rooms
export const mockRooms: Room[] = [
  // 1st Floor - Classrooms
  {
    id: '1',
    code: 'ITRM101',
    name: 'IT Room 101',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  {
    id: '2',
    code: 'ITRM102',
    name: 'IT Room 102',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  {
    id: '3',
    code: 'ITRM104',
    name: 'IT Room 104',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  {
    id: '4',
    code: 'ITRM105',
    name: 'IT Room 105',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  {
    id: '5',
    code: 'ITRM106',
    name: 'IT Room 106',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  {
    id: '6',
    code: 'ITRM107',
    name: 'IT Room 107',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  {
    id: '7',
    code: 'ITRM108',
    name: 'IT Room 108',
    floor: '1st Floor',
    type: 'Classroom',
    isActive: true,
  },
  // 2nd Floor - Laboratory Rooms
  {
    id: '8',
    code: 'ITRM201',
    name: 'IT Lab 201',
    floor: '2nd Floor',
    type: 'Laboratory',
    isActive: true,
  },
  {
    id: '9',
    code: 'ITRM202',
    name: 'IT Lab 202',
    floor: '2nd Floor',
    type: 'Laboratory',
    isActive: true,
  },
];

// Mock Subjects
export const mockSubjects: Subject[] = [
  {
    id: '1',
    code: 'IT101',
    name: 'Introduction to Computing',
    units: 3,
    hoursPerWeek: 3,
    semester: '1st',
    schoolYear: '2024-2025',
    isActive: true,
  },
  {
    id: '2',
    code: 'IT102',
    name: 'Computer Programming 1',
    units: 3,
    hoursPerWeek: 6,
    semester: '1st',
    schoolYear: '2024-2025',
    isActive: true,
  },
  {
    id: '3',
    code: 'IT201',
    name: 'Data Structures and Algorithms',
    units: 3,
    hoursPerWeek: 6,
    semester: '1st',
    schoolYear: '2024-2025',
    isActive: true,
  },
  {
    id: '4',
    code: 'IT202',
    name: 'Database Management Systems',
    units: 3,
    hoursPerWeek: 6,
    semester: '1st',
    schoolYear: '2024-2025',
    isActive: true,
  },
  {
    id: '5',
    code: 'IT301',
    name: 'Web Development',
    units: 3,
    hoursPerWeek: 6,
    semester: '2nd',
    schoolYear: '2024-2025',
    isActive: true,
  },
];

// Mock Class Schedules
export const mockClassSchedules: ClassSchedule[] = [
  // Prof. Juan - Monday
  {
    id: '1',
    subjectId: '1',
    facultyId: '101',
    section: 'BSIT-1A',
    dayOfWeek: 'Monday',
    startTime: '08:00',
    endTime: '10:00',
    room: 'ITRM101',
    isActive: true,
  },
  {
    id: '2',
    subjectId: '2',
    facultyId: '101',
    section: 'BSIT-2B',
    dayOfWeek: 'Monday',
    startTime: '13:00',
    endTime: '15:00',
    room: 'ITRM201',
    isActive: true,
  },
  {
    id: '3',
    subjectId: '3',
    facultyId: '101',
    section: 'BSIT-3A',
    dayOfWeek: 'Monday',
    startTime: '15:00',
    endTime: '18:00',
    room: 'ITRM202',
    isActive: true,
  },
  // Prof. Juan - Wednesday
  {
    id: '4',
    subjectId: '1',
    facultyId: '101',
    section: 'BSIT-1A',
    dayOfWeek: 'Wednesday',
    startTime: '08:00',
    endTime: '09:00',
    room: 'ITRM101',
    isActive: true,
  },
  {
    id: '5',
    subjectId: '2',
    facultyId: '101',
    section: 'BSIT-2B',
    dayOfWeek: 'Wednesday',
    startTime: '13:00',
    endTime: '17:00',
    room: 'ITRM201',
    isActive: true,
  },
  // Prof. Maria - Tuesday
  {
    id: '6',
    subjectId: '4',
    facultyId: '102',
    section: 'BSIT-2A',
    dayOfWeek: 'Tuesday',
    startTime: '07:00',
    endTime: '09:00',
    room: 'ITRM105',
    isActive: true,
  },
  {
    id: '7',
    subjectId: '4',
    facultyId: '102',
    section: 'BSIT-2A',
    dayOfWeek: 'Thursday',
    startTime: '07:00',
    endTime: '09:00',
    room: 'ITRM105',
    isActive: true,
  },
  {
    id: '8',
    subjectId: '5',
    facultyId: '102',
    section: 'BSIT-3B',
    dayOfWeek: 'Tuesday',
    startTime: '10:00',
    endTime: '13:00',
    room: 'ITRM202',
    isActive: true,
  },
];

// Mock Faculty (Teachers)
export const mockFaculty: Employee[] = [
  {
    id: '101',
    name: 'Prof. Juan Dela Cruz',
    email: 'juan.delacruz@bsit.edu.ph',
    department: 'BSIT Department',
    position: 'Instructor II',
    salary: 500, // Hourly rate: ₱500/hour
    joinDate: '2020-06-01',
    status: 'active',
  },
  {
    id: '102',
    name: 'Prof. Maria Santos',
    email: 'maria.santos@bsit.edu.ph',
    department: 'BSIT Department',
    position: 'Assistant Professor',
    salary: 600, // Hourly rate: ₱600/hour
    joinDate: '2019-08-15',
    status: 'active',
  },
  {
    id: '103',
    name: 'Prof. Pedro Reyes',
    email: 'pedro.reyes@bsit.edu.ph',
    department: 'BSIT Department',
    position: 'Instructor I',
    salary: 450, // Hourly rate: ₱450/hour
    joinDate: '2021-01-10',
    status: 'active',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@payflow.com',
    department: 'Engineering',
    position: 'Senior Developer',
    salary: 85000,
    joinDate: '2022-01-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@payflow.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    salary: 70000,
    joinDate: '2021-06-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@payflow.com',
    department: 'HR',
    position: 'HR Specialist',
    salary: 60000,
    joinDate: '2023-03-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.k@payflow.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    salary: 75000,
    joinDate: '2022-09-01',
    status: 'active',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.a@payflow.com',
    department: 'Finance',
    position: 'Accountant',
    salary: 65000,
    joinDate: '2021-11-15',
    status: 'active',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', employeeId: '1', date: '2025-10-27', checkIn: '09:00', checkOut: '18:00', status: 'present' },
  { id: '2', employeeId: '2', date: '2025-10-27', checkIn: '09:15', checkOut: '18:10', status: 'late' },
  { id: '3', employeeId: '3', date: '2025-10-27', checkIn: '08:55', checkOut: '17:55', status: 'present' },
  { id: '4', employeeId: '4', date: '2025-10-27', checkIn: '09:00', status: 'present' },
  { id: '5', employeeId: '5', date: '2025-10-27', checkIn: '09:05', checkOut: '18:00', status: 'present' },
];

export const mockPayroll: PayrollRecord[] = [
  {
    id: '1',
    employeeId: '1',
    month: 'October 2025',
    basicSalary: 85000,
    allowances: 5000,
    deductions: 8500,
    netSalary: 81500,
    status: 'paid',
  },
  {
    id: '2',
    employeeId: '2',
    month: 'October 2025',
    basicSalary: 70000,
    allowances: 4000,
    deductions: 7000,
    netSalary: 67000,
    status: 'paid',
  },
  {
    id: '3',
    employeeId: '3',
    month: 'October 2025',
    basicSalary: 60000,
    allowances: 3000,
    deductions: 6000,
    netSalary: 57000,
    status: 'processed',
  },
];
