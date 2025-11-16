import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-coffee.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium Sulawesi Coffee"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 text-center pt-24 pb-16">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-block glass rounded-full px-6 py-2 mb-4">
            <span className="text-sm font-medium text-secondary">100% Kopi Sulawesi</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
            Premium Coffee
            <br />
            <span className="text-white" style={{ WebkitTextStroke: '1px hsl(0, 84%, 60%)' }}>From </span>
            <span className="text-destructive" style={{ WebkitTextStroke: '1px white' }}>Indonesia</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Experience the rich flavors of Sulawesi with every cup. 
            Sourced directly from local farmers, roasted to perfection.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg rounded-full group"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="glass border-foreground/20 hover:border-accent text-foreground hover:text-accent font-semibold px-8 py-6 text-lg rounded-full"
            >
              Explore DRIPEN
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-16 max-w-3xl mx-auto">
            {[
              { value: "100%", label: "Sulawesi Beans" },
              { value: "500+", label: "Happy Customers" },
              { value: "15+", label: "Farm Partners" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl md:text-4xl font-bold text-accent mb-2">{stat.value}</div>
                <div className="text-sm text-foreground/70">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-accent rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
