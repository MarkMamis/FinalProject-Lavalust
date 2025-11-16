import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Plus } from 'lucide-react';
import { Room } from '@/lib/mockData';

interface AddRoomDialogProps {
  onAddRoom: (room: Omit<Room, 'id' | 'isActive'>) => void;
}

export function AddRoomDialog({ onAddRoom }: AddRoomDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    floor: '1st Floor' as Room['floor'],
    type: 'Classroom' as Room['type'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || !formData.name) {
      alert('Please fill in all required fields');
      return;
    }
    onAddRoom(formData);
    setFormData({
      code: '',
      name: '',
      floor: '1st Floor',
      type: 'Classroom',
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>
              Add a new room to the BSIT department inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Room Code *</Label>
              <Input
                id="code"
                placeholder="e.g., ITRM109"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Room Name *</Label>
              <Input
                id="name"
                placeholder="e.g., IT Room 109"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="floor">Floor *</Label>
                <Select
                  value={formData.floor}
                  onValueChange={(value: Room['floor']) =>
                    setFormData({ ...formData, floor: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st Floor">1st Floor</SelectItem>
                    <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Room Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Room['type']) =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Classroom">Classroom</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <p className="font-medium mb-1">💡 Tip:</p>
              <p className="text-muted-foreground">
                Use consistent naming conventions. 1st floor rooms are typically classrooms,
                while 2nd floor rooms are laboratories.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Room</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
