import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Trash2, RefreshCw } from 'lucide-react';
import { Subject } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { DataTable, ColumnDef } from '@/components/DataTable';
import { AddSubjectDialog } from '@/components/AddSubjectDialog';
import { ConfirmationAlert } from '@/components/ConfirmationAlert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

export default function Subjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<'all' | '1st' | '2nd' | 'Summer'>('all');
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; subjectId: string | null; subjectName: string }>({ open: false, subjectId: null, subjectName: '' });
  const [confirmRestore, setConfirmRestore] = useState<{ open: boolean; subjectId: string | null; subjectName: string }>({ open: false, subjectId: null, subjectName: '' });

  const canManageSubjects = user?.role === 'admin' || user?.role === 'hr';

  // Fetch subjects from backend
  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    setLoading(true);
    fetch('/api/subjects', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch subjects');
        const data = await res.json().catch(() => ({}));
        const rows = data.subjects || [];
        const mapped: Subject[] = rows.map((r: any) => ({
          id: String(r.id),
          code: r.code,
          name: r.name,
          units: Number(r.units),
          hoursPerWeek: Number(r.hours_per_week),
          semester: r.semester as '1st' | '2nd' | 'Summer',
          schoolYear: r.school_year,
          isActive: Boolean(r.is_active)
        }));
        setSubjects(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching subjects:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch subjects from server',
          variant: 'destructive'
        });
        setLoading(false);
      });
  };

  const handleAddSubject = (newSubject: Omit<Subject, 'id' | 'isActive'>) => {
    fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newSubject)
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to create subject');
        
        toast({ 
          title: 'Subject Added', 
          description: `"${newSubject.name}" has been added successfully.`,
          variant: 'success'
        });
        
        // Refresh the list
        fetchSubjects();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to add subject',
          variant: 'destructive'
        });
      });
  };

  const handleDeleteSubject = (id: string | number) => {
    const subject = subjects.find(s => s.id === String(id));
    setConfirmDelete({ open: true, subjectId: String(id), subjectName: subject?.name || 'Subject' });
  };

  const handleRestoreSubject = (id: string | number) => {
    const subject = subjects.find(s => s.id === String(id));
    setConfirmRestore({ open: true, subjectId: String(id), subjectName: subject?.name || 'Subject' });
  };

  const handleConfirmDelete = () => {
    if (confirmDelete.subjectId) {
      fetch('/api/subjects/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: confirmDelete.subjectId, is_active: 0 })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.error || 'Failed to deactivate');
          
          toast({ 
            title: 'Subject Deactivated', 
            description: `"${confirmDelete.subjectName}" has been deactivated successfully.`,
            variant: 'success'
          });
          
          fetchSubjects();
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message || 'Failed to deactivate subject',
            variant: 'destructive'
          });
        });
    }
    setConfirmDelete({ open: false, subjectId: null, subjectName: '' });
  };

  const handleConfirmRestore = () => {
    if (confirmRestore.subjectId) {
      fetch('/api/subjects/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: confirmRestore.subjectId, is_active: 1 })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.error || 'Failed to restore');
          
          toast({ 
            title: 'Subject Restored', 
            description: `"${confirmRestore.subjectName}" has been restored successfully.`,
            variant: 'success'
          });
          
          fetchSubjects();
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message || 'Failed to restore subject',
            variant: 'destructive'
          });
        });
    }
    setConfirmRestore({ open: false, subjectId: null, subjectName: '' });
  };

  const handleSaveEdit = (id: string | number, updates: Partial<Subject>) => {
    const sy = (updates.schoolYear || '').toString().trim();
    if (sy && !/^\d{4}-\d{4}$/.test(sy)) { 
      toast({ 
        title: 'Invalid School Year', 
        description: 'School year must be in YYYY-YYYY format',
        variant: 'destructive' 
      }); 
      return; 
    }
    if (sy) {
      const [y1Str, y2Str] = sy.split('-');
      const y1 = parseInt(y1Str, 10), y2 = parseInt(y2Str, 10);
      if (Number.isNaN(y1) || Number.isNaN(y2) || y2 !== y1 + 1) { 
        toast({ 
          title: 'Invalid School Year', 
          description: 'School year must be a 1-year interval (e.g. 2024-2025)',
          variant: 'destructive' 
        }); 
        return; 
      }
    }
    if (updates.units !== undefined) {
      const unitsNum = Number(updates.units);
      if (isNaN(unitsNum) || !Number.isInteger(unitsNum) || unitsNum < 0) { 
        toast({ 
          title: 'Invalid Units', 
          description: 'Units must be a non-negative integer',
          variant: 'destructive' 
        }); 
        return; 
      }
    }
    if (updates.hoursPerWeek !== undefined) {
      const hoursNum = Number(updates.hoursPerWeek);
      if (isNaN(hoursNum) || !Number.isInteger(hoursNum) || hoursNum < 0) { 
        toast({ 
          title: 'Invalid Hours per Week', 
          description: 'Hours/week must be a non-negative integer',
          variant: 'destructive' 
        }); 
        return; 
      }
    }
    
    fetch('/api/subjects/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, ...updates })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to update');
        
        toast({ 
          title: 'Subject Updated', 
          description: 'Subject information has been successfully updated.',
          variant: 'success'
        });
        
        fetchSubjects();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to update subject',
          variant: 'destructive'
        });
      });
  };

  const filteredSubjects = subjects.filter(s => selectedSemester === 'all' || s.semester === selectedSemester);

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BookOpen className="h-8 w-8" /> Subjects Management
              </h1>
              <p className="text-muted-foreground">Manage BSIT Department courses and subjects</p>
            </div>
          </div>
          <div className="text-center py-8">Loading subjects...</div>
        </div>
      </Layout>
    );
  }

  const columns: ColumnDef<Subject>[] = [
    { key: 'code', label: 'Subject Code', sortable: true, width: '20', className: 'font-mono font-semibold whitespace-nowrap' },
    { 
      key: 'name', 
      label: 'Subject Description', 
      sortable: true, 
        render: (v: string) => (
        <div>
          <div className="font-medium">{v}</div>
        </div>
      ),
      // In edit mode show a compact name input and a textarea for description
      editRender: (value: any, row: Subject, onChange: (val: any) => void) => (
        <Input
          value={String(value || row.name || '')}
          onChange={(e: any) => onChange && onChange(e.target.value)}
          className="w-[360px]"
        />
      ),
    },
    { 
      key: 'units', 
      label: 'Units', 
      sortable: true, 
      align: 'center', 
      width: '16', 
      render: (v: number) => <Badge variant="secondary">{v}</Badge>,
      editRender: (value: any, _row: Subject, onChange: (val: any) => void) => (
        <Input 
          type="number" 
          value={String(value || '')} 
          onChange={(e: any) => {
            const val = e.target.value;
            // Only allow digits
            if (val === '' || /^\d+$/.test(val)) {
              onChange(val === '' ? 0 : parseInt(val, 10));
            }
          }}
          onKeyDown={(e: any) => {
            // Prevent non-numeric keys except backspace, delete, arrow keys
            if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          className="w-[80px]" 
          min="0"
        />
      )
    },
    { 
      key: 'hoursPerWeek', 
      label: 'Hours/Week', 
      sortable: true, 
      align: 'center', 
      width: '24', 
      render: (v: number) => <Badge variant="outline">{v} hrs</Badge>,
      editRender: (value: any, _row: Subject, onChange: (val: any) => void) => (
        <Input 
          type="number" 
          value={String(value || '')} 
          onChange={(e: any) => {
            const val = e.target.value;
            // Only allow digits
            if (val === '' || /^\d+$/.test(val)) {
              onChange(val === '' ? 0 : parseInt(val, 10));
            }
          }}
          onKeyDown={(e: any) => {
            // Prevent non-numeric keys except backspace, delete, arrow keys
            if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          className="w-[100px]" 
          min="0"
        />
      )
    },
    { 
      key: 'semester', 
      label: 'Semester', 
      sortable: true, 
      align: 'center', 
      width: '20', 
      render: (v: string) => <Badge variant={v === '1st' ? 'default' : v === '2nd' ? 'secondary' : 'outline'}>{v}</Badge>,
      editRender: (value: any, _row: Subject, onChange: (val: any) => void) => (
        <Select value={String(value || '')} onValueChange={(v: any) => onChange(v)}>
          <SelectTrigger className="h-8 w-[120px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1st">1st</SelectItem>
            <SelectItem value="2nd">2nd</SelectItem>
            <SelectItem value="Summer">Summer</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
    { key: 'schoolYear', label: 'School Year', sortable: true, width: '24', className: 'whitespace-nowrap',
      editRender: (value: any, _row: Subject, onChange: (val: any) => void) => (
        <Input value={String(value || '')} onChange={(e: any) => onChange && onChange(e.target.value)} className="w-[140px]" placeholder="2024-2025" />
      )
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="h-8 w-8" /> Subjects Management
            </h1>
            <p className="text-muted-foreground">Manage BSIT Department courses and subjects</p>
          </div>
          {canManageSubjects && <AddSubjectDialog onAddSubject={handleAddSubject} />}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter(s => s.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">1st Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter(s => s.semester === '1st' && s.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">2nd Semester</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter(s => s.semester === '2nd' && s.isActive).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Units</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{subjects.filter(s => s.isActive).reduce((sum, s) => sum + s.units, 0)}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2">
          <Select value={selectedSemester} onValueChange={(val: any) => setSelectedSemester(val)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              <SelectItem value="1st">1st Semester</SelectItem>
              <SelectItem value="2nd">2nd Semester</SelectItem>
              <SelectItem value="Summer">Summer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable<Subject>
          data={filteredSubjects}
          columns={columns}
          searchPlaceholder="Search by subject code or name..."
          searchableFields={['code', 'name']}
          itemsPerPage={10}
          canManage={canManageSubjects}
          onEdit={() => {}}
          editableFields={['code', 'name', 'units', 'hoursPerWeek', 'semester', 'schoolYear']}
          onSave={handleSaveEdit}
          archiveButtonLabel="Archives"
          actions={[
            { label: 'Deactivate', icon: <Trash2 className="h-4 w-4" />, onClick: (row) => handleDeleteSubject(row.id), tooltip: 'Deactivate subject', className: 'text-primary hover:bg-white', condition: (row) => row.isActive },
            { label: 'Restore', icon: <RefreshCw className="h-4 w-4" />, onClick: (row) => handleRestoreSubject(row.id), tooltip: 'Restore subject', className: 'text-primary hover:bg-white', condition: (row) => !row.isActive }
          ]}
        />

        <ConfirmationAlert
          open={confirmDelete.open}
          title="Deactivate Subject"
          description={`Are you sure you want to deactivate "${confirmDelete.subjectName}"? This action can be reversed by reactivating the subject later.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmDelete({ open: false, subjectId: null, subjectName: '' })}
          confirmText="Deactivate"
          cancelText="Cancel"
          variant="destructive"
        />

        <ConfirmationAlert
          open={confirmRestore.open}
          title="Restore Subject"
          description={`Are you sure you want to restore "${confirmRestore.subjectName}"? This will reactivate the subject.`}
          onConfirm={handleConfirmRestore}
          onCancel={() => setConfirmRestore({ open: false, subjectId: null, subjectName: '' })}
          confirmText="Restore"
          cancelText="Cancel"
          variant="default"
        />
      </div>
    </Layout>
  );
}
