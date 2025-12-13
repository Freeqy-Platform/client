import Header from "../navigation/Header";
import React from "react";
import Footer from "../navigation/Footer";

const AthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default AthLayout;
