import { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, TrendingUp, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface SalaryGradeStep {
  step: number;
  monthly_salary: string;
  effective_date: string;
}

interface SalaryGrade {
  salary_grade: number;
  steps: SalaryGradeStep[];
}

interface FlatSalaryGrade {
  id: number;
  salary_grade: number;
  step: number;
  monthly_salary: string;
  effective_date: string;
}

const POSITION_MAPPING: Record<number, string> = {
  11: 'Instructor I',
  12: 'Instructor II',
  13: 'Instructor III',
  14: 'Instructor IV',
  15: 'Assistant Professor I',
  16: 'Assistant Professor II',
  17: 'Assistant Professor III',
  18: 'Assistant Professor IV',
  19: 'Associate Professor I',
  20: 'Associate Professor II',
  21: 'Associate Professor III',
  22: 'Associate Professor IV',
};

export default function SalaryGrades() {
  const { user } = useAuth();
  const [groupedGrades, setGroupedGrades] = useState<SalaryGrade[]>([]);
  const [flatGrades, setFlatGrades] = useState<FlatSalaryGrade[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grouped' | 'table'>('grouped');

  const canViewSalary = user?.role === 'admin' || user?.role === 'hr';

  useEffect(() => {
    if (canViewSalary) {
      fetchSalaryGrades();
    }
  }, [canViewSalary]);

  const fetchSalaryGrades = () => {
    setLoading(true);
    
    // Fetch grouped grades
    fetch('/api/payroll/salary-grades?grouped=1', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch salary grades');
        const data = await res.json().catch(() => ({}));
        setGroupedGrades(data.salary_grades || []);
      })
      .catch((err) => console.error('Error fetching grouped grades:', err));

    // Fetch flat grades for table view
    fetch('/api/payroll/salary-grades', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch salary grades');
        const data = await res.json().catch(() => ({}));
        setFlatGrades(data.salary_grades || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching flat grades:', err);
        setLoading(false);
      });
  };

  if (!canViewSalary) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to view salary grades.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  const totalGrades = groupedGrades.length;
  const minSalary = flatGrades.length > 0 
    ? Math.min(...flatGrades.map(g => parseFloat(g.monthly_salary)))
    : 0;
  const maxSalary = flatGrades.length > 0
    ? Math.max(...flatGrades.map(g => parseFloat(g.monthly_salary)))
    : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Salary Grades</h1>
            <p className="text-muted-foreground">
              SSL IV (2023) - Salary Standardization Law for Higher Education Institutions
            </p>
          </div>
          <div className="flex gap-2">
            <Badge 
              variant={viewMode === 'grouped' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setViewMode('grouped')}
            >
              Grouped View
            </Badge>
            <Badge 
              variant={viewMode === 'table' ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setViewMode('table')}
            >
              Table View
            </Badge>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Salary Grades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalGrades}</div>
              <p className="text-xs text-muted-foreground">SG 11-{10 + totalGrades}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Minimum Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">₱{minSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">SG 11 Step 1</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Maximum Salary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">₱{maxSalary.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">SG {10 + totalGrades} Step 8</p>
            </CardContent>
          </Card>
        </div>

        {/* Salary Grades Content */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">Loading salary grades...</div>
            </CardContent>
          </Card>
        ) : viewMode === 'grouped' ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {groupedGrades.map((grade) => (
              <Card key={grade.salary_grade} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">SG {grade.salary_grade}</CardTitle>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {grade.steps.length} Steps
                    </Badge>
                  </div>
                  <CardDescription className="text-blue-50">
                    {POSITION_MAPPING[grade.salary_grade] || 'Faculty Position'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    {grade.steps.map((step) => (
                      <div
                        key={step.step}
                        className="flex items-center justify-between p-2 rounded-md hover:bg-accent transition-colors"
                      >
                        <span className="text-sm font-medium text-muted-foreground">
                          Step {step.step}
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          ₱{parseFloat(step.monthly_salary).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Range:</span>
                      <span className="font-medium">
                        ₱{parseFloat(grade.steps[0].monthly_salary).toLocaleString()} - 
                        ₱{parseFloat(grade.steps[grade.steps.length - 1].monthly_salary).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Complete Salary Grade Table</CardTitle>
              <CardDescription>
                All salary grades and steps with monthly salaries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-32">Salary Grade</TableHead>
                      <TableHead className="w-24">Step</TableHead>
                      <TableHead className="text-right">Monthly Salary</TableHead>
                      <TableHead>Typical Position</TableHead>
                      <TableHead className="w-32">Effective Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {flatGrades.map((grade, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">SG {grade.salary_grade}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{grade.step}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-bold text-green-600">
                          ₱{parseFloat(grade.monthly_salary).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {POSITION_MAPPING[grade.salary_grade] || '-'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(grade.effective_date).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Information Card */}
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100">About Salary Grades</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
            <p>
              <strong>Salary Standardization Law (SSL) IV</strong> - Implemented in 2023 for government employees
              in Higher Education Institutions.
            </p>
            <p>
              <strong>Step Increments:</strong> Employees progress through steps 1-8 within their salary grade
              based on years of service and performance evaluations.
            </p>
            <p>
              <strong>Promotions:</strong> When promoted to a higher position, the employee moves to the next
              salary grade and typically starts at Step 1.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
