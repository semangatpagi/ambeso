import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.number().min(0, "Harga harus positif"),
  weight_g: z.number().min(1, "Berat wajib diisi"),
  image_url: z.string().nullable(),
  in_stock: z.boolean(),
  featured: z.boolean(),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  weight_g: number;
  image_url: string | null;
  in_stock: boolean;
  featured: boolean;
  is_coffee: boolean;
};

export const NonCoffeeProductForm = ({
  product,
  onSuccess,
}: {
  product: Product | null;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url || null);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      weight_g: 100,
      image_url: null,
      in_stock: true,
      featured: false,
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      form.setValue('image_url', publicUrl);
      setImagePreview(publicUrl);
      toast.success("Gambar berhasil diupload");
    } catch (error: any) {
      toast.error(error.message || "Gagal mengupload gambar");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    form.setValue('image_url', null);
    setImagePreview(null);
  };

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      const submitData: any = {
        ...values,
        is_coffee: false,
        product_type: "non_coffee",
        origin: "N/A",
        roast_level: "None",
        grind_type: "None",
        tasting_notes: [],
        flavor_profile: [],
      };

      if (product) {
        const { error } = await supabase
          .from("products")
          .update(submitData)
          .eq("id", product.id);

        if (error) throw error;
        toast.success("Produk berhasil diupdate");
      } else {
        const { error } = await supabase
          .from("products")
          .insert([submitData]);

        if (error) throw error;
        toast.success("Produk berhasil ditambahkan");
      }
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Informasi Produk</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Produk</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (URL)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deskripsi</FormLabel>
                <FormControl>
                  <Textarea {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga (Rp)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight_g"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Berat (gram)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Gambar Produk</h3>
          
          <div className="flex items-start gap-4">
            {imagePreview ? (
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Upload</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading}
                />
              </label>
            )}
            {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
          </div>
        </div>

        {/* Status */}
        <div className="flex gap-6">
          <FormField
            control={form.control}
            name="in_stock"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>In Stock</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormLabel>Featured</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading || uploading} className="flex-1">
            {loading ? "Menyimpan..." : product ? "Update Produk" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
