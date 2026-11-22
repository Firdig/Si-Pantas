import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

type ComingSoonProps = {
  title: string;
  description: string;
  note: string;
};

/** Halaman sementara agar navigasi tidak berakhir di 404. */
export function ComingSoon({ title, description, note }: ComingSoonProps) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-5 pb-14 pt-10 sm:px-8 lg:px-14 lg:pb-20 lg:pt-12">
      <PageHeader title={title} description={description} />

      <Card className="mt-8 max-w-[720px] p-6">
        <p className="text-body leading-relaxed text-ink-muted">{note}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/" variant="outline" size="md">
            Kembali ke Beranda
          </ButtonLink>
          <ButtonLink href="/peta" variant="soft" size="md">
            Lihat Peta Sampah
          </ButtonLink>
        </div>
      </Card>
    </div>
  );
}
