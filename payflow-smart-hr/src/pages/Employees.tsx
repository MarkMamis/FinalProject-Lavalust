import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Calendar, AlertCircle } from 'lucide-react';
import { mockEmployees, Employee } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AddEmployeeDialog } from '@/components/AddEmployeeDialog';

export default function Employees() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/employees', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch employees');
        const data = await res.json().catch(() => ({}));
        const rows = data.employees || [];
        const mapped: Employee[] = rows.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          email: r.email,
          position: r.position || '',
          department: r.department_id ? String(r.department_id) : 'General',
          salary: Number(r.salary) || 0,
          joinDate: r.join_date || new Date().toISOString(),
          status: r.status || 'active'
        }));
        setEmployees(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Role-based access control
  const canViewSalary = user?.role === 'admin' || user?.role === 'hr';
  const canAddEmployee = user?.role === 'admin';

  const handleAddEmployee = (newEmployee: {
    name: string;
    email: string;
    position: string;
    salary: number;
  }) => {
    const employee: Employee = {
      id: `emp${employees.length + 1}`,
      name: newEmployee.name,
      email: newEmployee.email,
      position: newEmployee.position,
      department: 'General',
      salary: newEmployee.salary,
      joinDate: new Date().toISOString(),
      status: 'active',
    };
    setEmployees([...employees, employee]);
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Employees</h1>
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

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div>Loading...</div>
              ) : filteredEmployees.map((employee) => (
                <Card key={employee.id}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                        {employee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{employee.name}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {employee.email}
                          </span>
                          <span>•</span>
                          <span>{employee.position}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium text-foreground">{employee.department}</p>
                      </div>
                      {canViewSalary && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Salary</p>
                          <p className="font-medium text-foreground">${(employee.salary / 1000).toFixed(0)}K</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(employee.joinDate).toLocaleDateString()}
                        </span>
                      </div>
                      <Badge variant={employee.status === 'active' ? 'default' : 'secondary'}>
                        {employee.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
