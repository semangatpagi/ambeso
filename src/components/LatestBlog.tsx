import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const LatestBlog = () => {
  const articles = [
    {
      slug: "the-art-of-coffee-roasting",
      title: "The Art of Coffee Roasting: Finding the Perfect Balance",
      excerpt: "Discover how we roast our Sulawesi beans to unlock their unique flavor profiles.",
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&h=600&fit=crop",
      category: "Roasting",
      date: "2025-01-15",
      readTime: "5 min"
    },
    {
      slug: "sulawesi-coffee-regions",
      title: "Exploring Sulawesi's Premier Coffee Regions",
      excerpt: "A journey through Toraja, Mamasa, and Enrekang - the three regions that define excellence.",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop",
      category: "Origin",
      date: "2025-01-10",
      readTime: "7 min"
    },
    {
      slug: "brewing-perfect-cup",
      title: "Brewing the Perfect Cup: A Complete Guide",
      excerpt: "Master the fundamentals of coffee brewing with our comprehensive guide.",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
      category: "Brewing",
      date: "2025-01-05",
      readTime: "6 min"
    }
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <Badge variant="outline" className="mb-4">Blog & Stories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Latest from Our Journal</h2>
            <p className="text-muted-foreground mt-2 max-w-lg">
              Explore stories, guides, and insights from the world of Sulawesi coffee.
            </p>
          </div>
          <Link 
            to="/blog" 
            className="group flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <Link 
              key={article.slug} 
              to={`/blog/${article.slug}`}
              className="group"
            >
              <article className="h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-primary/90 hover:bg-primary">
                    {article.category}
                  </Badge>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric'
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
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
  );
};

export default LatestBlog;
