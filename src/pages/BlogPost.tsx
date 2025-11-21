import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const BlogPost = () => {
  const { slug } = useParams();

  // Placeholder content - in a real app, this would come from a CMS or database
  const post = {
    title: "The Art of Coffee Roasting: Finding the Perfect Balance",
    category: "Roasting",
    date: "2025-01-15",
    readTime: "5 min read",
    author: "Ahmad Rizki",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1200&h=600&fit=crop",
    content: `
      <p>Coffee roasting is both an art and a science, requiring precision, experience, and a deep understanding of how heat transforms green coffee beans into the aromatic, flavorful beans we all love.</p>

      <h2>Understanding the Roasting Process</h2>
      <p>The journey from green bean to perfectly roasted coffee involves several critical stages. At Ambeso, we carefully monitor temperature, time, and airflow to bring out the unique characteristics of Sulawesi coffee.</p>

      <h3>First Crack</h3>
      <p>Around 385°F (196°C), the beans reach what we call "first crack" - a popping sound that indicates the beans are expanding and releasing moisture. This is where light to medium roasts are typically finished.</p>

      <h3>Development Time</h3>
      <p>The period after first crack is crucial. This is where we develop the flavors specific to each origin. For our Toraja beans, we extend this phase slightly to enhance their earthy, chocolate notes while maintaining brightness.</p>

      <h2>Roast Profiles for Sulawesi Coffee</h2>
      <p>Sulawesi coffee responds beautifully to various roast levels:</p>
      <ul>
        <li><strong>Light Roast:</strong> Highlights fruity acidity and floral notes</li>
        <li><strong>Medium Roast:</strong> Balances acidity with body, bringing out caramel sweetness</li>
        <li><strong>Dark Roast:</strong> Emphasizes chocolate and earthy flavors with full body</li>
      </ul>

      <h2>Our Roasting Philosophy</h2>
      <p>At Ambeso, we believe in letting the beans speak for themselves. Rather than over-roasting to create a uniform taste, we carefully craft each roast profile to honor the unique terroir of each region.</p>

      <p>Every batch is roasted in small quantities to ensure consistency and quality. We constantly taste and adjust our profiles to bring you the best possible expression of Sulawesi coffee.</p>

      <h2>Tasting the Difference</h2>
      <p>The proof is in the cup. When you taste properly roasted Sulawesi coffee, you should experience a complex interplay of flavors - from the initial bright acidity to the lingering chocolatey finish.</p>

      <p>We invite you to explore our range of roast levels and discover which profile speaks to your palate. Whether you prefer the vibrant notes of a light roast or the comforting depth of a dark roast, each tells a unique story of Sulawesi's coffee heritage.</p>
    `
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      {/* Header */}
      <div className="pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
          
          <Badge className="mb-4">{post.category}</Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-4 text-muted-foreground mb-8">
            <span>By {post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="px-4 mb-12">
        <div className="container mx-auto max-w-4xl">
          <img 
            src={post.image}
            alt={post.title}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      </div>

      {/* Content */}
      <article className="px-4 pb-16">
        <div className="container mx-auto max-w-3xl prose prose-lg dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>

      {/* Related Articles */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Link 
                key={i}
                to="/blog/related-article" 
                className="group bg-card border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="h-48 bg-muted"></div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                    Related Article Title {i}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BlogPost;
