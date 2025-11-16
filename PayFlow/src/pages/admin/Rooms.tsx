import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Check, Trash2, RefreshCw } from 'lucide-react';
import { AddRoomDialog } from '@/components/AddRoomDialog';
import { Room } from '@/lib/mockData';
import { Layout } from '@/components/Layout';
import { DataTable, ColumnDef } from '@/components/DataTable';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmationAlert } from '@/components/ConfirmationAlert';

export default function Rooms() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmDeactivate, setConfirmDeactivate] = useState<{ open: boolean; roomId: string | null; roomName: string }>({ open: false, roomId: null, roomName: '' });
  const [confirmRestore, setConfirmRestore] = useState<{ open: boolean; roomId: string | null; roomName: string }>({ open: false, roomId: null, roomName: '' });

  const canManageRooms = user?.role === 'admin' || user?.role === 'hr';

  // Fetch rooms from backend
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = () => {
    setLoading(true);
    fetch('/api/rooms', { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch rooms');
        const data = await res.json().catch(() => ({}));
        const rows = data.rooms || [];
        const mapped: Room[] = rows.map((r: any) => ({
          id: String(r.id),
          code: r.code,
          name: r.name,
          floor: r.floor as '1st Floor' | '2nd Floor',
          type: r.type as 'Classroom' | 'Laboratory',
          isActive: Boolean(r.is_active)
        }));
        setRooms(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching rooms:', err);
        toast({
          title: 'Error',
          description: 'Failed to fetch rooms from server',
          variant: 'destructive'
        });
        setLoading(false);
      });
  };

  const handleAddRoom = (newRoom: Omit<Room, 'id' | 'isActive'>) => {
    fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newRoom)
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to create room');
        
        toast({
          title: 'Room Added',
          description: `"${newRoom.name}" has been added successfully.`,
          variant: 'success'
        });
        
        // Refresh the list
        fetchRooms();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to add room',
          variant: 'destructive'
        });
      });
  };

  const handleToggleStatus = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (room?.isActive) {
      setConfirmDeactivate({ open: true, roomId, roomName: room.name });
    } else {
      setConfirmRestore({ open: true, roomId, roomName: room?.name ?? '' });
    }
  };

  const handleConfirmDeactivate = () => {
    if (confirmDeactivate.roomId) {
      fetch('/api/rooms/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: confirmDeactivate.roomId, is_active: 0 })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.error || 'Failed to deactivate');
          
          toast({
            title: 'Room Deactivated',
            description: `"${confirmDeactivate.roomName}" has been deactivated successfully.`,
            variant: 'success'
          });
          
          fetchRooms();
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message || 'Failed to deactivate room',
            variant: 'destructive'
          });
        });
    }
    setConfirmDeactivate({ open: false, roomId: null, roomName: '' });
  };

  const handleConfirmRestore = () => {
    if (confirmRestore.roomId) {
      fetch('/api/rooms/toggle-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: confirmRestore.roomId, is_active: 1 })
      })
        .then(async (res) => {
          const data = await res.json().catch(() => ({}));
          if (!res.ok) throw new Error(data?.error || 'Failed to restore');
          
          toast({
            title: 'Room Restored',
            description: `"${confirmRestore.roomName}" has been restored successfully.`,
            variant: 'success'
          });
          
          fetchRooms();
        })
        .catch((err) => {
          toast({
            title: 'Error',
            description: err.message || 'Failed to restore room',
            variant: 'destructive'
          });
        });
    }
    setConfirmRestore({ open: false, roomId: null, roomName: '' });
  };

  const handleSaveEdit = (id: string | number, updates: Partial<Room>) => {
    // Check for unique room code if code is being updated
    if (updates.code) {
      const existingRoom = rooms.find(r => r.code === updates.code && r.id !== String(id));
      if (existingRoom) {
        toast({
          title: 'Duplicate Room Code',
          description: 'Room code must be unique. This code is already in use.',
          variant: 'destructive'
        });
        return;
      }
    }

    // Auto-set type based on floor if floor is updated
    if (updates.floor) {
      const f = String(updates.floor);
      if (f.includes('1st') || f === '1st' || f.includes('1st Floor')) {
        updates.type = 'Classroom';
        updates.floor = '1st Floor';
      } else if (f.includes('2nd') || f === '2nd' || f.includes('2nd Floor')) {
        updates.type = 'Laboratory';
        updates.floor = '2nd Floor';
      }
    }

    fetch('/api/rooms/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ id, ...updates })
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || 'Failed to update');
        
        toast({
          title: 'Room Updated',
          description: 'Room information has been successfully updated.',
          variant: 'success'
        });
        
        fetchRooms();
      })
      .catch((err) => {
        toast({
          title: 'Error',
          description: err.message || 'Failed to update room',
          variant: 'destructive'
        });
      });
  };

  const stats = {
    total: rooms.length,
    active: rooms.filter((r) => r.isActive).length,
    classrooms: rooms.filter((r) => r.type === 'Classroom').length,
    laboratories: rooms.filter((r) => r.type === 'Laboratory').length,
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <Building2 className="h-8 w-8" /> Room Management
              </h1>
              <p className="text-muted-foreground">Manage BSIT department rooms</p>
            </div>
          </div>
          <div className="text-center py-8">Loading rooms...</div>
        </div>
      </Layout>
    );
  }

  const columns: ColumnDef<Room>[] = [
    { 
      key: 'code', 
      label: 'Room Code', 
      sortable: true, 
      width: '20', 
      className: 'font-mono font-semibold whitespace-nowrap',
      editRender: (value: any, _row: Room, onChange: (val: any) => void) => (
        <Input 
          value={String(value || '')} 
          onChange={(e: any) => onChange(e.target.value)} 
          className="w-[140px]" 
          placeholder="ITRM101"
        />
      )
    },
    { 
      key: 'name', 
      label: 'Room Name', 
      sortable: true,
      editRender: (value: any, _row: Room, onChange: (val: any) => void) => (
        <Input 
          value={String(value || '')} 
          onChange={(e: any) => onChange(e.target.value)} 
          className="w-[200px]" 
          placeholder="IT Room 101"
        />
      )
    },
    { 
      key: 'floor', 
      label: 'Floor', 
      sortable: true, 
      align: 'center', 
      width: '24', 
      className: 'whitespace-nowrap',
      render: (v: string) => {
        const val = String(v || '');
        return <Badge className="whitespace-nowrap px-2 py-0.5 text-xs" variant={val.includes('1st') ? 'secondary' : 'default'}>{val}</Badge>;
      },
      editRender: (value: any, _row: Room, onChange: (val: any) => void, onChangeMultiple?: (updates: Partial<Room>) => void) => (
        <Select 
          value={String(value || '')} 
          onValueChange={(v: any) => {
            // v will be the long form (e.g. '1st Floor') so store that to keep types consistent
            onChange(v);
            // Also update the type field immediately when floor changes
            if (onChangeMultiple) {
              onChangeMultiple({ 
                floor: v, 
                type: String(v).includes('1st') ? 'Classroom' : 'Laboratory' 
              });
            }
          }}
        >
          <SelectTrigger className="h-8 w-[90px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1st Floor">1st</SelectItem>
            <SelectItem value="2nd Floor">2nd</SelectItem>
          </SelectContent>
        </Select>
      )
    },
    { 
      key: 'type', 
      label: 'Type', 
      sortable: true, 
      align: 'center', 
      width: '24', 
      className: 'whitespace-nowrap',
      render: (v: string) => <Badge className="whitespace-nowrap px-2 py-0.5 text-xs" variant={v === 'Laboratory' ? 'default' : 'secondary'}>{v}</Badge> 
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Building2 className="h-8 w-8" /> Room Management
            </h1>
            <p className="text-muted-foreground">Manage BSIT department rooms</p>
          </div>
          {canManageRooms && <AddRoomDialog onAddRoom={handleAddRoom} />}
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Rooms</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active</CardTitle>
              <Check className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Classrooms</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.classrooms}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Laboratories</CardTitle>
              <Building2 className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.laboratories}</div>
            </CardContent>
          </Card>
        </div>

        <DataTable<Room>
          data={rooms}
          columns={columns}
          searchPlaceholder="Search by room code or name..."
          searchableFields={['code', 'name']}
          itemsPerPage={10}
          canManage={canManageRooms}
          onEdit={() => {}}
          editableFields={['code', 'name', 'floor']}
          onSave={handleSaveEdit}
          showArchive={true}
          archiveButtonLabel="Archives"
          actions={[
            { label: 'Deactivate', icon: <Trash2 className="h-4 w-4" />, onClick: (row) => handleToggleStatus(String(row.id)), tooltip: 'Deactivate room', className: 'text-primary hover:bg-white', condition: (row) => row.isActive },
            { label: 'Restore', icon: <RefreshCw className="h-4 w-4" />, onClick: (row) => handleToggleStatus(String(row.id)), tooltip: 'Restore room', className: 'text-primary hover:bg-white', condition: (row) => !row.isActive }
          ]}
        />

        <ConfirmationAlert
          open={confirmDeactivate.open}
          title="Deactivate Room"
          description={`Are you sure you want to deactivate "${confirmDeactivate.roomName}"? This action can be reversed by restoring the room later.`}
          onConfirm={handleConfirmDeactivate}
          onCancel={() => setConfirmDeactivate({ open: false, roomId: null, roomName: '' })}
          confirmText="Deactivate"
          cancelText="Cancel"
          variant="destructive"
        />

        <ConfirmationAlert
          open={confirmRestore.open}
          title="Restore Room"
          description={`Are you sure you want to restore "${confirmRestore.roomName}"? This will reactivate the room.`}
          onConfirm={handleConfirmRestore}
          onCancel={() => setConfirmRestore({ open: false, roomId: null, roomName: '' })}
          confirmText="Restore"
          cancelText="Cancel"
          variant="default"
        />
      </div>
    </Layout>
  );
}
