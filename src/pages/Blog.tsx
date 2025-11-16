import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "The Art of Pour Over Coffee",
    excerpt:
      "Discover the perfect technique for brewing exceptional pour over coffee at home.",
    date: "2024-01-15",
    image: "/placeholder.svg",
    category: "Brewing Guide",
  },
  {
    id: "2",
    title: "Direct Trade: Our Farm Partnerships",
    excerpt:
      "Learn about our direct relationships with coffee farmers and how it impacts quality.",
    date: "2024-01-10",
    image: "/placeholder.svg",
    category: "Sustainability",
  },
  {
    id: "3",
    title: "Coffee Roasting 101",
    excerpt:
      "Understanding the roasting process and how it affects flavor profiles.",
    date: "2024-01-05",
    image: "/placeholder.svg",
    category: "Education",
  },
];

const Blog = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Coffee Journal</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Stories, guides, and insights from the world of specialty coffee
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className="glass rounded-2xl overflow-hidden group"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-6">
                <div className="flex items-center gap-4 mb-3 text-sm">
                  <span className="text-accent font-medium">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground">{post.date}</span>
                </div>
                <h2 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-2 text-accent font-medium">
                  Read More
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
