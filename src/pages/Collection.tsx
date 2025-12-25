import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Coffee, Package, MapPin, Mountain, Leaf, ArrowRight } from "lucide-react";
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
  is_coffee: boolean;
  product_type: string;
  altitude_m: number | null;
  processing_method: string | null;
}

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  green_bean: "Green Bean",
  roasted_coffee: "Roasted Coffee",
  ground_coffee: "Ground Coffee",
  dripen: "DRIPEN",
  capsule: "Capsule",
  others: "Others",
  non_coffee: "Non-Coffee",
};

const Collection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .order("featured", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const coffeeProducts = products.filter((p) => p.is_coffee);
  const nonCoffeeProducts = products.filter((p) => !p.is_coffee);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="container mx-auto px-4 mb-20">
          <div className="text-center max-w-3xl mx-auto animate-fade-in">
            <span className="text-secondary font-medium tracking-wider uppercase text-sm mb-4 block">
              Koleksi Produk
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Eksplorasi Kopi Sulawesi
            </h1>
            <p className="text-lg text-foreground/70 leading-relaxed">
              Setiap produk kami merupakan hasil kolaborasi dengan petani lokal Sulawesi.
              Temukan cerita di balik setiap biji kopi dan produk berkualitas kami.
            </p>
          </div>
        </section>

        {/* Coffee Products Section */}
        {loading ? (
          <section className="container mx-auto px-4 mb-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass rounded-3xl overflow-hidden">
                  <Skeleton className="w-full h-64" />
                  <div className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            {/* Coffee Collection */}
            {coffeeProducts.length > 0 && (
              <section className="container mx-auto px-4 mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Coffee className="h-6 w-6 text-secondary" />
                  <h2 className="text-2xl md:text-3xl font-bold">Koleksi Kopi</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {coffeeProducts.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/collection/${product.slug}`}
                      className="group glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Coffee className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex flex-col gap-2">
                          {product.featured && (
                            <Badge className="bg-accent text-accent-foreground">
                              Featured
                            </Badge>
                          )}
                          <Badge variant="secondary">
                            {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}
                          </Badge>
                        </div>

                        {/* Origin Badge */}
                        <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-secondary" />
                          <span className="text-xs font-medium">{product.origin}</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-foreground/70 text-sm leading-relaxed line-clamp-2">
                            {product.description}
                          </p>
                        </div>

                        {/* Product Details */}
                        <div className="grid grid-cols-2 gap-3">
                          {product.altitude_m && (
                            <div className="flex items-center gap-2 text-sm text-foreground/60">
                              <Mountain className="h-4 w-4 text-secondary" />
                              <span>{product.altitude_m} mdpl</span>
                            </div>
                          )}
                          {product.processing_method && (
                            <div className="flex items-center gap-2 text-sm text-foreground/60">
                              <Leaf className="h-4 w-4 text-secondary" />
                              <span>{product.processing_method}</span>
                            </div>
                          )}
                        </div>

                        {/* Tasting Notes */}
                        {product.tasting_notes && product.tasting_notes.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {product.tasting_notes.slice(0, 3).map((note, i) => (
                              <span
                                key={i}
                                className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full"
                              >
                                {note}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Learn More */}
                        <div className="pt-2 flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                          <span>Pelajari Lebih Lanjut</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Non-Coffee Collection */}
            {nonCoffeeProducts.length > 0 && (
              <section className="container mx-auto px-4 mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Package className="h-6 w-6 text-secondary" />
                  <h2 className="text-2xl md:text-3xl font-bold">Produk Lainnya</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {nonCoffeeProducts.map((product, index) => (
                    <Link
                      key={product.id}
                      to={`/collection/${product.slug}`}
                      className="group glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 animate-fade-in-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Product Image */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-16 h-16 text-muted-foreground" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                      </div>

                      {/* Product Info */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
                            {product.description}
                          </p>
                        </div>

                        {/* Learn More */}
                        <div className="pt-2 flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                          <span>Lihat Detail</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {products.length === 0 && (
              <section className="container mx-auto px-4">
                <div className="text-center py-20 glass rounded-3xl">
                  <Coffee className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">Belum ada produk tersedia.</p>
                </div>
              </section>
            )}
          </>
        )}

        {/* Story CTA */}
        <section className="container mx-auto px-4 mt-20">
          <div className="glass rounded-3xl p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ingin Tahu Lebih Banyak?
            </h2>
            <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
              Pelajari perjalanan kopi kami dari petani di dataran tinggi Sulawesi
              hingga sampai di tangan Anda.
            </p>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-full font-semibold hover:bg-accent/90 transition-colors"
            >
              <span>Cerita Kami</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Collection;