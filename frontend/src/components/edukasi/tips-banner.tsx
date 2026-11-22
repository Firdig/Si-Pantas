import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type TipsBannerProps = {
  href: string;
};

export function TipsBanner({ href }: TipsBannerProps) {
  return (
    <section aria-labelledby="tips-edukasi-judul" className="mt-8">
      <Card className="flex flex-col gap-4 border-0 bg-brand-soft p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2
            id="tips-edukasi-judul"
            className="text-[17px] font-semibold text-brand-dark"
          >
            Tips penting mudah untuk mulai memilah
          </h2>
          <p className="mt-1 max-w-[640px] text-caption leading-relaxed text-ink-muted">
            Mulai dari satu kebiasaan kecil: pisahkan sampah organik dan
            anorganik di rumah sebelum dibuang ke titik pengumpulan.
          </p>
        </div>

        <ButtonLink href={href} className="shrink-0">
          Lihat Panduan Lengkap
        </ButtonLink>
      </Card>
    </section>
  );
}
