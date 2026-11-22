"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { WastePoint } from "@/types/api";

type SampahMapProps = {
  points: WastePoint[];
  activeId: string | null;
  onSelect: (id: string) => void;
};

/** Titik tengah cadangan bila data belum punya koordinat valid. */
const FALLBACK_CENTER: [number, number] = [-7.87, 112.526];

function escapeHtml(value: string): string {
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };

  return value.replace(/[&<>"']/g, (char) => entities[char] ?? char);
}

/**
 * Peta Leaflet.
 *
 * Leaflet hanya diimpor di dalam `useEffect` (bukan `next/dynamic` dengan
 * `ssr: false`, yang dilarang di Server Component pada Next 15+), sehingga
 * tidak ada kode Leaflet yang berjalan di server.
 *
 * Penanda memakai `divIcon` berbentuk pill — sama seperti penanda pada desain —
 * sekaligus menghindari masalah path ikon PNG bawaan Leaflet saat di-bundle.
 */
export function SampahMap({ points, activeId, onSelect }: SampahMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const onSelectRef = useRef(onSelect);
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    onSelectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    let cancelled = false;
    const markers = markersRef.current;

    async function mount() {
      const container = containerRef.current;

      if (!container || mapRef.current) return;

      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current || mapRef.current) return;

      const map = L.map(containerRef.current, {
        center: FALLBACK_CENTER,
        zoom: 15,
        scrollWheelZoom: false,
      });

      mapRef.current = map;

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const bounds = L.latLngBounds([]);

      for (const point of points) {
        const label = `${escapeHtml(point.name)} · ${escapeHtml(point.rt)}`;
        const tone = point.condition === "NORMAL" ? "success" : "warning";

        const marker = L.marker([point.latitude, point.longitude], {
          keyboard: true,
          title: `${point.name} · ${point.rt}`,
          alt: `${point.name} · ${point.rt}`,
          icon: L.divIcon({
            className: "sampah-marker-wrapper",
            html: `<span class="sampah-marker" data-tone="${tone}">${label}</span>`,
            iconSize: [0, 0],
          }),
        });

        marker.addTo(map);
        marker.on("click", () => onSelectRef.current(point.id));
        markers.set(point.id, marker);
        bounds.extend([point.latitude, point.longitude]);
      }

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [72, 72], maxZoom: 17 });
      }

      for (const [id, marker] of markers) {
        const pill = marker.getElement()?.querySelector(".sampah-marker");
        pill?.classList.toggle("is-active", id === activeIdRef.current);
      }

      requestAnimationFrame(() => {
        // Bisa saja map sudah dilepas saat efek dibersihkan (React Strict Mode
        // di dev), jadi jangan sentuh instance yang sudah tidak dipakai.
        if (!cancelled && mapRef.current === map) map.invalidateSize();
      });
    }

    void mount();

    return () => {
      cancelled = true;
      markers.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [points]);

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const active = id === activeId;
      const pill = marker.getElement()?.querySelector(".sampah-marker");

      pill?.classList.toggle("is-active", active);
      marker.setZIndexOffset(active ? 1000 : 0);
    }
  }, [activeId]);

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Peta titik sampah RW XI"
      className="h-full w-full"
    />
  );
}
