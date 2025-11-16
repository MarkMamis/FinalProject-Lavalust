import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { Subject } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface AddSubjectDialogProps {
  onAddSubject: (subject: Omit<Subject, 'id' | 'isActive'>) => void;
}

export function AddSubjectDialog({ onAddSubject }: AddSubjectDialogProps) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    units: 3,
    hoursPerWeek: 3,
    semester: '1st' as '1st' | '2nd' | 'Summer',
    schoolYear: '2024-2025',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate school year format: YYYY-YYYY and one-year interval
    const sy = (formData.schoolYear || '').toString().trim();
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
      const y1 = parseInt(y1Str, 10);
      const y2 = parseInt(y2Str, 10);
      if (Number.isNaN(y1) || Number.isNaN(y2) || y2 !== y1 + 1) {
        toast({
          title: 'Invalid School Year',
          description: 'School year must be a 1-year interval (e.g. 2024-2025)',
          variant: 'destructive'
        });
        return;
      }
    }

    onAddSubject(formData);
    setFormData({
      code: '',
      name: '',
      units: 3,
      hoursPerWeek: 3,
      semester: '1st',
      schoolYear: '2024-2025',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
            <DialogDescription>
              Create a new subject/course for the BSIT Department curriculum.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Subject Code *</Label>
                <Input
                  id="code"
                  placeholder="e.g., IT101"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="units">Units *</Label>
                <Input
                  id="units"
                  type="number"
                  min="1"
                  max="6"
                  step="0.5"
                  value={formData.units}
                  onChange={(e) => setFormData({ ...formData, units: parseFloat(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Subject Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Introduction to Computing"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hoursPerWeek">Hours per Week *</Label>
                <Input
                  id="hoursPerWeek"
                  type="number"
                  min="1"
                  max="12"
                  step="0.5"
                  value={formData.hoursPerWeek}
                  onChange={(e) =>
                    setFormData({ ...formData, hoursPerWeek: parseFloat(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="semester">Semester *</Label>
                <Select
                  value={formData.semester}
                  onValueChange={(value: '1st' | '2nd' | 'Summer') =>
                    setFormData({ ...formData, semester: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Semester</SelectItem>
                    <SelectItem value="2nd">2nd Semester</SelectItem>
                    <SelectItem value="Summer">Summer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolYear">School Year *</Label>
              <Input
                id="schoolYear"
                placeholder="e.g., 2024-2025"
                value={formData.schoolYear}
                onChange={(e) => setFormData({ ...formData, schoolYear: e.target.value })}
                required
              />
            </div>

            {/* Description removed per request */}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Subject</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
