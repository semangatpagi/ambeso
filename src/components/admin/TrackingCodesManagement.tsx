import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Edit, Save, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type TrackingCode = {
  id: string;
  name: string;
  code_type: string;
  code_id: string;
  is_active: boolean;
  created_at: string;
};

const CODE_TYPES = [
  { value: "google_analytics", label: "Google Analytics", placeholder: "G-XXXXXXXXXX" },
  { value: "fb_pixel", label: "Facebook Pixel", placeholder: "1234567890123456" },
  { value: "tiktok_pixel", label: "TikTok Pixel", placeholder: "XXXXXXXXXXXXXXXXXX" },
  { value: "google_tag", label: "Google Tag Manager", placeholder: "GTM-XXXXXXX" },
];

export const TrackingCodesManagement = () => {
  const [codes, setCodes] = useState<TrackingCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<TrackingCode | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code_type: "",
    code_id: "",
    is_active: true,
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const { data, error } = await supabase
        .from("tracking_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCodes(data || []);
    } catch (error) {
      toast.error("Gagal memuat tracking codes");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.code_type || !formData.code_id) {
      toast.error("Semua field wajib diisi");
      return;
    }

    try {
      if (editingCode) {
        const { error } = await supabase
          .from("tracking_codes")
          .update(formData)
          .eq("id", editingCode.id);

        if (error) throw error;
        toast.success("Tracking code berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("tracking_codes")
          .insert([formData]);

        if (error) throw error;
        toast.success("Tracking code berhasil ditambahkan");
      }
      
      setDialogOpen(false);
      resetForm();
      fetchCodes();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus tracking code ini?")) return;

    try {
      const { error } = await supabase
        .from("tracking_codes")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Tracking code berhasil dihapus");
      fetchCodes();
    } catch (error) {
      toast.error("Gagal menghapus tracking code");
    }
  };

  const handleToggleActive = async (id: string, currentValue: boolean) => {
    try {
      const { error } = await supabase
        .from("tracking_codes")
        .update({ is_active: !currentValue })
        .eq("id", id);

      if (error) throw error;
      toast.success("Status berhasil diubah");
      fetchCodes();
    } catch (error) {
      toast.error("Gagal mengubah status");
    }
  };

  const handleEdit = (code: TrackingCode) => {
    setEditingCode(code);
    setFormData({
      name: code.name,
      code_type: code.code_type,
      code_id: code.code_id,
      is_active: code.is_active,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCode(null);
    setFormData({
      name: "",
      code_type: "",
      code_id: "",
      is_active: true,
    });
  };

  const getCodeTypeLabel = (type: string) => {
    return CODE_TYPES.find(t => t.value === type)?.label || type;
  };

  const getPlaceholder = (type: string) => {
    return CODE_TYPES.find(t => t.value === type)?.placeholder || "";
  };

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Tracking Codes</CardTitle>
          <CardDescription>
            Kelola Google Analytics, FB Pixel, TikTok Pixel, dan Google Tag Manager
          </CardDescription>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Tracking Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCode ? "Edit Tracking Code" : "Tambah Tracking Code"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Nama</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Main Analytics"
                />
              </div>

              <div>
                <Label>Tipe</Label>
                <Select 
                  value={formData.code_type} 
                  onValueChange={(v) => setFormData({ ...formData, code_type: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    {CODE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Code ID</Label>
                <Input
                  value={formData.code_id}
                  onChange={(e) => setFormData({ ...formData, code_id: e.target.value })}
                  placeholder={getPlaceholder(formData.code_type)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(v) => setFormData({ ...formData, is_active: v })}
                />
                <Label>Aktif</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSubmit} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {editingCode ? "Update" : "Simpan"}
                </Button>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Batal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {codes.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Belum ada tracking code. Klik "Tambah Tracking Code" untuk menambahkan.
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Tipe</TableHead>
                  <TableHead>Code ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {codes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell className="font-medium">{code.name}</TableCell>
                    <TableCell>{getCodeTypeLabel(code.code_type)}</TableCell>
                    <TableCell className="font-mono text-sm">{code.code_id}</TableCell>
                    <TableCell>
                      <Switch
                        checked={code.is_active}
                        onCheckedChange={() => handleToggleActive(code.id, code.is_active)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(code)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(code.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
