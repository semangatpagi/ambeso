import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const PRODUCT_TYPES = [
  { value: "green_bean", label: "Green Bean" },
  { value: "roasted_coffee", label: "Roasted Coffee" },
  { value: "ground_coffee", label: "Ground Coffee" },
  { value: "dripen", label: "DRIPEN" },
  { value: "capsule", label: "Capsule" },
  { value: "others", label: "Others" },
];

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.number().min(0, "Harga harus positif"),
  origin: z.string().min(1, "Origin wajib diisi"),
  product_type: z.string().min(1, "Tipe produk wajib diisi"),
  roast_level: z.string().nullable(),
  grind_type: z.string().nullable(),
  weight_g: z.number().min(1, "Berat wajib diisi"),
  acidity_level: z.string().nullable(),
  body_level: z.string().nullable(),
  altitude_m: z.number().nullable(),
  variety: z.string().nullable(),
  processing_method: z.string().nullable(),
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

export const CoffeeProductForm = ({
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
      origin: "",
      product_type: "roasted_coffee",
      roast_level: "Medium",
      grind_type: "Whole Bean",
      weight_g: 250,
      acidity_level: null,
      body_level: null,
      altitude_m: null,
      variety: null,
      processing_method: null,
      image_url: null,
      in_stock: true,
      featured: false,
    },
  });

  const productType = form.watch("product_type");
  const isGreenBean = productType === "green_bean";

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
        is_coffee: true,
        tasting_notes: [],
        flavor_profile: values.variety ? [values.variety] : [],
        roast_level: isGreenBean ? "None" : (values.roast_level || "Medium"),
        grind_type: isGreenBean ? "None" : (values.grind_type || "Whole Bean"),
        acidity_level: isGreenBean ? null : values.acidity_level,
        body_level: isGreenBean ? null : values.body_level,
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
          <h3 className="font-semibold text-lg border-b pb-2">Informasi Dasar</h3>
          
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

          <FormField
            control={form.control}
            name="product_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Produk</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tipe produk" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-3 gap-4">
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

            <FormField
              control={form.control}
              name="altitude_m"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altitude (m)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g., Toraja, Sulawesi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variety"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Varietas</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value || ""} placeholder="e.g., Typica, Bourbon" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="processing_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processing Method</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="e.g., Washed, Natural, Honey" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Roasted Parameters Section */}
        <div className={`space-y-4 p-4 rounded-lg border ${isGreenBean ? 'opacity-50 bg-muted' : ''}`}>
          <h3 className="font-semibold text-lg border-b pb-2">
            Parameter Roasting
            {isGreenBean && <span className="text-sm font-normal text-muted-foreground ml-2">(Tidak berlaku untuk Green Bean)</span>}
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="roast_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Roast Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                    disabled={isGreenBean}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Light">Light</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Dark">Dark</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="grind_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Grind Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                    disabled={isGreenBean}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Whole Bean">Whole Bean</SelectItem>
                      <SelectItem value="Fine">Fine</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Coarse">Coarse</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="acidity_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acidity Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                    disabled={isGreenBean}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Body Level</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value || undefined}
                    disabled={isGreenBean}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
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
