import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Package, Flame, Coffee, Mountain, Leaf, MapPin, Droplets, Scale } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  origin: string;
  roast_level: string;
  grind_type: string;
  price: number;
  image_url: string | null;
  weight_g: number;
  tasting_notes: string[];
  in_stock: boolean;
  featured: boolean;
  created_at: string;
  acidity_level: string | null;
  body_level: string | null;
  altitude_m: number | null;
  variety: string | null;
  processing_method: string | null;
  flavor_profile: string[] | null;
  category_id: string | null;
  product_type: string;
  is_coffee: boolean;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  green_bean: "Green Bean",
  roasted_coffee: "Roasted Coffee",
  ground_coffee: "Ground Coffee",
  dripen: "DRIPEN",
  capsule: "Capsule",
  others: "Others",
};

const CollectionDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("Error fetching product:", error);
    } else {
      setProduct(data);
    }
    setLoading(false);
  };

  const roastLevelLabel: Record<string, string> = {
    light: "Light Roast",
    medium: "Medium Roast",
    dark: "Dark Roast",
    Light: "Light Roast",
    Medium: "Medium Roast",
    Dark: "Dark Roast",
  };

  const grindTypeLabel: Record<string, string> = {
    "whole-bean": "Whole Bean",
    "whole_bean": "Whole Bean",
    ground: "Ground",
    "drip-bag": "Drip Bag",
    drip_bag: "Drip Bag",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-32 pb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-[600px] rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-32 pb-20 text-center">
          <Coffee className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
          <h1 className="text-3xl font-bold mb-4">Produk Tidak Ditemukan</h1>
          <p className="text-muted-foreground mb-8">
            Maaf, produk yang Anda cari tidak tersedia.
          </p>
          <Link to="/collection">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Koleksi
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <Link
            to="/collection"
            className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Koleksi
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 animate-fade-in">
            {/* Product Image */}
            <div className="glass rounded-3xl overflow-hidden">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover aspect-square"
                />
              ) : (
                <div className="w-full aspect-square flex items-center justify-center text-muted-foreground bg-muted">
                  {product.is_coffee ? (
                    <Coffee className="w-32 h-32" />
                  ) : (
                    <Package className="w-32 h-32" />
                  )}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Header */}
              <div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.featured && (
                    <Badge className="bg-accent text-accent-foreground">Featured</Badge>
                  )}
                  {product.is_coffee && (
                    <Badge variant="secondary">
                      {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}
                    </Badge>
                  )}
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
                {product.is_coffee && (
                  <div className="flex items-center gap-2 text-lg text-foreground/70">
                    <MapPin className="h-5 w-5 text-secondary" />
                    <span>{product.origin}</span>
                  </div>
                )}
              </div>

              {/* Tasting Notes */}
              {product.is_coffee && product.tasting_notes && product.tasting_notes.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-foreground/60 uppercase tracking-wider mb-3">
                    Tasting Notes
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {product.tasting_notes.map((note) => (
                      <span
                        key={note}
                        className="px-4 py-2 text-sm font-medium bg-secondary/10 text-secondary rounded-full"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Product Specs - Coffee */}
              {product.is_coffee && (
                <div className="glass rounded-2xl p-6">
                  <h3 className="text-sm font-medium text-foreground/60 uppercase tracking-wider mb-4">
                    Spesifikasi
                  </h3>
                  <div className="grid grid-cols-2 gap-6">
                    {product.altitude_m && (
                      <div className="flex items-start gap-3">
                        <Mountain className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground/60">Ketinggian</p>
                          <p className="font-semibold">{product.altitude_m} mdpl</p>
                        </div>
                      </div>
                    )}

                    {product.processing_method && (
                      <div className="flex items-start gap-3">
                        <Leaf className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground/60">Proses</p>
                          <p className="font-semibold">{product.processing_method}</p>
                        </div>
                      </div>
                    )}

                    {product.roast_level && product.product_type !== "green_bean" && (
                      <div className="flex items-start gap-3">
                        <Flame className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground/60">Roast Level</p>
                          <p className="font-semibold">
                            {roastLevelLabel[product.roast_level] || product.roast_level}
                          </p>
                        </div>
                      </div>
                    )}

                    {product.grind_type && (
                      <div className="flex items-start gap-3">
                        <Coffee className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground/60">Grind Type</p>
                          <p className="font-semibold">
                            {grindTypeLabel[product.grind_type] || product.grind_type}
                          </p>
                        </div>
                      </div>
                    )}

                    {product.variety && (
                      <div className="flex items-start gap-3">
                        <Droplets className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground/60">Varietas</p>
                          <p className="font-semibold">{product.variety}</p>
                        </div>
                      </div>
                    )}

                    {product.weight_g && (
                      <div className="flex items-start gap-3">
                        <Scale className="w-5 h-5 text-secondary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground/60">Berat</p>
                          <p className="font-semibold">{product.weight_g}g</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Flavor Profile */}
                  {(product.acidity_level || product.body_level) && (
                    <div className="mt-6 pt-6 border-t border-foreground/10">
                      <h4 className="text-sm font-medium text-foreground/60 mb-4">Profil Rasa</h4>
                      <div className="space-y-3">
                        {product.acidity_level && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Acidity</span>
                              <span className="font-medium">{product.acidity_level}</span>
                            </div>
                            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{
                                  width:
                                    product.acidity_level === "low"
                                      ? "33%"
                                      : product.acidity_level === "medium"
                                      ? "66%"
                                      : "100%",
                                }}
                              />
                            </div>
                          </div>
                        )}
                        {product.body_level && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Body</span>
                              <span className="font-medium">{product.body_level}</span>
                            </div>
                            <div className="h-2 bg-foreground/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-secondary rounded-full"
                                style={{
                                  width:
                                    product.body_level === "light"
                                      ? "33%"
                                      : product.body_level === "medium"
                                      ? "66%"
                                      : "100%",
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tabs */}
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full glass">
                  <TabsTrigger value="description" className="flex-1">
                    Deskripsi
                  </TabsTrigger>
                  {product.is_coffee && (
                    <>
                      <TabsTrigger value="origin" className="flex-1">
                        Asal Usul
                      </TabsTrigger>
                      <TabsTrigger value="brewing" className="flex-1">
                        Cara Seduh
                      </TabsTrigger>
                    </>
                  )}
                </TabsList>

                <TabsContent value="description" className="glass rounded-2xl p-6 mt-4">
                  <p className="text-foreground/80 leading-relaxed">{product.description}</p>
                </TabsContent>

                {product.is_coffee && (
                  <>
                    <TabsContent value="origin" className="glass rounded-2xl p-6 mt-4">
                      <div className="space-y-4 text-foreground/80 leading-relaxed">
                        <p>
                          Kopi ini berasal dari <strong>{product.origin}</strong>, salah satu
                          wilayah penghasil kopi terbaik di Sulawesi. Para petani di daerah ini
                          telah mewarisi tradisi menanam kopi selama beberapa generasi.
                        </p>
                        {product.altitude_m && (
                          <p>
                            Ditanam pada ketinggian <strong>{product.altitude_m} mdpl</strong>,
                            kondisi iklim yang sejuk dan tanah vulkanik yang subur memberikan
                            karakteristik rasa yang unik pada setiap biji kopi.
                          </p>
                        )}
                        {product.processing_method && (
                          <p>
                            Metode pengolahan <strong>{product.processing_method}</strong> yang
                            digunakan memastikan setiap biji kopi mencapai potensi rasa
                            terbaiknya.
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="brewing" className="glass rounded-2xl p-6 mt-4">
                      <div className="space-y-6">
                        <div>
                          <h4 className="font-semibold mb-2">Rasio yang Direkomendasikan</h4>
                          <p className="text-foreground/70">
                            1:15 kopi dengan air (contoh: 15g kopi untuk 225ml air)
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Suhu Air</h4>
                          <p className="text-foreground/70">90-96°C (195-205°F)</p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Waktu Seduh</h4>
                          <p className="text-foreground/70">
                            3-4 menit untuk ekstraksi optimal
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Tips</h4>
                          <p className="text-foreground/70">
                            Gunakan air mineral dengan TDS 100-150 ppm untuk hasil terbaik.
                            Grind size disesuaikan dengan metode seduh pilihan Anda.
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </>
                )}
              </Tabs>

              {/* Contact CTA */}
              <div className="glass rounded-2xl p-6 text-center">
                <p className="text-foreground/70 mb-4">
                  Tertarik dengan produk ini? Hubungi kami untuk informasi lebih lanjut.
                </p>
                <a
                  href="mailto:hello@ambeso.com"
                  className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CollectionDetail;