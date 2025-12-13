import React from "react";
import { useNavigate } from "react-router-dom";
import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  StatsSection,
  CTASection,
} from "../components/home";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/register");
  };

  const handleBrowseProjects = () => {
    navigate("/projects");
  };

  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        onGetStarted={handleGetStarted}
        onBrowseProjects={handleBrowseProjects}
      />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <CTASection />
    </div>
  );
};

export default Home;
