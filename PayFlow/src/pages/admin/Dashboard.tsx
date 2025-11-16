import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { mockEmployees, mockAttendance, mockPayroll } from '@/lib/mockData';

export default function AdminDashboard() {
  const totalEmployees = mockEmployees.filter(e => e.status === 'active').length;
  const presentToday = mockAttendance.filter(a => a.status === 'present' || a.status === 'late').length;
  const totalPayroll = mockPayroll.reduce((sum, p) => sum + p.netSalary, 0);
  const avgSalary = Math.round(mockEmployees.reduce((sum, e) => sum + e.salary, 0) / mockEmployees.length);

  const stats = [
    { title: 'Total Employees', value: totalEmployees, icon: Users, trend: '+2 this month' },
    { title: 'Present Today', value: `${presentToday}/${totalEmployees}`, icon: Clock, trend: '95% attendance' },
    { title: 'Monthly Payroll', value: `$${(totalPayroll / 1000).toFixed(0)}K`, icon: DollarSign, trend: 'October 2025' },
    { title: 'Avg Salary', value: `$${(avgSalary / 1000).toFixed(0)}K`, icon: TrendingUp, trend: 'Per employee' },
  ];

  const recentActivity = [
    { employee: 'Sarah Johnson', action: 'Clocked in', time: '09:00 AM' },
    { employee: 'Michael Chen', action: 'Late arrival', time: '09:15 AM' },
    { employee: 'Emily Rodriguez', action: 'Clocked in', time: '08:55 AM' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome! Here's your workforce overview.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            let iconColor = 'text-primary';
            if (stat.title === 'Present Today') iconColor = 'text-secondary';
            if (stat.title === 'Monthly Payroll') iconColor = 'text-warning';
            if (stat.title === 'Avg Salary') iconColor = 'text-accent';
            
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-foreground">{activity.employee}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Engineering', 'Marketing', 'HR', 'Finance'].map((dept) => {
                  const count = mockEmployees.filter(e => e.department === dept).length;
                  const percentage = Math.round((count / totalEmployees) * 100);
                  return (
                    <div key={dept}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-foreground">{dept}</span>
                        <span className="text-muted-foreground">{count} employees</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
