import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddDepartmentDialogProps {
  onAddDepartment: (department: {
    id?: string | number;
    name: string;
    description: string;
  }) => void;
}

export function AddDepartmentDialog({ onAddDepartment }: AddDepartmentDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Please enter a department name",
        variant: "destructive",
      });
      return;
    }

    // call backend API to create department
    fetch('/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name: formData.name, description: formData.description })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to create department');
        // use returned department if available
        const dept = data.department || { id: data.id || `dept-${Date.now()}`, name: formData.name, description: formData.description };
        onAddDepartment({ name: dept.name, description: dept.description, id: String(dept.id) } as any);
        toast({ title: 'Success', description: 'Department added successfully' });
        setFormData({ name: '', description: '' });
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
          Add Department
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Department</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Department Name</Label>
            <Input
              id="name"
              placeholder="Engineering"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Department description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Department</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
