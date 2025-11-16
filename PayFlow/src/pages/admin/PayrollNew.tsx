import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Download, TrendingUp, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GeneratePayrollDialog } from '@/components/GeneratePayrollDialog';

interface PayrollRecord {
  id: number;
  employee_id: number;
  period_id: number;
  period_month: string;
  basic_salary: number;
  days_worked: number;
  days_absent: number;
  late_minutes_total: number;
  allowance_rla: number;
  honorarium: number;
  overtime_pay: number;
  deduction_gsis: number;
  deduction_philhealth: number;
  deduction_pagibig: number;
  deduction_tax: number;
  other_deductions: number;
  net_salary: number;
  status: string;
  employee_name?: string;
  employee_position?: string;
}

export default function Payroll() {
  const { user } = useAuth();
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayrollRecords();
  }, []);

  const fetchPayrollRecords = async () => {
    try {
      const response = await fetch('/api/payroll', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch payroll');
      const data = await response.json();
      setPayrollRecords(data.payroll || []);
    } catch (error) {
      console.error('Error fetching payroll:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePayrollGenerated = () => {
    fetchPayrollRecords();
  };

  const totalPayroll = payrollRecords.reduce((sum, p) => sum + parseFloat(String(p.net_salary)), 0);
  const totalDeductions = payrollRecords.reduce((sum, p) => 
    sum + parseFloat(String(p.deduction_gsis)) + parseFloat(String(p.deduction_philhealth)) + 
    parseFloat(String(p.deduction_pagibig)) + parseFloat(String(p.deduction_tax)) + parseFloat(String(p.other_deductions)), 0);
  const totalAllowances = payrollRecords.reduce((sum, p) => 
    sum + parseFloat(String(p.allowance_rla)) + parseFloat(String(p.honorarium)) + parseFloat(String(p.overtime_pay)), 0);

  const statusColors = {
    paid: 'bg-green-500/10 text-green-600 border-green-500/20',
    processed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
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
            <GeneratePayrollDialog onSuccess={handlePayrollGenerated} />
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
                ₱{(totalPayroll / 1000).toFixed(1)}K
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
                ₱{(totalDeductions / 1000).toFixed(1)}K
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
                ₱{(totalAllowances / 1000).toFixed(1)}K
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
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading payroll records...</div>
            ) : payrollRecords.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No payroll records found. Generate payroll to see records here.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {payrollRecords.map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {record.employee_name ? record.employee_name.charAt(0) : 'E'}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{record.employee_name || `Employee #${record.employee_id}`}</p>
                        <p className="text-sm text-muted-foreground">{new Date(record.period_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Basic</p>
                        <p className="font-medium text-foreground">
                          ₱{(parseFloat(String(record.basic_salary)) / 1000).toFixed(0)}K
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Allowances</p>
                        <p className="font-medium text-secondary">
                          +₱{(parseFloat(String(record.allowance_rla)) + parseFloat(String(record.honorarium)) + parseFloat(String(record.overtime_pay))).toFixed(0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Deductions</p>
                        <p className="font-medium text-destructive">
                          -₱{(parseFloat(String(record.deduction_gsis)) + parseFloat(String(record.deduction_philhealth)) + 
                            parseFloat(String(record.deduction_pagibig)) + parseFloat(String(record.deduction_tax)) + 
                            parseFloat(String(record.other_deductions))).toFixed(0)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Net Salary</p>
                        <p className="text-lg font-bold text-foreground">
                          ₱{(parseFloat(String(record.net_salary)) / 1000).toFixed(1)}K
                        </p>
                      </div>
                      <Badge className={statusColors[record.status as keyof typeof statusColors] || statusColors.pending}>
                        {record.status}
                      </Badge>
                    </div>
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
