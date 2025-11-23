import { Facebook, Instagram, Twitter, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const footerLinks = {
    Shop: ["All Products", "DRIPEN Collection", "Gift Sets", "Subscriptions"],
    Company: ["About Us", "Our Story", "Farm Partners", "Sustainability"],
    Support: ["Contact", "FAQ", "Shipping", "Returns"],
    Community: ["Blog", "Events", "Wholesale", "Loyalty Program"],
  };

  const socialLinks = [
    { icon: Facebook, href: "https://www.facebook.com/AmbesoCoffeeshop/" },
    { icon: Instagram, href: "https://www.instagram.com/ambesocoffeeshop/" },
    { icon: Twitter, href: "https://x.com/ambesocoffee" },
    { icon: MessageCircle, href: "https://wa.me/628114291919" },
    { icon: Mail, href: "mailto:idham@supplierlokal.com" },
  ];

  return (
    <footer className="relative pt-24 pb-12 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Newsletter Section */}
        <div className="glass rounded-3xl p-12 mb-16 text-center max-w-3xl mx-auto animate-fade-in">
          <h3 className="text-3xl font-bold mb-4">Stay Connected</h3>
          <p className="text-foreground/70 mb-8">
            Subscribe to our newsletter for exclusive offers and coffee stories
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="glass border-foreground/20 text-foreground placeholder:text-foreground/50 rounded-full px-6"
            />
            <Button
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full px-8"
            >
              Subscribe
            </Button>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1">
            <h2 className="text-3xl font-bold mb-4">AMBESO</h2>
            <p className="text-foreground/70 text-sm mb-6">
              Jln. Anggrek Raya No. 23, Kel. Paropo, Kec. Panakkukang, Kota Makassar, Sulawesi Selatan, Indonesia
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="p-2 glass rounded-full hover:bg-accent/20 transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-bold text-lg mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-foreground/70 hover:text-accent transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-foreground/70">
          <p>© 2024 Ambeso. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-accent transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
