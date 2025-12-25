import { Link } from "react-router-dom";
import { MapPin, Mountain, Leaf, Coffee } from "lucide-react";

const FeaturedProducts = () => {
  const products = [
    {
      name: "Toraja Reserve",
      origin: "Toraja Highlands",
      altitude: "1,400 - 1,800 mdpl",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      description: "Kopi dengan karakter full-bodied, aroma earthy yang khas, dan aftertaste yang panjang. Ditanam di dataran tinggi Toraja dengan metode tradisional.",
      process: "Wet Hulled",
      notes: ["Earthy", "Herbal", "Dark Chocolate"],
    },
    {
      name: "Mamasa Single Origin",
      origin: "Mamasa Valley",
      altitude: "1,200 - 1,600 mdpl",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&q=80",
      description: "Profil rasa smooth dengan hint cokelat dan kacang-kacangan. Kopi ini dipetik dari perkebunan keluarga di lembah Mamasa yang subur.",
      process: "Natural",
      notes: ["Chocolate", "Nutty", "Caramel"],
    },
    {
      name: "Enrekang Premium",
      origin: "Enrekang Region",
      altitude: "1,300 - 1,700 mdpl",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
      description: "Keseimbangan sempurna antara acidity citrus dan body yang medium. Varietas arabika unggulan dari pegunungan Enrekang.",
      process: "Honey",
      notes: ["Citrus", "Floral", "Brown Sugar"],
    },
  ];

  return (
    <section id="products" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-secondary font-medium tracking-wider uppercase text-sm mb-4 block">
            Dari Tanah Sulawesi
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Koleksi Kopi Kami</h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            Setiap biji kopi kami berasal dari petani lokal Sulawesi yang telah mewarisi 
            tradisi bertanam kopi selama generasi. Kami memastikan setiap proses dilakukan 
            dengan penuh dedikasi untuk menghasilkan cita rasa terbaik.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <Link
              to={`/store`}
              key={index}
              className="group glass rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-500 animate-fade-in-up cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                
                {/* Origin Badge */}
                <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-secondary" />
                  <span className="text-xs font-medium">{product.origin}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-accent transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Mountain className="h-4 w-4 text-secondary" />
                    <span>{product.altitude}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Leaf className="h-4 w-4 text-secondary" />
                    <span>{product.process}</span>
                  </div>
                </div>

                {/* Tasting Notes */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {product.notes.map((note, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs font-medium bg-secondary/10 text-secondary rounded-full"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {/* Learn More */}
                <div className="pt-4 flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
                  <Coffee className="h-4 w-4" />
                  <span>Pelajari Lebih Lanjut</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-foreground/60 mb-4">
            Tertarik mengetahui proses dari biji hingga cangkir?
          </p>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-semibold transition-colors"
          >
            <span>Lihat Perjalanan Kami</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
