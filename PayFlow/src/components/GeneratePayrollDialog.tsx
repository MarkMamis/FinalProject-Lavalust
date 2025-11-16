import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  email: string;
  position_title: string;
  department_name: string;
  salary_grade: number;
  step_increment: number;
  salary: number;
}

interface PayrollPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
}

interface GeneratePayrollDialogProps {
  onSuccess?: () => void;
}

export function GeneratePayrollDialog({ onSuccess }: GeneratePayrollDialogProps) {
  const [open, setOpen] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    periodId: '',
    allowanceRla: '1500',
    honorarium: '0',
    overtimePay: '0',
    otherDeductions: '0',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchEmployees();
      fetchPeriods();
    }
  }, [open]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch employees');
      const data = await response.json();
      setEmployees(data.employees || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees",
        variant: "destructive",
      });
    }
  };

  const fetchPeriods = async () => {
    try {
      // Request only open periods; also filter client-side as a safety
      const response = await fetch('/api/payroll/periods?status=open', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch periods');
      const data = await response.json();
      const list = data.periods || [];
      setPeriods(list.filter((p: any) => p.status === 'open'));
    } catch (error) {
      console.error('Error fetching periods:', error);
      toast({
        title: "Error",
        description: "Failed to load payroll periods",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId && !formData.periodId) {
      toast({
        title: "Error",
        description: "Please select at least a payroll period",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const payload: any = {
        period_id: parseInt(formData.periodId),
        allowance_rla: formData.allowanceRla !== '' ? parseFloat(formData.allowanceRla) : 1500,
        honorarium: formData.honorarium !== '' ? parseFloat(formData.honorarium) : 0,
        overtime_pay: formData.overtimePay !== '' ? parseFloat(formData.overtimePay) : 0,
        other_deductions: formData.otherDeductions !== '' ? parseFloat(formData.otherDeductions) : 0,
      };

      // If specific employee selected, only generate for that employee
      if (formData.employeeId) {
        payload.employee_ids = [parseInt(formData.employeeId)];
      }

      const response = await fetch('/api/payroll/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate payroll');
      }

      const result = await response.json();

      toast({
        title: "Success",
        description: result.message || "Payroll generated successfully",
      });

      setFormData({ 
        employeeId: '', 
        periodId: '', 
        allowanceRla: '1500',
        honorarium: '0',
        overtimePay: '0',
        otherDeductions: '0',
      });
      setOpen(false);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to generate payroll",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
            <Label htmlFor="period">Payroll Period *</Label>
            <Select
              value={formData.periodId}
              onValueChange={(value) => setFormData({ ...formData, periodId: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payroll period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={String(period.id)}>
                    {period.name} ({period.start_date} to {period.end_date})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee">Employee (Optional - leave blank for all)</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee or leave blank for all" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={String(employee.id)}>
                    {employee.first_name} {employee.last_name} - {employee.position_title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="allowanceRla">RLA Allowance (₱)</Label>
            <Input
              id="allowanceRla"
              type="number"
              step="0.01"
              placeholder="1500"
              value={formData.allowanceRla}
              onChange={(e) => setFormData({ ...formData, allowanceRla: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="honorarium">Honorarium (₱)</Label>
            <Input
              id="honorarium"
              type="number"
              step="0.01"
              placeholder="0"
              value={formData.honorarium}
              onChange={(e) => setFormData({ ...formData, honorarium: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="overtimePay">Overtime Pay (₱)</Label>
            <Input
              id="overtimePay"
              type="number"
              step="0.01"
              placeholder="0"
              value={formData.overtimePay}
              onChange={(e) => setFormData({ ...formData, overtimePay: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otherDeductions">Other Deductions (₱)</Label>
            <Input
              id="otherDeductions"
              type="number"
              step="0.01"
              placeholder="0"
              value={formData.otherDeductions}
              onChange={(e) => setFormData({ ...formData, otherDeductions: e.target.value })}
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
