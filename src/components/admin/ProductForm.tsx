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

const productSchema = z.object({
  name: z.string().min(1, "Nama produk wajib diisi"),
  slug: z.string().min(1, "Slug wajib diisi"),
  description: z.string().min(1, "Deskripsi wajib diisi"),
  price: z.number().min(0, "Harga harus positif"),
  origin: z.string().min(1, "Origin wajib diisi"),
  roast_level: z.string().min(1, "Roast level wajib diisi"),
  grind_type: z.string().min(1, "Grind type wajib diisi"),
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
};

export const ProductForm = ({
  product,
  onSuccess,
}: {
  product: Product | null;
  onSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product || {
      name: "",
      slug: "",
      description: "",
      price: 0,
      origin: "",
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

  const onSubmit = async (values: ProductFormValues) => {
    setLoading(true);
    try {
      const submitData: any = {
        ...values,
        tasting_notes: [],
        flavor_profile: values.variety ? [values.variety] : [],
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="roast_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Roast Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
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

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="acidity_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acidity Level</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || undefined}>
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
                <Select onValueChange={field.onChange} value={field.value || undefined}>
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

          <FormField
            control={form.control}
            name="processing_method"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processing Method</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value || ""} placeholder="e.g., Washed, Natural" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input {...field} value={field.value || ""} placeholder="https://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Menyimpan..." : product ? "Update Produk" : "Tambah Produk"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
