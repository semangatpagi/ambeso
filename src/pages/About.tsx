import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { MapPin, Users, Award, Leaf } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Ahmad Rizki",
      role: "Founder & Master Roaster",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop"
    },
    {
      name: "Siti Nurhaliza",
      role: "Head of Sourcing",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop"
    },
    {
      name: "Budi Santoso",
      role: "Production Manager",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"
    }
  ];

  const values = [
    {
      icon: Leaf,
      title: "Sustainable Sourcing",
      description: "Direct partnerships with farmers in Sulawesi highlands"
    },
    {
      icon: Award,
      title: "Premium Quality",
      description: "Carefully selected beans, expertly roasted to perfection"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Supporting local farmers and building lasting relationships"
    },
    {
      icon: MapPin,
      title: "Sulawesi Origin",
      description: "100% sourced from the rich volcanic soils of Sulawesi"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-6">
            From Sulawesi Highlands<br />to Your Cup
          </h1>
          <p className="text-xl text-muted-foreground text-center max-w-3xl mx-auto">
            Ambeso brings the authentic taste of Sulawesi coffee to the world, 
            connecting passionate coffee lovers with exceptional beans from Indonesia's coffee heartland.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, Ambeso started with a simple mission: to showcase the extraordinary 
                  coffee that grows in the volcanic highlands of Sulawesi to the world.
                </p>
                <p>
                  Our journey began when our founder, Ahmad Rizki, returned to his hometown in Toraja 
                  and discovered that local farmers were producing exceptional coffee beans that 
                  deserved global recognition.
                </p>
                <p>
                  Today, Ambeso works directly with over 50 smallholder farmers across Sulawesi, 
                  ensuring fair prices, sustainable practices, and the highest quality standards.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop"
                alt="Coffee plantation in Sulawesi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <value.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sourcing Transparency */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Sourcing Transparency</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Toraja Region</h3>
              <p className="text-muted-foreground mb-4">
                High altitude farms at 1,400-1,800 masl, known for full-bodied, 
                earthy flavors with hints of dark chocolate.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>• 30 partner farms</p>
                <p>• Organic certified</p>
                <p>• Fair trade practices</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Mamasa Valley</h3>
              <p className="text-muted-foreground mb-4">
                Pristine mountain environment producing smooth, balanced coffee 
                with fruity notes and bright acidity.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>• 15 partner farms</p>
                <p>• Shade-grown</p>
                <p>• Traditional processing</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-2xl font-semibold mb-4">Enrekang</h3>
              <p className="text-muted-foreground mb-4">
                Unique microclimate creates distinctive spicy and herbal notes 
                with exceptional body and complexity.
              </p>
              <div className="text-sm text-muted-foreground">
                <p>• 20 partner farms</p>
                <p>• Wet-hulled method</p>
                <p>• Women-led cooperatives</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-12">Gallery</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop"
              alt="Coffee farm"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=400&fit=crop"
              alt="Coffee cherries"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=600&h=400&fit=crop"
              alt="Roasting process"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop"
              alt="Coffee cup"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&h=400&fit=crop"
              alt="Coffee beans"
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop"
              alt="Coffee preparation"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
