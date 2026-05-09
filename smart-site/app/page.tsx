"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VisitorTypeSelector from "@/components/VisitorTypeSelector";
import SmartData from "@/components/SmartData";
import SmartTopics from "@/components/SmartTopics";
import SmartExperience from "@/components/SmartExperience";
import Diagnosis from "@/components/Diagnosis";
import AINavi from "@/components/AINavi";
import BeforeAfter from "@/components/BeforeAfter";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import type { VisitorType } from "@/lib/mockData";

export default function Home() {
  const [visitor, setVisitor] = useState<VisitorType>("new");

  return (
    <main>
      <Header />
      <Hero />
      <VisitorTypeSelector visitor={visitor} onChange={setVisitor} />
      <SmartData />
      <SmartTopics />
      <SmartExperience />
      <Diagnosis />
      <AINavi />
      <BeforeAfter />
      <ContactCTA />
      <Footer />
      <FloatingCTA />
    </main>
  );
}
