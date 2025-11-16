import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Phone, Package } from "lucide-react";

const Wholesale = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">
              Global Supply Partner
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Bringing premium Indonesian coffee to businesses worldwide. Connect with us for bulk orders and long-term partnerships.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass p-8 rounded-2xl text-center animate-fade-in">
              <Package className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Bulk Orders</h3>
              <p className="text-muted-foreground">
                Minimum order quantities starting from 100kg with competitive pricing
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl text-center animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <Mail className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Direct Sourcing</h3>
              <p className="text-muted-foreground">
                From our farms to your business, ensuring quality and fair trade practices
              </p>
            </div>
            
            <div className="glass p-8 rounded-2xl text-center animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Phone className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Dedicated Support</h3>
              <p className="text-muted-foreground">
                Personal account manager for all your wholesale needs
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-12 rounded-2xl max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Get in Touch</h2>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your company"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Contact Person</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="Your name"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="+62 xxx xxxx"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Order Volume (kg/month)</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="100"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder="Tell us about your business and requirements..."
                />
              </div>
              
              <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-6 text-lg">
                Submit Inquiry
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Wholesale;
