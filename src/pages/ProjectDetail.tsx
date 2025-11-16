import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const projects = [
  {
    id: "1",
    title: "Ethiopian Farm Partnership",
    location: "Yirgacheffe, Ethiopia",
    description:
      "Supporting sustainable farming practices and fair trade in Ethiopian coffee regions.",
    image: "/placeholder.svg",
    year: "2023-Present",
    fullContent: `Our partnership with coffee farmers in Yirgacheffe, Ethiopia represents our commitment to sustainable and ethical coffee sourcing. We work directly with farming cooperatives to ensure fair compensation and support sustainable agricultural practices.

**Key Initiatives:**
- Direct trade relationships eliminating middlemen
- Premium pricing above fair trade standards
- Agricultural training and resource support
- Investment in processing equipment
- Community development programs

**Impact:**
- 150+ farming families supported
- 30% increase in farmer income
- Improved coffee quality and consistency
- Sustainable farming practices adopted
- Community infrastructure improvements

We believe that exceptional coffee starts with empowering the people who grow it.`,
  },
];

const ProjectDetail = () => {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 pt-32 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <article className="container mx-auto px-4 pt-32 pb-16">
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>

        <div className="mb-6">
          <span className="text-accent font-medium">{project.year}</span>
          <span className="text-muted-foreground mx-3">•</span>
          <span className="text-muted-foreground">{project.location}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          {project.title}
        </h1>

        <img
          src={project.image}
          alt={project.title}
          className="w-full h-[500px] object-cover rounded-2xl mb-12"
        />

        <div className="max-w-3xl mx-auto prose prose-lg">
          {project.fullContent.split("\n\n").map((paragraph, index) => (
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

export default ProjectDetail;
