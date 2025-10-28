import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AddDepartmentDialog } from '@/components/AddDepartmentDialog';
import { AddPositionDialog } from '@/components/AddPositionDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface Position {
  id: string;
  title: string;
  departmentId: string;
}

interface Department {
  id: string;
  name: string;
  description: string;
  positions: Position[];
}

const initialDepartments: Department[] = [];

export default function Departments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // fetch departments from backend
    setLoading(true);
    fetch('/api/departments', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch departments');
        const data = await res.json().catch(() => ({}));
        const rows = data.departments || [];
        // map backend rows to Department shape (positions remain frontend-only)
        const mapped: Department[] = rows.map((r: any) => ({
          id: String(r.id),
          name: r.name,
          description: r.description || '',
          positions: []
        }));
        setDepartments(mapped);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleAddDepartment = (newDept: { name: string; description: string }) => {
    // backend will return the created department (AddDepartmentDialog already called API)
    // Here we optimistically add or expect AddDepartmentDialog to pass created dept
    const department: Department = {
      id: newDept['id'] ? String((newDept as any).id) : `dept${departments.length + 1}`,
      name: newDept.name,
      description: newDept.description,
      positions: [],
    };
    setDepartments((prev) => [...prev, department]);
  };

  const handleAddPosition = (departmentId: string, positionTitle: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          const newPosition: Position = {
            id: `pos${Date.now()}`,
            title: positionTitle,
            departmentId: departmentId,
          };
          return {
            ...dept,
            positions: [...dept.positions, newPosition],
          };
        }
        return dept;
      })
    );
  };

  const handleDeletePosition = (departmentId: string, positionId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === departmentId) {
          return {
            ...dept,
            positions: dept.positions.filter((pos) => pos.id !== positionId),
          };
        }
        return dept;
      })
    );
  };

  const handleDeleteDepartment = (departmentId: string) => {
    // call backend to delete
    fetch('/api/departments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: departmentId })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to delete');
        setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
      })
      .catch(() => {
        // ignore for now or show toast (could hook into useToast)
        setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
      });
  };

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You don't have permission to access this page. Only administrators can manage departments.
          </AlertDescription>
        </Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Departments</h1>
            <p className="text-muted-foreground">Manage departments and positions</p>
          </div>
          <AddDepartmentDialog onAddDepartment={handleAddDepartment} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full">Loading...</div>
          ) : departments.map((department) => (
            <Card key={department.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{department.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {department.description}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{department.positions.length} positions</span>
                    </div>
                    <AddPositionDialog
                      departmentId={department.id}
                      onAddPosition={handleAddPosition}
                    />
                  </div>
                  <div className="space-y-2">
                    {department.positions.map((position) => (
                      <div
                        key={position.id}
                        className="flex items-center justify-between rounded-md border border-border p-2"
                      >
                        <span className="text-sm text-foreground">{position.title}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePosition(department.id, position.id)}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    ))}
                    {department.positions.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No positions yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
