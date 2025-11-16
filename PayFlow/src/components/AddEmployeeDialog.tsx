import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
import { useToast } from '@/hooks/use-toast';

interface AddEmployeeDialogProps {
  onAddEmployee: (employee: any) => void;
}

export function AddEmployeeDialog({ onAddEmployee }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [departments, setDepartments] = useState<Array<{ id: string; name: string; }>>([]);
  const [positions, setPositions] = useState<Array<{ id: string; title: string; department_id: string; }>>([]);
  const [filteredPositions, setFilteredPositions] = useState<Array<{ id: string; title: string; }>>([]);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    employee_code: '',
    department_id: '',
    position_id: '',
    salary: '',
    join_date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    // Fetch departments
    fetch('/api/departments', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setDepartments(data.departments || []))
      .catch(err => console.error('Error fetching departments:', err));

    // Fetch positions
    fetch('/api/positions', { credentials: 'include' })
      .then(res => res.json())
      .then(data => setPositions(data.positions || []))
      .catch(err => console.error('Error fetching positions:', err));
  }, []);

  useEffect(() => {
    // Filter positions by selected department
    if (formData.department_id) {
      setFilteredPositions(
        positions.filter(p => String(p.department_id) === formData.department_id)
      );
    } else {
      setFilteredPositions([]);
    }
  }, [formData.department_id, positions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Disable future join dates
    const todayStr = new Date().toISOString().split('T')[0];
    if (formData.join_date && formData.join_date > todayStr) {
      toast({ title: 'Error', description: 'Join date cannot be in the future', variant: 'destructive' });
      return;
    }

    if (!formData.firstname || !formData.lastname || !formData.email || !formData.department_id || !formData.position_id || !formData.salary) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const salary = parseFloat(formData.salary);
    if (isNaN(salary) || salary <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid salary",
        variant: "destructive",
      });
      return;
    }

    // POST to backend API
    fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        employee_code: formData.employee_code,
        department_id: parseInt(formData.department_id),
        position_id: parseInt(formData.position_id),
        salary: salary,
        join_date: formData.join_date,
      })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || 'Failed to create employee');
        const emp = data.employee || {};
        onAddEmployee(emp);
        toast({ title: 'Success', description: 'Employee added successfully' });
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          employee_code: '',
          department_id: '',
          position_id: '',
          salary: '',
          join_date: new Date().toISOString().split('T')[0],
        });
        setOpen(false);
      })
      .catch((err) => {
        toast({ title: 'Error', description: String(err), variant: 'destructive' });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name *</Label>
              <Input
                id="firstname"
                placeholder="John"
                value={formData.firstname}
                onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name *</Label>
              <Input
                id="lastname"
                placeholder="Doe"
                value={formData.lastname}
                onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="john.doe@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="employee_code">Employee Code</Label>
            <Input
              id="employee_code"
              placeholder="EMP001"
              value={formData.employee_code}
              onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Department *</Label>
            <Select
              value={formData.department_id}
              onValueChange={(value) => {
                setFormData({ ...formData, department_id: value, position_id: '' });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={String(dept.id)}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <Select
              value={formData.position_id}
              onValueChange={(value) => setFormData({ ...formData, position_id: value })}
              disabled={!formData.department_id}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.department_id ? "Select position" : "Select department first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredPositions.map((pos) => (
                  <SelectItem key={pos.id} value={String(pos.id)}>
                    {pos.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Salary *</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                placeholder="50000.00"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="join_date">Join Date *</Label>
              <Input
                id="join_date"
                type="date"
                value={formData.join_date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, join_date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Employee</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
