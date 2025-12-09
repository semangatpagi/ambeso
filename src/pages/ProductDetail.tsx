import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ShoppingCart, Heart, Package, Flame, Coffee } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";

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
}

const ProductDetail = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addItem(product);
      }
      toast({
        title: "Added to cart",
        description: `${quantity}x ${product.name} added to your cart.`,
      });
    }
  };

  const roastLevelLabel = {
    light: "Light Roast",
    medium: "Medium Roast",
    dark: "Dark Roast",
  };

  const grindTypeLabel = {
    "whole-bean": "Whole Bean",
    ground: "Ground",
    "drip-bag": "Drip Bag",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="container mx-auto px-4 pt-32 pb-20">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="w-full h-[600px] rounded-2xl" />
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
          <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
          <Link to="/store">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Store
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-32 pb-20">
        <Link to="/store" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-12 animate-fade-in">
          {/* Product Image */}
          <div className="glass rounded-2xl overflow-hidden aspect-square">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <Package className="w-24 h-24" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              {product.featured && (
                <Badge className="mb-3 bg-accent text-accent-foreground">Featured</Badge>
              )}
              <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
              <p className="text-xl text-muted-foreground">{product.origin}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.tasting_notes.map((note) => (
                <Badge key={note} variant="secondary">
                  {note}
                </Badge>
              ))}
            </div>

            <div className="glass rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Flame className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Roast Level</p>
                  <p className="font-semibold">{roastLevelLabel[product.roast_level as keyof typeof roastLevelLabel]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Coffee className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Grind Type</p>
                  <p className="font-semibold">{grindTypeLabel[product.grind_type as keyof typeof grindTypeLabel]}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-semibold">{product.weight_g}g</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <p className="text-3xl font-bold text-primary mb-2">
                {formatPrice(product.price)}
              </p>
              <p className="text-muted-foreground">
                {product.in_stock ? "In Stock" : "Out of Stock"}
              </p>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center glass rounded-lg px-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <span className="mx-4 font-semibold">{quantity}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
              
              <Button
                className="flex-1 gap-2"
                size="lg"
                onClick={handleAddToCart}
                disabled={!product.in_stock}
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </Button>

              <Button variant="outline" size="lg">
                <Heart className="w-5 h-5" />
              </Button>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
                <TabsTrigger value="origin" className="flex-1">Origin Info</TabsTrigger>
                <TabsTrigger value="brewing" className="flex-1">Brewing Tips</TabsTrigger>
              </TabsList>
              
              <TabsContent value="description" className="glass rounded-xl p-6 mt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </TabsContent>
              
              <TabsContent value="origin" className="glass rounded-xl p-6 mt-4">
                <p className="text-muted-foreground leading-relaxed">
                  This premium coffee is sourced from {product.origin}, one of Sulawesi's finest 
                  coffee-growing regions. Our farmers use traditional methods passed down through 
                  generations, ensuring each bean reaches its full potential.
                </p>
              </TabsContent>
              
              <TabsContent value="brewing" className="glass rounded-xl p-6 mt-4">
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="font-semibold text-foreground mb-2">Recommended Ratio</p>
                    <p>1:15 coffee to water (e.g., 15g coffee to 225ml water)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Water Temperature</p>
                    <p>90-96°C (195-205°F)</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground mb-2">Brew Time</p>
                    <p>3-4 minutes for optimal extraction</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
