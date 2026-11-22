import { EducationBanner } from "@/components/beranda/education-banner";
import { Hero } from "@/components/beranda/hero";
import { SummaryCard } from "@/components/beranda/summary-card";

export default function BerandaPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-12 sm:px-8 lg:px-14 lg:pb-20 lg:pt-20">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-16">
        <Hero />
        <SummaryCard />
      </div>

      <EducationBanner />
    </div>
  );
}
