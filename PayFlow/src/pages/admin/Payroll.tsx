import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { mockPayroll, mockEmployees, PayrollRecord } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GeneratePayrollDialog } from '@/components/GeneratePayrollDialog';

export default function Payroll() {
  const { user } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(mockPayroll);

  const getEmployeeName = (employeeId: string) => {
    return mockEmployees.find(e => e.id === employeeId)?.name || 'Unknown';
  };

  const handleGeneratePayroll = (payrollData: {
    employeeId: string;
    month: string;
    basicSalary: number;
    allowances: number;
    deductions: number;
  }) => {
    const netSalary = payrollData.basicSalary + payrollData.allowances - payrollData.deductions;
    const newRecord: PayrollRecord = {
      id: `pay${payrollRecords.length + 1}`,
      employeeId: payrollData.employeeId,
      month: new Date(payrollData.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      basicSalary: payrollData.basicSalary,
      allowances: payrollData.allowances,
      deductions: payrollData.deductions,
      netSalary: netSalary,
      status: 'processed',
    };
    setPayrollRecords([newRecord, ...payrollRecords]);
  };

  const totalPayroll = payrollRecords.reduce((sum, p) => sum + p.netSalary, 0);
  const totalDeductions = payrollRecords.reduce((sum, p) => sum + p.deductions, 0);
  const totalAllowances = payrollRecords.reduce((sum, p) => sum + p.allowances, 0);

  const statusColors = {
    paid: 'bg-secondary/10 text-secondary border-secondary/20',
    processed: 'bg-primary/10 text-primary border-primary/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
            <p className="text-muted-foreground">Track and process employee payments</p>
          </div>
          <div className="flex gap-2">
            <GeneratePayrollDialog onGeneratePayroll={handleGeneratePayroll} />
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Payroll
              </CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                ${(totalPayroll / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground">October 2025</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Deductions
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                ${(totalDeductions / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground">Taxes & contributions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Allowances
              </CardTitle>
              <DollarSign className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                ${(totalAllowances / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground">Bonuses & benefits</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Payroll Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payrollRecords.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {getEmployeeName(record.employeeId).charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{getEmployeeName(record.employeeId)}</p>
                      <p className="text-sm text-muted-foreground">{record.month}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Basic</p>
                      <p className="font-medium text-foreground">
                        ${(record.basicSalary / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Allowances</p>
                      <p className="font-medium text-secondary">+${record.allowances}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Deductions</p>
                      <p className="font-medium text-destructive">-${record.deductions}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Net Salary</p>
                      <p className="text-lg font-bold text-foreground">
                        ${(record.netSalary / 1000).toFixed(1)}K
                      </p>
                    </div>
                    <Badge className={statusColors[record.status]}>
                      {record.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
