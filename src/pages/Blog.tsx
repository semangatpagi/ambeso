import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Blog = () => {
  const articles = [
    {
      slug: "the-art-of-coffee-roasting",
      title: "The Art of Coffee Roasting: Finding the Perfect Balance",
      excerpt: "Discover how we roast our Sulawesi beans to unlock their unique flavor profiles and create the perfect cup.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop",
      category: "Roasting",
      date: "2025-01-15",
      readTime: "5 min read"
    },
    {
      slug: "sulawesi-coffee-regions",
      title: "Exploring Sulawesi's Premier Coffee Regions",
      excerpt: "A journey through Toraja, Mamasa, and Enrekang - the three regions that define Sulawesi coffee excellence.",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
      category: "Origin",
      date: "2025-01-10",
      readTime: "7 min read"
    },
    {
      slug: "brewing-perfect-cup",
      title: "Brewing the Perfect Cup: A Complete Guide",
      excerpt: "Master the fundamentals of coffee brewing with our comprehensive guide to extraction, ratios, and techniques.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      category: "Brewing",
      date: "2025-01-05",
      readTime: "6 min read"
    },
    {
      slug: "sustainable-coffee-farming",
      title: "Sustainable Coffee Farming in Sulawesi",
      excerpt: "How our partner farmers are leading the way in environmentally responsible coffee production.",
      image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=600&fit=crop",
      category: "Sustainability",
      date: "2024-12-28",
      readTime: "8 min read"
    },
    {
      slug: "introducing-dripen",
      title: "Introducing DRIPEN: Premium Portable Coffee",
      excerpt: "Experience specialty coffee anywhere with our new premium drip bag collection designed for coffee lovers on the go.",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&h=600&fit=crop",
      category: "Product",
      date: "2024-12-20",
      readTime: "4 min read"
    },
    {
      slug: "coffee-tasting-notes",
      title: "Understanding Coffee Tasting Notes",
      excerpt: "Learn how to identify and appreciate the complex flavors in your coffee, from fruity to chocolatey notes.",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop",
      category: "Education",
      date: "2024-12-15",
      readTime: "5 min read"
    }
  ];

  const categories = ["All", "Roasting", "Origin", "Brewing", "Sustainability", "Product", "Education"];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4 bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Coffee Stories & Insights</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore the world of specialty coffee through our articles, guides, and stories from Sulawesi.
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 px-4 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge 
                key={category} 
                variant={category === "All" ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link 
                key={article.slug} 
                to={`/blog/${article.slug}`}
                className="group"
              >
                <article className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 left-4">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for the latest coffee stories, brewing tips, and exclusive offers.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
