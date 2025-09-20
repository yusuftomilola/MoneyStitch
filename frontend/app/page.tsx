import {
  Navbar,
  Hero,
  Features,
  FeaturedTool,
  Blog,
  Premium,
  Footer,
  Newsletter,
} from "@/components/homepage";

const MoneyStitchLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <FeaturedTool />
      <Blog />
      <Premium />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default MoneyStitchLanding;
