// frontend/app/page.tsx
import {
  Hero,
  Features,
  FeaturedTool,
  Blog,
  Premium,
  Newsletter,
} from "@/components/homepage";
import { Footer, Navbar } from "@/components/layout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoneyStitch - Smart Personal Finance Education",
  description:
    "Master your personal finances with MoneyStitch. Get practical tools, smart guides, and resources designed to help you build better money habits and secure your financial future.",
};

const MoneyStitchLanding = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      {/* <Features /> */}
      {/* <FeaturedTool /> */}
      <Blog />
      {/* <Premium />
      <Newsletter />
      <Footer /> */}
    </div>
  );
};

export default MoneyStitchLanding;
