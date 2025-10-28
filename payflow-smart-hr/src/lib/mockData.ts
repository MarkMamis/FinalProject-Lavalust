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
