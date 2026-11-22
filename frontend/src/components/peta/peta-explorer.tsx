"use client";

import { useState } from "react";
import { MapPanel } from "@/components/peta/map-panel";
import { PointCard } from "@/components/peta/point-card";
import type { WastePoint } from "@/types/api";

export type PointView = WastePoint & {
  /** Teks siap pakai, dihitung di server agar tidak beda saat hidrasi. */
  lastUpdatedLabel: string;
};

type PetaExplorerProps = {
  points: PointView[];
};

/**
 * Satu-satunya pulau client pada halaman ini: menyinkronkan penanda peta
 * dengan kartu daftar titik di sebelahnya.
 */
export function PetaExplorer({ points }: PetaExplorerProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_345px] lg:gap-8">
      <MapPanel points={points} activeId={activeId} onSelect={setActiveId} />

      <section aria-labelledby="daftar-titik-judul">
        <h2
          id="daftar-titik-judul"
          className="text-section-title font-semibold text-ink"
        >
          Daftar titik
        </h2>

        <ul className="mt-4 space-y-3">
          {points.map((point) => (
            <PointCard
              key={point.id}
              point={point}
              lastUpdatedLabel={point.lastUpdatedLabel}
              active={point.id === activeId}
              onSelect={() => setActiveId(point.id)}
            />
          ))}
        </ul>
      </section>
    </div>
  );
}
