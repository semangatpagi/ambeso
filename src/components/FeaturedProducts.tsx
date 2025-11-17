import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedProducts = () => {
  const products = [
    {
      name: "Toraja Reserve",
      origin: "Toraja Highlands",
      price: "Rp 185,000",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      description: "Full-bodied with earthy notes",
    },
    {
      name: "Mamasa Single Origin",
      origin: "Mamasa Valley",
      price: "Rp 165,000",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      description: "Smooth with chocolate hints",
    },
    {
      name: "Enrekang Premium",
      origin: "Enrekang Region",
      price: "Rp 175,000",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
      description: "Balanced with citrus notes",
    },
  ];

  return (
    <section id="store" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Featured Collection</h2>
          <p className="text-lg text-foreground/70">
            Discover our premium selection of single-origin Sulawesi coffee beans
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="group glass rounded-3xl overflow-hidden hover:scale-105 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative h-80 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-secondary font-medium">{product.origin}</p>
                </div>

                <p className="text-foreground/70">{product.description}</p>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-2xl font-bold text-accent">{product.price}</span>
                  <Button
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full group/btn"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link to="/store">
            <Button
              size="lg"
              variant="outline"
              className="glass border-foreground/20 hover:border-accent text-foreground hover:text-accent font-semibold px-8 py-6 rounded-full"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
