import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Lock, 
  Unlock, 
  Trash2, 
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface PayrollPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  payroll_count?: number;
  total_amount?: string;
}

export default function PayrollPeriods() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<PayrollPeriod | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    status: 'open',
  });

  useEffect(() => {
    fetchPeriods();
  }, []);

  const fetchPeriods = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/payroll/periods', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch periods');
      const data = await response.json();
      // Support different API response shapes: { periods: [...] } or { data: [...] }
      setPeriods(data.periods || data.data || []);
    } catch (error) {
      console.error('Error fetching periods:', error);
      toast({
        title: 'Error',
        description: 'Failed to load payroll periods',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (period?: PayrollPeriod) => {
    if (period) {
      setEditingPeriod(period);
      setFormData({
        name: period.name,
        start_date: period.start_date,
        end_date: period.end_date,
        status: period.status,
      });
    } else {
      setEditingPeriod(null);
      // Auto-generate period name based on current month
      const now = new Date();
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
      const periodName = `${monthNames[now.getMonth()]} ${now.getFullYear()} - 1st Half`;
      
      setFormData({
        name: periodName,
        start_date: '',
        end_date: '',
        status: 'open',
      });
    }
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingPeriod(null);
    setFormData({
      name: '',
      start_date: '',
      end_date: '',
      status: 'open',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.start_date || !formData.end_date) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Validate dates
    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      toast({
        title: 'Error',
        description: 'End date must be after start date',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Use POST fallback for updates to accommodate dev proxy limitations.
      const url = editingPeriod
        ? `/api/payroll/periods/${editingPeriod.id}` // POST fallback to update
        : '/api/payroll/periods'; // POST create

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save period');
      }

      toast({
        title: 'Success',
        description: editingPeriod ? 'Period updated successfully' : 'Period created successfully',
      });

      handleCloseDialog();
      fetchPeriods();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save period',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      // Use POST fallback for status update
      const response = await fetch(`/api/payroll/periods/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast({
        title: 'Success',
        description: `Period ${newStatus === 'locked' ? 'locked' : 'unlocked'} successfully`,
      });

      fetchPeriods();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update period status',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePeriod = async (id: number) => {
    if (!confirm('Are you sure you want to delete this period? This action cannot be undone.')) {
      return;
    }

    try {
      // Use POST fallback for delete to work with dev proxy
      const response = await fetch(`/api/payroll/periods/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete period');

      toast({
        title: 'Success',
        description: 'Period deleted successfully',
      });

      fetchPeriods();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete period. It may contain payroll records.',
        variant: 'destructive',
      });
    }
  };

  const getQuickPeriodTemplate = (type: '1st' | '2nd') => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-11
    
    const monthStr = String(month + 1).padStart(2, '0');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    if (type === '1st') {
      return {
        name: `${monthNames[month]} ${year} - 1st Half`,
        start_date: `${year}-${monthStr}-01`,
        end_date: `${year}-${monthStr}-15`,
      };
    } else {
      const lastDay = new Date(year, month + 1, 0).getDate();
      return {
        name: `${monthNames[month]} ${year} - 2nd Half`,
        start_date: `${year}-${monthStr}-16`,
        end_date: `${year}-${monthStr}-${lastDay}`,
      };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const statusColors = {
    open: 'bg-green-500/10 text-green-600 border-green-500/20',
    locked: 'bg-red-500/10 text-red-600 border-red-500/20',
    processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  };

  const statusIcons = {
    open: <Unlock className="h-3 w-3" />,
    locked: <Lock className="h-3 w-3" />,
    processing: <Clock className="h-3 w-3" />,
  };

  const openPeriods = periods.filter(p => p.status === 'open').length;
  const lockedPeriods = periods.filter(p => p.status === 'locked').length;
  const currentPeriod = periods.find(p => {
    const now = new Date();
    const start = new Date(p.start_date);
    const end = new Date(p.end_date);
    return now >= start && now <= end && p.status === 'open';
  });

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Payroll Periods</h1>
            <p className="text-muted-foreground">Manage payroll processing periods and cutoffs</p>
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Create Period
          </Button>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Period Templates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const template = getQuickPeriodTemplate('1st');
                  setFormData({ ...formData, ...template });
                  setShowDialog(true);
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Create 1st Half Period (1-15)
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const template = getQuickPeriodTemplate('2nd');
                  setFormData({ ...formData, ...template });
                  setShowDialog(true);
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                Create 2nd Half Period (16-End)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Periods
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{periods.length}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Periods
              </CardTitle>
              <Unlock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{openPeriods}</div>
              <p className="text-xs text-muted-foreground">Active for payroll generation</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Period
              </CardTitle>
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-blue-600">
                {currentPeriod ? currentPeriod.name : 'None'}
              </div>
              <p className="text-xs text-muted-foreground">
                {currentPeriod 
                  ? `${formatDate(currentPeriod.start_date)} - ${formatDate(currentPeriod.end_date)}`
                  : 'No active period for today'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Period Alert */}
        {currentPeriod && (
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <strong>Current Period:</strong> {currentPeriod.name} is active from{' '}
              {formatDate(currentPeriod.start_date)} to {formatDate(currentPeriod.end_date)}.
              You can generate payroll for this period.
            </AlertDescription>
          </Alert>
        )}

        {/* Periods Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Payroll Periods</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                Loading periods...
              </div>
            ) : periods.length === 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No payroll periods found. Create your first period to start processing payroll.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Period Name</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead className="text-center">Duration</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Payroll Records</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {periods.map((period) => {
                      const startDate = new Date(period.start_date);
                      const endDate = new Date(period.end_date);
                      const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                      const isActive = currentPeriod?.id === period.id;

                      return (
                        <TableRow key={period.id} className={isActive ? 'bg-blue-50 dark:bg-blue-950' : ''}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{period.name}</p>
                                {isActive && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    Active Now
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(period.start_date)}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{formatDate(period.end_date)}</div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline">{duration} days</Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={statusColors[period.status as keyof typeof statusColors] || statusColors.open}>
                              <span className="mr-1">{statusIcons[period.status as keyof typeof statusIcons]}</span>
                              {period.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{period.payroll_count || 0}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleOpenDialog(period)}
                                disabled={period.status === 'locked'}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              
                              {period.status === 'open' ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(period.id, 'locked')}
                                  className="text-red-600"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleUpdateStatus(period.id, 'open')}
                                  className="text-green-600"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeletePeriod(period.id)}
                                className="text-destructive"
                                disabled={period.status === 'locked' || Boolean(period.payroll_count && period.payroll_count > 0)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
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

        {/* Create/Edit Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingPeriod ? 'Edit Period' : 'Create Payroll Period'}</DialogTitle>
              <DialogDescription>
                {editingPeriod 
                  ? 'Update the payroll period details below.'
                  : 'Create a new payroll period for processing employee salaries.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Period Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., November 2025 - 1st Half"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date *</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="end_date">End Date *</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="locked">Locked</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Open periods allow payroll generation. Lock periods to prevent changes.
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingPeriod ? 'Update Period' : 'Create Period'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
