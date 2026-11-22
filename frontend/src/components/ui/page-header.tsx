import { cn } from "@/lib/cn";

type PageHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("max-w-[720px]", className)}>
      <h1 className="text-page-title font-bold leading-[1.2] tracking-tight text-ink">
        {title}
      </h1>
      {description ? (
        <p className="mt-2 text-body leading-relaxed text-ink-muted">{description}</p>
      ) : null}
    </div>
  );
}
