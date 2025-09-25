import {
  Hero,
  Features,
  FeaturedTool,
  Blog,
  Premium,
  Newsletter,
} from "@/components/homepage";
import { Footer, Navbar } from "@/components/layout";

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
