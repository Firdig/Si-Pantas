import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { hero } from "@/lib/mock/beranda";

export function Hero() {
  return (
    <div className="max-w-[700px]">
      <Badge tone="success">{hero.badge}</Badge>

      <h1 className="mt-4 text-[34px] font-bold leading-[1.15] tracking-tight text-ink sm:text-[38px] lg:text-[44px]">
        {hero.title}
      </h1>

      <p className="mt-4 max-w-[640px] text-body leading-relaxed text-ink-muted">
        {hero.description}
      </p>

      {/* ITERASI 2: satu ajakan saja — memantau status laporan. */}
      <div className="mt-6">
        <ButtonLink href={hero.action.href} variant="outline">
          {hero.action.label}
        </ButtonLink>
      </div>
    </div>
  );
}
