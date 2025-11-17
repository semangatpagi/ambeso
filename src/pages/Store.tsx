import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Filter } from "lucide-react";
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
}

const Store = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const originFilter = searchParams.get("origin") || "all";
  const roastFilter = searchParams.get("roast") || "all";
  const grindFilter = searchParams.get("grind") || "all";

  useEffect(() => {
    fetchProducts();
  }, [originFilter, roastFilter, grindFilter]);

  const fetchProducts = async () => {
    setLoading(true);
    let query = supabase.from("products").select("*").eq("in_stock", true);

    if (originFilter !== "all") {
      query = query.eq("origin", originFilter);
    }
    if (roastFilter !== "all") {
      query = query.eq("roast_level", roastFilter);
    }
    if (grindFilter !== "all") {
      query = query.eq("grind_type", grindFilter);
    }

    const { data, error } = await query.order("featured", { ascending: false });
    
    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    setSearchParams(params);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Coffee Collection</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover premium coffee from the highlands of Sulawesi
          </p>
        </div>

        {/* Filters */}
        <div className="glass rounded-2xl p-6 mb-12 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" />
            <h2 className="font-semibold">Filter Products</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Origin</label>
              <Select value={originFilter} onValueChange={(v) => updateFilter("origin", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Origins</SelectItem>
                  <SelectItem value="Toraja">Toraja</SelectItem>
                  <SelectItem value="Gayo">Gayo</SelectItem>
                  <SelectItem value="Mandheling">Mandheling</SelectItem>
                  <SelectItem value="Sulawesi Blend">Sulawesi Blend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Roast Level</label>
              <Select value={roastFilter} onValueChange={(v) => updateFilter("roast", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roasts</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Grind Type</label>
              <Select value={grindFilter} onValueChange={(v) => updateFilter("grind", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="whole-bean">Whole Bean</SelectItem>
                  <SelectItem value="ground">Ground</SelectItem>
                  <SelectItem value="drip-bag">Drip Bag</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass rounded-2xl overflow-hidden">
                <Skeleton className="w-full h-64" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No products found with current filters.</p>
            <Button onClick={() => setSearchParams({})} variant="outline" className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <Link
                key={product.id}
                to={`/store/${product.slug}`}
                className="group glass rounded-2xl overflow-hidden hover-scale animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 bg-muted overflow-hidden">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No Image
                    </div>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{product.origin}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {product.tasting_notes.slice(0, 3).map((note) => (
                      <Badge key={note} variant="secondary" className="text-xs">
                        {note}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-xs text-muted-foreground">{product.weight_g}g</p>
                    </div>
                    
                    <Button size="sm" className="gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Store;
