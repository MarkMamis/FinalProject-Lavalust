import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  Calendar, 
  Users, 
  FileText, 
  Eye,
  Trash2,
  CheckCircle2,
  XCircle,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GeneratePayrollDialog } from '@/components/GeneratePayrollDialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PayrollRecord {
  id: number;
  employee_id: number;
  period_id: number;
  period_month: string;
  basic_salary: string;
  days_worked: number;
  days_absent: number;
  late_minutes_total: number;
  allowance_rla: string;
  honorarium: string;
  overtime_pay: string;
  deduction_gsis: string;
  deduction_philhealth: string;
  deduction_pagibig: string;
  deduction_tax: string;
  other_deductions: string;
  net_salary: string;
  status: string;
  created_at: string;
  // Joined fields
  employee_code?: string;
  employee_name?: string;
  employee_email?: string;
  position_title?: string;
  department_name?: string;
  period_name?: string;
}

interface PayrollPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

export default function Payroll() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<Set<number>>(new Set());
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    fetchPeriods();
    fetchPayrollRecords();
  }, []);

  const fetchPeriods = async () => {
    try {
      // Fetch only open periods; filter client-side to be safe
      const response = await fetch('/api/payroll/periods?status=open', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch periods');
      const data = await response.json();
      const list = data.periods || [];
      setPeriods(list.filter((p: any) => p.status === 'open'));
    } catch (error) {
      console.error('Error fetching periods:', error);
    }
  };

  const fetchPayrollRecords = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payroll', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch payroll');
      const data = await response.json();
      setPayrollRecords(data.payroll || []);
    } catch (error) {
      console.error('Error fetching payroll:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payroll records',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayrollGenerated = () => {
    fetchPayrollRecords();
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/payroll/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: 'Success',
        description: `Payroll marked as ${newStatus}`,
      });

      fetchPayrollRecords();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update payroll status',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePayroll = async (id: number) => {
    if (!confirm('Are you sure you want to delete this payroll record?')) return;

    try {
      const response = await fetch(`/api/payroll/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete payroll');

      toast({
        title: 'Success',
        description: 'Payroll record deleted',
      });

      fetchPayrollRecords();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete payroll record',
        variant: 'destructive',
      });
    }
  };

  const handleExportReport = () => {
    setShowExportModal(true);
    setSelectedForExport(new Set());
  };

  const toggleSelectForExport = (id: number) => {
    const newSelection = new Set(selectedForExport);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedForExport(newSelection);
  };

  const toggleSelectAllForExport = () => {
    const filtered = getFilteredRecords();
    if (selectedForExport.size === filtered.length) {
      setSelectedForExport(new Set());
    } else {
      setSelectedForExport(new Set(filtered.map(r => r.id)));
    }
  };

  const handleExportPDF = async () => {
    if (selectedForExport.size === 0) {
      toast({
        title: 'No records selected',
        description: 'Please select at least one payroll record to export',
        variant: 'destructive',
      });
      return;
    }

    setExportLoading(true);
    try {
      const response = await fetch('/api/payroll/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ payroll_ids: Array.from(selectedForExport) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate PDF');
      }

      // Download the PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payroll_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: 'Success',
        description: 'Payroll PDF exported successfully',
      });

      setShowExportModal(false);
      setSelectedForExport(new Set());
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message || 'Failed to export payroll PDF',
        variant: 'destructive',
      });
    } finally {
      setExportLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatCurrency = (value: string | number) => {
    return `₱${parseFloat(String(value)).toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  // Count business days (Mon-Fri) inclusive between two dates
  const countWorkingDays = (start: string, end: string) => {
    try {
      const s = new Date(start);
      const e = new Date(end);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) return 0;
      let count = 0;
      const cur = new Date(s);
      while (cur <= e) {
        const day = cur.getDay();
        if (day !== 0 && day !== 6) count++;
        cur.setDate(cur.getDate() + 1);
      }
      return count;
    } catch (err) {
      return 0;
    }
  };

  // Derive absence count: use provided days_absent if present, otherwise compute as workingDays - days_worked
  const deriveAbsent = (record: PayrollRecord) => {
    if (record.days_absent && record.days_absent > 0) return Number(record.days_absent);
    const period = periods.find(p => p.id === record.period_id);
    if (!period) return Number(record.days_absent || 0);
    const workingDays = countWorkingDays(period.start_date, period.end_date);
    const absent = Math.max(0, +(workingDays - Number(record.days_worked)).toFixed(2));
    return absent;
  };

  const getFilteredRecords = () => {
    return payrollRecords.filter(record => {
      const matchesPeriod = selectedPeriod === 'all' || String(record.period_id) === selectedPeriod;
      const matchesStatus = selectedStatus === 'all' || record.status === selectedStatus;
      const matchesSearch = !searchTerm || 
        record.employee_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.department_name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesPeriod && matchesStatus && matchesSearch;
    });
  };

  const filteredRecords = getFilteredRecords();

  const totalPayroll = filteredRecords.reduce((sum, p) => sum + parseFloat(String(p.net_salary)), 0);
  const totalDeductions = filteredRecords.reduce((sum, p) => 
    sum + parseFloat(String(p.deduction_gsis)) + 
    parseFloat(String(p.deduction_philhealth)) + 
    parseFloat(String(p.deduction_pagibig)) + 
    parseFloat(String(p.deduction_tax)) + 
    parseFloat(String(p.other_deductions)), 0);
  const totalAllowances = filteredRecords.reduce((sum, p) => 
    sum + parseFloat(String(p.allowance_rla)) + 
    parseFloat(String(p.honorarium)) + 
    parseFloat(String(p.overtime_pay)), 0);
  const totalEmployees = new Set(filteredRecords.map(p => p.employee_id)).size;

  const statusColors = {
    paid: 'bg-green-500/10 text-green-600 border-green-500/20',
    processed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payroll Management</h1>
            <p className="text-muted-foreground">Track and process employee payments</p>
          </div>
          <div className="flex gap-2">
            <GeneratePayrollDialog onSuccess={handlePayrollGenerated} />
            <Button variant="outline" onClick={handleExportReport}>
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
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
              <p className="text-xs text-muted-foreground">
                {filteredRecords.length} record{filteredRecords.length !== 1 ? 's' : ''}
              </p>
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
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                ₱{(totalAllowances / 1000).toFixed(1)}K
              </div>
              <p className="text-xs text-muted-foreground">Bonuses & benefits</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Employees
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {totalEmployees}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg: {totalEmployees > 0 ? formatCurrency(totalPayroll / totalEmployees) : '₱0.00'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Employee name or code..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="All periods" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Periods</SelectItem>
                    {periods.map((period) => (
                      <SelectItem key={period.id} value={String(period.id)}>
                        {period.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">&nbsp;</label>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSelectedPeriod('all');
                    setSelectedStatus('all');
                    setSearchTerm('');
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payroll Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payroll Records</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                Loading payroll records...
              </div>
            ) : filteredRecords.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {payrollRecords.length === 0 
                    ? 'No payroll records found. Generate payroll to see records here.'
                    : 'No records match your filters.'}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Period</TableHead>
                      <TableHead className="text-right">Basic Salary</TableHead>
                      <TableHead className="text-right">Allowances</TableHead>
                      <TableHead className="text-right">Deductions</TableHead>
                      <TableHead className="text-right">Net Salary</TableHead>
                      <TableHead className="text-center">Days</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => {
                      const totalAllowance = 
                        parseFloat(String(record.allowance_rla)) + 
                        parseFloat(String(record.honorarium)) + 
                        parseFloat(String(record.overtime_pay));
                      
                      const totalDeduction = 
                        parseFloat(String(record.deduction_gsis)) + 
                        parseFloat(String(record.deduction_philhealth)) + 
                        parseFloat(String(record.deduction_pagibig)) + 
                        parseFloat(String(record.deduction_tax)) + 
                        parseFloat(String(record.other_deductions));

                      return (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                                {record.employee_name?.charAt(0) || 'E'}
                              </div>
                              <div>
                                <p className="font-medium">{record.employee_name || `Employee #${record.employee_id}`}</p>
                                <p className="text-xs text-muted-foreground">
                                  {record.employee_code} • {record.position_title}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">
                                {record.period_name || formatDate(record.period_month)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(record.basic_salary)}
                          </TableCell>
                          <TableCell className="text-right text-green-600 font-medium">
                            +{formatCurrency(totalAllowance)}
                          </TableCell>
                          <TableCell className="text-right text-destructive font-medium">
                            -{formatCurrency(totalDeduction)}
                          </TableCell>
                          <TableCell className="text-right font-bold text-lg">
                            {formatCurrency(record.net_salary)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="text-xs">
                              <div className="text-green-600 font-medium">{record.days_worked}W</div>
                              {deriveAbsent(record) > 0 && (
                                <div className="text-destructive">{deriveAbsent(record)}A</div>
                              )}
                              {record.late_minutes_total > 0 && (
                                <div className="text-yellow-600">{record.late_minutes_total}m Late</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={statusColors[record.status as keyof typeof statusColors] || statusColors.pending}>
                              {record.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setShowDetails(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {record.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(record.id, 'processed')}
                                  className="text-blue-600"
                                >
                                  <CheckCircle2 className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {record.status === 'processed' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(record.id, 'paid')}
                                  className="text-green-600"
                                >
                                  <DollarSign className="h-4 w-4" />
                                </Button>
                              )}
                              
                              {record.status !== 'paid' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeletePayroll(record.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Details Dialog */}
        <Dialog open={showDetails} onOpenChange={setShowDetails}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Payroll Details</DialogTitle>
              <DialogDescription>
                Complete breakdown of payroll computation
              </DialogDescription>
            </DialogHeader>
            
            {selectedRecord && (
              <div className="space-y-6">
                {/* Employee Info */}
                <div className="rounded-lg border p-4 space-y-2">
                  <h3 className="font-semibold text-lg">{selectedRecord.employee_name}</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Employee Code:</span>
                      <span className="ml-2 font-medium">{selectedRecord.employee_code}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Position:</span>
                      <span className="ml-2 font-medium">{selectedRecord.position_title}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Department:</span>
                      <span className="ml-2 font-medium">{selectedRecord.department_name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Period:</span>
                      <span className="ml-2 font-medium">
                        {selectedRecord.period_name || formatDate(selectedRecord.period_month)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Attendance */}
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-3">Attendance Summary</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center p-3 rounded bg-green-50 dark:bg-green-950">
                      <div className="text-2xl font-bold text-green-600">{selectedRecord.days_worked}</div>
                      <div className="text-muted-foreground">Days Worked</div>
                    </div>
                    <div className="text-center p-3 rounded bg-red-50 dark:bg-red-950">
                      <div className="text-2xl font-bold text-destructive">{deriveAbsent(selectedRecord)}</div>
                      <div className="text-muted-foreground">Days Absent</div>
                    </div>
                    <div className="text-center p-3 rounded bg-yellow-50 dark:bg-yellow-950">
                      <div className="text-2xl font-bold text-yellow-600">{selectedRecord.late_minutes_total}</div>
                      <div className="text-muted-foreground">Minutes Late</div>
                    </div>
                  </div>
                </div>

                {/* Earnings */}
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-3">Earnings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span>Monthly Salary (Base)</span>
                      <span className="font-medium text-muted-foreground">{formatCurrency(
                        parseFloat(String(selectedRecord.basic_salary)) + 
                        (deriveAbsent(selectedRecord) * (parseFloat(String(selectedRecord.basic_salary)) / 22))
                      )}</span>
                    </div>
                    {deriveAbsent(selectedRecord) > 0 && (
                      <div className="flex justify-between py-2 border-b bg-red-50 dark:bg-red-950 px-2">
                        <span className="text-destructive">Absence Deduction ({deriveAbsent(selectedRecord)} days)</span>
                        <span className="font-medium text-destructive">-{formatCurrency(
                          deriveAbsent(selectedRecord) * (parseFloat(String(selectedRecord.basic_salary)) / 22)
                        )}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 border-b">
                      <span>Basic Salary (After Absences)</span>
                      <span className="font-medium">{formatCurrency(selectedRecord.basic_salary)}</span>
                    </div>
                    {parseFloat(String(selectedRecord.allowance_rla)) > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>RLA Allowance</span>
                        <span className="font-medium text-green-600">+{formatCurrency(selectedRecord.allowance_rla)}</span>
                      </div>
                    )}
                    {parseFloat(String(selectedRecord.honorarium)) > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Honorarium</span>
                        <span className="font-medium text-green-600">+{formatCurrency(selectedRecord.honorarium)}</span>
                      </div>
                    )}
                    {parseFloat(String(selectedRecord.overtime_pay)) > 0 && (
                      <div className="flex justify-between py-2 border-b">
                        <span>Overtime Pay</span>
                        <span className="font-medium text-green-600">+{formatCurrency(selectedRecord.overtime_pay)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-2 font-bold bg-green-50 dark:bg-green-950 px-2 rounded">
                      <span>Gross Pay</span>
                      <span className="text-green-600">
                        {formatCurrency(
                          parseFloat(String(selectedRecord.basic_salary)) +
                          parseFloat(String(selectedRecord.allowance_rla)) +
                          parseFloat(String(selectedRecord.honorarium)) +
                          parseFloat(String(selectedRecord.overtime_pay))
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div className="rounded-lg border p-4">
                  <h4 className="font-semibold mb-3">Deductions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span>GSIS (9%)</span>
                      <span className="font-medium text-destructive">-{formatCurrency(selectedRecord.deduction_gsis)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>PhilHealth</span>
                      <span className="font-medium text-destructive">-{formatCurrency(selectedRecord.deduction_philhealth)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Pag-IBIG</span>
                      <span className="font-medium text-destructive">-{formatCurrency(selectedRecord.deduction_pagibig)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Withholding Tax</span>
                      <span className="font-medium text-destructive">-{formatCurrency(selectedRecord.deduction_tax)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Other Deductions</span>
                      <span className="font-medium text-destructive">-{formatCurrency(selectedRecord.other_deductions)}</span>
                    </div>
                    <div className="flex justify-between py-2 font-bold bg-red-50 dark:bg-red-950 px-2 rounded">
                      <span>Total Deductions</span>
                      <span className="text-destructive">
                        -{formatCurrency(
                          parseFloat(String(selectedRecord.deduction_gsis)) +
                          parseFloat(String(selectedRecord.deduction_philhealth)) +
                          parseFloat(String(selectedRecord.deduction_pagibig)) +
                          parseFloat(String(selectedRecord.deduction_tax)) +
                          parseFloat(String(selectedRecord.other_deductions))
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Pay */}
                <div className="rounded-lg border-2 border-primary p-4 bg-primary/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">NET PAY</div>
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(selectedRecord.net_salary)}
                      </div>
                    </div>
                    <Badge className={statusColors[selectedRecord.status as keyof typeof statusColors] || statusColors.pending}>
                      {selectedRecord.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Export Modal */}
        <Dialog open={showExportModal} onOpenChange={setShowExportModal}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Export Payroll to PDF</DialogTitle>
              <DialogDescription>
                Select the payroll records you want to export. The PDF will include detailed breakdown similar to the payroll details view.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedForExport.size === getFilteredRecords().length && getFilteredRecords().length > 0}
                    onChange={toggleSelectAllForExport}
                    className="h-4 w-4"
                    aria-label="Select all payroll records for export"
                  />
                  <span className="text-sm font-medium">
                    Select All ({selectedForExport.size} of {getFilteredRecords().length} selected)
                  </span>
                </div>
                <Button
                  onClick={handleExportPDF}
                  disabled={selectedForExport.size === 0 || exportLoading}
                  className="gap-2"
                >
                  {exportLoading ? (
                    <>Generating PDF...</>
                  ) : (
                    <>
                      <Download className="h-4 w-4" />
                      Export {selectedForExport.size} Record(s)
                    </>
                  )}
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getFilteredRecords().map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                    onClick={() => toggleSelectForExport(record.id)}
                  >
                    <input
                      type="checkbox"
                      checked={selectedForExport.has(record.id)}
                      onChange={() => toggleSelectForExport(record.id)}
                      className="h-4 w-4"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${record.employee_name} for export`}
                    />
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm font-medium">{record.employee_name}</div>
                        <div className="text-xs text-muted-foreground">{record.employee_code}</div>
                      </div>
                      <div>
                        <div className="text-sm">{record.position_title}</div>
                        <div className="text-xs text-muted-foreground">{record.department_name}</div>
                      </div>
                      <div>
                        <div className="text-sm">{record.period_name || formatDate(record.period_month)}</div>
                        <div className="text-xs text-muted-foreground">
                          {record.days_worked} days worked
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-primary">
                          {formatCurrency(record.net_salary)}
                        </div>
                        <Badge 
                          className={statusColors[record.status as keyof typeof statusColors] || statusColors.pending}
                          variant="outline"
                        >
                          {record.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
