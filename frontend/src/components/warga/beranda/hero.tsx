import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { hero } from "@/lib/mock/warga/beranda";

export function Hero() {
  return (
    <div className="max-w-[700px]">
      <Badge tone="success">{hero.badge}</Badge>

      <h1 className="mt-4 text-balance text-hero font-bold leading-[1.16] tracking-tight text-ink">
        {hero.title}
      </h1>

      <p className="mt-3 max-w-[640px] text-body leading-relaxed text-ink-muted">
        {hero.description}
      </p>

      {/* ITERASI 2: satu ajakan saja — memantau status laporan. */}
      <div className="mt-5">
        <ButtonLink
          href={hero.action.href}
          variant="outline"
          className="w-full sm:w-auto"
        >
          {hero.action.label}
        </ButtonLink>
      </div>
    </div>
  );
}
