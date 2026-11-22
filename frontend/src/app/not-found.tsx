import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-14 lg:py-24">
          <p className="text-body font-semibold text-brand">Halaman tidak ditemukan</p>
          <h1 className="mt-2 max-w-[620px] text-[30px] font-bold leading-[1.2] tracking-tight text-ink sm:text-[32px]">
            Alamat yang Anda buka tidak tersedia.
          </h1>
          <p className="mt-3 max-w-[560px] text-body leading-relaxed text-ink-muted">
            Periksa kembali tautannya, atau kembali ke halaman utama untuk melihat
            titik sampah dan panduan warga.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/" size="md">
              Kembali ke Beranda
            </ButtonLink>
            <ButtonLink href="/peta" variant="outline" size="md">
              Lihat Peta Sampah
            </ButtonLink>
          </div>

          <p className="mt-8 text-caption text-ink-muted">
            Butuh bantuan?{" "}
            <Link href="/bantuan" className="font-semibold text-brand hover:underline">
              Hubungi pengurus RW
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
