import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Users, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AddDepartmentDialog } from '@/components/AddDepartmentDialog';
import { AddPositionDialog } from '@/components/AddPositionDialog';
import { EditPositionDialog } from '@/components/EditPositionDialog';
import { DataTable, ColumnDef } from '@/components/DataTable';

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
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>(initialDepartments);
  const [loading, setLoading] = useState(false);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set());

  const canManageDepartments = user?.role === 'admin' || user?.role === 'hr';

  const toggleDepartment = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    setLoading(true);
    fetch('/api/departments', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch departments');
        const data = await res.json().catch(() => ({}));
        const rows = data.departments || [];
        
        // Fetch positions for each department
        const departmentsWithPositions = await Promise.all(
          rows.map(async (dept: any) => {
            const posRes = await fetch(`/api/positions?department_id=${dept.id}`, { credentials: 'include' });
            const posData = await posRes.json().catch(() => ({ positions: [] }));
            const positions = (posData.positions || []).map((p: any) => ({
              id: String(p.id),
              title: p.title,
              departmentId: String(p.department_id)
            }));
            
            return {
              id: String(dept.id),
              name: dept.name,
              description: dept.description || '',
              positions: positions
            };
          })
        );
        
        setDepartments(departmentsWithPositions);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching departments:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch departments from server',
          variant: 'destructive'
        });
        setLoading(false);
      });
  };

  const handleAddDepartment = (newDept: { name: string; description: string }) => {
    const department: Department = {
      id: newDept['id'] ? String((newDept as any).id) : `dept${departments.length + 1}`,
      name: newDept.name,
      description: newDept.description,
      positions: [],
    };
    setDepartments((prev) => [...prev, department]);
  };

  const handleAddPosition = (departmentId: string, positionTitle: string) => {
    fetch('/api/positions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        title: positionTitle,
        department_id: departmentId
      })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to create position');
        
        toast({
          title: 'Position Added',
          description: `"${positionTitle}" has been added successfully.`,
          variant: 'success'
        });
        
        // Refresh departments to get updated positions
        fetchDepartments();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to create position',
          variant: 'destructive'
        });
      });
  };

  const handleEditPosition = (positionId: string, newTitle: string) => {
    // Find the position to get its department_id
    let departmentId = '';
    for (const dept of departments) {
      const pos = dept.positions.find(p => p.id === positionId);
      if (pos) {
        departmentId = pos.departmentId;
        break;
      }
    }

    fetch(`/api/positions/update`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        id: positionId,
        title: newTitle,
        department_id: departmentId
      })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to update position');
        
        toast({
          title: 'Position Updated',
          description: `Position has been updated successfully.`,
          variant: 'success'
        });
        
        // Refresh departments to get updated positions
        fetchDepartments();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to update position',
          variant: 'destructive'
        });
      });
  };

  const handleDeletePosition = (departmentId: string, positionId: string) => {
    fetch(`/api/positions/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id: positionId })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to delete position');
        
        toast({
          title: 'Position Deleted',
          description: 'Position has been deleted successfully.',
          variant: 'success'
        });
        
        // Refresh departments to get updated positions
        fetchDepartments();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to delete position',
          variant: 'destructive'
        });
      });
  };

  const handleDeleteDepartment = (departmentId: string) => {
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
        setDepartments((prev) => prev.filter((dept) => dept.id !== departmentId));
      });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Departments</h1>
              <p className="text-muted-foreground">Manage departments and positions</p>
            </div>
          </div>
          {canManageDepartments && (
            <AddDepartmentDialog onAddDepartment={handleAddDepartment} />
          )}
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Departments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Positions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.reduce((sum, dept) => sum + dept.positions.length, 0)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Positions per Dept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {departments.length > 0 
                  ? Math.round(departments.reduce((sum, dept) => sum + dept.positions.length, 0) / departments.length)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Department List</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : departments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No departments found. Add a department to get started.
              </div>
            ) : (
              <div className="space-y-2">
                {departments.map((department) => (
                  <div key={department.id} className="border rounded-lg overflow-hidden">
                    {/* Department Row */}
                    <div className="flex items-center justify-between p-4 hover:bg-accent transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleDepartment(department.id)}
                        >
                          {expandedDepts.has(department.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{department.name}</div>
                          <div className="text-sm text-muted-foreground">{department.description}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {department.positions.length} {department.positions.length === 1 ? 'position' : 'positions'}
                        </Badge>
                        {canManageDepartments && (
                          <>
                            <AddPositionDialog
                              departmentId={department.id}
                              onAddPosition={handleAddPosition}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDepartment(department.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Positions List (Collapsible) */}
                    {expandedDepts.has(department.id) && (
                      <div className="border-t bg-background">
                        {department.positions.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No positions yet. Click "Add Position" to create one.
                          </div>
                        ) : (
                          <div className="divide-y">
                            {department.positions.map((position, index) => (
                              <div
                                key={position.id}
                                className="flex items-center justify-between p-3 pl-16 hover:bg-accent/30 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-muted-foreground w-8">
                                    #{index + 1}
                                  </span>
                                  <span className="text-sm font-medium text-foreground">
                                    {position.title}
                                  </span>
                                </div>
                                {canManageDepartments && (
                                  <div className="flex gap-1">
                                    <EditPositionDialog
                                      position={position}
                                      onEditPosition={handleEditPosition}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeletePosition(department.id, position.id)}
                                    >
                                      <Trash2 className="h-3 w-3 text-destructive" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
