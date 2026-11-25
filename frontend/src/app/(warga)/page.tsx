import { EducationBanner } from "@/components/warga/beranda/education-banner";
import { Hero } from "@/components/warga/beranda/hero";
import { SummaryCard } from "@/components/warga/beranda/summary-card";

export default function BerandaPage() {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12 lg:px-14 lg:pb-20 lg:pt-20">
      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_410px] lg:gap-16">
        <Hero />
        <SummaryCard />
      </div>

      <EducationBanner />
    </div>
  );
}
