import { SampahMap } from "@/components/peta/sampah-map";
import type { WastePoint } from "@/types/api";

type MapPanelProps = {
  points: WastePoint[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

export function MapPanel({ points, activeId, onSelect }: MapPanelProps) {
  return (
    <section
      aria-labelledby="peta-rw-judul"
      className="rounded-card bg-brand-soft p-4 sm:p-5"
    >
      <div className="px-1 py-1">
        <h2
          id="peta-rw-judul"
          className="text-section-title font-semibold text-brand-dark"
        >
          Peta RW XI
        </h2>
        <p className="mt-1 text-caption text-ink-muted">
          Klik penanda besar untuk melihat detail titik.
        </p>
      </div>

      <div className="mt-3 h-[300px] overflow-hidden rounded-xl border border-[#d8e7db] bg-brand-tint sm:h-[360px] lg:h-[400px]">
        <SampahMap points={points} activeId={activeId} onSelect={onSelect} />
      </div>
    </section>
  );
}
