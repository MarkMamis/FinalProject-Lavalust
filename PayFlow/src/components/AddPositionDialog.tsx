import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddPositionDialogProps {
  departmentId: string;
  onAddPosition: (departmentId: string, positionTitle: string, salaryGrade?: number) => void;
}

export function AddPositionDialog({ departmentId, onAddPosition }: AddPositionDialogProps) {
  const [open, setOpen] = useState(false);
  const [positionTitle, setPositionTitle] = useState('');
  const [salaryGrade, setSalaryGrade] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!positionTitle) {
      toast({
        title: "Error",
        description: "Please enter a position title",
        variant: "destructive",
      });
      return;
    }

    onAddPosition(departmentId, positionTitle, salaryGrade ? parseInt(salaryGrade) : undefined);

    toast({
      title: "Success",
      description: "Position added successfully",
    });

    setPositionTitle('');
    setSalaryGrade('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary text-white hover:bg-white hover:text-primary border border-primary transition-colors"
        >
          <Plus className="mr-2 h-3 w-3" />
          Add Position
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Position</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Position Title</Label>
            <Input
              id="title"
              placeholder="Senior Software Engineer"
              value={positionTitle}
              onChange={(e) => setPositionTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="salary_grade">Salary Grade (Optional)</Label>
            <Input
              id="salary_grade"
              type="number"
              min="11"
              max="33"
              placeholder="11-33"
              value={salaryGrade}
              onChange={(e) => setSalaryGrade(e.target.value)}
            />
            <p className="text-xs text-gray-500">SSL IV: SG 11-33 for faculty positions</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Position</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
