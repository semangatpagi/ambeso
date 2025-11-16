import { Button } from "@/components/ui/button";
import { Heart, Users, Leaf } from "lucide-react";
import farmImage from "@/assets/farm-story.jpg";

const BrandStory = () => {
  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Dedicated to bringing the finest Sulawesi coffee to the world",
    },
    {
      icon: Users,
      title: "Community",
      description: "Supporting local farmers and building sustainable partnerships",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Committed to eco-friendly practices from farm to cup",
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative animate-slide-in-right">
            <div className="glass rounded-3xl overflow-hidden">
              <img
                src={farmImage}
                alt="Sulawesi Coffee Farm"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 glass-strong rounded-3xl p-8 animate-float">
              <div className="text-4xl font-bold text-accent mb-2">15+</div>
              <div className="text-sm text-foreground/70">Years of Excellence</div>
            </div>
          </div>

          {/* Content Side */}
          <div className="space-y-8 animate-fade-in">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                From Sulawesi Farms
                <br />
                <span className="text-secondary">To Your Cup</span>
              </h2>
              <p className="text-lg text-foreground/70 leading-relaxed mb-6">
                Ambeso began with a simple mission: to share the extraordinary flavors of 
                Sulawesi coffee with the world. We work directly with local farmers, 
                ensuring fair wages and sustainable practices.
              </p>
              <p className="text-lg text-foreground/70 leading-relaxed">
                Every bean tells a story of tradition, dedication, and the rich volcanic 
                soil of Indonesia's beautiful islands.
              </p>
            </div>

            {/* Values Grid */}
            <div className="grid gap-6 pt-4">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="glass rounded-2xl p-6 flex items-start gap-4 hover:scale-105 transition-transform duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="p-3 bg-accent/20 rounded-xl">
                    <value.icon className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                    <p className="text-foreground/70">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 rounded-full"
            >
              Read Our Story
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
