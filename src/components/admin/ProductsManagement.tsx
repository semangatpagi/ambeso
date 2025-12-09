import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { CoffeeProductForm } from "./CoffeeProductForm";
import { NonCoffeeProductForm } from "./NonCoffeeProductForm";
import { toast } from "sonner";
import { Loader2, Pencil, Trash2, Plus, Coffee, Package } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  origin: string;
  product_type: string;
  roast_level: string;
  grind_type: string;
  weight_g: number;
  acidity_level: string | null;
  body_level: string | null;
  altitude_m: number | null;
  variety: string | null;
  processing_method: string | null;
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  is_coffee: boolean;
};

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  green_bean: "Green Bean",
  roasted_coffee: "Roasted Coffee",
  ground_coffee: "Ground Coffee",
  dripen: "DRIPEN",
  capsule: "Capsule",
  others: "Others",
  non_coffee: "Non-Coffee",
};

export const ProductsManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [coffeeDialogOpen, setCoffeeDialogOpen] = useState(false);
  const [nonCoffeeDialogOpen, setNonCoffeeDialogOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error("Gagal memuat products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Produk berhasil dihapus");
      fetchProducts();
    } catch (error) {
      toast.error("Gagal menghapus produk");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    if (product.is_coffee) {
      setCoffeeDialogOpen(true);
    } else {
      setNonCoffeeDialogOpen(true);
    }
  };

  const handleAddCoffee = () => {
    setEditingProduct(null);
    setCoffeeDialogOpen(true);
  };

  const handleAddNonCoffee = () => {
    setEditingProduct(null);
    setNonCoffeeDialogOpen(true);
  };

  const handleCoffeeSuccess = () => {
    setCoffeeDialogOpen(false);
    setEditingProduct(null);
    fetchProducts();
  };

  const handleNonCoffeeSuccess = () => {
    setNonCoffeeDialogOpen(false);
    setEditingProduct(null);
    fetchProducts();
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
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
        <CardTitle>Manajemen Products</CardTitle>
        <div className="flex gap-2">
          <Dialog open={coffeeDialogOpen} onOpenChange={setCoffeeDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddCoffee}>
                <Coffee className="mr-2 h-4 w-4" />
                Tambah Produk Kopi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Produk Kopi" : "Tambah Produk Kopi"}
                </DialogTitle>
              </DialogHeader>
              <CoffeeProductForm
                product={editingProduct}
                onSuccess={handleCoffeeSuccess}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={nonCoffeeDialogOpen} onOpenChange={setNonCoffeeDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleAddNonCoffee}>
                <Package className="mr-2 h-4 w-4" />
                Tambah Produk Non Kopi
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? "Edit Produk Non Kopi" : "Tambah Produk Non Kopi"}
                </DialogTitle>
              </DialogHeader>
              <NonCoffeeProductForm
                product={editingProduct}
                onSuccess={handleNonCoffeeSuccess}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {product.is_coffee ? (
                        <Coffee className="h-4 w-4 text-primary" />
                      ) : (
                        <Package className="h-4 w-4 text-muted-foreground" />
                      )}
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.is_coffee ? product.origin : "-"}</TableCell>
                  <TableCell>Rp {product.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={product.in_stock ? "default" : "destructive"}>
                      {product.in_stock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
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
      </CardContent>
    </Card>
  );
};
