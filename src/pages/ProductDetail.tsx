import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag, ArrowLeft } from "lucide-react";

const products = [
  {
    id: "1",
    name: "Espresso Blend",
    price: 24.99,
    image: "/placeholder.svg",
    description: "Rich and bold espresso blend perfect for morning routines",
    details:
      "Our signature espresso blend combines beans from Brazil and Colombia to create a perfectly balanced shot with notes of dark chocolate and caramel.",
    origin: "Brazil & Colombia",
    roast: "Dark",
    weight: "250g",
  },
  {
    id: "2",
    name: "Dripen Pour Over",
    price: 89.99,
    image: "/placeholder.svg",
    description: "Premium pour over coffee maker",
    details:
      "Experience the art of coffee brewing with our handcrafted Dripen pour over system. Designed for precision and consistency.",
    material: "Ceramic & Wood",
    capacity: "500ml",
  },
];

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="glass rounded-2xl overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-[500px] object-cover"
            />
          </div>

          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-primary mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-lg text-muted-foreground mb-6">
              {product.description}
            </p>
            <p className="text-foreground mb-8">{product.details}</p>

            <div className="space-y-3 mb-8">
              {"origin" in product && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Origin:</span>
                  <span className="text-muted-foreground">{product.origin}</span>
                </div>
              )}
              {"roast" in product && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Roast:</span>
                  <span className="text-muted-foreground">{product.roast}</span>
                </div>
              )}
              {"weight" in product && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Weight:</span>
                  <span className="text-muted-foreground">{product.weight}</span>
                </div>
              )}
              {"material" in product && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Material:</span>
                  <span className="text-muted-foreground">
                    {product.material}
                  </span>
                </div>
              )}
              {"capacity" in product && (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Capacity:</span>
                  <span className="text-muted-foreground">
                    {product.capacity}
                  </span>
                </div>
              )}
            </div>

            <Button
              size="lg"
              className="w-full md:w-auto"
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                })
              }
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
