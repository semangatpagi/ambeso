import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import DripenSection from "@/components/DripenSection";
import ProjectsPreview from "@/components/ProjectsPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <Hero />
      <FeaturedProducts />
      <BrandStory />
      <DripenSection />
      <ProjectsPreview />
      <Footer />
    </div>
  );
};

export default Index;
