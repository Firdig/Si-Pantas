import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function EducationBanner() {
  return (
    <section aria-labelledby="edukasi-banner-judul">
      <Card className="mt-10 flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between lg:mt-14">
        <div>
          <h2
            id="edukasi-banner-judul"
            className="text-section-title font-semibold text-ink"
          >
            Belajar memilah sampah
          </h2>
          <p className="mt-1 text-caption text-ink-muted">
            Panduan singkat organik, anorganik, residu, dan B3 rumah tangga.
          </p>
        </div>

        <ButtonLink href="/edukasi" variant="outline" className="shrink-0">
          Buka Edukasi
        </ButtonLink>
      </Card>
    </section>
  );
}
