import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  TrendingDown,
  FileText,
  Download,
  Upload,
  Shield,
  Heart,
  Home,
  Receipt
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
import { Textarea } from '@/components/ui/textarea';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface DeductionRate {
  id: number;
  deduction_type: string;
  description: string;
  rate_type: string;
  rate_value: string;
  min_amount?: string;
  max_amount?: string;
  salary_min?: string;
  salary_max?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface TaxBracket {
  id: number;
  income_from: string;
  income_to: string;
  base_tax: string;
  rate_percentage: string;
  excess_over: string;
  is_active: boolean;
}

export default function Deductions() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [deductions, setDeductions] = useState<DeductionRate[]>([]);
  const [taxBrackets, setTaxBrackets] = useState<TaxBracket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [showTaxDialog, setShowTaxDialog] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<DeductionRate | null>(null);
  const [editingTaxBracket, setEditingTaxBracket] = useState<TaxBracket | null>(null);
  const [activeTab, setActiveTab] = useState('gsis');
  
  const [formData, setFormData] = useState({
    deduction_type: 'gsis',
    description: '',
    rate_type: 'percentage',
    rate_value: '',
    min_amount: '',
    max_amount: '',
    salary_min: '',
    salary_max: '',
    is_active: true,
  });

  const [taxFormData, setTaxFormData] = useState({
    income_from: '',
    income_to: '',
    base_tax: '',
    rate_percentage: '',
    excess_over: '',
    is_active: true,
  });

  useEffect(() => {
    fetchDeductions();
    fetchTaxBrackets();
  }, []);

  const fetchDeductions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/deductions', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch deductions');
      const data = await response.json();
      setDeductions(data.data || []);
    } catch (error) {
      console.error('Error fetching deductions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load deduction rates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTaxBrackets = async () => {
    try {
      const response = await fetch('/api/deductions/tax-brackets', { credentials: 'include' });
      if (!response.ok) throw new Error('Failed to fetch tax brackets');
      const data = await response.json();
      setTaxBrackets(data.data || []);
    } catch (error) {
      console.error('Error fetching tax brackets:', error);
    }
  };

  const handleOpenDialog = (deduction?: DeductionRate) => {
    if (deduction) {
      setEditingDeduction(deduction);
      setFormData({
        deduction_type: deduction.deduction_type,
        description: deduction.description,
        rate_type: deduction.rate_type,
        rate_value: deduction.rate_value,
        min_amount: deduction.min_amount || '',
        max_amount: deduction.max_amount || '',
        salary_min: deduction.salary_min || '',
        salary_max: deduction.salary_max || '',
        is_active: deduction.is_active,
      });
    } else {
      setEditingDeduction(null);
      setFormData({
        deduction_type: activeTab,
        description: '',
        rate_type: 'percentage',
        rate_value: '',
        min_amount: '',
        max_amount: '',
        salary_min: '',
        salary_max: '',
        is_active: true,
      });
    }
    setShowDialog(true);
  };

  const handleOpenTaxDialog = (bracket?: TaxBracket) => {
    if (bracket) {
      setEditingTaxBracket(bracket);
      setTaxFormData({
        income_from: bracket.income_from,
        income_to: bracket.income_to,
        base_tax: bracket.base_tax,
        rate_percentage: bracket.rate_percentage,
        excess_over: bracket.excess_over,
        is_active: bracket.is_active,
      });
    } else {
      setEditingTaxBracket(null);
      setTaxFormData({
        income_from: '',
        income_to: '',
        base_tax: '',
        rate_percentage: '',
        excess_over: '',
        is_active: true,
      });
    }
    setShowTaxDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setEditingDeduction(null);
    setFormData({
      deduction_type: 'gsis',
      description: '',
      rate_type: 'percentage',
      rate_value: '',
      min_amount: '',
      max_amount: '',
      salary_min: '',
      salary_max: '',
      is_active: true,
    });
  };

  const handleCloseTaxDialog = () => {
    setShowTaxDialog(false);
    setEditingTaxBracket(null);
    setTaxFormData({
      income_from: '',
      income_to: '',
      base_tax: '',
      rate_percentage: '',
      excess_over: '',
      is_active: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.deduction_type || !formData.rate_value) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      let url: string;
      let method: string;

      if (editingDeduction) {
        // Use POST fallback with id in URL path
        url = `/api/deductions/${editingDeduction.id}`;
        method = 'POST';
      } else {
        url = '/api/deductions';
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save deduction');
      }

      toast({
        title: 'Success',
        description: editingDeduction ? 'Deduction updated successfully' : 'Deduction created successfully',
      });

      handleCloseDialog();
      fetchDeductions();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save deduction',
        variant: 'destructive',
      });
    }
  };

  const handleTaxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let url: string;
      let method: string;

      if (editingTaxBracket) {
        // Use POST fallback with id in URL path
        url = `/api/deductions/tax-brackets/${editingTaxBracket.id}`;
        method = 'POST';
      } else {
        url = '/api/deductions/tax-brackets';
        method = 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(taxFormData),
      });

      if (!response.ok) throw new Error('Failed to save tax bracket');

      toast({
        title: 'Success',
        description: editingTaxBracket ? 'Tax bracket updated successfully' : 'Tax bracket created successfully',
      });

      handleCloseTaxDialog();
      fetchTaxBrackets();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save tax bracket',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDeduction = async (id: number) => {
    if (!confirm('Are you sure you want to delete this deduction rate?')) {
      return;
    }

    try {
      const response = await fetch(`/api/deductions/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete deduction');

      toast({
        title: 'Success',
        description: 'Deduction deleted successfully',
      });

      fetchDeductions();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete deduction',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTaxBracket = async (id: number) => {
    if (!confirm('Are you sure you want to delete this tax bracket?')) {
      return;
    }

    try {
      const response = await fetch(`/api/deductions/tax-brackets/${id}/delete`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to delete tax bracket');

      toast({
        title: 'Success',
        description: 'Tax bracket deleted successfully',
      });

      fetchTaxBrackets();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tax bracket',
        variant: 'destructive',
      });
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Type', 'Description', 'Rate Type', 'Rate Value', 'Min', 'Max', 'Salary Min', 'Salary Max', 'Status'].join(','),
      ...deductions.map(d => [
        d.deduction_type,
        `"${d.description}"`,
        d.rate_type,
        d.rate_value,
        d.min_amount || '',
        d.max_amount || '',
        d.salary_min || '',
        d.salary_max || '',
        d.is_active ? 'Active' : 'Inactive'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deductions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDeductionsByType = (type: string) => {
    return deductions.filter(d => d.deduction_type === type);
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(Number(amount));
  };

  const deductionTypes = [
    { id: 'gsis', name: 'GSIS', icon: Shield, color: 'text-blue-600' },
    { id: 'philhealth', name: 'PhilHealth', icon: Heart, color: 'text-green-600' },
    { id: 'pagibig', name: 'Pag-IBIG', icon: Home, color: 'text-orange-600' },
    { id: 'tax', name: 'Withholding Tax', icon: Receipt, color: 'text-purple-600' },
    { id: 'other', name: 'Other Deductions', icon: Calculator, color: 'text-gray-600' },
  ];

  const totalDeductions = deductions.length;
  const activeDeductions = deductions.filter(d => d.is_active).length;
  const gsisRates = getDeductionsByType('gsis').length;
  const philhealthRates = getDeductionsByType('philhealth').length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Deductions Management</h1>
            <p className="text-muted-foreground">Configure government mandated and other deduction rates</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Deduction Rate
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Rates
              </CardTitle>
              <TrendingDown className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{totalDeductions}</div>
              <p className="text-xs text-muted-foreground">All deduction types</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Rates
              </CardTitle>
              <Shield className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeDeductions}</div>
              <p className="text-xs text-muted-foreground">Currently in use</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                GSIS Rates
              </CardTitle>
              <Shield className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{gsisRates}</div>
              <p className="text-xs text-muted-foreground">Government Service Insurance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                PhilHealth Rates
              </CardTitle>
              <Heart className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{philhealthRates}</div>
              <p className="text-xs text-muted-foreground">Health insurance</p>
            </CardContent>
          </Card>
        </div>

        {/* Info Alert */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> Deduction rates are automatically applied during payroll generation based on employee salary brackets. 
            Ensure rates are up-to-date with current government regulations.
          </AlertDescription>
        </Alert>

        {/* Deductions Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Deduction Rates by Type</CardTitle>
            <CardDescription>Configure rates for each deduction category</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                {deductionTypes.map((type) => {
                  const Icon = type.icon;
                  const count = getDeductionsByType(type.id).length;
                  return (
                    <TabsTrigger key={type.id} value={type.id}>
                      <Icon className={`h-4 w-4 mr-2 ${type.color}`} />
                      {type.name}
                      <Badge variant="outline" className="ml-2">{count}</Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {deductionTypes.map((type) => (
                <TabsContent key={type.id} value={type.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold">{type.name} Configuration</h3>
                      <p className="text-sm text-muted-foreground">
                        {getDeductionsByType(type.id).length} rate{getDeductionsByType(type.id).length !== 1 ? 's' : ''} configured
                      </p>
                    </div>
                    {type.id === 'tax' ? (
                      <Button onClick={() => handleOpenTaxDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Tax Bracket
                      </Button>
                    ) : (
                      <Button onClick={() => {
                        setFormData({ ...formData, deduction_type: type.id });
                        handleOpenDialog();
                      }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Rate
                      </Button>
                    )}
                  </div>

                  {type.id === 'tax' ? (
                    // Tax Brackets Table
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Income Range</TableHead>
                            <TableHead>Base Tax</TableHead>
                            <TableHead>Rate %</TableHead>
                            <TableHead>Excess Over</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {taxBrackets.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No tax brackets configured. Add your first tax bracket.
                              </TableCell>
                            </TableRow>
                          ) : (
                            taxBrackets.map((bracket) => (
                              <TableRow key={bracket.id}>
                                <TableCell>
                                  <div className="font-medium">
                                    {formatCurrency(bracket.income_from)} - {formatCurrency(bracket.income_to)}
                                  </div>
                                </TableCell>
                                <TableCell>{formatCurrency(bracket.base_tax)}</TableCell>
                                <TableCell>{bracket.rate_percentage}%</TableCell>
                                <TableCell>{formatCurrency(bracket.excess_over)}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={bracket.is_active ? 'default' : 'secondary'}>
                                    {bracket.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpenTaxDialog(bracket)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteTaxBracket(bracket.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    // Regular Deductions Table
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Description</TableHead>
                            <TableHead>Rate Type</TableHead>
                            <TableHead>Rate Value</TableHead>
                            <TableHead>Salary Range</TableHead>
                            <TableHead>Amount Range</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getDeductionsByType(type.id).length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No rates configured for {type.name}. Add your first rate.
                              </TableCell>
                            </TableRow>
                          ) : (
                            getDeductionsByType(type.id).map((deduction) => (
                              <TableRow key={deduction.id}>
                                <TableCell>
                                  <div className="font-medium">{deduction.description || 'N/A'}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline">
                                    {deduction.rate_type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <span className="font-semibold">
                                    {deduction.rate_type === 'percentage' 
                                      ? `${deduction.rate_value}%` 
                                      : formatCurrency(deduction.rate_value)}
                                  </span>
                                </TableCell>
                                <TableCell>
                                  {deduction.salary_min && deduction.salary_max ? (
                                    <div className="text-sm">
                                      {formatCurrency(deduction.salary_min)} - {formatCurrency(deduction.salary_max)}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  {deduction.min_amount && deduction.max_amount ? (
                                    <div className="text-sm">
                                      {formatCurrency(deduction.min_amount)} - {formatCurrency(deduction.max_amount)}
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Badge variant={deduction.is_active ? 'default' : 'secondary'}>
                                    {deduction.is_active ? 'Active' : 'Inactive'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleOpenDialog(deduction)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteDeduction(deduction.id)}
                                      className="text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Add/Edit Deduction Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingDeduction ? 'Edit Deduction Rate' : 'Add Deduction Rate'}</DialogTitle>
              <DialogDescription>
                Configure the deduction rate details. Rates can be percentage-based or fixed amounts.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deduction_type">Deduction Type *</Label>
                    <Select 
                      value={formData.deduction_type} 
                      onValueChange={(value) => setFormData({ ...formData, deduction_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gsis">GSIS</SelectItem>
                        <SelectItem value="philhealth">PhilHealth</SelectItem>
                        <SelectItem value="pagibig">Pag-IBIG</SelectItem>
                        <SelectItem value="tax">Withholding Tax</SelectItem>
                        <SelectItem value="other">Other Deductions</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rate_type">Rate Type *</Label>
                    <Select 
                      value={formData.rate_type} 
                      onValueChange={(value) => setFormData({ ...formData, rate_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select rate type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage (%)</SelectItem>
                        <SelectItem value="fixed">Fixed Amount (₱)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., GSIS Contribution Rate for employees earning 10k-20k"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rate_value">
                    Rate Value * {formData.rate_type === 'percentage' ? '(%)' : '(₱)'}
                  </Label>
                  <Input
                    id="rate_value"
                    type="number"
                    step="0.01"
                    placeholder={formData.rate_type === 'percentage' ? 'e.g., 9.00' : 'e.g., 100.00'}
                    value={formData.rate_value}
                    onChange={(e) => setFormData({ ...formData, rate_value: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salary_min">Min Salary (₱)</Label>
                    <Input
                      id="salary_min"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 10000.00"
                      value={formData.salary_min}
                      onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary_max">Max Salary (₱)</Label>
                    <Input
                      id="salary_max"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 20000.00"
                      value={formData.salary_max}
                      onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="min_amount">Min Amount (₱)</Label>
                    <Input
                      id="min_amount"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 100.00"
                      value={formData.min_amount}
                      onChange={(e) => setFormData({ ...formData, min_amount: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max_amount">Max Amount (₱)</Label>
                    <Input
                      id="max_amount"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 5000.00"
                      value={formData.max_amount}
                      onChange={(e) => setFormData({ ...formData, max_amount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300"
                    aria-label="Set deduction rate as active"
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">
                    Active (apply this rate during payroll generation)
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDeduction ? 'Update Rate' : 'Create Rate'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Add/Edit Tax Bracket Dialog */}
        <Dialog open={showTaxDialog} onOpenChange={setShowTaxDialog}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingTaxBracket ? 'Edit Tax Bracket' : 'Add Tax Bracket'}</DialogTitle>
              <DialogDescription>
                Configure withholding tax bracket based on BIR regulations.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleTaxSubmit}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="income_from">Income From (₱) *</Label>
                    <Input
                      id="income_from"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 0.00"
                      value={taxFormData.income_from}
                      onChange={(e) => setTaxFormData({ ...taxFormData, income_from: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="income_to">Income To (₱) *</Label>
                    <Input
                      id="income_to"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 20833.00"
                      value={taxFormData.income_to}
                      onChange={(e) => setTaxFormData({ ...taxFormData, income_to: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="base_tax">Base Tax (₱) *</Label>
                  <Input
                    id="base_tax"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 0.00"
                    value={taxFormData.base_tax}
                    onChange={(e) => setTaxFormData({ ...taxFormData, base_tax: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate_percentage">Tax Rate (%) *</Label>
                    <Input
                      id="rate_percentage"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 20.00"
                      value={taxFormData.rate_percentage}
                      onChange={(e) => setTaxFormData({ ...taxFormData, rate_percentage: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excess_over">Excess Over (₱) *</Label>
                    <Input
                      id="excess_over"
                      type="number"
                      step="0.01"
                      placeholder="e.g., 20833.00"
                      value={taxFormData.excess_over}
                      onChange={(e) => setTaxFormData({ ...taxFormData, excess_over: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="tax_is_active"
                    checked={taxFormData.is_active}
                    onChange={(e) => setTaxFormData({ ...taxFormData, is_active: e.target.checked })}
                    className="rounded border-gray-300"
                    aria-label="Set tax bracket as active"
                  />
                  <Label htmlFor="tax_is_active" className="cursor-pointer">
                    Active
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseTaxDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTaxBracket ? 'Update Bracket' : 'Create Bracket'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
