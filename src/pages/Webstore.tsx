import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Filter, Search, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Product = Tables<'products'>;

const PRODUCT_TYPE_LABELS: Record<string, string> = {
  green_bean: "Green Bean",
  roasted_coffee: "Roasted Coffee",
  ground_coffee: "Ground Coffee",
  dripen: "DRIPEN",
  capsule: "Capsule",
  others: "Others",
  non_coffee: "Non-Coffee",
};

const Webstore = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const { addItem } = useCart();

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

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === "all" || p.product_type === selectedType;
    return matchesSearch && matchesType;
  });

  const productTypes = ["all", ...new Set(products.map((p) => p.product_type))];

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Ditambahkan ke keranjang",
      description: `${product.name} berhasil ditambahkan.`,
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-28 pb-20">
        {/* Store Header */}
        <section className="container mx-auto px-4 mb-12">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/80 to-accent/30 p-10 md:p-16">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent blur-3xl" />
              <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-secondary blur-3xl" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <Badge className="bg-accent/20 text-accent border-accent/30 mb-4">
                <ShoppingBag className="h-3 w-3 mr-1" />
                Webstore
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Belanja Kopi Sulawesi
              </h1>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                Pesan langsung kopi premium dari dataran tinggi Sulawesi.
                Tersedia dalam berbagai varian dan ukuran.
              </p>
            </div>
          </div>
        </section>

        {/* Search & Filter Bar */}
        <section className="container mx-auto px-4 mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
              <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
              {productTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedType === type
                      ? "bg-accent text-accent-foreground"
                      : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-accent/50"
                  }`}
                >
                  {type === "all" ? "Semua" : PRODUCT_TYPE_LABELS[type] || type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-card border border-border">
                  <Skeleton className="w-full h-56" />
                  <div className="p-5">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-accent/40 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5"
                >
                  {/* Image */}
                  <Link to={`/collection/${product.slug}`} className="block relative h-56 overflow-hidden bg-muted">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {product.featured && (
                      <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs">
                        <Star className="h-3 w-3 mr-1" /> Best Seller
                      </Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className="absolute top-3 right-3 text-xs"
                    >
                      {PRODUCT_TYPE_LABELS[product.product_type] || product.product_type}
                    </Badge>
                  </Link>

                  {/* Info */}
                  <div className="p-5 space-y-3">
                    <Link to={`/collection/${product.slug}`}>
                      <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    {/* Tasting Notes */}
                    {product.tasting_notes && product.tasting_notes.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {product.tasting_notes.slice(0, 3).map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs bg-secondary/10 text-secondary rounded-full"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <p className="text-lg font-bold text-foreground">{formatPrice(product.price)}</p>
                        <p className="text-xs text-muted-foreground">{product.weight_g}g</p>
                      </div>
                      <Button
                        size="sm"
                        className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                        onClick={() => handleAddToCart(product)}
                      >
                        <ShoppingBag className="h-4 w-4 mr-1" />
                        Beli
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Tidak ada produk ditemukan.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Webstore;
