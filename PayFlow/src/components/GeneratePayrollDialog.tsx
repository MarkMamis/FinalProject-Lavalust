import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { mockEmployees } from '@/lib/mockData';

interface GeneratePayrollDialogProps {
  onGeneratePayroll: (payrollData: {
    employeeId: string;
    month: string;
    basicSalary: number;
    allowances: number;
    deductions: number;
  }) => void;
}

export function GeneratePayrollDialog({ onGeneratePayroll }: GeneratePayrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    month: '',
    allowances: '',
    deductions: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.month) {
      toast({
        title: "Error",
        description: "Please select employee and month",
        variant: "destructive",
      });
      return;
    }

    const employee = mockEmployees.find(e => e.id === formData.employeeId);
    if (!employee) return;

    const allowances = parseFloat(formData.allowances) || 0;
    const deductions = parseFloat(formData.deductions) || 0;

    onGeneratePayroll({
      employeeId: formData.employeeId,
      month: formData.month,
      basicSalary: employee.salary,
      allowances,
      deductions,
    });

    toast({
      title: "Success",
      description: "Payroll generated successfully",
    });

    setFormData({ employeeId: '', month: '', allowances: '', deductions: '' });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Generate Payroll
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Generate Payroll</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">Employee</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {mockEmployees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.position}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="month">Month</Label>
            <Input
              id="month"
              type="month"
              value={formData.month}
              onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowances">Allowances</Label>
            <Input
              id="allowances"
              type="number"
              placeholder="0"
              value={formData.allowances}
              onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deductions">Deductions</Label>
            <Input
              id="deductions"
              type="number"
              placeholder="0"
              value={formData.deductions}
              onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Generate</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
