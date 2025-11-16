import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { ArrowRight } from "lucide-react";

const projects = [
  {
    id: "1",
    title: "Ethiopian Farm Partnership",
    location: "Yirgacheffe, Ethiopia",
    description:
      "Supporting sustainable farming practices and fair trade in Ethiopian coffee regions.",
    image: "/placeholder.svg",
    year: "2023-Present",
  },
  {
    id: "2",
    title: "Community Coffee Education",
    location: "Local Communities",
    description:
      "Free workshops and training programs to share coffee knowledge and brewing techniques.",
    image: "/placeholder.svg",
    year: "2022-Present",
  },
  {
    id: "3",
    title: "Eco-Friendly Packaging Initiative",
    location: "Global",
    description:
      "Transitioning to 100% biodegradable and compostable packaging materials.",
    image: "/placeholder.svg",
    year: "2024",
  },
];

const Projects = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 pt-32 pb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Projects</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Building a sustainable coffee ecosystem through meaningful partnerships
        </p>

        <div className="space-y-12">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              className="grid md:grid-cols-2 gap-8 glass rounded-2xl overflow-hidden group"
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-8 flex flex-col justify-center">
                <div className="text-accent font-medium mb-2">
                  {project.year}
                </div>
                <h2 className="text-3xl font-bold mb-3 group-hover:text-accent transition-colors">
                  {project.title}
                </h2>
                <p className="text-muted-foreground mb-2">{project.location}</p>
                <p className="text-foreground mb-6">{project.description}</p>
                <div className="flex items-center gap-2 text-accent font-medium">
                  Learn More
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

export default Projects;
