import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp } from 'lucide-react';
import { mockPayroll, mockEmployees } from '@/lib/mockData';
import { useAuth } from '@/contexts/AuthContext';

export default function Payroll() {
  const { user } = useAuth();
  const [payrollRecords] = useState(mockPayroll);

  const filteredPayroll = payrollRecords.filter(p => p.employeeId === user?.employeeId);

  const totalPayroll = filteredPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  const totalDeductions = filteredPayroll.reduce((sum, p) => sum + p.deductions, 0);
  const totalAllowances = filteredPayroll.reduce((sum, p) => sum + p.allowances, 0);

  const statusColors = {
    paid: 'bg-secondary/10 text-secondary border-secondary/20',
    processed: 'bg-primary/10 text-primary border-primary/20',
    pending: 'bg-warning/10 text-warning border-warning/20',
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Payroll</h1>
          <p className="text-muted-foreground">View your salary and payment details</p>
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
              <p className="text-xs text-muted-foreground">Total earned</p>
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
            <CardTitle>My Payroll History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPayroll.map((record) => (
                <div
                  key={record.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div>
                    <p className="font-medium text-foreground">{record.month}</p>
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
