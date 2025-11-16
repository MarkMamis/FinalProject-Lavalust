import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddEmployeeDialog } from '@/components/AddEmployeeDialog';
import { DataTable, ColumnDef } from '@/components/DataTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  employee_code?: string;
  department_name: string;
  department_id?: string;
  position_title: string;
  position_id?: string;
  salary: number;
  join_date: string;
  status: string;
}

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  title: string;
  department_id: string;
}

export default function Employees() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingNameData, setEditingNameData] = useState<{ first_name: string; last_name: string } | null>(null);

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchPositions();
  }, []);

  const fetchDepartments = () => {
    fetch('/api/departments', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch departments');
        const data = await res.json().catch(() => ({}));
        const rows = data.departments || [];
        const mapped: Department[] = rows.map((r: any) => ({
          id: String(r.id),
          name: r.name || ''
        }));
        setDepartments(mapped);
      })
      .catch(() => {});
  };

  const fetchPositions = () => {
    fetch('/api/positions', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch positions');
        const data = await res.json().catch(() => ({}));
        const rows = data.positions || [];
        const mapped: Position[] = rows.map((r: any) => ({
          id: String(r.id),
          title: r.title || '',
          department_id: String(r.department_id || '')
        }));
        setPositions(mapped);
      })
      .catch(() => {});
  };

  const fetchEmployees = () => {
    setLoading(true);
    fetch('/api/employees', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json().catch(() => ({}));
        const rows = data.employees || [];
        const mapped: Employee[] = rows.map((r: any) => ({
          id: String(r.id),
          first_name: r.first_name || '',
          last_name: r.last_name || '',
          email: r.email || '',
          employee_code: r.employee_code || '',
          department_name: r.department_name || 'N/A',
          department_id: String(r.department_id || ''),
          position_title: r.position_title || 'N/A',
          position_id: String(r.position_id || ''),
          salary: Number(r.salary) || 0,
          join_date: r.join_date || '',
          status: r.status || 'active'
        }));
        setEmployees(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Role-based access control
  const canViewSalary = user?.role === 'admin' || user?.role === 'hr';
  const canAddEmployee = user?.role === 'admin';

  const handleAddEmployee = (newEmployee: any) => {
    // Refresh the employee list from server
    fetchEmployees();
  };

  const handleSaveEdit = async (id: string | number, updates: Partial<Employee>) => {
    // Prevent saving a future join date from the inline editor
    if (updates.join_date) {
      const today = new Date().toISOString().split('T')[0];
      if (updates.join_date > today) {
        alert('Join date cannot be in the future');
        return;
      }
    }

    try {
      const response = await fetch('/api/employees/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: id,
          ...updates
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update employee');
      }

      const data = await response.json();
      
      // Update local state with the response from server
      setEmployees(
        employees.map((emp) =>
          emp.id === String(id) ? { ...emp, ...updates } : emp
        )
      );
      
      // Reset editing state
      setEditingNameData(null);
      
      // Refresh the employee list to get updated data
      fetchEmployees();
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee: ' + (error as Error).message);
    }
  };

  const columns: ColumnDef<Employee>[] = [
    { 
      key: 'first_name', 
      label: 'Employee Name', 
      sortable: true,
      editRender: (firstNameValue: string, row: Employee, onChange, onChangeMultiple) => {
        const currentEditData = editingNameData || { first_name: firstNameValue || row.first_name || '', last_name: row.last_name || '' };
        
        return (
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              autoFocus
              value={currentEditData.first_name}
              onChange={(e) => {
                const newData = { ...currentEditData, first_name: e.target.value };
                setEditingNameData(newData);
                onChange(e.target.value);
              }}
              onBlur={() => onChangeMultiple?.({ first_name: currentEditData.first_name, last_name: currentEditData.last_name } as Partial<Employee>)}
              placeholder="First Name"
              className="h-8 px-2 py-1 border border-blue-500 rounded-md bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <input
              type="text"
              value={currentEditData.last_name}
              onChange={(e) => {
                const newData = { ...currentEditData, last_name: e.target.value };
                setEditingNameData(newData);
              }}
              onBlur={() => onChangeMultiple?.({ first_name: currentEditData.first_name, last_name: currentEditData.last_name } as Partial<Employee>)}
              placeholder="Last Name"
              className="h-8 px-2 py-1 border border-blue-500 rounded-md bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
          </div>
        );
      },
      render: (v: string, r: Employee) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-sm font-semibold text-white shadow-md">
            {((r.first_name || '').charAt(0) + (r.last_name || '').charAt(0)).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white">{(r.first_name || '')} {(r.last_name || '')}</div>
          </div>
        </div>
      ) 
    },
    { key: 'employee_code', label: 'Employee Code', sortable: true, align: 'center' },
    {
      key: 'email',
      label: 'Email',
      sortable: true,
      render: (v: string) => <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v}</span>,
      editRender: (emailValue: string, row: Employee, onChange, onChangeMultiple) => {
        return (
          <input
            type="email"
            autoFocus
            value={emailValue || row.email || ''}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => onChangeMultiple?.({ email: emailValue || row.email } as Partial<Employee>)}
            className="h-8 w-full px-2 py-1 border border-blue-500 rounded-md bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        );
      }
    },
    { 
      key: 'position_id', 
      label: 'Position', 
      sortable: false,
      render: (positionId: string, row: Employee) => {
        // Use position_title if available (from editData), otherwise look up by position_id
        const displayText = row.position_title || (positions.find(p => p.id === positionId)?.title || 'N/A');
        return <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{displayText}</span>;
      },
      editRender: (positionIdValue: string, row: Employee, onChange, onChangeMultiple) => {
        const currentDeptId = row.department_id || '';
        const availablePositions = positions.filter(p => p.department_id === currentDeptId);
        const currentPosition = positions.find(p => p.id === positionIdValue || p.id === row.position_id);
        
        return (
          <Select
            value={positionIdValue || row.position_id || ''}
            onValueChange={(val) => {
              const selectedPosition = positions.find(p => p.id === val);
              if (selectedPosition) {
                onChange(val);
                onChangeMultiple?.({
                  position_id: val,
                  position_title: selectedPosition.title
                } as Partial<Employee>);
              }
            }}
          >
            <SelectTrigger className="h-8 w-full border border-blue-500 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 hover:border-blue-600 transition-colors">
              <SelectValue>
                {currentPosition ? (
                  <span className="text-sm font-medium">{currentPosition.title}</span>
                ) : (
                  <span className="text-sm text-gray-500">Select position</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5} className="max-h-[250px] overflow-y-auto z-[100]">
              {availablePositions.length === 0 ? (
                <div className="p-2 text-xs text-gray-500 text-center">No positions in this department</div>
              ) : (
                availablePositions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.id} className="py-1">
                    {pos.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        );
      }
    },
    { 
      key: 'position_title', 
      label: 'Position Display', 
      sortable: false,
      className: 'hidden',
      render: () => null, // Hidden column, only for display in non-edit mode
    },
    { 
      key: 'department_id', 
      label: 'Department', 
      sortable: false, 
      align: 'center',
      render: (deptId: string, row: Employee) => {
        const dept = departments.find(d => d.id === deptId);
        return <Badge variant="outline" className="font-medium">{dept ? dept.name : 'N/A'}</Badge>;
      },
      editRender: (departmentIdValue: string, row: Employee, onChange, onChangeMultiple) => {
        const currentDept = departments.find(d => d.id === departmentIdValue || d.id === row.department_id);
        
        return (
          <Select
            value={departmentIdValue || row.department_id || ''}
            onValueChange={(val) => {
              const selectedDept = departments.find(d => d.id === val);
              if (selectedDept) {
                onChange(val);
                onChangeMultiple?.({
                  department_id: val,
                  department_name: selectedDept.name,
                  position_id: '',
                  position_title: ''
                } as Partial<Employee>);
              }
            }}
          >
            <SelectTrigger className="h-8 w-full border border-blue-500 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400 hover:border-blue-600 transition-colors">
              <SelectValue>
                {currentDept ? (
                  <span className="text-sm font-medium">{currentDept.name}</span>
                ) : (
                  <span className="text-sm text-gray-500">Select department</span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={5} className="max-h-[250px] overflow-y-auto z-[100]">
              {departments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id} className="py-1">
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
    },
    { 
      key: 'department_name', 
      label: 'Department Display', 
      sortable: false,
      className: 'hidden',
      render: () => null, // Hidden column
    },
    ...(canViewSalary ? [{ 
      key: 'salary', 
      label: 'Salary', 
      sortable: true, 
      align: 'right' as const,
      width: '20' as const,
      render: (v: number) => <span className="font-semibold text-green-600 dark:text-green-400">₱{v.toLocaleString()}</span>,
      editRender: (salaryValue: number, row: Employee, onChange, onChangeMultiple) => {
        return (
          <input
            type="number"
            autoFocus
            value={salaryValue ?? row.salary ?? 0}
            onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
            onBlur={() => onChangeMultiple?.({ salary: salaryValue ?? row.salary ?? 0 } as Partial<Employee>)}
            placeholder="Salary"
            className="h-8 px-2 py-1 border border-green-500 rounded-md bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-green-400 focus:border-transparent min-w-[150px]"
            style={{ 
              width: '150px',
              appearance: 'textfield'
            } as any}
            step="0.01"
            min="0"
          />
        );
      }
    }] : []),
    { 
      key: 'join_date', 
      label: 'Join Date', 
      sortable: true, 
      align: 'center',
      width: '20',
      render: (v: string) => <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{v ? new Date(v).toLocaleDateString() : 'N/A'}</span>,
      editRender: (joinDateValue: string, row: Employee, onChange, onChangeMultiple) => {
        return (
          <input
            type="date"
            autoFocus
            value={joinDateValue || row.join_date || ''}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => onChange(e.target.value)}
            onBlur={() => onChangeMultiple?.({ join_date: joinDateValue || row.join_date } as Partial<Employee>)}
            className="h-8 w-full px-2 py-1 border border-blue-500 rounded-md bg-white dark:bg-gray-900 text-sm font-medium focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        );
      }
    },
    { 
      key: 'status', 
      label: 'Status', 
      sortable: true, 
      align: 'center',
      width: '16',
      render: (v: string) => (
        <Badge 
          variant={v === 'active' ? 'default' : 'secondary'}
          className={v === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-400 hover:bg-gray-500'}
        >
          {v}
        </Badge>
      ),
      editRender: (statusValue: string, row: Employee, onChange, onChangeMultiple) => {
        return (
          <Select
            value={statusValue || row.status || 'active'}
            onValueChange={(val) => {
              onChange(val);
              onChangeMultiple?.({ status: val } as Partial<Employee>);
            }}
          >
            <SelectTrigger className="h-8 w-full border border-blue-500 rounded-md bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-400">
              <SelectValue>
                <span className="text-sm font-medium">{statusValue || row.status}</span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active" className="py-1">Active</SelectItem>
              <SelectItem value="inactive" className="py-1">Inactive</SelectItem>
            </SelectContent>
          </Select>
        );
      }
    },
  ] as ColumnDef<Employee>[];

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.status === 'active').length,
    departments: new Set(employees.map((e) => e.department_name)).size,
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-8 w-8" /> Employees
            </h1>
            <p className="text-muted-foreground">Manage your workforce records</p>
          </div>
          {canAddEmployee && (
            <AddEmployeeDialog onAddEmployee={handleAddEmployee} />
          )}
        </div>

        {user?.role === 'hr' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You have read-only access to employee records. Contact an admin to make changes.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Departments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.departments}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>View and manage all employees</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading...</div>
            ) : (
              <DataTable<Employee>
                data={employees}
                columns={columns}
                searchPlaceholder="Search by name, email, or position..."
                searchableFields={['first_name', 'last_name', 'email', 'position_title', 'department_name']}
                itemsPerPage={10}
                canManage={canAddEmployee}
                onEdit={() => {}}
                editableFields={['first_name', 'email', 'salary', 'position_id', 'department_id', 'join_date', 'status']}
                onSave={handleSaveEdit}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
