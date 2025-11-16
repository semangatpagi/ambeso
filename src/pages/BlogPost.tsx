import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const posts = [
  {
    id: "1",
    title: "The Art of Pour Over Coffee",
    content: `Pour over coffee brewing is a precise and rewarding method that allows you to control every aspect of the extraction process. In this guide, we'll walk you through the essential steps to achieve the perfect cup.

**What You'll Need:**
- Fresh coffee beans (20g)
- Filtered water (300ml)
- Pour over dripper
- Paper filter
- Gooseneck kettle
- Timer

**The Process:**
1. Boil water to 200°F (93°C)
2. Rinse the paper filter
3. Add ground coffee (medium-fine grind)
4. Bloom for 30 seconds with 40ml water
5. Continue pouring in circular motions
6. Total brew time: 2.5-3 minutes

The key is consistency and patience. With practice, you'll develop muscle memory for the perfect pour.`,
    date: "2024-01-15",
    image: "/placeholder.svg",
    category: "Brewing Guide",
  },
];

const BlogPost = () => {
  const { id } = useParams();
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <article className="container mx-auto px-4 pt-32 pb-16 max-w-3xl">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <div className="mb-6">
          <span className="text-accent font-medium">{post.category}</span>
          <span className="text-muted-foreground mx-3">•</span>
          <span className="text-muted-foreground">{post.date}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">{post.title}</h1>

        <img
          src={post.image}
          alt={post.title}
          className="w-full h-[400px] object-cover rounded-2xl mb-8"
        />

        <div className="prose prose-lg max-w-none">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-6 text-foreground leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;
