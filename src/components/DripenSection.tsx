import { Button } from "@/components/ui/button";
import { ArrowRight, Coffee, Timer, Sparkles } from "lucide-react";
import dripenImage from "@/assets/dripen-product.jpg";

const DripenSection = () => {
  const features = [
    {
      icon: Coffee,
      title: "Premium Quality",
      description: "Single-origin beans in every bag",
    },
    {
      icon: Timer,
      title: "Quick & Easy",
      description: "Perfect cup in 3 minutes",
    },
    {
      icon: Sparkles,
      title: "Portable",
      description: "Coffee anywhere, anytime",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-background to-secondary/10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content Side */}
          <div className="space-y-8 order-2 lg:order-1 animate-fade-in">
            <div className="inline-block glass rounded-full px-6 py-2">
              <span className="text-sm font-medium text-accent">Introducing DRIPEN</span>
            </div>

            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6">
                Premium Coffee
                <br />
                <span className="text-accent">On The Go</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed">
                DRIPEN brings you the convenience of portable drip bags without compromising 
                on quality. Each bag contains freshly ground, single-origin Sulawesi coffee, 
                ready to brew wherever life takes you.
              </p>
            </div>

            {/* Features */}
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-5 flex items-center gap-4 hover:scale-105 transition-transform duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <feature.icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{feature.title}</h3>
                    <p className="text-sm text-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 rounded-full group"
              >
                Shop DRIPEN
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="glass border-foreground/20 hover:border-accent text-foreground hover:text-accent font-semibold px-8 py-6 rounded-full"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative order-1 lg:order-2 animate-scale-in">
            <div className="relative">
              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 glass-strong rounded-3xl p-6 animate-float">
                <div className="text-3xl font-bold text-accent">99%</div>
                <div className="text-xs text-foreground/70">Customer Rating</div>
              </div>

              <div className="glass rounded-3xl overflow-hidden">
                <img
                  src={dripenImage}
                  alt="DRIPEN Product"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Background Accent */}
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DripenSection;
