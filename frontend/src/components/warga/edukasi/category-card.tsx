import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type CategoryCardProps = {
  title: string;
  description: string;
  /** `null` = belum ada artikel untuk kategori ini. */
  href: string | null;
};

export function CategoryCard({ title, description, href }: CategoryCardProps) {
  return (
    <Card className="flex h-full flex-col p-4 sm:p-5">
      <h3 className="text-section-title font-semibold text-ink">{title}</h3>

      <p className="mt-2 text-caption leading-relaxed text-ink-muted">
        {description}
      </p>

      <div className="mt-auto pt-5">
        {href ? (
          <ButtonLink href={href} variant="outline" size="md" full>
            Buka Panduan
          </ButtonLink>
        ) : (
          <p className="flex min-h-11 items-center justify-center rounded-[10px] bg-canvas px-4 text-caption font-semibold text-ink-subtle">
            Belum tersedia
          </p>
        )}
      </div>
    </Card>
  );
}
