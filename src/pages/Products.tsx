import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const products = [
  {
    id: "1",
    name: "Espresso Blend",
    price: 24.99,
    category: "coffee",
    image: "/placeholder.svg",
    description: "Rich and bold espresso blend",
  },
  {
    id: "2",
    name: "Dripen Pour Over",
    price: 89.99,
    category: "equipment",
    image: "/placeholder.svg",
    description: "Premium pour over coffee maker",
  },
  {
    id: "3",
    name: "Single Origin Ethiopia",
    price: 29.99,
    category: "coffee",
    image: "/placeholder.svg",
    description: "Fruity and floral notes",
  },
  {
    id: "4",
    name: "Coffee Grinder Pro",
    price: 149.99,
    category: "equipment",
    image: "/placeholder.svg",
    description: "Precision burr grinder",
  },
];

const Products = () => {
  const [filter, setFilter] = useState("all");
  const { addToCart } = useCart();

  const filteredProducts =
    filter === "all"
      ? products
      : products.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">Our Products</h1>

        <div className="flex gap-4 mb-8 flex-wrap">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
          >
            All Products
          </Button>
          <Button
            variant={filter === "coffee" ? "default" : "outline"}
            onClick={() => setFilter("coffee")}
          >
            Coffee
          </Button>
          <Button
            variant={filter === "equipment" ? "default" : "outline"}
            onClick={() => setFilter("equipment")}
          >
            Equipment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="glass rounded-2xl overflow-hidden group"
            >
              <Link to={`/product/${product.id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-6">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <p className="text-muted-foreground text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ${product.price.toFixed(2)}
                  </span>
                  <Button
                    onClick={() =>
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                      })
                    }
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Products;
