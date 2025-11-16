import { Button } from "@/components/ui/button";
import { TrendingUp, Heart, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const ProjectsPreview = () => {
  const projects = [
    {
      title: "Farm Infrastructure",
      category: "Investment",
      description: "Upgrading processing facilities for 3 partner farms",
      progress: 68,
      raised: "Rp 340M",
      goal: "Rp 500M",
      icon: TrendingUp,
      color: "accent",
    },
    {
      title: "Education Program",
      category: "Charity",
      description: "Supporting coffee farmer children's education",
      progress: 82,
      raised: "Rp 164M",
      goal: "Rp 200M",
      icon: Heart,
      color: "secondary",
    },
    {
      title: "Community Center",
      category: "Project",
      description: "Building a training center for local farmers",
      progress: 45,
      raised: "Rp 225M",
      goal: "Rp 500M",
      icon: Users,
      color: "accent",
    },
  ];

  return (
    <section id="projects" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Projects & <span className="text-accent">Impact</span>
          </h2>
          <p className="text-lg text-foreground/70">
            Join us in making a difference. Support sustainable coffee farming and community development.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={index}
              className="glass rounded-3xl p-8 space-y-6 hover:scale-105 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon & Category */}
              <div className="flex items-center justify-between">
                <div className="p-4 bg-accent/20 rounded-2xl">
                  <project.icon className="h-8 w-8 text-accent" />
                </div>
                <span className="text-xs font-semibold text-accent px-3 py-1 bg-accent/20 rounded-full">
                  {project.category}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
                <p className="text-foreground/70">{project.description}</p>
              </div>

              {/* Progress */}
              <div className="space-y-3">
                <Progress value={project.progress} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-foreground/70">
                    Raised: <span className="font-bold text-accent">{project.raised}</span>
                  </span>
                  <span className="text-foreground/70">Goal: {project.goal}</span>
                </div>
              </div>

              {/* CTA */}
              <Button
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full"
              >
                Support This Project
              </Button>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="glass border-foreground/20 hover:border-accent text-foreground hover:text-accent font-semibold px-8 py-6 rounded-full"
          >
            View All Projects
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPreview;
